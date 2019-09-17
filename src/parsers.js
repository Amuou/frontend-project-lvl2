import yaml from 'js-yaml'
import ini from 'ini'

const getParser = (fileExtension) => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.ini': ini.parse,
  }
  return parsers[fileExtension]
}

export default getParser
