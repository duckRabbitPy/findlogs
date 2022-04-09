#!/usr/bin/env node

import { getDirRecursive, countOccurences, logOrlogs } from "./helpers";
const nodeDir = require("node-dir");

//get all directory titles
//loop through each directory and log if console.log() found
(async function findAndLog() {
  const allDirTitles = getDirRecursive(".").filter(
    (dirTitle) =>
      !dirTitle.includes("node_modules") && !dirTitle.includes(".git")
  );

  console.log(`\nSearching: \n${allDirTitles.join("\r\n")} \n`);

  for (const dirTitle of allDirTitles) {
    await searchDir(dirTitle);
  }
})();

//open directory and loop through directory entries
//count and log occurrences of console.logs found
async function searchDir(dirTitle: string = "") {
  nodeDir.readFiles(
    `./${dirTitle}`,
    {
      match: /.js$|.jsx$|.ts$|.tsx$/,
      exclude: ["/node_modules"],
    },
    function (err: Error, content: string, filename: string, next: any) {
      if (err) throw err;

      const occurrences = countOccurences(content, "console.log");
      const commentedNum = countOccurences(content, "//console.log");
      const commentedNumV2 = countOccurences(content, "// console.log");

      const trueOccurrences = occurrences - (commentedNum + commentedNumV2);

      if (
        trueOccurrences > 0 &&
        !filename.includes("node_modules") &&
        !filename.includes(".json")
      ) {
        console.log(
          "\x1b[36m",
          `🔍 Found ${trueOccurrences} console.${logOrlogs(
            trueOccurrences
          )} in ${filename}`,
          "\x1b[0m"
        );
      }
      next();
    }
  );
}
