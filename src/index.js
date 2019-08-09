import fs from 'fs'
import { has } from 'lodash'

const types = [
  {
    name: 'changed',
    check: ([key, value], second) => has(second, key) && value !== second[key],
  },
  {
    name: 'unchanged',
    check: ([key, value], second) => has(second, key) && value === second[key],
  },
  {
    name: 'deleted',
    check: ([key], second) => !has(second, key),
  },
]

const operators = {
  added: '+',
  deleted: '-',
  unchanged: ' ',
}

const getType = (first, second) =>
  types.find(({ check }) => check(first, second))

const getDiff = (first, second) => {
  const typesWithoutAdded = Object.entries(first).map(elem => [
    getType(elem, second).name,
    ...elem,
  ])
  const typesDiff = Object.entries(second)
    .reduce(
      (acc, [key, value]) =>
        !has(first, key) ? [...acc, ['added', key, value]] : acc,
      typesWithoutAdded,
    )
    .slice()
    .sort()

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
