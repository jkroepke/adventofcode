#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/10
*/

const fs = require('fs');

const map = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(item => item.split(''));

const asteroidMap = [];
const asteroidSeenMap = [];
const visibleAsteroids = {};

for (const [y, asteroids] of map.entries()) {
  for (const [x, asteroid] of asteroids.entries()) {
    if (asteroid === '#') {
      asteroidMap.push([x, y]);
    }
  }
}

for (const asteroid of asteroidMap) {
  const [x, y] = asteroid;
  visibleAsteroids[`${x},${y}`] = {};

  for (const visibleAsteroid of asteroidMap) {
    if(asteroid.join(',') === visibleAsteroid.join(',')) continue;

    const [x1, y1] = visibleAsteroid;

    let angle = (Math.atan2((y1 - y), (x1 - x)) * 180 / Math.PI) + 90;

    if(angle < 0){
      angle += 360;
    }

    if (!visibleAsteroids[`${x},${y}`][angle]) {
      visibleAsteroids[`${x},${y}`][angle] = {};
      asteroidSeenMap[`${x},${y}`] = (asteroidSeenMap[`${x},${y}`] || 0) + 1;
    }

    visibleAsteroids[`${x},${y}`][angle][Math.abs(x1 - x) + Math.abs(y1 - y)] = [x1, y1];
  }
}

// https://stackoverflow.com/a/28191966/8087167
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const highestAmountOfAsteroids = Math.max(...Object.values(asteroidSeenMap));
const coordsOfHighestAmountOfAsteroids = getKeyByValue(asteroidSeenMap, highestAmountOfAsteroids);
const [x, y] = coordsOfHighestAmountOfAsteroids.split(',').map(Number);

let vaporizedAsteroidsTodo = 200;

// https://stackoverflow.com/a/31102605/8087167
const mapOfVisibleAsteroids = {};
Object.keys(visibleAsteroids[`${x},${y}`])
  // https://stackoverflow.com/a/1063027/8087167
  .sort((a, b) => Number(a) - Number(b))
  .forEach(key => {
    mapOfVisibleAsteroids[Number.parseFloat(key).toFixed(14)] = visibleAsteroids[`${x},${y}`][key];
  });

const vaporizedAsteroids = [];
while (vaporizedAsteroids.length < vaporizedAsteroidsTodo) {
  for (const angle of Object.keys(mapOfVisibleAsteroids)) {
    if(Object.values(mapOfVisibleAsteroids[angle]).length) {

      const key = Object.keys(mapOfVisibleAsteroids[angle])[0];
      const value = Object.values(mapOfVisibleAsteroids[angle])[0];

      vaporizedAsteroids.push(value);

      delete mapOfVisibleAsteroids[angle][key];
    }
  }
}

const [part2x, part2y] = vaporizedAsteroids[199];
console.log(part2x * 100 + part2y);
