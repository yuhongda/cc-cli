'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const { checkPackageJson } = require('./utils');

async function build (entry) {

  let _entry = entry;

  if(!_entry){
    if(fs.existsSync('./index.html')){
      _entry = 'index.html';
    }else{
      console.log(chalk.red('\n x please input entry!'));
      process.exit();
    }
  }

  await checkPackageJson();

  const spinner = ora(`📦  starting ${chalk.cyan(entry)}...`)
  spinner.start()


  // run parcel-bundler
  execSync(`parcel build ${entry}`, { stdio: [0, 1, 2] });

  spinner.stop()
  
  console.log(chalk.green(`\n √ Completed !`));
  process.exit();
}

module.exports = build