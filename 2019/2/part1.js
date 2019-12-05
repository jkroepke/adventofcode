#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/2
*/

const fs = require('fs');

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

intCode[1] = 12;
intCode[2] = 2;

while (intCode[position] != 99) {
    opcode[intCode[position]](intCode, position);
    position += 4;
}

console.log(intCode[0]);
