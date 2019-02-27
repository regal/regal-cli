import { Command } from "commander";
import * as readline from "readline";
import { join } from "path";
import * as wrappers from "../../src/wrappers";
import playCommand from "../../src/play";

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

/* Game API Mocks */
const gameMetadataMock = jest.fn(() => ({
    output: {
        metadata: {
            name: "Test Game",
            author: "Test Author"
        }
    }
}));
const gameStartMock = jest.fn(() => ({
    output: {
        wasSuccessful: true,
        log: [
            {
                data: "Test Line Data"
            }
        ]
    }
}));
const gameMock = {
    getMetadataCommand: () => gameMetadataMock,
    postStartCommand: () => gameStartMock
};

/* Dynamic Import Mock */
jest.spyOn(wrappers, "importDynamic").mockImplementation(() =>
    Promise.resolve(gameMock)
);

/* Stdout Mock */
const logMock = jest.fn(a => console.log(`LOGGED ${a}`));
//@ts-ignore
wrappers.log = logMock;

/* Process Exit Mock */
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

describe("Play Command", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Print metadata and start lines on game load", done => {
        getProgram().parse(argv("foo"));
        logMock
            .mockImplementationOnce(i =>
                expect(i).toEqual("Now Playing: Test Game by Test Author")
            )
            .mockImplementationOnce(i => expect(i).toEqual(""))
            .mockImplementationOnce(i => {
                expect(i).toEqual("Test Line Data");
                done();
            });
    });

    describe("Various Commands", () => {});
});
