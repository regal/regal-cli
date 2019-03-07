/**
* Regal CLI
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/regal/regal-cli)
*/
import * as program from 'commander';
import { version, parse, args, help } from 'commander';
import { bundle } from 'regal-bundler';
import { join } from 'path';
import { createInterface } from 'readline';

var version$1 = "1.0.0";
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
const importDynamic = (path) => import(path);

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
    .action(args$$1 => {
    const opts = {
        bundler: {
            input: {},
            output: {}
        }
    };
    // Handle --config
    if (args$$1.config) {
        opts.configLocation = args$$1.config;
    }
    // Handle --input-file
    if (args$$1.inputFile) {
        opts.bundler.input.file = args$$1.inputFile;
    }
    // Handle --input-ts
    if (args$$1.inputTs !== undefined) {
        opts.bundler.input.ts = parseBoolean("--input-ts", args$$1.inputTs);
    }
    // Handle --output-file
    if (args$$1.outputFile) {
        opts.bundler.output.file = args$$1.outputFile;
    }
    // Handle --bundle-type
    if (args$$1.bundleType) {
        opts.bundler.output.bundle = args$$1.bundleType;
    }
    // Handle --format
    if (args$$1.format) {
        opts.bundler.output.format = args$$1.format;
    }
    // Handle --minify
    if (args$$1.minify !== undefined) {
        opts.bundler.output.minify = parseBoolean("--minify", args$$1.minify);
    }
    bundle(opts);
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
const makeOptions = (args$$1) => {
    const opts = {};
    if (args$$1.debug !== undefined) {
        opts.debug = parseBoolean("--debug", args$$1.debug);
    }
    if (args$$1.showMinor !== undefined) {
        opts.showMinor = parseBoolean("--showMinor", args$$1.showMinor);
    }
    if (args$$1.trackAgentChanges !== undefined) {
        opts.trackAgentChanges = parseBoolean("--trackAgentChanges", args$$1.trackAgentChanges);
    }
    if (args$$1.seed !== undefined) {
        opts.seed = args$$1.seed;
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
    .action((file, args$$1) => __awaiter(undefined, void 0, void 0, function* () {
    const io = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    const fullPath = join(process.cwd(), file);
    try {
        const game = (yield importDynamic(fullPath));
        const metadata = game.getMetadataCommand().output.metadata;
        log(`Now Playing: ${metadata.name} by ${metadata.author}`, "Type :quit to exit the game.");
        const cliOverrides = makeOptions(args$$1);
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

version(version$1, "-v, --version").description(description);
/* Load commands */
bundleCommand(program);
playCommand(program);
parse(process.argv);
if (!args.length) {
    help();
}
