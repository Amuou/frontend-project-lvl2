import fs from 'fs'
import path from 'path'
import genDiff from '../src'

const testFiles = [
  ['json/before.json', 'json/after.json', 'expected.txt'],
  ['json/before1.json', 'json/after1.json', 'expected1.txt'],
  ['yaml/before.yaml', 'yaml/after.yaml', 'expected.txt'],
  ['ini/before.ini', 'ini/after.ini', 'expected.txt'],
]

test.each(testFiles)('genDiff(%s, %s)', (before, after, expected) => {
  const beforePath = path.resolve(__dirname, `__fixtures__/${before}`)
  const afterPath = path.resolve(__dirname, `__fixtures__/${after}`)
  const expectedPath = path.resolve(__dirname, `__fixtures__/${expected}`)
  const result = fs.readFileSync(expectedPath, 'utf8')
  expect(genDiff(beforePath, afterPath)).toEqual(result)
})
