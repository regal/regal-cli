/*
 * CLI bundle command, which uses regal-bundler to create game bundles.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal-cli)
 */

import { Command } from "commander";
import { bundle, BundlerOptions, RecursivePartial } from "regal-bundler";
import { parseBoolean } from "./utils";
import { log } from "./wrappers";

export default (program: Command) =>
    program
        .command("bundle")
        .description("create a Regal game bundle")
        .on("--help", () => {
            log(
                "",
                "will load configuration values from regal.json or package.json,",
                "but any options specified here will override their respective values "
            );
        })
        .option(
            "-c, --config <dir>",
            "load configuration from a specific directory (default: the current directory)"
        )
        .option(
            "-i, --input-file <file>",
            "the root file of the game to bundle (default: src/index.ts)"
        )
        .option(
            "--input-ts [boolean]",
            "whether the source is TypeScript (default: true)"
        )
        .option(
            "-o, --output-file <file>",
            "game bundle output file (default: [GAME_NAME].regal.js)"
        )
        .option(
            "-b, --bundle-type <type>",
            "type of bundle to produce (default: standard)"
        )
        .option(
            "-f, --format <type>",
            "module format of the bundle: cjs (default), esm, or umd"
        )
        .option(
            "-m, --minify [boolean]",
            "whether the bundle should be minified (default: false)"
        )
        .action(args => {
            const opts: RecursivePartial<BundlerOptions> = {
                bundler: {
                    input: {},
                    output: {}
                }
            };

            // Handle --config
            if (args.config) {
                opts.configLocation = args.config;
            }

            // Handle --input-file
            if (args.inputFile) {
                opts.bundler.input.file = args.inputFile;
            }

            // Handle --input-ts
            if (args.inputTs !== undefined) {
                opts.bundler.input.ts = parseBoolean(
                    "--input-ts",
                    args.inputTs
                );
            }

            // Handle --output-file
            if (args.outputFile) {
                opts.bundler.output.file = args.outputFile;
            }

            // Handle --bundle-type
            if (args.bundleType) {
                opts.bundler.output.bundle = args.bundleType;
            }

            // Handle --format
            if (args.format) {
                opts.bundler.output.format = args.format;
            }

            // Handle --minify
            if (args.minify !== undefined) {
                opts.bundler.output.minify = parseBoolean(
                    "--minify",
                    args.minify
                );
            }

            bundle(opts);
        });
