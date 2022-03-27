#!/usr/bin/env node

import fs = require("fs");
import { getDirRecursive, countOccurences, logOrlogs } from "./helpers";
const util = require("util");
const readFile = util.promisify(fs.readFile);

//get all directory titles
//loop through each directory and log if console.log() found
//display no log found message if no logs found
(async function findAndLog() {
  const allDirTitles = getDirRecursive(".").filter(
    (dirTitle) => !dirTitle.includes("node_modules")
  );

  const foundLogArr = Promise.all(
    allDirTitles.map((dirTitle: string) => {
      return searchDir(dirTitle).catch(console.error);
    })
  );

  foundLogArr.then((arr) => {
    if (arr.every((found) => found === false)) {
      console.log("no logs found, directory is clean 🧼");
    }
  });
})();

//open directory and loop through directory entries
// pass current directory entry as argument to countAndDisplay()
//return true if log found, false if no log found
async function searchDir(dirTitle: string = "") {
  const dir = await fs.promises.opendir(`./${dirTitle}`);
  for await (const dirent of dir) {
    const filepath = process.cwd() + `/${dirTitle}/${dirent.name}`;

    if (
      [".js", ".ts"].includes(filepath.slice(-3)) ||
      [".jsx", ".tsx"].includes(filepath.slice(-4))
    ) {
      let occurrences = await countAndDisplay(filepath, dirent);
      if (occurrences > 0) {
        return true;
      }
    }
  }
  return false;
}

//read directory entry contents and count occurrences of console.log()
//log output
async function countAndDisplay(filepath: string, dirent: fs.Dirent) {
  return readFile(filepath, "utf8")
    .then((data: string) => {
      let occurences = countOccurences(data, "console.log");
      if (occurences > 0) {
        const lastIndex = filepath.lastIndexOf("/");
        const secondLastIndex = filepath.lastIndexOf(
          "/",
          filepath.lastIndexOf("/") - 1
        );

        const enclosingDir = filepath.slice(secondLastIndex, lastIndex);

        console.log(
          `🔎 Found `,
          occurences,
          `console.${logOrlogs(occurences)} in ${enclosingDir}/${dirent.name}`
        );
      }
      return occurences;
    })
    .catch((err: string) => {
      console.log("Error", err);
    });
}
