/*
 * CLI play command, which loads a standard Regal game bundle to be played
 * through the terminal.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal-bundler)
 */

import { Command } from "commander";
import path from "path";
import { createInterface } from "readline";
import { GameApi, GameResponse } from "regal";
import { error, log } from "./wrappers";

// Helper function to print output lines
const printLines = (gameResponse: GameResponse) => {
    log("");
    if (gameResponse.output.wasSuccessful) {
        for (const line of gameResponse.output.log) {
            log(line.data);
        }
    } else {
        log(gameResponse);
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
                log(
                    `Now Playing: ${metadata.name} by ${metadata.author}`,
                    "Type :quit to exit the game."
                );

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
                error(`ERROR: Could not resolve a bundle at ${fullPath}\n`);
                error(ex.stack);
                process.exit();
            }
        });
