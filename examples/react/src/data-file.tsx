import pino from 'pino';
import React, { useRef } from 'react';
import { Toolkit } from '@arcanejs/toolkit';

import type { TextInput as TextInputType } from '@arcanejs/toolkit';
import {
  ToolkitRenderer,
  Group,
  TextInput,
  Button,
} from '@arcanejs/react-toolkit';
import {
  createDataFileDefinition,
  useDataFileContext,
} from '@arcanejs/react-toolkit/data';
import { z } from 'zod';
import path from 'path';

const DATA_DIR = path.join(path.dirname(__dirname), 'data', 'data-file');

const toolkit = new Toolkit({
  log: pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  }),
});

toolkit.start({
  mode: 'automatic',
  port: 1336,
});

const DataSpec = createDataFileDefinition({
  schema: z.object({
    text: z.string(),
  }),
  defaultValue: {
    text: 'Hello World',
  },
});

const NAME_REGEX = /^[a-zA-Z0-9_-]+\.json$/;

const validateName = (name: string) => {
  if (!NAME_REGEX.exec(name)) {
    throw new Error('Invalid filename for JSON file');
  }
};

const FileDetails = () => {
  const { data, lastUpdatedMillis, updateData } = useDataFileContext(DataSpec);
  return (
    <Group direction="vertical">
      <Group>
        Last Updated: {new Date(lastUpdatedMillis).toLocaleString()}
      </Group>
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

const App = () => {
  const fileInputRef = useRef<TextInputType | null>(null);
  const [filename, setFilename] = React.useState<string | null>(null);

  return (
    <Group direction="vertical">
      Enter a filename to save data to, it must end in .json:
      <Group>
        {`${DATA_DIR}/`}
        <TextInput ref={fileInputRef} />
        <Button
          text={'Use File'}
          onClick={() => {
            const name = fileInputRef.current?.getValue() ?? '';
            validateName(name);
            setFilename(name);
          }}
        />
      </Group>
      {filename && (
        <DataSpec.Provider
          path={path.join(DATA_DIR, filename)}
          onPathChange="transfer"
        >
          <FileDetails />
        </DataSpec.Provider>
      )}
    </Group>
  );
};

ToolkitRenderer.render(<App />, toolkit);
