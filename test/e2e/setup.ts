const exec = require("child_process").exec;

let wasSuccessful = false;
let finishedProcesses = 0;
const numProcesses = 1;

const checkDone = () => {
    if (finishedProcesses == numProcesses) {
        if (wasSuccessful) {
            console.log("e2e setup successful");
        } else {
            console.log("e2e setup failed");
        }
    }
};

const logbacks = (error, stdout, stderr) => {
    finishedProcesses++;

    if (error) {
        console.error(`exec error: ${error}`);
    }
    if (stdout) {
        console.log(`stdout: ${stdout}`);
        wasSuccessful = true;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }

    checkDone();
};

exec("cd ./test/e2e/resources/sample-game && npm run build", logbacks);
