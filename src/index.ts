#!/usr/bin/env node

import fs = require("fs");
import { getDirRecursive, countOccurences } from "./helpers";
import { stdin, stdout } from "process";

//get all directory titles
//loop through each directory and log if console.log() found
(function findAndLog() {
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
  let clean = true;
  const dir = await fs.promises.opendir(`./${dirTitle}`);
  for await (const dirent of dir) {
    const filepath = process.cwd() + `/${dirTitle}/${dirent.name}`;

    if (filepath.slice(-3) === ".js" || filepath.slice(-3) === ".ts") {
      countAndDisplay(filepath, dirent, (result: boolean) => {
        if (result === false) {
          clean = false;
        }
      });
    }
    console.log(clean);
  }
}

//read directory entry contents and count occurrences of console.log()
//log output
async function countAndDisplay(
  filepath: string,
  dirent: fs.Dirent,
  callback: any
) {
  let count = 0;
  fs.readFile(filepath, "utf8", (err, data: string) => {
    if (err) {
      console.error(err);
      return;
    }
    let occurences = countOccurences(data, "console.log");
    if (occurences > 0) {
      console.log(`🔎 Found `, occurences, `console.logs in ${dirent.name}`);
      callback();
    } else {
      callback();
    }
  });
}
