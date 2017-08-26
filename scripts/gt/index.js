/**
 * @since 2017-04-11 19:09:25
 * @author vivaxy
 */

import Listr from 'listr';
import execa from 'execa';

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

const copyFiles = (options) => {
    const { presets } = options;

    const files = [
        'scripts',
        'src',
        '.babelrc',
        '.editorconfig',
        '.eslintrc',
        '.gitignore',
        '.npmignore',
        '.npmrc',
        'LICENSE',
        'CONTRIBUTING.md',
        'yarn.lock',
    ];
    return async() => {
        await sleep(1000);
        await presets.copyFiles(files);
    };
};

const updatePackageJSON = (options) => {
    const { project, presets } = options;
    const projectGit = project.git || {};
    const filename = 'package.json';

    return async() => {
        await sleep(1000);
        await presets.updateJson(filename, (json) => {
            const {
                version,
                description,
                main,
                scripts,
                repository,
                keywords,
                author,
                license,
                bugs,
                dependencies,
                devDependencies,
                peerDependencies,
            } = json;

            return {
                name: project.name,
                version: '0.0.0',
                gtScaffoldVersion: version,
                description,
                main,
                scripts,
                repository: {
                    ...repository,
                    url: projectGit.repositoryURL,
                },
                keywords,
                author,
                license,
                bugs: {
                    ...bugs,
                    url: undefined,
                },
                dependencies,
                devDependencies,
                peerDependencies,
            };
        });
    };
};

const updateREADME = (options) => {
    const { project, presets } = options;
    const filename = 'README.md';

    return async() => {
        await sleep(1000);
        await presets.updateFile(filename, (content) => {
            const projectData = content.split('----------\n\n')[1];
            return projectData
                .replace(/{{ projectName }}/g, project.name)
                .replace(/{{ gtAnnotation }}/g,
                    'Initialized by [vivaxy/gt-npm-package](https://github.com/vivaxy/gt-npm-package).');
        });
    };
};

const yarnInstall = () => {
    return async() => {
        await execa('yarn', ['install']);
    };
};

export const init = async(options) => {
    return new Listr([
        {
            title: 'copy files',
            task: copyFiles(options),
        },
        {
            title: 'update package.json',
            task: updatePackageJSON(options),
        },
        {
            title: 'update README.md',
            task: updateREADME(options),
        },
        {
            title: 'run yarn install',
            task: yarnInstall(options),
        },
    ]);
};

export const after = async() => {
    console.log('\nWHAM!\n'); // eslint-disable-line no-console
};
