/*
 * CLI play command, which loads a standard Regal game bundle to be played
 * through the terminal.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal-bundler)
 */

import { Command } from "commander";
import * as path from "path";
import { createInterface } from "readline";
import { GameApi, GameOptions, GameResponse } from "regal";
import { parseBoolean } from "./utils";
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

const makeOptions = (args): GameOptions => {
    const opts = {} as any;

    if (args.debug !== undefined) {
        opts.debug = parseBoolean("--debug", args.debug);
    }
    if (args.showMinor !== undefined) {
        opts.showMinor = parseBoolean("--showMinor", args.showMinor);
    }
    if (args.trackAgentChanges !== undefined) {
        opts.trackAgentChanges = parseBoolean(
            "--trackAgentChanges",
            args.trackAgentChanges
        );
    }
    if (args.seed !== undefined) {
        opts.seed = args.seed;
    }

    return opts;
};

export default (program: Command) =>
    program
        .command("play <file>")
        .description("play a standard Regal game bundle from the terminal")
        .option(
            "--debug [boolean]",
            "load the game bundle in debug mode (default: false)"
        )
        .option(
            "--showMinor [boolean]",
            "whether minor output should be shown (default: true)"
        )
        .option(
            "--trackAgentChanges [boolean]",
            "whether all changes to agent properties should be tracked (default: false)"
        )
        .option(
            "--seed <string>",
            "Optional string used to initialize pseudorandom number generation in each game instance."
        )
        .action(async (file, args) => {
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

                const cliOverrides = makeOptions(args);

                const start = game.postStartCommand(cliOverrides);
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
