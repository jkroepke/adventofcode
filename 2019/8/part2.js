#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/8
*/
const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('');

const pixelWide = 25;
const pixelTall = 6;

const pixelPerLayer = pixelWide * pixelTall;
const layerCount = (input.length / pixelPerLayer);

const layers = [[[]]];

let layer = 0;
let pixelY = 0;
let pixelX = 0;

for (const pixel of input) {
  layers[layer][pixelY].push(Number(pixel));

  pixelX++;

  if (pixelX >= pixelWide) {
    pixelY++;
    pixelX = 0;
    layers[layer].push([]);
  }

  if (pixelY >= pixelTall) {
    layer++;
    pixelY = 0;

    if (layer < layerCount) {
      layers.push([[]]);
    }
  }
}
const image = [...layers[layerCount - 1]];

for (const layer of layers.reverse()) {
  for (const [y, pixels] of layer.entries()) {
    for (const [x, pixel] of pixels.entries()) {
      if (pixel !== 2) {
        image[y][x] = pixel;
      }
    }
  }
}

for (const pixels of image) {
  for (const pixel of pixels) {
    process.stdout.write(pixel.toString());
  }
  process.stdout.write('\n');
}

