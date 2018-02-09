'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const {
  getTemplatePath,
  renderFile,
  renderAppendFile,
  replaceFileContent
} = require('./utils');

module.exports = () => {
    let pageName;

    co(function*() {
        pageName = process.argv[3];
        if (pageName == null) {
            pageName = yield prompt('Page Name: ');
        }

        //server route files
        renderFile(`./templates/server/routes/newPage.js`, `./server/routes/${pageName}.js`);
        renderFile(`./server/app.js`, null, {
            content: replaceFileContent(`./templates/server/app.js`, { content: pageName })
        });

        //page resource files
        renderFile(`./templates/src/pages/newPage.vue`, `./src/pages/${pageName}.vue`, { pageName });

        //store files
        renderFile(`./templates/src/stores/pages/newPageStore.js`, `./src/store/${pageName}Store.js`, { pageName });
        renderFile(`./src/store/store.js`, null, {
            importStore: replaceFileContent(`./templates/src/stores/importStore.js`, { content: pageName }),
            importModule: replaceFileContent(`./templates/src/stores/importModule.js`, { content: pageName })
        });

        //router config
        renderFile(`./router-config.js`, null, {
            importPage: replaceFileContent(`./templates/router-config-import.js`, { content: pageName }),
            importRoute: replaceFileContent(`./templates/router-config-route.js`, { content: pageName }),
        });

        console.log(chalk.green('\n √ created page finished !'));
        process.exit();
    });
};