'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

async function serve (entry) {

  if(!entry){
    console.log(chalk.red('\n x plugin does not exist!'));
    process.exit();
  }

  const spinner = ora(`📦  starting ${chalk.cyan(entry)}...`)
  spinner.start()


  // run parcel-bundler
  execSync(`parcel ${entry} --open`, { stdio: [0, 1, 2] });

  spinner.stop()
  
  console.log(chalk.green(`\n √ Completed !`));
  process.exit();
}

module.exports = serve