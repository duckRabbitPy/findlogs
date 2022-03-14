#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

(function findAndLog() {
  const allDirs = getDirectoriesRecursive(".");

  const authorDirs = allDirs.filter(
    (folder) => !folder.includes("node_modules")
  );

  authorDirs.forEach((folder: string) => {
    logLogs(folder).catch(console.error);
  });
})();

function getDirectories(srcpath: string) {
  return fs
    .readdirSync(srcpath)
    .map((file: string) => path.join(srcpath, file))
    .filter((path: string) => fs.statSync(path).isDirectory());
}

function flatten(lists: []) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectoriesRecursive(srcpath: string) {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
  ];
}

function countOccurences(filecontent: string, word: string) {
  return filecontent.split(word).length - 1;
}

async function logLogs(folder: string = "") {
  const dir = await fs.promises.opendir(`./${folder}`);
  for await (const dirent of dir) {
    const filepath = process.cwd() + `/${folder}/${dirent.name}`;
    if (filepath.slice(-2) === "js") {
      fs.readFile(filepath, "utf8", (err: Error, data: string) => {
        if (err) {
          console.error(err);
          return;
        }
        let occurences = countOccurences(data, "console.log");
        if (occurences > 0) {
          console.log(
            `🔎 Found `,
            occurences,
            `console.logs in ${dirent.name}`
          );
        }
      });
    }
  }
}
