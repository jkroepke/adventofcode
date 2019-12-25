#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/24
*/

const fs = require('fs');

let grid = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const minutes = 200;

const emptyGrid = [
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '?', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
];

const deepClone = object => JSON.parse(JSON.stringify(object));

let matrix = {};

for (let level = -minutes; level <= minutes; level++) {
  matrix[level] = JSON.parse(JSON.stringify(emptyGrid));
}

matrix['0'] = grid;

for (let minute = 1; minute <= minutes; minute++) {
  const newMatrix = JSON.parse(JSON.stringify(matrix));

  for (const z of Object.keys(matrix).map(Number)) {
    for (const [y, line] of matrix[z].entries()) {
      for (const [x, tile] of line.entries()) {
        if (x === 2 && y === 2) {
          continue;
        }

        let bugsAdjacent = 0;

        // Top
        if (y === 0) {
          if (!matrix[z-1]) {
            newMatrix[z-1] = deepClone(emptyGrid);
            matrix[z-1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z-1][1][2] === '#');
        }
        else if (y === 3 && x === 2) {
          if (!matrix[z+1]) {
            newMatrix[z+1] = deepClone(emptyGrid);
            matrix[z+1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z+1][4][0] === '#');
          bugsAdjacent += Number(matrix[z+1][4][1] === '#');
          bugsAdjacent += Number(matrix[z+1][4][2] === '#');
          bugsAdjacent += Number(matrix[z+1][4][3] === '#');
          bugsAdjacent += Number(matrix[z+1][4][4] === '#');
        }
        else
        {
          bugsAdjacent += Number(matrix[z][y-1][x] === '#');
        }

        // Bottom
        if (y === 4) {
          if (!matrix[z-1]) {
            newMatrix[z-1] = deepClone(emptyGrid);
            matrix[z-1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z-1][3][2] === '#');
        }
        else if (y === 1 && x === 2) {
          if (!matrix[z+1]) {
            newMatrix[z+1] = deepClone(emptyGrid);
            matrix[z+1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z+1][0][0] === '#');
          bugsAdjacent += Number(matrix[z+1][0][1] === '#');
          bugsAdjacent += Number(matrix[z+1][0][2] === '#');
          bugsAdjacent += Number(matrix[z+1][0][3] === '#');
          bugsAdjacent += Number(matrix[z+1][0][4] === '#');
        }
        else
        {
          bugsAdjacent += Number(matrix[z][y+1][x] === '#');
        }

        // Left
        if (x === 0) {
          if (!matrix[z-1]) {
            newMatrix[z-1] = deepClone(emptyGrid);
            matrix[z-1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z-1][2][1] === '#');
        }
        else if (y === 2 && x === 3) {
          if (!matrix[z+1]) {
            newMatrix[z+1] = deepClone(emptyGrid);
            matrix[z+1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z+1][0][4] === '#');
          bugsAdjacent += Number(matrix[z+1][1][4] === '#');
          bugsAdjacent += Number(matrix[z+1][2][4] === '#');
          bugsAdjacent += Number(matrix[z+1][3][4] === '#');
          bugsAdjacent += Number(matrix[z+1][4][4] === '#');
        }
        else
        {
          bugsAdjacent += Number(matrix[z][y][x-1] === '#');
        }

        // Right
        if (x === 4) {
          if (!matrix[z-1]) {
            newMatrix[z-1] = deepClone(emptyGrid);
            matrix[z-1] = deepClone(emptyGrid);
          }

          bugsAdjacent += Number(matrix[z-1][2][3] === '#');
        }
        else if (y === 2 && x === 1) {
          if (!matrix[z+1]) {
            newMatrix[z+1] = deepClone(emptyGrid);
            matrix[z+1] = deepClone(emptyGrid);
          }
          bugsAdjacent += Number(matrix[z+1][0][0] === '#');
          bugsAdjacent += Number(matrix[z+1][1][0] === '#');
          bugsAdjacent += Number(matrix[z+1][2][0] === '#');
          bugsAdjacent += Number(matrix[z+1][3][0] === '#');
          bugsAdjacent += Number(matrix[z+1][4][0] === '#');
        }
        else
        {
          bugsAdjacent += Number(matrix[z][y][x+1] === '#');
        }

        if (tile === '#' && bugsAdjacent !== 1) {
          newMatrix[z][y][x] = '.';
        }
        else if (tile === '.' && (bugsAdjacent === 1 || bugsAdjacent === 2)) {
          newMatrix[z][y][x] = '#';
        }
        else {
          newMatrix[z][y][x] = tile;
        }
      }
    }
  }

  matrix = deepClone(newMatrix);
}

let bugs = 0;

for (const z of Object.keys(matrix)) {
  for (const line of matrix[z]) {
    for (const tile of line) {
      if (tile === '#') bugs++;
    }
  }
}

// console.log(matrix);
console.log(bugs);
