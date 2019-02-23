import { spawn } from "child_process";
import { execRegal } from "../test-utils";

it("Play-Verify", done => {
    const bundlePath = "./test/e2e/resources/sample-game/temp/bundle.regal.js";

    const proc = spawn(execRegal, ["play", bundlePath, "--seed", "w00f"], {
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
});
