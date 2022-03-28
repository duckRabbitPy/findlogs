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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
// general purpose function to run commands in new shell, returning stdout
function runShellCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // child_process.exec spawns a new shell and runs a command inside a child process
        // Creating a promise from child_process.exec allows use of await for async scripts
        const execPromise = util_1.default.promisify(child_process_1.exec);
        const processPromise = execPromise(cmd);
        // the child property of processPromise is an instance of the ChildProcess module
        const { child } = processPromise;
        // logs for stdout, stderr, error messages and exit code from child process
        child.on("error", (Error) => process.stdout.write(`Error: ${Error.message}`));
        child.on("exit", (code) => process.stdout.write(`exit code: ${code}`));
        // await completion of child_process.exec and return final stdout string
        const { stdout } = yield processPromise;
        return stdout;
    });
}
// spawn new shell and run command
runShellCommand("node ./dist/index.js").then((result) => {
    foundExpected(result, "Found 1 console.log in fixture/testLvl1/file1.js", 1);
    foundExpected(result, "Found 1 console.log in fixture/testLvl1/file1.ts", 2);
    foundExpected(result, "Found 2 console.logs in fixture/testLvl1/file2.jsx", 3);
    foundExpected(result, "Found 2 console.logs in fixture/testLvl1/file2.tsx", 4);
    foundExpected(result, "Found 1 console.log in fixture/testLvl1/testLvl2/file3.js", 5);
    foundExpected(result, "Found 1 console.log in fixture/testLvl1/testLvl2/file3.ts", 6);
    foundExpected(result, "Found 2 console.logs in fixture/testLvl1/testLvl2/file4.jsx", 7);
    foundExpected(result, "Found 2 console.logs in fixture/testLvl1/testLvl2/file4.tsx", 8);
    foundExpected(result, "Found 1 console.log in fixture/testLvl1/testLvl2/testLvl3/file5.js", 9);
    foundExpected(result, "Found 1 console.log in fixture/testLvl1/testLvl2/testLvl3/file5.ts", 10);
    foundExpected(result, "Found 2 console.logs in fixture/testLvl1/testLvl2/testLvl3/file6.jsx", 11);
    foundExpected(result, "Found 2 console.logs in fixture/testLvl1/testLvl2/testLvl3/file6.tsx", 12);
    fileExtensionLimit(result, "Found 1 console.log in fixture/testLvl1/index.html", 13);
});
function foundExpected(testResults, expected, testnum) {
    if (testResults.includes(expected)) {
        console.log(`T${testnum} ${expected} = pass ✅`);
    }
    else {
        console.log(`T${testnum} "${expected}" is missing from output = fail ❌`);
    }
}
function fileExtensionLimit(testResults, falsePositive, testnum) {
    if (testResults.includes(falsePositive)) {
        console.log(`T${testnum} "${falsePositive}" was logged when it ought not to have been = fail ❌`);
    }
    else {
        console.log(`T${testnum} no false positive in HTML = pass ✅`);
    }
}
