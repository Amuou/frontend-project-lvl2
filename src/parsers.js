import ini from 'ini'
import yaml from 'js-yaml'

const getParser = (fileExtension) => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.ini': ini.parse,
  }
  return parsers[fileExtension]
}

export default getParser
