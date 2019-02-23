/*
 * Abstractions of some external functions.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal-cli)
 */

export const log = (...items) => items.forEach(i => console.log(i));
export const error = (...items) => items.forEach(i => console.error(i));
