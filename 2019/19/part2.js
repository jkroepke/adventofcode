#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/19
*/

const fs = require('fs');

class IntCodeComputer {

  constructor(intCode, name = 'unknown') {
    this.name = name;
    this.currentIntCode = '00000';
    this.position = 0;
    this.input = [];
    this.output = [];

    this.relativeBase = 0;

    // remove reference
    this.intCode = [...intCode];

    this.state = {
      waitForInput: false,
      halted: false,
    };
  }

  setInput(input) {
    this.input.push(input);
  }

  async run() {
    let opcode;

    do {
      this.currentIntCode = '00000'.substring(0, 5 - this.intCode[this.position].toString().length) + this.intCode[this.position];
      opcode = Number(this.currentIntCode.slice(-2));
      if (typeof this['opcode' + opcode] !== "function") {
        console.error('Unknown opcode: '+opcode);
        console.error('Instruction: '+this.currentIntCode);
        process.exit(1);
      }

      await this['opcode' + opcode]();
    } while (!this.state.halted);
  }

  getParameterPosition(numberOfParameter) {
    const parameterMode = Number(this.currentIntCode[Math.abs(numberOfParameter - 3)]);

    switch (parameterMode) {
      case 0:
        return this.intCode[this.position + numberOfParameter];
      case 1:
        return this.position + numberOfParameter;
      case 2:
        return this.relativeBase + this.intCode[this.position + numberOfParameter];
    }

    console.error('Unknown parameter mode: '+parameterMode);
    console.error('Instruction: '+this.currentIntCode);
    process.exit(1);
  }

  getParameter(numberOfParameter) {
    const parameterPosition = this.getParameterPosition(numberOfParameter);

    return Number(this.intCode[parameterPosition]);
  }

  writeData(data, numberOfParameter) {
    const parameterPosition = this.getParameterPosition(numberOfParameter);

    this.intCode[parameterPosition] = Number(data);
  }

  async getInput() {
    this.state.waitForInput = true;

    while (this.input.length === 0) {
      if(this.state.halted) break;
      await null;
    }

    if(this.state.halted) return 0;

    this.state.waitForInput = false;

    return this.input.shift();
  }

  shutdown() {
    this.state.halted = true;
  }

  getOutput() {
    return this.output;
  }

  /*
    Opcode 1 adds together numbers read from two positions and stores the result in a third position.
   */
  async opcode1() {
    this.writeData(this.getParameter(1) + this.getParameter(2), 3);
    this.position += 4;
  }

  /*
    Opcode 2 works exactly like opcode 1,
    except it multiplies the two inputs instead of adding them.
   */
  async opcode2() {
    this.writeData(this.getParameter(1) * this.getParameter(2), 3);
    this.position += 4;
  }

  /*
    Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
   */
  async opcode3() {
    const input = await this.getInput();
    this.writeData(input, 1);

    this.position += 2;
  }

  /*
    Opcode 4 outputs the value of its only parameter.
   */
  async opcode4() {
    this.output.push(this.getParameter(1));
    this.position += 2;
  }

  /*
  Opcode 5 is jump-if-true:
    if the first parameter is non-zero,
    it sets the instruction pointer to the value from the second parameter.
    Otherwise, it does nothing.
  */
  async opcode5() {
    if (this.getParameter(1) !== 0) {
      this.position = this.getParameter(2);
    }
    else {
      this.position += 3;
    }
  }

  /*
  Opcode 6 is jump-if-false:
    if the first parameter is zero,
    it sets the instruction pointer to the value from the second parameter.
    Otherwise, it does nothing.
  */
  async opcode6() {
    if (this.getParameter(1) === 0) {
      this.position = this.getParameter(2);
    }
    else {
      this.position += 3;
    }
  }

  /*
  Opcode 7 is less than:
    if the first parameter is less than the second parameter,
    it stores 1 in the position given by the third parameter.
    Otherwise, it stores 0.
   */
  async opcode7() {
    this.writeData(
      Number(this.getParameter(1) < this.getParameter(2)),
      3);

    this.position += 4;
  }

  /*
  Opcode 8 is equals:
    if the first parameter is equal to the second parameter,
    it stores 1 in the position given by the third parameter.
    Otherwise, it stores 0.
   */
  async opcode8() {
    this.writeData(
      Number(this.getParameter(1) === this.getParameter(2)),
      3);

    this.position += 4;
  }

  /*
    Opcode 9 adjusts the relative base by the value of its only parameter.
    The relative base increases (or decreases, if the value is negative) by the value of the parameter.
   */
  async opcode9() {
    this.relativeBase += this.getParameter(1);

    this.position += 2;
  }

  async opcode99() {
    this.state.halted = true;
    this.position = -1;
  }
}

(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);


  let minBeamX = 0;
  let maxBeamX = 0;

  let maxX = 0;
  let maxY = 0;

  let allXBeamCoords = [];

  const closedCords = [];
  const screen = [];

  while(!closedCords.length) {
    screen[maxY] = [];

    let x = 0;
    let y = 0;

    const results = [];

    if(allXBeamCoords.length) {
      minBeamX = Math.min(...allXBeamCoords);
      maxBeamX = Math.max(...allXBeamCoords) + 3;
    } else {
      minBeamX = 0;
      maxBeamX = maxX;
    }

    for (let x = minBeamX; x <= maxBeamX; x++) {
      const computer = new IntCodeComputer(intCode, `${x},${maxY}`);
      computer.setInput(x);
      computer.setInput(maxY);

      results.push(computer.run().then(() => {
        const [ x, y ] = computer.name.split(',').map(Number);
        const [ fieldPulledByBeam ] = computer.getOutput();

        screen[y][x] = fieldPulledByBeam === 0 ? '.' : '#';
      }));
    }

    for (let y = 0; y <= maxY; y++) {
      const computer = new IntCodeComputer(intCode, `${maxX},${y}`);
      computer.setInput(maxX);
      computer.setInput(y);

      results.push(computer.run().then(() => {
        const [ x, y ] = computer.name.split(',').map(Number);
        const [ fieldPulledByBeam ] = computer.getOutput();

        screen[y][x] = fieldPulledByBeam === 0 ? '.' : '#';
      }));
    }

    await Promise.all(results);

    allXBeamCoords = screen[maxY]
      .map((item, key) => [key, item])
      .filter(item => item[1] === '#')
      .map(item => item[0]);

    const minXBeam = Math.min(...allXBeamCoords);

    if (
      screen[maxY-99]
      && screen[maxY][minXBeam] === '#'
      && screen[maxY-99][minXBeam] === '#'
      && screen[maxY-99][minXBeam+99] === '#'
      && screen[maxY][minXBeam+99] === '#'
    ) {
      closedCords.push(minXBeam);
      closedCords.push(maxY-99);
    }

    maxX++;
    maxY++;
  }

  console.log(closedCords[0] * 10000 + closedCords[1]);
})();
