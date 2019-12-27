#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/16
*
* with help from ... https://www.reddit.com/r/adventofcode/comments/ebai4g/2019_day_16_solutions/fb3zcdx
+
*/

const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8')
  .trim();

const getPatternForValue = (value) => {
  const basePattern = [0,1,0,-1];

  // https://stackoverflow.com/a/33305263/8087167
  return basePattern.reduce(function (res, current) {
    return res.concat(Array(value + 1).fill(current));
  }, [])
};

const repeat = 10000;
let numberOfPhases = 100;

const message = input.repeat(repeat);
const messageOffset = input.substring(0, 7);

let signal = message.split(
  '').map(Number).splice(Number(messageOffset));

for (let phases = 1; phases <= numberOfPhases; phases++) {
  for (let i = signal.length - 1; i >= 0; i--) {
    signal[i] = Math.abs((signal[i+1]||0) + signal[i]) % 10;
  }
}

console.log(signal.join("").substring(0, 8));
