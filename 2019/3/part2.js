#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/3
*/

/*
NOT WORKING SKIP, IT!
F*CK OFF
 */

const fs = require('fs');
const cables = fs.readFileSync('input.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(','));

const cablesPositions = [];
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

    cablesPositions.push(positions);
}

const cableIntersections = [];

for (const position0 of cablesPositions[0]) {
    for (const position1 of cablesPositions[1]) {
        if(position0[0] === position1[0] && position0[1] === position1[1]) {
            cableIntersections.push(position0);
        }
    }
}

let lowestStepCount = Infinity;

for (const cableIntersection of cableIntersections) {
    const cableStepCount = [];

    cableStepCount.push(cablesPositions[0].map((element) => JSON.stringify(element)).indexOf(JSON.stringify(cableIntersection)));
    cableStepCount.push(cablesPositions[1].map((element) => JSON.stringify(element)).indexOf(JSON.stringify(cableIntersection)));

    const combinedStepCount = cableStepCount.reduce((total, num) => total + num);

    if (combinedStepCount < lowestStepCount) {
        lowestStepCount = combinedStepCount;
    }
}

console.log(lowestStepCount);
