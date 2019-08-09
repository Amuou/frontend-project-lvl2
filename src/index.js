import fs from 'fs'
import { has, compact } from 'lodash'

const getMissingEntries = (first, second) =>
  Object.entries(first).filter(([key]) => !has(second, key))

const getChangedEntries = (first, second) =>
  Object.entries(first).reduce(
    (acc, [key, value]) =>
      has(second, key) && value !== second[key]
        ? [
            ...acc,
            {
              before: { operator: '-', key, value },
              after: { operator: '+', key, value: second[key] },
            },
          ]
        : acc,
    [],
  )

const getRemainEntries = (first, second) =>
  Object.entries(first).filter(
    ([key, value]) => has(second, key) && value === second[key],
  )

const reverseAttrs = f => (a, b) => f(b, a)

const genDiff = (firstConfig, secondConfig) => {
  const first = JSON.parse(fs.readFileSync(firstConfig, 'utf8'))
  const second = JSON.parse(fs.readFileSync(secondConfig, 'utf8'))
  const deleted = getMissingEntries(first, second)
  const added = reverseAttrs(getMissingEntries)(first, second)
  const changed = getChangedEntries(first, second)
  const remain = getRemainEntries(first, second)
  const diff = compact([
    `${remain.map(([key, value]) => `    ${key}: ${value}`).join('\n')}`,
    `${changed
      .map(({ before, after }) =>
        [
          `  ${before.operator} ${before.key}: ${before.value}`,
          `  ${after.operator} ${after.key}: ${after.value}`,
        ].join('\n'),
      )
      .join('\n')}`,
    `${deleted.map(([key, value]) => `  - ${key}: ${value}`).join('\n')}`,
    `${added.map(([key, value]) => `  + ${key}: ${value}`).join('\n')}`,
  ]).join('\n')

  return `{\n${diff}\n}`
}

export default genDiff
