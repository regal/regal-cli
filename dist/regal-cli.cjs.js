/**
* Regal CLI
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/regal/regal-cli)
*/
'use strict';

var program = require('commander');
var regalBundler = require('regal-bundler');
var path = require('path');
var readline = require('readline');

var version = "1.2.0";
var description = "Command line interface for creating games with the Regal Framework";

const parseBoolean = (argName, argValue) => {
    if (typeof argValue === "boolean") {
        return argValue;
    }
    else if (typeof argValue === "string") {
        if (argValue === "true") {
            return true;
        }
        else if (argValue === "false") {
            return false;
        }
    }
    throw new Error(`Illegal argument for ${argName}. Must be a boolean.`);
};

const log = (...items) => items.forEach(i => console.log(i));
const error = (...items) => items.forEach(i => console.error(i));
const importDynamic = (path$$1) => Promise.resolve(require(path$$1));

var bundleCommand = (program$$1) => program$$1
    .command("bundle")
    .description("create a Regal game bundle")
    .on("--help", () => {
    log("", "will load configuration values from regal.json or package.json,", "but any options specified here will override their respective values ");
})
    .option("-c, --config <dir>", "load configuration from a specific directory (default: the current directory)")
    .option("-i, --input-file <file>", "the root file of the game to bundle (default: src/index.ts)")
    .option("--input-ts [boolean]", "whether the source is TypeScript (default: true)")
    .option("-o, --output-file <file>", "game bundle output file (default: [GAME_NAME].regal.js)")
    .option("-b, --bundle-type <type>", "type of bundle to produce (default: standard)")
    .option("-f, --format <type>", "module format of the bundle: cjs (default), esm, or umd")
    .option("-m, --minify [boolean]", "whether the bundle should be minified (default: false)")
    .action(args => {
    const opts = {
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
        opts.bundler.input.ts = parseBoolean("--input-ts", args.inputTs);
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
        opts.bundler.output.minify = parseBoolean("--minify", args.minify);
    }
    regalBundler.bundle(opts);
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// Helper function to print output lines
const printLines = (gameResponse) => {
    log("");
    if (gameResponse.output.wasSuccessful) {
        for (const line of gameResponse.output.log) {
            log(line.data);
        }
    }
    else {
        log(gameResponse);
    }
};
const makeOptions = (args) => {
    const opts = {};
    if (args.debug !== undefined) {
        opts.debug = parseBoolean("--debug", args.debug);
    }
    if (args.showMinor !== undefined) {
        opts.showMinor = parseBoolean("--showMinor", args.showMinor);
    }
    if (args.trackAgentChanges !== undefined) {
        opts.trackAgentChanges = parseBoolean("--trackAgentChanges", args.trackAgentChanges);
    }
    if (args.seed !== undefined) {
        opts.seed = args.seed;
    }
    return opts;
};
var playCommand = (program$$1) => program$$1
    .command("play <file>")
    .description("play a standard Regal game bundle from the terminal")
    .option("--debug [boolean]", "load the game bundle in debug mode (default: false)")
    .option("--showMinor [boolean]", "whether minor output should be shown (default: true)")
    .option("--trackAgentChanges [boolean]", "whether all changes to agent properties should be tracked (default: false)")
    .option("--seed <string>", "Optional string used to initialize pseudorandom number generation in each game instance.")
    .action((file, args) => __awaiter(undefined, void 0, void 0, function* () {
    const io = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    const fullPath = path.join(process.cwd(), file);
    try {
        const game = (yield importDynamic(fullPath));
        const metadata = game.getMetadataCommand().output.metadata;
        log(`Now Playing: ${metadata.name} by ${metadata.author}`, "Type :quit to exit the game.");
        const cliOverrides = makeOptions(args);
        const start = game.postStartCommand(cliOverrides);
        printLines(start);
        let gameInstance = start.instance;
        io.on("line", command => {
            if (command === ":quit") {
                process.exit();
            }
            const response = game.postPlayerCommand(gameInstance, command);
            printLines(response);
            if (response.output.wasSuccessful) {
                gameInstance = response.instance;
            }
        });
    }
    catch (ex) {
        error(`ERROR: Could not resolve a bundle at ${fullPath}\n`);
        error(ex.stack);
        process.exit();
    }
}));

program.version(version, "-v, --version").description(description);
/* Load commands */
bundleCommand(program);
playCommand(program);
program.parse(process.argv);
if (!program.args.length) {
    program.help();
}
