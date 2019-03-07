# regal-cli

[![CircleCI](https://circleci.com/gh/regal/regal-cli.svg?style=svg)](https://circleci.com/gh/regal/regal-cli)
[![Coverage Status](https://coveralls.io/repos/github/regal/regal-cli/badge.svg?branch=master)](https://coveralls.io/github/regal/regal-cli?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Command line interface for creating games with the Regal Framework

## Installation

In most cases, the Regal CLI should be installed as a global dependency.

```
npm install -g regal-cli
```

The CLI peer depends on [**regal-bundler**](https://github.com/regal/regal-bundler), which must be installed manually. You can either install this as a global dependency:

```
npm install -g regal-bundler
```

Or, as a dev dependency in your project.

```
npm install --save-dev regal-bundler
```

Finally, confirm that you've installed everything correctly:

```
regal
```

The program should display some information and list the available commands.

## Usage

The Regal CLI automates several tasks related to making and playing [Regal games](https://github.com/regal/regal).

Currently, the following commands are available:

Command | Description | Reference
--- | --- | ---
`bundle [options]` | create a Regal game bundle | [Link](#bundle)
`play [options] <file>` | play a standard Regal game bundle from the terminal | [Link](#play)

## `bundle`

The `bundle` command creates a Regal game bundle with [**regal-bundler**](https://github.com/regal/regal-bundler).

### Basic Usage

```
regal bundle
```

The bundler will attempt to load configuration values from `regal.json` or `package.json`. If no values are found, their defaults will be used. For more information, see the [bundler documentation](https://github.com/regal/regal-bundler).

### Options

To see a list of all options, run:

```
regal bundle --help
```

The following options are available for the `bundle` command:

Option | Description | Bundler Default*
--- | --- | ---
`-c, --config <dir>` | load configuration from a specific directory | `process.cwd()`
`-i, --input-file <file>` | the root file of the game to bundle | `src/index.ts`
`--input-ts [boolean]` | whether the source is TypeScript | `true`
`-o, --output-file <file>` | game bundle output file | `[GAME_NAME].regal.js`
`-f, --format <type>` | module format of the bundle: `cjs`, `esm`, or `umd` | `cjs`
`-m, --minify [boolean]` | whether the bundle should be minified | `false`

**The default values will be used if no configuration values can be found in `regal.json`, `package.json`, or the CLI. If an option is specified in one of these configuration files, there is no need to specify it in the CLI command. The CLI options override everything else, so they are used to bundle games differently than specified in the configuration file.*

### Examples

Bundle the game as a minified UMD file:

```
regal bundle -f umd --minify
```

Load an alternate configuration from the `test` directory and save the bundle as `./test/game-test.regal.js`:

```
regal bundle -c ./test -o ./test/game-test.regal.js
```

## `play`

The `play` command plays a standard Regal game bundle from the terminal.

### Basic Usage

```
regal play ./my-game.regal.js
```

### Options

To see a list of all options, run:

```
regal play --help
```

The following options are available for the `play` command:

Option | Description | Game Default*
--- | --- | ---
`--debug [boolean]` | load the game bundle in debug mode | `false`
`--showMinor [boolean]` | whether minor output should be shown | `true`
`--trackAgentChanges [boolean]` | whether all changes to agent properties should be tracked | `false`
`--seed <string>` | Optional string used to initialize psuedorandom number generation in each game instance | None

When one or more options are specified, a new game instance is generated with those game options. For more information, see the Regal Game Library's [configuration docs](https://github.com/regal/regal#configuration).

**The default values will be used if no option overrides were specified in `regal.json`, `package.json`, or the CLI. If an option is specified in one of these configuration files, there is no need to specify it in the CLI command. The CLI options override everything else, so they are used to play games configured differently than they are specified in their configuration files.*

### Examples

Play a game in debug mode:

```
regal play ./bundle.regal.js --debug
```

Play a game that's seeded and doesn't show minor output:

```
regal play ./bundle.regal.js --showMinor false --seed hello
```