#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/3
*/

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split('-');

const lowerLimit = parseInt(input[0]);
const upperLimit = parseInt(input[1]);

// https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
const range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
};

const possiblePasswords = range(lowerLimit, upperLimit).map(String).filter(password => {
    if (password.length !== 6) {
        return false;
    }

    if (!password.match(/(\d)\1/)) {
        return false;
    }

    for (let pos = 1; pos < password.length; pos++) {
        if (password.charAt(pos - 1) > password.charAt(pos)) {
            return false;
        }
    }

    return true;
});

console.log(possiblePasswords.length);
