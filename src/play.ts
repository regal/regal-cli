import { Command } from "commander";
import { createInterface } from "readline";
import { GameApi, GameResponse } from "regal";

// Helper function to print output lines
const printLines = (gameResponse: GameResponse) => {
    console.log("");
    if (gameResponse.output.wasSuccessful) {
        for (const line of gameResponse.output.log) {
            console.log(line.data);
        }
    } else {
        console.log(gameResponse);
    }
};

export default (program: Command) =>
    program
        .command("play <file>")
        .description("play a standard Regal game bundle from the terminal")
        .action(args => {
            const io = createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            console.log(args.file);

            import(args.file).then((game: GameApi) => {
                const start = game.postStartCommand();
                printLines(start);
                let gameInstance = start.instance;

                io.on("line", command => {
                    const response = game.postPlayerCommand(
                        gameInstance,
                        command
                    );
                    printLines(response);
                    if (response.output.wasSuccessful) {
                        gameInstance = response.instance;
                    }
                });
            });
        });
