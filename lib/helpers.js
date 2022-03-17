"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countOccurences = exports.getDirRecursive = exports.flatten = exports.getDir = void 0;
const fs = require("fs");
const path = require("path");
function getDir(srcpath) {
    return fs
        .readdirSync(srcpath)
        .map((file) => path.join(srcpath, file))
        .filter((path) => fs.statSync(path).isDirectory());
}
exports.getDir = getDir;
function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}
exports.flatten = flatten;
function getDirRecursive(srcpath) {
    return [srcpath, ...flatten(getDir(srcpath).map(getDirRecursive))];
}
exports.getDirRecursive = getDirRecursive;
function countOccurences(filecontent, word) {
    return filecontent.split(word).length - 1;
}
exports.countOccurences = countOccurences;
