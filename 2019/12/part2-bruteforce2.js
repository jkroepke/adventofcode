#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/12
*/

const fs = require('fs');
const moonsCoord = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(moon => moon.match(/<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/));

let steps = 1;

const moonCount = moonsCoord.length;
const moons = [];
const originalMoons = [];

const pairMap = [];

const start = new Date().getTime();

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

while(true) {
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

  if (
    moons[0].coords['x'] === originalMoons[0].coords['x'] &&
    moons[0].coords['y'] === originalMoons[0].coords['y'] &&
    moons[0].coords['z'] === originalMoons[0].coords['z'] &&

    moons[0].velocity['x'] === originalMoons[0].velocity['x'] &&
    moons[0].velocity['y'] === originalMoons[0].velocity['y'] &&
    moons[0].velocity['z'] === originalMoons[0].velocity['z'] &&

    moons[1].coords['x'] === originalMoons[1].coords['x'] &&
    moons[1].coords['y'] === originalMoons[1].coords['y'] &&
    moons[1].coords['z'] === originalMoons[1].coords['z'] &&

    moons[1].velocity['x'] === originalMoons[1].velocity['x'] &&
    moons[1].velocity['y'] === originalMoons[1].velocity['y'] &&
    moons[1].velocity['z'] === originalMoons[1].velocity['z'] &&

    moons[2].coords['x'] === originalMoons[2].coords['x'] &&
    moons[2].coords['y'] === originalMoons[2].coords['y'] &&
    moons[2].coords['z'] === originalMoons[2].coords['z'] &&

    moons[2].velocity['x'] === originalMoons[2].velocity['x'] &&
    moons[2].velocity['y'] === originalMoons[2].velocity['y'] &&
    moons[2].velocity['z'] === originalMoons[2].velocity['z'] &&

    moons[3].coords['x'] === originalMoons[3].coords['x'] &&
    moons[3].coords['y'] === originalMoons[3].coords['y'] &&
    moons[3].coords['z'] === originalMoons[3].coords['z'] &&

    moons[3].velocity['x'] === originalMoons[3].velocity['x'] &&
    moons[3].velocity['y'] === originalMoons[3].velocity['y'] &&
    moons[3].velocity['z'] === originalMoons[3].velocity['z']
  ) {
    break;
  }

  if (steps % 1000000 === 0) {
    console.log(steps);
    break;
  }

  steps++;
}

const end = new Date().getTime();
const time = end - start;

console.log(steps);

// Clearly, you might need to find a more efficient way to simulate the universe.
console.log('Execution time: ' + time);
