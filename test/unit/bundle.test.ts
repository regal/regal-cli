import * as regalBundler from "regal-bundler";
import { Command } from "commander";
import bundleCommand from "../../src/bundle";

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

        getProgram().parse(argv("--input-file", val));

        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: { file: val },
                output: {}
            }
        });
    });
});
