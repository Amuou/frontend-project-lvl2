import cli from 'commander';

cli
  .version('0.0.2')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  

export default cli
