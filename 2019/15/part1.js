#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/15
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

  shutdown() {
    this.state.halted = true;
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

class Guy {
  constructor(intCode) {
    this.input = [];
    this.output = [];

    this.computerState = {};

    this.screen = {'0':{'0':'S'}};
    this.x = 0;
    this.y = 0;

    this.oldCommad = -1;

    this.brain = {'0,0': []};
    this.walls = [];
    this.lookForNext = ['0,0'];

    this.intCode = [...intCode];
  }


  async getInput() {

    while (this.input.length === 0) {
      if(this.computerState.halted) { return [null, null, null]; }
      await null;
    }

    return this.input.shift();
  }

  async goToPosition(x, y) {
    const positionKey = `${x},${y}`;

    const computer = new IntCodeComputer([...this.intCode]);

    if(!this.brain[positionKey]) {
      console.error(`Unknown Position ${positionKey}`);
      process.exit(0);
    }

    computer.input = [...this.brain[positionKey]];

    const waitForExpectedOutputLength = new Promise(async (resolve, reject) => {
      while (computer.output.length !== this.brain[positionKey].length) {
        await null;
      }

      resolve();
    });

    await Promise.race([
      computer.run(),
      waitForExpectedOutputLength
    ]);

    computer.shutdown();

    const status = computer.output[computer.output.length-1];
    if(status === 0) {
      if(!this.walls.includes(positionKey)) {
        this.walls.push(positionKey);
      }
      return status;
    }

    const lookTop = `${x},${y-1}`;
    const lookBottom = `${x},${y+1}`;
    const lookLeft = `${x-1},${y}`;
    const lookRight = `${x+1},${y}`;

    if(!this.lookForNext.includes(lookTop) && !this.walls.includes(lookTop) && !this.brain[lookTop]) {
      this.lookForNext.push(lookTop);
      this.brain[lookTop] = [...this.brain[positionKey]];
      this.brain[lookTop].push(1);
    }

    if(!this.lookForNext.includes(lookBottom) && !this.walls.includes(lookBottom) && !this.brain[lookBottom]) {
      this.lookForNext.push(lookBottom);
      this.brain[lookBottom] = [...this.brain[positionKey]];
      this.brain[lookBottom].push(2);
    }

    if(!this.lookForNext.includes(lookLeft) && !this.walls.includes(lookLeft) && !this.brain[lookLeft]) {
      this.lookForNext.push(lookLeft);
      this.brain[lookLeft] = [...this.brain[positionKey]];
      this.brain[lookLeft].push(3);
    }

    if(!this.lookForNext.includes(lookRight) && !this.walls.includes(lookRight) && !this.brain[lookRight]) {
      this.lookForNext.push(lookRight);
      this.brain[lookRight] = [...this.brain[positionKey]];
      this.brain[lookRight].push(4);
    }

    return status;
  }

  async run() {
    while(true) {
      const nextPosition = this.lookForNext.shift();

      if(!nextPosition) {
        break;
      }

      let [x, y] = nextPosition.split(',').map(Number);

      const status = await this.goToPosition(x, y);

      // https://stackoverflow.com/a/3216041/8087167
      if (!this.screen[y]) this.screen[y] = {};

      if (status === 0) {
        this.screen[y][x] = '█';
      } else if (status === 1) {
        this.screen[y][x] = '░';
      } else if (status === 2) {
        this.screen[y][x] = 'Q';
      }

      const minY = Math.min(...Object.keys(this.screen).map(Number));
      const maxY = Math.max(...Object.keys(this.screen).map(Number));
      const minX = Math.min(...Array.prototype.concat.apply([], Object.values(this.screen).map(line => Object.keys(line))));
      const maxX = Math.max(...Array.prototype.concat.apply([], Object.values(this.screen).map(line => Object.keys(line))));

      process.stdout.write('\u001B[2J\u001B[0;0f', 'utf-8');
      console.log(x, y);
      console.log('');
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (this.screen[y]) {
            process.stdout.write(this.screen[y][x] || ' ', 'utf-8');
          }
          else {
            process.stdout.write(' ', 'utf-8');

          }
        }
        process.stdout.write('\n', 'utf-8');
      }
    }

    // https://stackoverflow.com/a/183197/8087167
    outside:
    for (const y of Object.keys(this.screen)) {
      for (const x of Object.keys(this.screen[y])) {
        if(this.screen[y][x] !== 'Q') continue;

        console.log('');
        console.log('Oxygen Found!', x, y);
        console.log('Moves: ' + this.brain[`${x},${y}`].length);
        break outside;
      }
    }
  }
}

(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);

  const guy = new Guy(intCode);

  await guy.run();
})();
