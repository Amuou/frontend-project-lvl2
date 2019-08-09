import fs from 'fs'
import { has, union } from 'lodash'

const types = [
  {
    name: 'added',
    check: (key, first) => !has(first, key),
    process: (key, first, second) => ['added', key, second[key]],
  },
  {
    name: 'deleted',
    check: (key, first, second) => !has(second, key),
    process: (key, first) => ['deleted', key, first[key]],
  },
  {
    name: 'changed',
    check: (key, first, second) =>
      has(second, key) && first[key] !== second[key],
    process: (key, first) => ['changed', key, first[key]],
  },
  {
    name: 'unchanged',
    check: (key, first, second) =>
      has(second, key) && first[key] === second[key],
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

const getDiff = (first, second) => {
  const firstKeys = Object.keys(first)
  const secondKeys = Object.keys(second)
  const unitedKeys = union(firstKeys, secondKeys)
  const typesDiff = unitedKeys
    .map(key => getType(key, first, second))
    .slice()
    .sort()
    .reverse()

  return typesDiff
}

const genDiff = (firstConfig, secondConfig) => {
  const first = JSON.parse(fs.readFileSync(firstConfig, 'utf8'))
  const second = JSON.parse(fs.readFileSync(secondConfig, 'utf8'))
  const parseDiff = diff =>
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
