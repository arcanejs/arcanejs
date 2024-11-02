import React, { useRef } from 'react';
import { Toolkit } from '@arcanejs/toolkit';

import type { TextInput as TextInputType } from '@arcanejs/toolkit';
import {
  ToolkitRenderer,
  Group,
  TextInput,
  Button,
  Tabs,
  Tab,
} from '@arcanejs/react-toolkit';
import {
  createDataFileSpec,
  useDataFile,
  useDataFileUpdater,
} from '@arcanejs/react-toolkit/data';
import { z } from 'zod';
import path from 'path';

const DATA_DIR = path.join(path.dirname(__dirname), 'data', 'data-files');

const toolkit = new Toolkit();

toolkit.start({
  mode: 'automatic',
  port: 1335,
});

const ConfiguredFiles = createDataFileSpec({
  schema: z.string().array(),
  defaultValue: [],
});

const IndividualFile = createDataFileSpec({
  schema: z.object({
    text: z.string(),
  }),
  defaultValue: {
    text: 'Hello World',
  },
  onPathChange: 'transfer',
});

const NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const validateName = (name: string) => {
  if (!NAME_REGEX.exec(name)) {
    throw new Error('Invalid name');
  }
};

const FileDetails = () => {
  const { error, data, updateData } = useDataFile(IndividualFile);
  return (
    <Group direction="vertical">
      {error ? <>{`${error}`}</> : null}
      <Group>
        Data:
        <TextInput
          value={data.text}
          onChange={(text) => updateData((current) => ({ ...current, text }))}
        />
      </Group>
    </Group>
  );
};

const File = ({ index, filename }: { index: number; filename: string }) => {
  const updateFiles = useDataFileUpdater(ConfiguredFiles);
  const fileInputRef = useRef<TextInputType | null>(null);

  return (
    <Tab name={filename}>
      <IndividualFile.Provider
        path={path.join(DATA_DIR, 'files', `${filename}.json`)}
      >
        <Group direction="vertical">
          <Group>
            File Path:
            <TextInput value={filename} ref={fileInputRef} />
            <Button
              text="Update file"
              onClick={() => {
                const name = fileInputRef.current?.getValue() ?? '';
                validateName(name);
                updateFiles((current) => {
                  const updated = [...current];
                  updated[index] = name;
                  return updated;
                });
              }}
            />
          </Group>
          <FileDetails />
        </Group>
      </IndividualFile.Provider>
    </Tab>
  );
};

const Files = () => {
  const { data, updateData, error } = useDataFile(ConfiguredFiles);
  const fileInputRef = useRef<TextInputType | null>(null);

  return (
    <Group direction="vertical">
      {error ? <>{`${error}`}</> : null}
      <Group>
        <TextInput ref={fileInputRef} />
        <Button
          text={'Add File'}
          onClick={() => {
            const name = fileInputRef.current?.getValue() ?? '';
            validateName(name);
            updateData((current) => {
              // Only add the file if it doesn't already exist
              if (current.includes(name)) {
                throw new Error('File already exists');
              }
              return [...current, name];
            });
            fileInputRef.current?.setValue('');
          }}
        />
      </Group>
      <Tabs>
        {data.map((filename, index) => (
          <File key={index} index={index} filename={filename} />
        ))}
      </Tabs>
    </Group>
  );
};

const App = () => (
  <ConfiguredFiles.Provider path={path.join(DATA_DIR, 'index.json')}>
    <Files />
  </ConfiguredFiles.Provider>
);

ToolkitRenderer.render(<App />, toolkit);
