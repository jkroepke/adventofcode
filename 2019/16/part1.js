#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/16
*/

const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('')
  .map(Number);

const getPatternForValue = (value) => {
  const basePattern = [0,1,0,-1];

  return basePattern
    // https://stackoverflow.com/a/34104348/8087167
    .map(item => Array(value + 1).fill(item))
    // https://stackoverflow.com/a/18307218/8087167
    .reduce((a, b) => a.concat(b), []);
};

let signal = [...input];

const numberOfPhases = 100;

for (let i = 1; i <= numberOfPhases; i++) {
  let newSignal = [];

  for (let j = 0; j < signal.length; j++) {
    const pattern = getPatternForValue(j);

    let buffer = 0;

    for (let k = 0; k < signal.length; k++) {
      buffer += signal[k] * pattern[(k+1) % pattern.length];
    }

    newSignal[j] = Math.abs(buffer % 10);
  }

  signal = newSignal;
}

console.log(signal.join('').substring(0, 8));
