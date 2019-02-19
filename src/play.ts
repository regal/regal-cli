import { Command } from "commander";
import path from "path";
import { createInterface } from "readline";
import { GameApi, GameResponse, RegalError } from "regal";

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
        .action(async file => {
            const io = createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            const fullPath = path.join(process.cwd(), file);

            try {
                const game = (await import(fullPath)) as GameApi;

                const metadata = game.getMetadataCommand().output.metadata;
                console.log(
                    `Now Playing: ${metadata.name} by ${metadata.author}`
                );
                console.log("Type :quit to exit the game.");

                const start = game.postStartCommand();
                printLines(start);
                let gameInstance = start.instance;

                io.on("line", command => {
                    if (command === ":quit") {
                        process.exit();
                    }

                    const response = game.postPlayerCommand(
                        gameInstance,
                        command
                    );
                    printLines(response);
                    if (response.output.wasSuccessful) {
                        gameInstance = response.instance;
                    }
                });
            } catch (ex) {
                console.error(
                    `ERROR: Could not resolve a bundle at ${fullPath}`
                );
                process.exit();
            }
        });
