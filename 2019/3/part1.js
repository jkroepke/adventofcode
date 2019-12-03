#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/3
*/

const fs = require('fs');
const cables = fs.readFileSync('input.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(','));

const cablePositions = [];
for (const cable of cables) {
    const positions = [];
    positions.unshift([0, 0]);

    for (const step of cable) {
        const direction = step.charAt(0);
        const length = parseInt(step.replace(direction, ''));
        const lastPosition = positions[0];

        switch (direction) {
            case 'U':
                [...Array(length).keys()].forEach((i) => {
                    positions.unshift([lastPosition[0], lastPosition[1] + i + 1]);
                });

                break;
            case 'D':
                [...Array(length).keys()].forEach((i) => {
                    positions.unshift([lastPosition[0], lastPosition[1] - (i + 1)]);
                });
                break;
            case 'L':
                [...Array(length).keys()].forEach((i) => {
                    positions.unshift([lastPosition[0] - (i + 1), lastPosition[1]]);
                });
                break;
            case 'R':
                [...Array(length).keys()].forEach((i) => {
                    positions.unshift([lastPosition[0] + i + 1, lastPosition[1]]);
                });
                break;

        }
    }

    cablePositions.push(positions);
}

const cableIntersections = [];

for (const position0 of cablePositions[0]) {
    for (const position1 of cablePositions[1]) {
        if(position0[0] === position1[0] && position0[1] === position1[1]) {
            cableIntersections.push(position0);
        }
    }
}

const getClosedIntersection = Math.min(...cableIntersections.map((element) => element[0] + element[1]).filter(Boolean));

console.log(cableIntersections.filter((element) => element[0] + element[1] === getClosedIntersection));
