import { spawn } from "child_process";
import { execRegal, logbacks } from "../test-utils";

it.skip("Play-Verify", done => {
    const proc = spawn(
        `${execRegal} play ./test/e2e/resources/sample-game/temp/bundle.regal.js`,
        {
            shell: true
        }
    );

    let isDone = false;

    proc.stderr.on("data", data => {
        if (!isDone) {
            isDone = true;
            console.log("stderr");
            // proc.kill();
            done();
        }
    });

    proc.stdout.on("data", data => {
        if (!isDone) {
            console.log("data");
            done();
        }
    });

    while (true) {} // TODO - start here
});
