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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const helpers_1 = require("./helpers");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const nodeDir = require("node-dir");
//get all directory titles
//loop through each directory and log if console.log() found
//display no log found message if no logs found
(function findAndLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const allDirTitles = (0, helpers_1.getDirRecursive)(".").filter((dirTitle) => !dirTitle.includes("node_modules"));
        const foundLogArr = Promise.all(allDirTitles.map((dirTitle) => {
            return searchDir(dirTitle).catch(console.error);
        }));
        foundLogArr.then((arr) => {
            if (arr.every((found) => found === false)) {
                console.log("no logs found, directory is clean 🧼");
            }
        });
    });
})();
//open directory and loop through directory entries
// pass current directory entry as argument to countAndDisplay()
//return true if log found, false if no log found
function searchDir(dirTitle = "") {
    return __awaiter(this, void 0, void 0, function* () {
        nodeDir.readFiles(`./${dirTitle}`, {
            match: /.js|.jsx|.ts|.tsx$/,
            exclude: ["node_modules"],
        }, function (err, content, filename, next) {
            if (err)
                throw err;
            const occurrences = (0, helpers_1.countOccurences)(content, "console.log");
            const commentedNum = (0, helpers_1.countOccurences)(content, "//console.log");
            const commentedNumV2 = (0, helpers_1.countOccurences)(content, "// console.log");
            const trueOccurrences = occurrences - (commentedNum + commentedNumV2);
            if (trueOccurrences > 0 && !filename.includes("node_modules")) {
                console.log(`🔍 Found ${trueOccurrences} console.${(0, helpers_1.logOrlogs)(trueOccurrences)} in ${filename}`);
            }
            next();
        }, function (err) {
            if (err)
                throw err;
        });
        return false;
    });
}
