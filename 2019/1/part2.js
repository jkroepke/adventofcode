#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/1
*/

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
    (total, mass) => {
        let fuel = (Math.floor(mass / 3) - 2);
        let totalFuel = 0;

        while (fuel > 0) {
            totalFuel += fuel;
            fuel = (Math.floor(fuel / 3) - 2);
        }

        return total + totalFuel;
    },
    0
);

console.log(sum);
