import { Command } from "commander";
import playCommand from "../../src/play";
import * as readline from "readline";
import { join } from "path";
import * as wrappers from "../../src/wrappers";

/* Readline Mock */
jest.mock("readline");
let lineHandler = () => {
    throw new Error("lineHandler is not defined.");
};
const listenerMock = jest.fn().mockImplementation((event, handler) => {
    lineHandler = handler;
});
const ioMock = jest.fn().mockImplementation(() => ({ on: listenerMock }));
//@ts-ignore
readline.createInterface = ioMock;

/* Game API Mock */
const gameMock = jest.fn();
jest.spyOn(wrappers, "importDynamic").mockImplementation(() =>
    Promise.resolve(gameMock)
);

/* Stdout Mock */
const logMock = jest.spyOn(wrappers, "log").mockImplementation(() => {});

//@ts-ignore
const exitSpy: any = jest.spyOn(process, "exit").mockImplementation(() => {});

/* Utility function to produce argv */
const argv = (...args: string[]) =>
    [process.execPath, __filename, "play"].concat(args);

/* Utility function to generate a new command instance */
const getProgram = () => {
    const program = new Command();
    playCommand(program);
    return program;
};

describe.skip("Play Command", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Various Options", () => {
        beforeEach(() => {
            gameMock.mockImplementation(() => ({
                getMetadataCommand: () => ({
                    output: {
                        metadata: {
                            name: "Test Game",
                            author: "Test Author"
                        }
                    }
                }),
                postStartCommand: () => ({
                    output: {
                        wasSuccessful: true,
                        log: [
                            {
                                data: "Test Line Data"
                            }
                        ]
                    }
                })
            }));
        });

        it("No-argument call", () => {
            getProgram().parse(argv("foo"));
            expect(logMock).toHaveBeenCalled();
        });
    });
});
