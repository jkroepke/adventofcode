#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/2
*/

const fs = require('fs');

/*
Opcode 1
    * adds together numbers read from two positions and stores the result in a third position.
    * The three integers immediately after the opcode tell you these three positions -
    * the first two indicate the positions from which you should read the input values,
    * and the third indicates the position at which the output should be stored.

Opcode 2
    * works exactly like opcode 1,
    * except it multiplies the two inputs instead of adding them.
    * Again, the three integers after the opcode indicate where the inputs and outputs are, not their values.

Once you're done processing an opcode, move to the next one by stepping forward 4 positions.
 */

let intCode = fs.readFileSync('input.txt', 'utf8').split(',').filter(Boolean).map(Number);
let position = 0;

const opcode = {
    1: (intCode, position) => {
        intCode[intCode[position + 3]] = intCode[intCode[position + 1]] + intCode[intCode[position + 2]];
    },
    2: (intCode, position) => {
        intCode[intCode[position + 3]] = intCode[intCode[position + 1]] * intCode[intCode[position + 2]];
    },
};

/*
    To do this, before running the program,
    replace position 1 with the value 12
    and replace position 2 with the value 2.

    What value is left at position 0 after the program halts?
*/

intCode[1] = 12;
intCode[2] = 2;


while (intCode[position] != 99) {
    opcode[intCode[position]](intCode, position);
    position += 4;
}

console.log(intCode[0]);
