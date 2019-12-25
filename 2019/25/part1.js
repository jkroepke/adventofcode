#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/13
*/

const fs = require('fs');
const readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// new function that promises to ask a question and
// resolve to its answer
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, (input) => resolve(input) );
  });
}

class IntCodeComputer {

  constructor(intCode, name = 'unknown') {
    this.name = name;
    this.currentIntCode = '00000';
    this.position = 0;
    this.input = [];
    this.output = [];

    this.relativeBase = 0;

    this.buffer = '';

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

    if (!this.input.length) {
      const line = await ask('');
      this.input.push(...(line.trim()+'\n').split('').map(char => char.charCodeAt(0)));
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

    const outputChar = String.fromCharCode(this.output.shift());

    this.buffer += outputChar;

    process.stdout.write(outputChar, 'utf-8');

    /*
    if (this.buffer.includes('Alert!')) {
      this.output = [-1];
      this.opcode99();
      return;
    }

    if (this.buffer.includes('\n')) {
      this.buffer = '';
    }
    */

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

  const cmd = (cmd) => (cmd+'\n').split('').map(char => char.charCodeAt(0));


  // https://stackoverflow.com/a/9229821/8087167
  /*

  Correct: 00146789

  const variations = [...new Set(
    [...Array(7777777).keys()]
    .map(item => item.toString().split('').sort().join(''))
  )]
    .filter(variation => !variation.match(/(\d)\1/))
    .map(variation => variation.padStart(8, '0'))
    .sort((a,b) => parseInt(a) - parseInt(b));


  let result = null;

  for (const variation of variations) {
    const computer = new IntCodeComputer(intCode);
    // "infinite loop" "molten lava" "photons" "escape pod" "giant electromagnet" are bad ...

    computer.input.push(
      ...cmd('inv'),
      ...cmd('west'),
    );
    variation.includes('0') && computer.input.push(
      ...cmd('take fixed point'), // 0
    );
    computer.input.push(
      ...cmd('north'),
    );
    variation.includes('1') && computer.input.push(
      ...cmd('take sand'), // 1
    );
    computer.input.push(
      ...cmd('south'),
      ...cmd('east'),
      ...cmd('east'),
    );
    variation.includes('2') && computer.input.push(
      ...cmd('take asterisk'), // 2
    );
    computer.input.push(
      ...cmd('north'),
      ...cmd('north'),
    );
    variation.includes('3') && computer.input.push(
      ...cmd('take hypercube'), // 3
    );
    computer.input.push(
      ...cmd('north'),
    );
    variation.includes('4') && computer.input.push(
      ...cmd('take coin'), // 4
    );
    computer.input.push(
      ...cmd('north'),
    );
    variation.includes('5') && computer.input.push(
      ...cmd('take easter egg'), // 5
    );
    computer.input.push(
      ...cmd('south'),
      ...cmd('south'),
      ...cmd('south'),
      ...cmd('west'),
      ...cmd('north'),
    );
    variation.includes('6') && computer.input.push(
      ...cmd('take spool of cat6'), // 6
    );
    computer.input.push(
      ...cmd('north'),
    );
    variation.includes('7') && computer.input.push(
      ...cmd('take spool shell'), // 7
    );
    computer.input.push(
      ...cmd('west'),
      ...cmd('north'),
    );

    await computer.run();

    // if (computer.output[0] === -1) continue;

    result = variation;
  }

  console.log(result);
 */
  // 00146789
  const computer = new IntCodeComputer(intCode);

  computer.input.push(
    ...cmd('inv'),
    ...cmd('west'),
    ...cmd('take fixed point'),
    ...cmd('north'),
    ...cmd('take sand'),
    ...cmd('south'),
    ...cmd('east'),
    ...cmd('east'),
    ...cmd('north'),
    ...cmd('north'),
    ...cmd('north'),
    ...cmd('take coin'),
    ...cmd('north'),
    ...cmd('south'),
    ...cmd('south'),
    ...cmd('south'),
    ...cmd('west'),
    ...cmd('north'),
    ...cmd('take spool of cat6'),
    ...cmd('north'),
    ...cmd('take spool shell'),
    ...cmd('west'),
    ...cmd('north'),
  );

  await computer.run();
})();
