#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/5
*/

const fs = require('fs');

class IntCodeComputer {

  constructor(intCode) {
    this.currentIntCode = '00000';
    this.intCode = intCode;
    this.position = 0;
    this.input = [];
    this.inputPosition = 0;
    this.output = '';
  }

  setInput(input) {
    this.input = input;
  }

  run() {
    let opcode;

    do {

      this.currentIntCode = '00000'.substring(0, 5 - this.intCode[this.position].toString().length) + this.intCode[this.position];
      opcode = Number(this.currentIntCode.slice(-2));

      if (typeof this['opcode' + opcode] !== "function") {
        console.error('Unknown opcode: '+opcode);
        console.error('Instruction: '+this.currentIntCode);
        process.exit(1);
      }

      this['opcode' + opcode]();
    } while (opcode !== 99);
  }

  getParameter(numberOfParameter) {
    const parameterMode = Number(this.currentIntCode[Math.abs(numberOfParameter - 3)]);
    return Number(
      parameterMode === 0
        ? this.intCode[this.intCode[this.position + numberOfParameter]]
        : this.intCode[this.position + numberOfParameter]
    );
  }

  writeData(data, position) {
    this.intCode[this.intCode[position]] = Number(data);
  }

  getOutput() {
    return this.output;
  }

  /*
    Opcode 1 adds together numbers read from two positions and stores the result in a third position.
   */
  opcode1() {
    this.writeData(this.getParameter(1) + this.getParameter(2), this.position + 3);
    this.position += 4;
  }

  /*
    Opcode 2 works exactly like opcode 1,
    except it multiplies the two inputs instead of adding them.
   */
  opcode2() {
    this.writeData(this.getParameter(1) * this.getParameter(2), this.position + 3);
    this.position += 4;
  }

  /*
    Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
   */
  opcode3() {
    this.writeData(this.input[this.inputPosition], this.position + 1);
    this.position += 2;
    this.inputPosition += 1;
  }

  /*
    Opcode 4 outputs the value of its only parameter.
   */
  opcode4() {
    this.output += this.getParameter(1).toString();
    this.position += 2;
  }

  /*
  Opcode 5 is jump-if-true:
    if the first parameter is non-zero,
    it sets the instruction pointer to the value from the second parameter.
    Otherwise, it does nothing.
  */
  opcode5() {
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
  opcode6() {
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
  opcode7() {

    this.writeData(
      Number(this.getParameter(1) < this.getParameter(2)),
      this.position + 3);

    this.position += 4;
  }

  /*
  Opcode 8 is equals:
    if the first parameter is equal to the second parameter,
    it stores 1 in the position given by the third parameter.
    Otherwise, it stores 0.
   */
  opcode8() {
    this.writeData(
      Number(this.getParameter(1) === this.getParameter(2)),
      this.position + 3);

    this.position += 4;
  }

  opcode99() {

  }
}

// https://initjs.org/all-permutations-of-a-set-f1be174c79f8
function getAllPermutations(string) {
  var results = [];

  if (string.length === 1) {
    results.push(string);
    return results;
  }

  for (var i = 0; i < string.length; i++) {
    var firstChar = string[i];
    var charsLeft = string.substring(0, i) + string.substring(i + 1);
    var innerPermutations = getAllPermutations(charsLeft);
    for (var j = 0; j < innerPermutations.length; j++) {
      results.push(firstChar + innerPermutations[j]);
    }
  }
  return results;
}

const intCode = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split(',')
  .map(Number);

const amplifierOrders = getAllPermutations('01234');
const results = [];

for (const amplifierOrder of amplifierOrders) {
  let amplifierOutput = 0;

  for (const amplifier of amplifierOrder) {
    const computer = new IntCodeComputer(intCode);
    computer.setInput([amplifier, amplifierOutput]);
    computer.run();
    amplifierOutput = computer.getOutput();
  }

  results.push(amplifierOutput);
}

console.log(Math.max(...results));
