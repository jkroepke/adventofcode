#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/12
*/

const fs = require('fs');
const moonsCoord = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(moon => moon.match(/<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/));

const steps = 1000;

const moonCount = moonsCoord.length;
const moons = [];

const pairMap = [];

for (let i = 0; i < moonCount; i++) {
  // [ [ 1, 2, 3 ], [ 2, 3 ], [ 3 ], [] ]
  // https://stackoverflow.com/a/38213213/8087167
  pairMap.push(Array.from({length: moonCount - i - 1}, (v, k) => k + i + 1));

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

for (let loop = 1; loop <= steps; loop++) {
  for (let i = 0; i < moonCount; i++) {
    for (let j of pairMap[i]) {
      for (const axis of ['x', 'y', 'z']) {
        if (moons[i].coords[axis] < moons[j].coords[axis]) {
          moons[i].velocity[axis]++;
          moons[j].velocity[axis]--;
        } else if (moons[i].coords[axis] > moons[j].coords[axis]) {
          moons[i].velocity[axis]--;
          moons[j].velocity[axis]++;
        }
      }
    }
  }

  for (let i = 0; i < moonCount; i++) {
    for (const axis of ['x', 'y', 'z']) {
      moons[i].coords[axis] += moons[i].velocity[axis];
    }
  }
}

let energy = 0;

for (let i = 0; i < moonCount; i++) {
  const potEnergy = Object.values(moons[i].coords).reduce((total, num) => total + Math.abs(num), 0);
  const kinEnergy = Object.values(moons[i].velocity).reduce((total, num) => total + Math.abs(num), 0);

  energy += potEnergy * kinEnergy;
}

console.log(energy);
