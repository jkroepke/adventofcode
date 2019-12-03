#!/usr/bin/env node

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

const opcode = {
    1: (intCode, position) => {
        intCode[intCode[position + 3]] = intCode[intCode[position + 1]] + intCode[intCode[position + 2]];
    },
    2: (intCode, position) => {
        intCode[intCode[position + 3]] = intCode[intCode[position + 1]] * intCode[intCode[position + 2]];
    },
};

const computer = (noun, verb) => {
    let intCode = fs.readFileSync('input.txt', 'utf8').split(',').filter(Boolean).map(Number);
    let position = 0;

    intCode[1] = noun;
    intCode[2] = verb;

    while (intCode[position] != 99) {
        opcode[intCode[position]](intCode, position);
        position += 4;
    }

    return intCode;
};

[...Array(99).keys()].forEach((noun) => {
    [...Array(99).keys()].forEach((verb) => {
        const memory = computer(noun, verb);
        if(memory[0] === 19690720) {
            console.log(noun, verb);
            console.log(100 * noun + verb);
        }
    });
});
