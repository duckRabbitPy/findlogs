#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const fs = require("fs");
const path = require("path");
(function findAndLog() {
    const allDirs = getDirectoriesRecursive(".");
    const authorDirs = allDirs.filter((folder) => !folder.includes("node_modules"));
    authorDirs.forEach((folder) => {
        logLogs(folder).catch(console.error);
    });
})();
function getDirectories(srcpath) {
    return fs
        .readdirSync(srcpath)
        .map((file) => path.join(srcpath, file))
        .filter((path) => fs.statSync(path).isDirectory());
}
function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}
function getDirectoriesRecursive(srcpath) {
    return [
        srcpath,
        ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
    ];
}
function countOccurences(filecontent, word) {
    return filecontent.split(word).length - 1;
}
function logLogs(folder = "") {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const dir = yield fs.promises.opendir(`./${folder}`);
        try {
            for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                const dirent = dir_1_1.value;
                const filepath = process.cwd() + `/${folder}/${dirent.name}`;
                if (filepath.slice(-2) === "js") {
                    fs.readFile(filepath, "utf8", (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let occurences = countOccurences(data, "console.log");
                        if (occurences > 0) {
                            console.log(`🔎 Found `, occurences, `console.logs in ${dirent.name}`);
                        }
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
