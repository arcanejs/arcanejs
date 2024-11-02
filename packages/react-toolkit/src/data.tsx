import { promises as fs } from 'fs';
import React, {
  useMemo,
  useContext,
  createContext,
  type Context,
  type FC,
  type ReactNode,
  useState,
  useEffect,
  useRef,
} from 'react';
import type { ZodType } from 'zod';
import { throttle } from 'lodash';
import { dirname } from 'path';

export type ProviderProps = {
  path: string;
  children: ReactNode;
};

type DataFileUpdater<T> = (update: (current: T) => T) => void;

type DataFileContext<T> = {
  data: T;
  updateData: DataFileUpdater<T>;
  /**
   * Can be called to force an attempt to re-save the data to disk
   */
  saveData: () => void;
  /**
   * If an error has ocurred in the last operation (e.g. load or save,
   * then this will be set to that error).
   *
   * Can be used for example to re-prompt users to save data.
   */
  error: unknown;
};

type DataFile<T> = {
  Provider: FC<ProviderProps>;
  context: Context<DataFileContext<T>>;
};

type DataFileProps<T> = {
  schema: ZodType<T>;
  defaultValue: T;
  /**
   * When the file path changes and the file does not yet exist,
   * should the previous data be stored in the new file
   * or should the new file be reset to the default value?
   *
   * @default 'defaultValue'
   */
  onPathChange?: 'transfer' | 'defaultValue';
};

export function useDataFileData<T>(dataFile: DataFile<T>): T {
  return useContext(dataFile.context).data;
}

export function useDataFileUpdater<T>(
  dataFile: DataFile<T>,
): DataFileUpdater<T> {
  return useContext(dataFile.context).updateData;
}

export function useDataFile<T>(dataFile: DataFile<T>): DataFileContext<T> {
  return useContext(dataFile.context);
}

type DataState<T> =
  | { status: 'loading' }
  | { status: 'error'; data: T | undefined; error: unknown }
  | { status: 'ready'; data: T };

type DataFileState<T> = {
  path: string | null;
  data: T | undefined;
  previousData: T | undefined;
  state: { state: 'error'; error: unknown } | { state: 'saved' | 'dirty' };
};

export function createDataFileSpec<T>({
  schema,
  defaultValue,
  onPathChange = 'defaultValue',
}: DataFileProps<T>): DataFile<T> {
  const context = createContext<DataFileContext<T>>({
    data: defaultValue,
    updateData: () => {
      throw new Error('Data file provider not used');
    },
    saveData: () => {
      throw new Error('Data file provider not used');
    },
    error: undefined,
  });

  /**
   * Create a specific provider function function component
   */
  const Provider: FC<ProviderProps> = ({ path, children }) => {
    /**
     * Maintain all data in a ref so that we can dynamically throttle the
     * writes to disk in a memoized function.
     */
    const state = useRef<DataFileState<T>>({
      path: null,
      data: undefined,
      previousData: undefined,
      state: {
        state: 'saved',
      },
    });

    /**
     * Processed version of the state,
     * updates less regularly than the state,
     * but more often than file writes to disk.
     */
    const [data, setData] = useState<DataState<T>>({
      status: 'loading',
    });

    const updateDataFromState = useMemo(
      () => () => {
        const data = state.current.data;

        if (state.current.state.state === 'error') {
          setData({
            status: 'error',
            error: state.current.state.error,
            data,
          });
          return;
        }

        if (data === undefined) {
          setData({
            status: 'loading',
          });
          return;
        }

        setData({
          status: 'ready',
          data,
        });
      },
      [],
    );

    const requestFileWriteToDisk = useMemo(
      () =>
        throttle(
          async () => {
            if (state.current.state.state === 'saved') {
              // No need to save data that has already been saved
              return;
            }

            const currentPath = state.current.path;
            const currentData = state.current.data;
            if (!currentPath || currentData === undefined) {
              return;
            }

            try {
              const json = JSON.stringify(currentData, null, 2);
              await fs.mkdir(dirname(currentPath), { recursive: true });
              await fs.writeFile(currentPath, json, 'utf8');
              if (
                state.current.path === currentPath &&
                state.current.data === currentData
              ) {
                state.current.state = { state: 'saved' };
              }
            } catch (error) {
              if (
                state.current.path === currentPath &&
                state.current.data === currentData
              ) {
                state.current.state = { state: 'error', error };
                updateDataFromState();
              }
            }
          },
          500,
          {
            // Write leading so that we always write to disk quickly when
            // only single things have changed
            leading: true,
            // Trailing is important otherwise we may lose data
            trailing: true,
          },
        ),
      [],
    );

    useEffect(() => {
      // Set the new path, and attempt to load the file
      state.current = {
        path,
        data: undefined,
        previousData: state.current.data ?? state.current.previousData,
        state: {
          state: 'saved',
        },
      };
      fs.readFile(path, 'utf8')
        .then((data) => {
          const parsedData = schema.parse(JSON.parse(data));
          if (state.current.path === path) {
            state.current.data = parsedData;
            state.current.state = { state: 'saved' };
            updateDataFromState();
          }
        })
        .catch((error) => {
          // If file doesn't exist, then create it using the default value
          if (state.current.path !== path) {
            // Ignore error if path has changed
            return;
          }
          if (error.code === 'ENOENT') {
            console.log('Creating new file');
            // Initialise the state, and then write it to disk
            const initialData =
              onPathChange === 'transfer' &&
              state.current.previousData !== undefined
                ? state.current.previousData
                : defaultValue;
            state.current.data = initialData;
            state.current.state = { state: 'dirty' };
            requestFileWriteToDisk();
            updateDataFromState();
            return;
          }

          state.current.state = { state: 'error', error };
          updateDataFromState();
        });
    }, [path]);

    const updateData: DataFileUpdater<T> = useMemo(
      () => (update) => {
        if (state.current.path !== path) {
          // Ignore any requests to update a file if the path has been changed
          return;
        }
        if (state.current.data === undefined) {
          throw new Error('Attempt to update data before it has been loaded');
        }
        state.current.data = update(state.current.data);
        state.current.state = { state: 'dirty' };
        requestFileWriteToDisk();
        updateDataFromState();
      },
      [path],
    );

    const providedContext: DataFileContext<T> = useMemo(
      () => ({
        data:
          data.status !== 'loading' && data.data !== undefined
            ? data.data
            : defaultValue,
        updateData,
        saveData: requestFileWriteToDisk,
        error: data.status === 'error' ? data.error : undefined,
      }),
      [data, updateData],
    );

    if (data.status === 'loading') {
      return <>Loading...</>;
    }

    return (
      <context.Provider value={providedContext}>{children}</context.Provider>
    );
  };

  return {
    Provider,
    context,
  };
}
