#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/23
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

class Network {
  constructor() {
    this.computers = [];
    this.nat = [];
    this.packetsFromNat = [0, 0];
    this.queue = {};
  }

  attach(address, computer) {
    computer.setInput(address);
    this.computers.push(computer);
  }

  async tick() {

    const computerCount = this.computers.length;
    const run = [];

    for (let address = 0; address < computerCount; address++) {
      run.push(this.computers[address].run());
    }

    run.push(this.handlePackets());

    await Promise.race(run);

    for (let address = 0; address < computerCount; address++) {
      this.computers[address].shutdown();
    }
  }

  async handlePackets() {
    const computerCount = this.computers.length;
    outerLoop:
      while(true) {
        for (let address = 0; address < computerCount; address++) {
          if (this.computers[address].output.length !== 3) continue;

          const targetAddress = this.computers[address].output.shift();
          const x = this.computers[address].output.shift();
          const y = this.computers[address].output.shift();

          if(targetAddress === 255) {
            this.nat = [x, y];
            continue;
          }

          if(!this.computers[targetAddress]) {
            console.error("Unknown address: "+targetAddress);
            break outerLoop;
          }

          if(!this.queue[targetAddress]) this.queue[targetAddress] = [];

          this.queue[targetAddress].push(x);
          this.queue[targetAddress].push(y);
        }

        const queueLength = Object.values(this.queue)
          .reduce((total, item) => total + item.length, 0);

        if (queueLength === 0 && this.nat.length === 2) {
          const x = this.nat.shift();
          const y = this.nat.shift();

          if(!this.queue[0]) this.queue[0] = [];
          this.queue[0].push(x);
          this.queue[0].push(y);

          if(this.packetsFromNat.includes(y)) {
            console.log('First "Y" value sent twice in a row to address 0 is: '+y);
            break;
          }

          this.packetsFromNat.shift();
          this.packetsFromNat.push(y);
        }

        for (let address = 0; address < computerCount; address++) {
          if (this.computers[address].input.length !== 0) continue;

          if (this.queue[address] && this.queue[address].length >= 2) {
            this.computers[address].input.push(this.queue[address].shift());
            this.computers[address].input.push(this.queue[address].shift());
          }
          else {
            this.computers[address].input.push(-1);
          }
        }

        await null;
      }
  }
}

(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);

  const network = new Network();
  const amountOfComputers = 50;

  for (let i = 0; i < amountOfComputers; i++) {
    network.attach(i, new IntCodeComputer(intCode));
  }

  await network.tick();
})();
