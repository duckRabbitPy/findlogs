import fs = require("fs");
import path = require("path");

export function getDir(srcpath: string) {
  return fs
    .readdirSync(srcpath)
    .map((file: string) => path.join(srcpath, file))
    .filter((path: string) => fs.statSync(path).isDirectory());
}

export function flatten(lists: any[]) {
  return lists.reduce((a, b) => a.concat(b), []);
}

export function getDirRecursive(srcpath: string): string[] {
  return [srcpath, ...flatten(getDir(srcpath).map(getDirRecursive))];
}

export function countOccurences(filecontent: string, word: string) {
  return filecontent.split(word).length - 1;
}

export function logOrlogs(occurences: number) {
  return occurences === 1 ? "log" : "logs";
}
