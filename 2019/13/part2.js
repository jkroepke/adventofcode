#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/13
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
    this.state.waitForInput = true;

    while (this.input.length === 0) {
      await null;
    }

    this.state.waitForInput = false;

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
    this.state.halted = true;
    this.position = -1;
  }
}

class Game {
  constructor() {
    this.input = [];
    this.output = [];

    this.ball = [0,0];
    this.paddel = [0,0];
    this.score = 0;
    this.screen = [];

    this.blockCount = 0;

    this.computerState = {};
  }


  async getInput() {

    while (this.input.length < 3) {
      if(this.computerState.halted) { return [null, null, null]; }
      await null;
    }

    return [
      this.input.shift(),
      this.input.shift(),
      this.input.shift(),
    ];
  }

  async run() {
    while(!this.computerState.halted) {
      const [x, y, type] = await this.getInput();

      if(this.computerState.halted) { break }

      if (x === -1 && y === 0) {
        this.score = type;
        continue;
      }

      if (!this.screen[y]) {
        this.screen[y] = [];
      }

      let tile;
      switch (type) {
        case 0:
          tile = ' ';
          break;
        case 1:
          tile = '█';
          break;
        case 2:
          tile = '▢';
          this.blockCount++;
          break;
        case 3:
          tile = '_';
          this.paddel[0] = x;
          this.paddel[1] = y;
          break;
        case 4:
          tile = '▓';

          this.ball[0] = x;
          this.ball[1] = y;

          if(this.paddel[0] < this.ball[0]) {
            this.output.push(1);
          } else if(this.paddel[0] > this.ball[0]) {
            this.output.push(-1);
          } else {
            this.output.push(0);
          }

          break;
      }

      this.screen[y][x] = tile;
    }
  }
}


(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);

  // The game didn't run because you didn't put in any quarters.
  // Unfortunately, you did not bring any quarters. Memory address 0 represents the number of quarters that have been
  // inserted; set it to 2 to play for free.
  intCode[0] = 2;

  const computer = new IntCodeComputer(intCode);

  const game = new Game();

  game.output        = computer.input;
  game.input         = computer.output;
  game.computerState = computer.state;

  await Promise.all([
    computer.run(),
    game.run(),
  ]);

  console.log(game.score);
})();
