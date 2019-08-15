import yaml from 'js-yaml'

const getParser = fileExtension => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
  }
  return parsers[fileExtension]
}

export default getParser
