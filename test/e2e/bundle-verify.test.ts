import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

const logbacks = callback => (error, stdout, stderr) => {
    if (error || stderr) {
        throw new Error(error);
    }
    if (stdout) {
        callback();
    }
};

it("Bundle-Verify", done => {
    exec(
        "regal bundle -c ./test/e2e/resources/sample-game -o ./test/e2e/resources/temp/bundle.verify.regal.js",
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
