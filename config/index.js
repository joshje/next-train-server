var chalk = require('chalk');
var config;

try {
  config = require('./config.json');
} catch(err) {
  console.log(chalk.red('config.json file not found at ') + chalk.bold.red(__dirname));
  console.log('Here\'s an example:');
  console.log(chalk.green(JSON.stringify(require('./config.example.json'), null, '  ')));

  throw new Error(err);
}

module.exports = config;
