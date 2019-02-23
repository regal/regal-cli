import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";

import pkg from "./package.json";

const banner = `/**
* Regal CLI
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/regal/regal-cli)
*/`;

export default [
    {
        input: "./src/cli.ts",
        output: [
            { file: pkg.main, format: "cjs", banner },
            { file: pkg.module, format: "esm", banner }
        ],
        external: Object.keys(pkg.dependencies).concat(["path"]),
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: { module: "esNext" }
                }
            }),
            json(),
            commonjs(),
            cleanup({
                extensions: [".js", ".ts"],
                comments: /^((?!(Joseph R Cowman)|tslint)[\s\S])*$/, // Removes file-header comments and tslint comments
                maxEmptyLines: 0
            })
        ]
    }
];