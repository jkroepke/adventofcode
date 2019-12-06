#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/5
*/

const fs = require('fs');
const readline = require('readline');

class IntCodeComputer {
  currentIntCode;

  constructor(intCode) {
    this.intCode = intCode;
    this.position = 0;
    this.output = '';
  }

  async run() {
    let opcode;

    do {
      this.currentIntCode = this.intCode[this.position].toString().reverse();
      opcode = Number(this.currentIntCode.slice(0, 2));

      if (typeof this['opcode' + opcode] !== "function") {
        console.error('Unknown opcode: '+opcode);
        process.exit(1);
      }

      await this['opcode' + opcode]();
    } while (opcode !== 99);
  }

  getParameter(numberOfParameter) {
    const parameterMode = this.currentIntCode[numberOfParameter + 1] || 0;

    return Number(
      parameterMode === 0
        ? this.intCode[this.intCode[numberOfParameter + 2]]
        : this.intCode[numberOfParameter + 2]
    );
  }

  writeData(data, offset) {
    this.intCode[this.intCode[this.position + offset]] = data;
  }

  getOutput() {
    return this.output;
  }

  async getConsoleInput(question = 'INPUT: ') {
    process.stdout.write(question, 'utf8');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let input;

    for await (const line of rl) {
      input = line;
      rl.close();
    }

    return input;
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
    this.writeData(await this.getConsoleInput(), 1);
    this.position += 2;
  }

  /*
    Opcode 4 outputs the value of its only parameter.
   */
  async opcode4() {
    this.output += this.getParameter(1).toString();
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
      this.position += this.getParameter(2);
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
      this.position += this.getParameter(2);
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

  async opcode99() {

  }
}

(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);

  const computer = new IntCodeComputer(intCode);
  await computer.run();

  console.log(computer.getOutput());
})();
