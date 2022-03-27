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
    // if stdout fails to return sucess message, output warning
    const testResultsOnly = result
        .replace("🔎 Found  3 console.logs in /dist/test.js", "")
        .replace("🔎 Found  10 console.logs in /src/test.ts", "");
    console.log(testResultsOnly);
    foundExpected(testResultsOnly, "Found  1 console.log in /testLvl1/file1.js", 1);
    foundExpected(testResultsOnly, "Found  2 console.logs in /testLvl1/file2.jsx", 2);
    foundExpected(testResultsOnly, "Found  1 console.log in /testLvl2/file3.js", 3);
    foundExpected(testResultsOnly, "Found  2 console.logs in /testLvl2/file4.jsx", 4);
    foundExpected(testResultsOnly, "Found  1 console.log in /testLvl3/file5.js", 5);
    foundExpected(testResultsOnly, "Found  2 console.logs in /testLvl3/file6.jsx", 6);
});
function foundExpected(testResults, expected, testnum) {
    if (testResults.includes(expected)) {
        console.log(`T${testnum} ${expected} = pass ✅`);
    }
    else {
        console.log(`T${testnum} "${expected}" is missing from output = fail ❌`);
    }
}
