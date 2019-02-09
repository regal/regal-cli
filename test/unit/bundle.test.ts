import * as regalBundler from "regal-bundler";
import * as program from "commander";

/* Mock the call to regal-bundler */
jest.mock("regal-bundler");
const bundleMock = jest.fn();
// @ts-ignore
regalBundler.bundle = bundleMock;

/* Utility function to produce argv */
const argv = (...args: string[]) =>
    [process.execPath, __filename, "bundle"].concat(args);

/* Add bundleCommand to CLI */
import bundleCommand from "../../src/bundle";
bundleCommand(program);

/* Unit tests */
describe("Bundle Command", () => {
    beforeEach(() => {
        bundleMock.mockReset();
    });

    it("No-argument call", () => {
        program.parse(argv());
        expect(bundleMock).toBeCalledWith({
            bundler: {
                input: {},
                output: {}
            }
        });
    });
});
