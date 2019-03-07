/*
 * Utility functions for the Regal CLI.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal-bundler)
 */

export const parseBoolean = (argName: string, argValue: string) => {
    if (typeof argValue === "boolean") {
        return argValue;
    } else if (typeof argValue === "string") {
        if (argValue === "true") {
            return true;
        } else if (argValue === "false") {
            return false;
        }
    }
    throw new Error(`Illegal argument for ${argName}. Must be a boolean.`);
};
