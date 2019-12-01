#!/usr/bin/env node

/*
 * Fuel required to launch a given module is based on its mass.
 * Specifically, to find the fuel required for a module, take its mass,
 * divide by three,
 * round down,
 * and subtract 2.
 *
 * 3366413
 * 3366415 <<-
 */

const fs = require('fs');
const masses = fs.readFileSync('input.txt', 'utf8').split("\n").filter(Boolean);

const sum = masses.reduce(
    (total, mass) => total + (Math.floor(mass / 3) - 2),
    0
);

console.log(sum);
