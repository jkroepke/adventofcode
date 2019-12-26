#!/usr/bin/env node

/*
https://adventofcode.com/2019/day/14
*/

const fs = require('fs');


class Factory {
  constructor(recipes) {
    this.recipes = recipes;

    this.storage = {};

    this.neededOre = 0;
  }

  produce(element) {
    for (const requiredElements of this.recipes[element].sources) {
      if (requiredElements[1] === 'ORE') {
        this.neededOre += requiredElements[0];
        continue;
      }

      if (!this.storage[requiredElements[1]]) {
        this.storage[requiredElements[1]] = 0;
      }

      while(this.storage[requiredElements[1]] < requiredElements[0]) {
        this.produce(requiredElements[1]);
      }

      this.storage[requiredElements[1]] -= requiredElements[0];
    }

    this.storage[element] += this.recipes[element].amount;
  }
}

const reactionsRaw = fs.readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n');

const reactions = {};

for (const reaction of reactionsRaw) {
  const parts = reaction.split('=>').map(item => item.trim());

  const target = parts[1].split(' ');
  target[0] = parseInt(target[0]);

  const sources = parts[0].split(', ')
    .map(item => item.trim().split(' '))
    .map(item => [parseInt(item[0]), item[1]]);

  reactions[target[1]] = {
    amount: target[0],
    sources: sources,
  };
}

const factory = new Factory(reactions);

factory.produce('FUEL');

console.log(factory.neededOre);
