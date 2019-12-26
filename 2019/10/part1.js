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

    let angle = Math.atan2((y1 - y), (x1 - x)) * 180 / Math.PI;
    if(angle < 0){
      angle += 360;
    }

    if (!visibleAsteroids[`${x},${y}`][angle]) {
      visibleAsteroids[`${x},${y}`][angle] = [];
      asteroidSeenMap[`${x},${y}`] = (asteroidSeenMap[`${x},${y}`] || 0) + 1;
    }

    visibleAsteroids[`${x},${y}`][angle].push([x, y]);
  }
}

console.log(Math.max(...Object.values(asteroidSeenMap)));
