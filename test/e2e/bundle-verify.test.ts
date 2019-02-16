import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

import { isWin } from "../test-utils";

const execRegal = isWin ? "regal" : "./bin/regal";

const logbacks = callback => (error, stdout, stderr) => {
    if (error) {
        throw new Error(error);
    }
    if (stderr) {
        throw new Error(stderr);
    }
    if (stdout) {
        callback();
    }
};

it("Bundle-Verify", done => {
    exec(
        `${execRegal} bundle -c ./test/e2e/resources/sample-game -o ./test/e2e/resources/temp/bundle.verify.regal.js`,
        logbacks(async () => {
            fs.readFile(
                path.join(
                    __dirname,
                    "./resources/sample-game/temp/bundle.regal.js"
                ),
                (err, expected) => {
                    if (err) throw err;

                    fs.readFile(
                        path.join(
                            __dirname,
                            "./resources/temp/bundle.verify.regal.js"
                        ),
                        (err, actual) => {
                            if (err) throw err;
                            expect(actual.toString()).toEqual(
                                expected.toString()
                            );
                            done();
                        }
                    );
                }
            );
        })
    );
});
