#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/24
*/

const fs = require('fs');

let grid = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const bioDiversities = [];
let bioDiversity = 0;

while (true) {
  let p = 0;
  bioDiversity = 0;

  for (const [y, line] of grid.entries()) {
    for (const [x, tile] of line.entries()) {
      if (tile === '#') {
        bioDiversity += Math.pow(2, p);
      }

      p++;
    }
  }

  if (bioDiversities.includes(bioDiversity)) {
    break;
  }

  bioDiversities.push(bioDiversity);

  const newGrid = [];

  for (const [y, line] of grid.entries()) {
    for (const [x, tile] of line.entries()) {
      let bugsAdjacent = 0;

      // Top
      if(grid[y+1]) {
        bugsAdjacent += Number(grid[y+1][x] === '#');
      }

      // Bottom
      if(grid[y-1]) {
        bugsAdjacent += Number(grid[y-1][x] === '#');
      }

      // Left
      if(grid[y][x-1]) {
        bugsAdjacent += Number(grid[y][x-1] === '#');
      }

      // Right
      if(grid[y][x+1]) {
        bugsAdjacent += Number(grid[y][x+1] === '#');
      }

      if(!newGrid[y]) { newGrid[y] = []; }

      if (tile === '#' && bugsAdjacent !== 1) {
        newGrid[y][x] = '.';
      }
      else if (tile === '.' && (bugsAdjacent === 1 || bugsAdjacent === 2)) {
        newGrid[y][x] = '#';
      }
      else {
        newGrid[y][x] = grid[y][x];
      }
    }
  }

  grid = newGrid;
}

/*
for (const [y, line] of grid.entries()) {
  for (const [x, tile] of line.entries()) {
    process.stdout.write(tile);
  }
  process.stdout.write('\n');
}
*/

console.log(bioDiversity);
