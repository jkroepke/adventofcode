#!/usr/bin/env node

const fs = require('fs');

/*
Opcode 1
    * adds together numbers read from two positions and stores the result in a third position.
    * The three integers immediately after the opcode tell you these three positions -
    * the first two indicate the positions from which you should read the input values,
    * and the third indicates the position at which the output should be stored.

Opcode 2
    * works exactly like opcode 1,
    * except it multiplies the two inputs instead of adding them.
    * Again, the three integers after the opcode indicate where the inputs and outputs are, not their values.

Once you're done processing an opcode, move to the next one by stepping forward 4 positions.
 */

const cables = fs.readFileSync('input.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(','));

const drawer = (cable) => {
    const positions = [];
    positions.unshift([0, 0]);

    for (const step of cable) {
        const direction = step.charAt(0);
        const length = parseInt(step.replace(direction, ''));
        const lastPosition = positions[0];
        let newPosition;

        switch (direction) {
            case 'U':
                newPosition = [lastPosition[0], lastPosition[1] + length];
                break;
            case 'D':
                newPosition = [lastPosition[0], lastPosition[1] - length];
                break;
            case 'L':
                newPosition = [lastPosition[0] - length, lastPosition[1]];
                break;
            case 'R':
                newPosition = [lastPosition[0] + length, lastPosition[1]];
                break;

        }
        positions.unshift(newPosition);
    }

    return positions;
};

const cablePositions = cables.map((cable) => drawer(cable));
const cableIntersections = [];

for (const position0 of cablePositions[0]) {
    for (const position1 of cablePositions[1]) {
        if(position0[0] === position1[0] && position0[1] === position1[1]) {
            cableIntersections.push(position0);
        }
    }
}

console.log(cableIntersections);
