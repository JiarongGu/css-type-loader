import * as path from 'path';
import { reservedWords } from './reservedWords';

export function getCssModuleKeys(content) {
  const cssKeys: Array<string> = [];
  const keyRegex = /"(?<key>[^\\"]+)":/g;

  // get all css keys from content
  let match: RegExpExecArray | null;
  do {
    match = keyRegex.exec(content);
    if (match && match.groups && match.groups.key)
      cssKeys.push(match.groups.key);
  } while (match != null)

  // filter out none ts formats
  return cssKeys.sort();
}

export function filterNonWordKeys(cssModuleKeys) {
  const allWordsRegexp = /^\w+$/i;
  const filteredClassNames = cssModuleKeys.filter(classname => allWordsRegexp.test(classname));
  return filteredClassNames;
};

export function filterReservedWordKeys(cssModuleKeys) {
  const filteredClassNames = cssModuleKeys.filter(classname => reservedWords.indexOf(classname) === -1);
  return filteredClassNames;
}

export function getReservedWordKeys(cssModuleKeys) {
  const filteredClassNames = cssModuleKeys.filter(classname => reservedWords.indexOf(classname) !== -1);
  return filteredClassNames;
}

export function getTypingFilename(filename) {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.d.ts`);
};