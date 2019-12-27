#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/16
*/

const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8')
  .trim();

const getPatternForValue = (value) => {
  const basePattern = [0,1,0,-1];

  // https://stackoverflow.com/a/33305263/8087167
  return basePattern.reduce(function (res, current) {
    return res.concat(Array(1 + 1).fill(current));
  }, [])
};

const repeat = 10000;
let numberOfPhases = 100;

const message = input.repeat(repeat);
const messageOffset = input.substring(0, 7);
let signal = message.substr(Number(messageOffset)).split('').map(Number);

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

  console.log(i);
}

console.log(signal.join('').substr(0, 8));
