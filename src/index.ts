#!/usr/bin/env node

import fs = require("fs");
import { getDirRecursive, countOccurences } from "./helpers";
const util = require("util");
const readFile = util.promisify(fs.readFile);

//get all directory titles
//loop through each directory and log if console.log() found
(async function findAndLog() {
  const allDirTitles = getDirRecursive(".").filter(
    (dirTitle) => !dirTitle.includes("node_modules")
  );

  allDirTitles.forEach((dirTitle: string) => {
    searchDir(dirTitle).catch(console.error);
  });
})();

//open directory and loop through directory entries
// pass current directory entry as argument to countAndDisplay()
async function searchDir(dirTitle: string = "") {
  let isClean = true;
  const dir = await fs.promises.opendir(`./${dirTitle}`);
  for await (const dirent of dir) {
    const filepath = process.cwd() + `/${dirTitle}/${dirent.name}`;

    if (filepath.slice(-3) === ".js" || filepath.slice(-3) === ".ts") {
      const occurences = await countAndDisplay(filepath, dirent);
      if (occurences > 0) {
        isClean = false;
      }
    }
  }
  return isClean;
}

//read directory entry contents and count occurrences of console.log()
//log output
async function countAndDisplay(filepath: string, dirent: fs.Dirent) {
  return readFile(filepath, "utf8")
    .then((data: string) => {
      let occurences = countOccurences(data, "console.log");
      if (occurences > 0) {
        console.log(`🔎 Found `, occurences, `console.logs in ${dirent.name}`);
      }
      return occurences;
    })
    .catch((err: string) => {
      console.log("Error", err);
    });
}
