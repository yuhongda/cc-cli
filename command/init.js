'use strict'

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'tmplName',
        message: 'Please select a project template:',
        choices: [
          'cc-template[vue]',
          'cc-template[jquery]',
          'cc-template[react-hooks]',
        ]
    }])
    .then(answers => {
        co(function *() {
            let tmplName = /\[(\w+)\]/.exec(answers.tmplName)[1];//yield prompt('Template Name: ');
            let projectName = yield prompt('Project Name: ');
            let gitUrl;
            let branch;
            if(!config[tmplName]){
                console.log(chalk.red('\n x Template does not exist!'));
                process.exit();
            }
            gitUrl = config[tmplName].url;
            branch = config[tmplName].branch;

            let spinner = ora('downloading... (just take a break, these whole things may take a long time.)')
            spinner.start();

            //git clone
            exec(`git clone ${gitUrl} ${projectName} --progress && cd ${projectName} && git checkout ${branch}`, (error, stdout, stderr) => {
                spinner.stop();
                if (error) {
                    console.log(error)
                    process.exit()
                }
                console.log(chalk.green('\n √ download finished!'));

                //npm install
                let spinner2 = ora('installing...')
                spinner2.start();
                exec(`cd ${projectName} && npm install`, (error, stdout, stderr) => {
                    spinner2.stop();
                    if (error) {
                        console.log(error)
                        process.exit()
                    }
                    console.log(chalk.green('\n √ competed!'));
                    process.exit();
                });
            })
        })
    })
};

