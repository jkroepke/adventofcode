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

// https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
const getPlanetOfOrbit = (flatOrbits, orbit) => {
  return Object.keys(flatOrbits).find(key => flatOrbits[key].includes(orbit));
};

const getAllPlanetOfOrbit = (flatOrbits, orbit) => {
  const orbits = [];
  let planet = orbit;
  do {
    planet = getPlanetOfOrbit(flatOrbits, planet)

    orbits.push(planet);
  } while(planet !== 'COM');

  return orbits;
};

const orbitsOfYou = getAllPlanetOfOrbit(flatOrbits, 'YOU');
const orbitsOfSan = getAllPlanetOfOrbit(flatOrbits, 'SAN');

let jumps = -2;

for (const orbit of orbitsOfYou) {
  jumps += 1;
  if (orbitsOfSan.includes(orbit)) {
    break;
  }
}

for (const orbit of orbitsOfSan) {
  jumps += 1;
  if (orbitsOfYou.includes(orbit)) {
    break;
  }
}

console.log(jumps);
