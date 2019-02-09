import * as program from "commander";
import * as pkg from "./../package.json";

program.version(pkg.version, "-v --version").description(pkg.description);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
