import fs from 'fs'
import _ from 'lodash/fp'
import path from 'path'

import getParser from './parsers'

const types = [
  {
    name: 'added',
    check: (key, first) => !_.has(key, first),
    process: (key, first, second) => ['added', key, second[key]],
  },
  {
    name: 'deleted',
    check: (key, first, second) => !_.has(key, second),
    process: (key, first) => ['deleted', key, first[key]],
  },
  {
    name: 'changed',
    check: (key, first, second) =>
      _.has(key, second) && first[key] !== second[key],
    process: (key, first) => ['changed', key, first[key]],
  },
  {
    name: 'unchanged',
    check: (key, first, second) =>
      _.has(key, second) && first[key] === second[key],
    process: (key, first) => ['unchanged', key, first[key]],
  },
]

const operators = {
  added: '+',
  deleted: '-',
  unchanged: ' ',
}

const getType = (key, first, second) =>
  types
    .find(({ check }) => check(key, first, second))
    .process(key, first, second)

const getDiff = (first, second) =>
  _.union(Object.keys(first), Object.keys(second))
    .map((key) => getType(key, first, second))
    .slice()
    .sort()
    .reverse()

const genDiff = (firstConfig, secondConfig) => {
  const firstParser = getParser(path.extname(firstConfig))
  const secondParser = getParser(path.extname(secondConfig))
  const first = firstParser(fs.readFileSync(firstConfig, 'utf8'))
  const second = secondParser(fs.readFileSync(secondConfig, 'utf8'))
  const parseDiff = (diff) =>
    diff
      .reduce(
        (acc, [type, key, value]) =>
          type === 'changed'
            ? acc.concat(
                `  - ${key}: ${value}\n`,
                `  + ${key}: ${second[key]}\n`,
              )
            : acc.concat(`  ${operators[type]} ${key}: ${value}\n`),
        '',
      )
      .trimRight()

  const result = getDiff(first, second) |> parseDiff

  return `{\n${result}\n}`
}

export default genDiff
