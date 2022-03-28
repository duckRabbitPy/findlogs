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
  foundExpected(result, "Found 1 console.log in fixture/testLvl1/file1.js", 1);
  foundExpected(result, "Found 1 console.log in fixture/testLvl1/file1.ts", 2);
  foundExpected(
    result,
    "Found 2 console.logs in fixture/testLvl1/file2.jsx",
    3
  );
  foundExpected(
    result,
    "Found 2 console.logs in fixture/testLvl1/file2.tsx",
    4
  );

  foundExpected(
    result,
    "Found 1 console.log in fixture/testLvl1/testLvl2/file3.js",
    5
  );
  foundExpected(
    result,
    "Found 1 console.log in fixture/testLvl1/testLvl2/file3.ts",
    6
  );
  foundExpected(
    result,
    "Found 2 console.logs in fixture/testLvl1/testLvl2/file4.jsx",
    7
  );
  foundExpected(
    result,
    "Found 2 console.logs in fixture/testLvl1/testLvl2/file4.tsx",
    8
  );
  foundExpected(
    result,
    "Found 1 console.log in fixture/testLvl1/testLvl2/testLvl3/file5.js",
    9
  );
  foundExpected(
    result,
    "Found 1 console.log in fixture/testLvl1/testLvl2/testLvl3/file5.ts",
    10
  );
  foundExpected(
    result,
    "Found 2 console.logs in fixture/testLvl1/testLvl2/testLvl3/file6.jsx",
    11
  );
  foundExpected(
    result,
    "Found 2 console.logs in fixture/testLvl1/testLvl2/testLvl3/file6.tsx",
    12
  );

  fileExtensionLimit(
    result,
    "Found 1 console.log in fixture/testLvl1/index.html",
    13
  );
});

function foundExpected(testResults: string, expected: string, testnum: number) {
  if (testResults.includes(expected)) {
    console.log(`T${testnum} ${expected} = pass ✅`);
  } else {
    console.log(`T${testnum} "${expected}" is missing from output = fail ❌`);
  }
}

function fileExtensionLimit(
  testResults: string,
  falsePositive: string,
  testnum: number
) {
  if (testResults.includes(falsePositive)) {
    console.log(
      `T${testnum} "${falsePositive}" was logged when it ought not to have been = fail ❌`
    );
  } else {
    console.log(`T${testnum} no false positive in HTML = pass ✅`);
  }
}
