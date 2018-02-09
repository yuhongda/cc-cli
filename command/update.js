'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getDeps } = require('./utils');

module.exports = (command = 'install') => {
  co(function*() {
    const pkgPath = `${process.cwd()}/package.json`;
    const pkg = require(pkgPath);
    const pkgDeps = getDeps(pkg);

    //npm install
    execSync(`npm ${command}${command == 'install' ? '' : (' ' + pkgDeps.deps.join(' '))}`, { stdio: [0, 1, 2] });

    console.log(chalk.green(`\n √ completed !`));
    process.exit();
  });
};