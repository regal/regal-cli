export const isWin = process.platform === "win32";
export const execRegal = isWin ? "regal" : "./bin/regal";

export const logbacks = callback => (error, stdout, stderr) => {
    if (error) {
        throw new Error(error);
    }
    if (stderr) {
        throw new Error(stderr);
    }
    if (stdout) {
        callback(stdout);
    }
};
