#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/8
*/

// https://stackoverflow.com/a/15030117/8087167
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('');

const pixelWide = 25;
const pixelTall = 6;

const pixelPerLayer = pixelWide * pixelTall;
const layerCount = (input.length / pixelPerLayer);

const pixels = [[[]]];

let layer = 0;
let pixelY = 0;
let pixelX = 0;

for (const pixel of input) {
  pixels[layer][pixelY].push(Number(pixel));

  pixelX++;

  if (pixelX >= pixelWide) {
    pixelY++;
    pixelX = 0;
    pixels[layer].push([]);
  }

  if (pixelY >= pixelTall) {
    layer++;
    pixelY = 0;

    if (layer < layerCount) {
      pixels.push([[]]);
    }
  }
}

const countZeros = pixels.map(item => flatten(item).reduce((total, num) => total + Number(num === 0), 0));

const lowestValueOfZeros = Math.min(...countZeros);

let layerWithLowestZeros = null;

for (const [layer, countOfZero] of countZeros.entries()) {
  if (countOfZero === lowestValueOfZeros) {
    layerWithLowestZeros = layer;
    break;
  }
}

console.log(
  flatten(pixels[layerWithLowestZeros]).reduce((total, num) => total + Number(num === 1), 0)
  *
  flatten(pixels[layerWithLowestZeros]).reduce((total, num) => total + Number(num === 2), 0)
);
