import cli from 'commander'
import genDiff from '.'

cli
  .version('0.0.2')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) =>
    console.log(genDiff(firstConfig, secondConfig)),
  )

export default cli
