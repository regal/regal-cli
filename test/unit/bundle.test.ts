import * as regalBundler from "regal-bundler";
import bundleCommand from "../../src/bundle";
import { Command } from "commander";
import * as CommandStatic from "commander";

/* Mock the call to regal-bundler */
jest.mock("regal-bundler");
const bundleMock = jest.fn();
// @ts-ignore
regalBundler.bundle = bundleMock;

/* Utility function to produce argv */
const argv = (...args: string[]) =>
    [process.execPath, __filename, "bundle"].concat(args);

/* Utility function to generate a new command instance */
const getProgram = () => {
    const program = new Command();
    bundleCommand(program);
    return program;
};

/* Unit tests */
describe("Bundle Command", () => {
    beforeEach(() => {
        bundleMock.mockReset();
    });

    it("No-argument call", () => {
        getProgram().parse(argv());

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: {}
            }
        });
    });

    it.each(["--config", "-c"])("Config option: %s", opt => {
        const val = "./someDir";

        getProgram().parse(argv(opt, val));

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: {}
            },
            configLocation: val
        });
    });

    it.each(["--input-file", "-i"])("InputFile option: %s", opt => {
        const val = "some-src.ts";

        getProgram().parse(argv(opt, val));

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: { file: val },
                output: {}
            }
        });
    });

    it.each([["", true], ["true", true], ["false", false]])(
        "InputTS option: --input-ts %s",
        (opt, val) => {
            const args =
                opt === "" ? argv("--input-ts") : argv("--input-ts", opt);
            getProgram().parse(args);

            expect(bundleMock).toBeCalledWith({
                bundler: {
                    input: { ts: val },
                    output: {}
                }
            });
        }
    );

    it.each(["--output-file", "-o"])("OutputFile option: %s", opt => {
        const val = "some-out.regal.js";

        getProgram().parse(argv(opt, val));

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: { file: val }
            }
        });
    });

    it.each(["--bundle-type", "-b"])("BundleType option: %s", opt => {
        const val = "standard";

        getProgram().parse(argv(opt, val));

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: { bundle: val }
            }
        });
    });

    it.each(["--format", "-f"])("Format option: %s", opt => {
        const val = "cjs";

        getProgram().parse(argv(opt, val));

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: { format: val }
            }
        });
    });

    it.each([
        ["--minify", "", true],
        ["-m", "true", true],
        ["--minify", "false", false]
    ])("Minify option: %s %s", (command, option, val) => {
        const args = option === "" ? argv(command) : argv(command, option);
        getProgram().parse(args);

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: { minify: val }
            }
        });
    });

    it("Error check for illegal InputTS argument", () => {
        expect(() =>
            getProgram().parse(argv("--input-ts", "blarp"))
        ).toThrowError("Illegal argument for --input-ts. Must be a boolean.");
    });

    it("Error check for illegal Minify argument", () => {
        expect(() =>
            getProgram().parse(argv("--minify", "blarp"))
        ).toThrowError("Illegal argument for --minify. Must be a boolean.");
    });

    it("Custom help message", () => {
        CommandStatic.parse(argv("--help"));
    });
});
