#!/usr/bin/env node

import fs = require("fs");
import { type } from "os";
import { getDirRecursive, countOccurences, logOrlogs } from "./helpers";
const util = require("util");
const readFile = util.promisify(fs.readFile);
const nodeDir = require("node-dir");

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
  nodeDir.readFiles(
    `./${dirTitle}`,
    {
      match: /.js|.jsx|.ts|.tsx$/,
      exclude: ["node_modules"],
    },
    function (err: Error, content: string, filename: string, next: any) {
      if (err) throw err;

      const occurrences = countOccurences(content, "console.log");
      const commentedNum = countOccurences(content, "//console.log");
      const commentedNumV2 = countOccurences(content, "// console.log");

      const trueOccurrences = occurrences - (commentedNum + commentedNumV2);

      if (trueOccurrences > 0 && !filename.includes("node_modules")) {
        console.log(
          `🔍 Found ${trueOccurrences} console.${logOrlogs(
            trueOccurrences
          )} in ${filename}`
        );
      }
      next();
    },
    function (err: Error) {
      if (err) throw err;
    }
  );

  return false;
}
