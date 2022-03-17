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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const helpers_1 = require("./helpers");
//get all directory titles
//loop through each directory and log if console.log() found
(function findAndLog() {
    const allDirTitles = (0, helpers_1.getDirRecursive)(".").filter((dirTitle) => !dirTitle.includes("node_modules"));
    allDirTitles.forEach((dirTitle) => {
        searchDir(dirTitle).catch(console.error);
    });
})();
//open directory and loop through directory entries
// pass current directory entry as argument to countAndDisplay()
function searchDir(dirTitle = "") {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let clean = true;
        const dir = yield fs.promises.opendir(`./${dirTitle}`);
        try {
            for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                const dirent = dir_1_1.value;
                const filepath = process.cwd() + `/${dirTitle}/${dirent.name}`;
                if (filepath.slice(-3) === ".js" || filepath.slice(-3) === ".ts") {
                    countAndDisplay(filepath, dirent, (result) => {
                        if (result === false) {
                            clean = false;
                        }
                    });
                }
                console.log(clean);
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
//read directory entry contents and count occurrences of console.log()
//log output
function countAndDisplay(filepath, dirent, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let occurences = (0, helpers_1.countOccurences)(data, "console.log");
            if (occurences > 0) {
                console.log(`🔎 Found `, occurences, `console.logs in ${dirent.name}`);
                callback();
            }
            else {
                callback();
            }
        });
    });
}
