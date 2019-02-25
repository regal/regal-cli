import { spawn } from "child_process";
import { execRegal } from "../test-utils";

const testOut = (arg: string[], done) => {
    const bundlePath = "./test/e2e/resources/sample-game/temp/bundle.regal.js";

    const proc = spawn(execRegal, ["play", bundlePath].concat(arg), {
        cwd: process.cwd(),
        shell: true
    });

    let firstResponse = true;
    const commands = ["hey there!", "foo", "asdfjf", ":quit"];

    let OUTPUT = "";

    proc.stderr.on("data", data => {
        throw new Error("StdErr: " + data.toString());
    });

    proc.on("error", err => {
        throw new Error("ERROR: " + JSON.stringify(err));
    });

    proc.stdout.on("data", data => {
        OUTPUT += `${data.toString()}`;
        if (!firstResponse) {
            proc.stdin.write(commands.shift() + "\n");
        }
        firstResponse = false;
    });

    proc.on("exit", () => {
        expect(OUTPUT).toMatchSnapshot();
        done();
    });
};

describe("Play-Options", () => {
    it("Play-Options: --debug", done => testOut(["--debug"], done));

    it("Play-Options: --showMinor false", done =>
        testOut(["--showMinor", "false"], done));
});
