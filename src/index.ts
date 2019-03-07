import * as fs from 'fs';
import chalk from 'chalk';

import { getCssModuleKeys, filterNonWordKeys, filterReservedWordKeys, getTypingFilename, getReservedWordKeys } from './cssTypeHelper';

const bannerMessage = `// This file is automatically generated on.\n\n`;

const makeDoneHandlers = (callback, content, rest) => ({
  failed: e => callback(e),
  success: () => callback(null, content, ...rest)
});

const makeFileHandlers = (filename: string) => ({
  read: handler => fs.readFile(filename, { encoding: 'utf-8' }, handler),
  write: (content, handler) =>
    fs.writeFile(filename, content, { encoding: 'utf-8' }, handler)
});

const logger = (level, ...args) => console[level](...args);

export default function (content, ...rest) {
  // get css module keys
  const cssKeys = getCssModuleKeys(content);

  // filter not vaild keys
  const cssWordKeys = filterNonWordKeys(cssKeys);
  const cssVaildKeys = filterReservedWordKeys(cssWordKeys);

  // css contains reserved word keys
  if (cssVaildKeys.length != cssWordKeys.length)
  {
    const reservedWordKeys = getReservedWordKeys(cssWordKeys);
    logger('warn',
      + chalk.yellow('\nYour css contains classes which are reserved words in JavaScript.')
      + chalk.red(`\n${reservedWordKeys.map(rwd => ` - "${rwd}"`).join('\n')}`)
      + chalk.cyan(`\nThese can be accessed using the object literal syntax; eg styles['delete'] instead of styles.delete.`));
  }

  // get typing exports
  const typeingExports = cssVaildKeys.map((key) => `export const ${key}: string;`);

  // get css module definition file content
  const cssModuleDefinition = bannerMessage + typeingExports.join('\n');

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
