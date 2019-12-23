#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/12
*/

const fs = require('fs');
const moonsCoord = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(moon => moon.match(/<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/));

const moonCount = moonsCoord.length;
const moons = [];
const originalMoons = [];

const pairMap = [];
const axisSteps = {};

for (let i = 0; i < moonCount; i++) {
  // [ [ 1, 2, 3 ], [ 2, 3 ], [ 3 ], [] ]
  // https://stackoverflow.com/a/38213213/8087167
  pairMap.push(Array.from({length: moonCount - i - 1}, (v, k) => k + i + 1));

  originalMoons.push({
    coords: {
      x: parseInt(moonsCoord[i][1]),
      y: parseInt(moonsCoord[i][2]),
      z: parseInt(moonsCoord[i][3]),
    },
    velocity: {
      x: 0,
      y: 0,
      z: 0,
    },
  });

  moons.push({
    coords: {
      x: parseInt(moonsCoord[i][1]),
      y: parseInt(moonsCoord[i][2]),
      z: parseInt(moonsCoord[i][3]),
    },
    velocity: {
      x: 0,
      y: 0,
      z: 0,
    },
  });
}

for (const axis of ['x', 'y', 'z']) {
  let steps = 1;

  while(true) {
    for (let i = 0; i < moonCount; i++) {
      for (let j of pairMap[i]) {
        if (moons[i].coords[axis] < moons[j].coords[axis]) {
          moons[i].velocity[axis]++;
          moons[j].velocity[axis]--;
        } else if (moons[i].coords[axis] > moons[j].coords[axis]) {
          moons[i].velocity[axis]--;
          moons[j].velocity[axis]++;
        }
      }
    }

    for (let i = 0; i < moonCount; i++) {
      moons[i].coords[axis] += moons[i].velocity[axis];
    }

    if (
      moons[0].velocity[axis] === 0 &&
      moons[1].velocity[axis] === 0 &&
      moons[2].velocity[axis] === 0 &&

      moons[0].coords[axis] === originalMoons[0].coords[axis] &&
      moons[1].coords[axis] === originalMoons[1].coords[axis] &&
      moons[2].coords[axis] === originalMoons[2].coords[axis]
    ) {
      axisSteps[axis] = steps;
      break;
    }

    if (steps % 1000000 === 0) {
      console.log(steps);
    }

    steps++;
  }
}

// https://stackoverflow.com/a/41888395/8087167
function gcd(a,b){
  var t = 0;
  a < b && (t = b, b = a, a = t); // swap them if a < b
  t = a%b;
  return t ? gcd(b,t) : b;
}

function lcm(a,b){
  return a/gcd(a,b)*b;
}

console.log(Object.values(axisSteps).reduce(lcm));
