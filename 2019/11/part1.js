#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/11
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
    } while (this.position !== -1);
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
    while (this.input.length === 0) {
      await null;
    }

    return this.input.shift();
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
    this.position = -1;
  }
}

class Panel {
  constructor() {
    this.panel = {};
    this.overrittenPanel = {};
    this.input = [];
    this.output = [];
    this.x = 0;
    this.y = 0;

    this.panelCount = 0;
    this.done = false;

    this.robotDirection = 0;
  }

  setDone() {
    this.done = true;
  }

  async draw() {
    while(!this.done) {
      const [color, direction] = await this.getInput();

      if(!this.panel[this.y]) {
        this.panel[this.y] = {};
        this.overrittenPanel[this.y] = {};
      }

      if(typeof this.panel[this.y][this.x] === 'undefined') {
        this.panelCount++;
      }

      this.panel[this.y][this.x] = color;
      this.overrittenPanel[this.y][this.x] = (this.overrittenPanel[this.y][this.x] || 0) + 1;

      this.setNextPanel(direction);

      const output = (this.panel[this.y] && this.panel[this.y][this.x])
        ? this.panel[this.y][this.x]
        : 0;

      this.output.push(output);
    }
  }

  setNextPanel(direction) {
    this.calculateDirection(direction);

    switch (this.robotDirection) {
      case 0:
        this.y += 1;
        break;
      case 90:
        this.x += 1;
        break;
      case 180:
        this.y -= 1;
        break;
      case 270:
        this.x -= 1;
        break;
      default:
        console.error('Unknown direction: '+this.robotDirection);
        process.exit(1);
        break;
    }
  }

  calculateDirection(newDirection) {
    const newRobotDirection = newDirection === 0 ? -90 : 90;
    this.robotDirection = this.robotDirection + newRobotDirection;

    if (this.robotDirection < 0) {
      this.robotDirection += 360;
    }
    else if (this.robotDirection >= 360) {
      this.robotDirection -= 360;
    }
  }

  async getInput() {
    while (this.input.length !== 2) {
      if(this.done) return;
      await null;
    }

    return [
      this.input.shift(),
      this.input.shift(),
    ];
  }
}

(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);

  const robot = new IntCodeComputer(intCode);
  const panel = new Panel();

  robot.input = panel.output;
  robot.output = panel.input;

  robot.setInput(0);

  await Promise.race([
    robot.run(),
    panel.draw()
  ]).then(() => {
    panel.setDone();
  });

  console.log(panel.panelCount);
})();

