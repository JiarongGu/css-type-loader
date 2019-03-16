import * as path from 'path';
import { reservedWords } from './reservedWords';

export function getCssModuleKeys(content) {
  // get local exports
  const localRegex = /locals\s*=\s*{(?<content>[\s\S]*)}/g;
  const localContent = getGroupedMatches(localRegex, content, 'content').join('\n');

  // get all css keys from content
  const keyRegex = /"(?<key>[^\\"]+)":/g;
  const cssKeys = getGroupedMatches(keyRegex, localContent, 'key');
  return cssKeys.sort();
}

function getGroupedMatches(regex: RegExp, content: string, group: string) {
  const matches: Array<string> = [] = [];
  let match: RegExpExecArray | null;
  do {
    match = regex.exec(content);
    if (match && match.groups && match.groups[group])
      matches.push(match.groups[group]);
  } while (match != null)
  return matches;
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