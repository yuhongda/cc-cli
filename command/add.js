'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getDeps } = require('./utils');

async function add (pluginName) {
  const pkgPath = `${process.cwd()}/package.json`;
  const pkg = require(pkgPath);
  const pkgDeps = getDeps(pkg);

  if(!pluginName){
    console.log(chalk.red('\n x plugin does not exist!'));
    process.exit();
  }
  const packageName = `cc-cli-plugin-${pluginName.replace('cc-cli-plugin-', '')}`

  const spinner = ora(`📦  Installing ${chalk.cyan(packageName)}...`)
  spinner.start()


  //npm install
  execSync(`npm install ${packageName} -D`, { stdio: [0, 1, 2] });

  spinner.stop()
  
  console.log(chalk.green(`\n √ Completed !`));
  process.exit();
}

module.exports = add