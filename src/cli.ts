/*
 * Regal CLI.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal-cli)
 */

import * as program from "commander";
import * as pkg from "./../package.json";
import bundleCommand from "./bundle";
import playCommand from "./play";

program.version(pkg.version, "-v, --version").description(pkg.description);

/* Load commands */
bundleCommand(program);
playCommand(program);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
