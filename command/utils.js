'use strict';

const globalModules = require('global-modules');
const fs = require('fs');
const nj = require('nornj').default;
const mkdirp = require('mkdirp');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

function getTemplatePath(notSourceFile) {
  return getRootPath() + 'templates/' + (notSourceFile ? '' : 'sourceFiles/');
}

function getRootPath() {
  return path.resolve(__dirname, '..').replace(/\\/g, '/') + '/';
  //return globalModules + '/nornj-cli/';
}

function deleteFolder(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function replaceFileContent(path, ...params) {
  let fileTxt = fs.readFileSync(path, 'utf-8');
  let configs = {};
  if (params && params.length) {
    configs = params[0];
  }

  if(configs.content){
    fileTxt = fileTxt.replace(/#\{pageName\}#/g, configs.content)
    fileTxt = fileTxt.replace(/#\{PageName\}#/gi, configs.content[0].toUpperCase() + configs.content.slice(1))
    
  }
  return fileTxt;
}

function renderFile(path, pathTo, ...params) {
  let fileTxt = fs.readFileSync(path, 'utf-8');
  let configs = {};
  if (params && params.length) {
    configs = params[0];
  }

  if(configs.content){
    fileTxt = fileTxt.replace(/\/\/{\w+}\/\//g, configs.content)
  }

  if(configs.pageName){
    fileTxt = fileTxt.replace(/#\{pageName\}#/gi, configs.pageName)
    fileTxt = fileTxt.replace(/#\{PageName\}#/gi, configs.pageName[0].toUpperCase() + configs.pageName.slice(1))
  }

  if(configs.importStore){
    fileTxt = fileTxt.replace(/\/\/{importStore}\/\//g, configs.importStore)
  }

  if(configs.importModule){
    fileTxt = fileTxt.replace(/\/\/{importModule}\/\//g, configs.importModule)
  }

  if(configs.importPage){
    fileTxt = fileTxt.replace(/\/\/{importPage}\/\//g, configs.importPage)
  }
  
  if(configs.importRoute){
    fileTxt = fileTxt.replace(/\/\/{importRoute}\/\//g, configs.importRoute)
  }

  if (pathTo != null) {
    const pathToDir = pathTo.substr(0, pathTo.lastIndexOf('/'));
    if (!fs.existsSync(pathToDir)) {
      mkdirp.sync(pathToDir);
    }
  }

  fs.writeFileSync(pathTo != null ? pathTo : path, fileTxt);
}

function renderAppendFile(path, pathTo, newLines, ...params) {
  const fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  fs.appendFileSync(pathTo != null ? pathTo : path, _.times(newLines, i => '\n').join('') + fileTxt.trim());
}

function getDeps(pkg) {
  const deps = [];

  pkg.dependencies && Object.keys(pkg.dependencies).forEach(dep => {
    deps.push(dep);
  });
  pkg.devDependencies && Object.keys(pkg.devDependencies).forEach(dep => {
    deps.push(dep);
  });

  return deps;
}


async function checkPackageJson() {
  try {
    if (fs.existsSync('./package.json') && !fs.existsSync('./node_modules')) {
      const spinner = ora(`📦  installing packages...`);
      spinner.start();
      await execSync(`npm install`, { stdio: [0, 1, 2] });
      spinner.stop();
    }
  } catch(err) {
    console.log(chalk.red(`\n x ${err}!`));
  }
}

module.exports = {
  getTemplatePath,
  getRootPath,
  deleteFolder,
  renderFile,
  renderAppendFile,
  getDeps,
  replaceFileContent,
  checkPackageJson
};