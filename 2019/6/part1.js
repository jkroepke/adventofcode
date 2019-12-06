#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/6
*/

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split('\n');

const flatOrbits = input.reduce((total, element) => {
  let [planetA, planetB] = element.split(')');

  return {...total, ...{
      [planetA]: (total[planetA] || []).concat([planetB])
  }}
}, {});

const constructNestedOrbits = (planet, input) => {
  let ret = {[planet]: []};

  if (planet in input) {
    for (const localOrbit of input[planet]) {
      ret[planet].push(constructNestedOrbits(localOrbit, flatOrbits));
    }
  }

  return ret;
};

const nestedOrbits = constructNestedOrbits('COM', flatOrbits);

const calcNumberOfOrbits = (orbit, depth) => {
  const planetInOrbit = Object.values(orbit)[0];

  let ret = [...planetInOrbit].length * depth;

  for (const localOrbit of planetInOrbit) {
    ret += calcNumberOfOrbits(localOrbit, depth + 1);
  }

  return ret;
};

const numberOfOrbits = calcNumberOfOrbits(nestedOrbits, 1);

console.log(numberOfOrbits);
