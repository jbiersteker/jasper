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

function addDir(path) {
    const pathParts = getPathParts(path);
    const dirName = pathParts.pop();
    const parentDir = getDir(pathParts);
    if (parentDir[dirName]) {
        return `Directory ${dirName} already exists.`;
    }
    parentDir[dirName] = {};
    return `Directory ${dirName} created.`;
}

function addFile(path) {
    const pathParts = getPathParts(path);
    const fileName = pathParts.pop();
    const parentDir = getDir(pathParts);
    if (parentDir[fileName]) {
        return `File ${fileName} already exists.`;
    }
    parentDir[fileName] = '';
    return `File ${fileName} created.`;
}

function removeDir(path) {
    const pathParts = getPathParts(path);
    const dirName = pathParts.pop();
    const parentDir = getDir(pathParts);
    if (!parentDir || !parentDir[dirName]) {
        return `Directory ${dirName} does not exist.`;
    }
    if (dirName === 'home') {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    }
    delete parentDir[dirName];
    return `Directory ${dirName} removed.`;
}

function removeFile(path) {
    const pathParts = getPathParts(path);
    const fileName = pathParts.pop();
    const parentDir = getDir(pathParts);
    if (!parentDir || !parentDir[fileName]) {
        return `File ${fileName} does not exist.`;
    }
    delete parentDir[fileName];
    return `File ${fileName} removed.`;
}

function moveDir(src, dest) {
    const srcParts = getPathParts(src);
    const destParts = getPathParts(dest);
    const dirName = srcParts.pop();
    const srcParentDir = getDir(srcParts);
    const destParentDir = getDir(destParts);
    if (!srcParentDir || !srcParentDir[dirName]) {
        return `Directory ${dirName} does not exist.`;
    }
    if (destParentDir[dirName]) {
        return `Directory ${dirName} already exists in the destination.`;
    }
    destParentDir[dirName] = srcParentDir[dirName];
    delete srcParentDir[dirName];
    return `Directory ${dirName} moved to ${dest}.`;
}

function moveFile(src, dest) {
    const srcParts = getPathParts(src);
    const destParts = getPathParts(dest);
    const fileName = srcParts.pop();
    const srcParentDir = getDir(srcParts);
    const destParentDir = getDir(destParts);
    if (!srcParentDir || !srcParentDir[fileName]) {
        return `File ${fileName} does not exist.`;
    }
    if (destParentDir[fileName]) {
        return `File ${fileName} already exists in the destination.`;
    }
    destParentDir[fileName] = srcParentDir[fileName];
    delete srcParentDir[fileName];
    return `File ${fileName} moved to ${dest}.`;
}

function duplicateDir(src, dest) {
    const srcParts = getPathParts(src);
    const destParts = getPathParts(dest);
    const dirName = srcParts.pop();
    const srcParentDir = getDir(srcParts);
    const destParentDir = getDir(destParts);
    if (!srcParentDir || !srcParentDir[dirName]) {
        return `Directory ${dirName} does not exist.`;
    }
    if (destParentDir[dirName]) {
        return `Directory ${dirName} already exists in the destination.`;
    }
    destParentDir[dirName] = JSON.parse(JSON.stringify(srcParentDir[dirName]));
    return `Directory ${dirName} duplicated to ${dest}.`;
}

function duplicateFile(src, dest) {
    const srcParts = getPathParts(src);
    const destParts = getPathParts(dest);
    const fileName = srcParts.pop();
    const srcParentDir = getDir(srcParts);
    const destParentDir = getDir(destParts);
    if (!srcParentDir || !srcParentDir[fileName]) {
        return `File ${fileName} does not exist.`;
    }
    if (destParentDir[fileName]) {
        return `File ${fileName} already exists in the destination.`;
    }
    destParentDir[fileName] = srcParentDir[fileName];
    return `File ${fileName} duplicated to ${dest}.`;
}

function readFile(path) {
    const pathParts = getPathParts(path);
    const fileName = pathParts.pop();
    const parentDir = getDir(pathParts);
    if (!parentDir || !parentDir[fileName]) {
        return `File ${fileName} does not exist.`;
    }
    return parentDir[fileName];
}

function writeFile(path, content) {
    const pathParts = getPathParts(path);
    const fileName = pathParts.pop();
    const parentDir = getDir(pathParts);
    if (!parentDir || !parentDir[fileName]) {
        return `File ${fileName} does not exist.`;
    }
    parentDir[fileName] = content;
    return `File ${fileName} written.`;
}

function applyTheme(theme) {
    const link = document.getElementById('theme-link');
    link.href = `themes/${theme}.css`;
    return `Theme switched to ${theme}.`;
}

const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

function prompt() {
    return `<blue>~/${cwd.slice(2).join('/')}</blue>$ `;
}

function executeCommand(command, args) {
    if (args.includes('--help')) {
        term.echo(commandDefinitions[command].description);
    } else if (commandDefinitions[command]) {
        if (isSudo || !['rm', 'mv', 'cp', 'write'].includes(command)) {
            commandDefinitions[command].execute(args);
        } else {
            term.error(`Permission denied: ${command}`);
        }
    } else {
        term.error(`Command "${command}" not found.`);
    }
}

function startTerminal() {
    const term = $('body').terminal((command, term) => {
        const [cmd, ...args] = command.split(' ');
        executeCommand(cmd, args);
    }, {
        greetings: "Welcome to my Terminal Portfolio",
        checkArity: false,
        exit: false,
        completion(string) {
            const cmd = this.get_command();
            const { name, rest } = $.terminal.parse_command(cmd);
            const currentDir = getCurrentDir();
            if (['cd', 'ls'].includes(name)) {
                if (typeof currentDir === 'object') {
                    return Object.keys(currentDir);
                }
            }
            return Object.keys(commandDefinitions);
        },
        prompt
    });

    term.on('click', '.command', function() {
        const command = $(this).text();
        term.exec(command);
    });

    term.on('click', '.directory', function() {
        const dir = $(this).text();
        term.exec(`cd ${dir}`);
    });

    $.terminal.xml_formatter.tags.green = (attrs) => `[[;#44D544;]`;
    $.terminal.xml_formatter.tags.blue = (attrs) => `[[;#55F;;${attrs.class}]`;
}
