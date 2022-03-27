import { exec } from "child_process";
import util from "util";

// general purpose function to run commands in new shell, returning stdout
async function runShellCommand(cmd: string): Promise<string> {
  // child_process.exec spawns a new shell and runs a command inside a child process
  // Creating a promise from child_process.exec allows use of await for async scripts

  const execPromise = util.promisify(exec);
  const processPromise = execPromise(cmd);

  // the child property of processPromise is an instance of the ChildProcess module
  const { child } = processPromise;

  // logs for stdout, stderr, error messages and exit code from child process
  child.on("error", (Error) => process.stdout.write(`Error: ${Error.message}`));
  child.on("exit", (code) => process.stdout.write(`exit code: ${code}`));

  // await completion of child_process.exec and return final stdout string
  const { stdout } = await processPromise;

  return stdout;
}

// spawn new shell and run command
runShellCommand("node ./dist/index.js").then((result) => {
  // if stdout fails to return sucess message, output warning
  const testResultsOnly = result
    .replace("🔎 Found  3 console.logs in /dist/test.js", "")
    .replace("🔎 Found  10 console.logs in /src/test.ts", "");

  console.log(testResultsOnly);
  foundExpected(
    testResultsOnly,
    "Found  1 console.log in /testLvl1/file1.js",
    1
  );
  foundExpected(
    testResultsOnly,
    "Found  2 console.logs in /testLvl1/file2.jsx",
    2
  );
  foundExpected(
    testResultsOnly,
    "Found  1 console.log in /testLvl2/file3.js",
    3
  );
  foundExpected(
    testResultsOnly,
    "Found  2 console.logs in /testLvl2/file4.jsx",
    4
  );
  foundExpected(
    testResultsOnly,
    "Found  1 console.log in /testLvl3/file5.js",
    5
  );
  foundExpected(
    testResultsOnly,
    "Found  2 console.logs in /testLvl3/file6.jsx",
    6
  );
});

function foundExpected(testResults: string, expected: string, testnum: number) {
  if (testResults.includes(expected)) {
    console.log(`T${testnum} ${expected} = pass ✅`);
  } else {
    console.log(`T${testnum} "${expected}" is missing from output = fail ❌`);
  }
}
