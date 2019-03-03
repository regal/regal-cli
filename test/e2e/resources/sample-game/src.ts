import { onStartCommand, onPlayerCommand, GameInstance, Charsets } from "regal";

interface S {
    commands: string[];
}

onStartCommand(game => {
    game.output.write("Hello, world!");
    game.output.writeDebug("Debug mode activated.");
    game.state.commands = [];
});

onPlayerCommand(cmd => (game: GameInstance<S>) => {
    game.output.write(`You just said ${cmd}.`);
    game.output.writeMinor("What a cool word!");

    game.output.writeDebug(
        `Prior command list: ${JSON.stringify(game.state.commands)}`
    );

    const numCmds = game.state.commands.length;
    let priorStr = "";
    if (numCmds > 0) {
        priorStr += `Recently, you said ${game.state.commands[numCmds - 1]}`;
        if (numCmds > 1) {
            priorStr += ` and ${game.state.commands[numCmds - 2]}`;
        } else {
            priorStr += ".";
        }
    }
    game.output.write(priorStr);

    game.state.commands.push(cmd);
    game.output.write(`You've said ${game.state.commands.length} in total.`);

    game.output.write(
        `Here's a random string for you: ${game.random.string(
            10,
            Charsets.ALPHABET_CHARSET
        )}`
    );
});
