// /js/filesystem.js

const fileSystem = {
    home: {
        guest: {
            code: {
                python: {},
                'c#': {},
                c: {},
                'c++': {},
                java: {},
                other: {}
            },
            resources: {
                unity: {},
                python: {}
            },
            projects: {
                unity: {},
                python: {},
                'c#': {},
                c: {},
                'c++': {},
                java: {},
                other: {}
            },
            themes: {
                light: {},
                dark: {},
                retro: {}
            }
        }
    }
};

let cwd = ['home', 'guest'];
let isSudo = false;

function getCurrentDir() {
    return cwd.reduce((dir, subDir) => dir[subDir], fileSystem);
}

function listDir(dir) {
    if (typeof dir === 'object') {
        return Object.keys(dir).map(subDir => `<blue class="directory">${subDir}</blue>`).join('\n');
    } else {
        return '';
    }
}

function getPathParts(path) {
    return path.split(/[\\/]/).filter(part => part.length > 0);
}

function getDir(pathParts, root = fileSystem) {
    return pathParts.reduce((dir, part) => dir && dir[part], root);
}
