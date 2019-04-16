import * as fs from 'fs';

import { getCssModuleKeys, getTypingFilename } from './cssTypeHelper';

const bannerMessage = `// This file is automatically generated.\n\n`;

const makeDoneHandlers = (callback, content, rest) => ({
  failed: e => callback(e),
  success: () => callback(null, content, ...rest)
});

const makeFileHandlers = (filename: string) => ({
  read: handler => fs.readFile(filename, { encoding: 'utf-8' }, handler),
  write: (content, handler) =>
    fs.writeFile(filename, content, { encoding: 'utf-8' }, handler)
});

export default function (content, ...rest) {
  // get css module keys
  const cssKeys = getCssModuleKeys(content);

  const fields = cssKeys.map((key) => `  '${key}': string;`);

  const cssInterface = `interface CssExports {\n${fields.join('\n')}\n}`;

  const cssModuleExport = '\n\ndeclare var cssExports: CssExports;\nexport = cssExports;\n';

  const cssModuleDefinition = bannerMessage + cssInterface + cssModuleExport;

  // get css module interface filename
  const cssModuleTypeFilename = getTypingFilename(this.resourcePath);

  // async handlers
  const { read, write } = makeFileHandlers(cssModuleTypeFilename);
  const { failed, success } = makeDoneHandlers(this.async(), content, rest);

  read((_, fileContents) => {
    if (cssModuleDefinition !== fileContents) {
      write(cssModuleDefinition, err => {
        if (err) {
          failed(err);
        } else {
          success();
        }
      });
    } else {
      success();
    }
  });
};
