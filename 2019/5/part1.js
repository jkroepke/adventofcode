#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/5
*/

const fs = require('fs');
const readline = require('readline');

(async () => {
  const intCode = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(',')
    .map(Number);

  const opcode = {
    1: async (intCode, position, inputMode1, inputMode2, inputMode3) => {
      const input1 = Number(inputMode1 === 0 ? intCode[intCode[position + 1]] : intCode[position + 1]);
      const input2 = Number(inputMode2 === 0 ? intCode[intCode[position + 2]] : intCode[position + 2]);

      intCode[intCode[position + 3]] = input1 + input2;
      return [4, null];
    },
    2: async (intCode, position, inputMode1, inputMode2, inputMode3) => {
      const input1 = Number(inputMode1 === 0 ? intCode[intCode[position + 1]] : intCode[position + 1]);
      const input2 = Number(inputMode2 === 0 ? intCode[intCode[position + 2]] : intCode[position + 2]);

      intCode[intCode[position + 3]] = input1 * input2;
      return [4, null];
    },
    3: async (intCode, position, inputMode1, inputMode2, inputMode3) => {
      console.log('INPUT:');

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      let input;

      for await (const line of rl) {
        input = line;
        rl.close();
      }

      intCode[intCode[position + 1]] = input;
      return [2, null];
    },
    4: async (intCode, position, inputMode1, inputMode2, inputMode3) => {
      const input1 = inputMode1 === 0 ? intCode[intCode[position + 1]] : intCode[position + 1];

      return [2, input1];
    },
    99: () => {
      return [0, null];
    }
  };

  let currentFunction;
  let position = 0;
  let output = '';
  do {
    const currentInstruction = '00000'.substring(0, 5 - intCode[position].toString().length) + intCode[position];

    currentFunction = Number(currentInstruction.charAt(3) + currentInstruction.charAt(4));

    const inputMode1 = Number(currentInstruction.charAt(2));
    const inputMode2 = Number(currentInstruction.charAt(1));
    const inputMode3 = Number(currentInstruction.charAt(0));

    if (!(currentFunction in opcode)) {
      console.error('Unknown instruction '+currentFunction+"\n"+currentInstruction);

      process.exit(1);
    }

    const ret = await opcode[currentFunction](intCode, position, inputMode1, inputMode2, inputMode3);

    position += ret[0];
    if (ret[1]) {
      output = output + ret[1];
    }
  } while (currentFunction !== 99);

  console.log(output);
})();
