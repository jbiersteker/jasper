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

function applyTheme(theme) {
    const link = document.getElementById('theme-link');
    link.href = `themes/${theme}.css`;
    return `Theme switched to ${theme}.`;
}

const commandDefinitions = {
    "help": {
        "description": "List available commands.",
        "execute": function(args) {
            const command_list = Object.keys(commandDefinitions).map(cmd => `<white class="command">${cmd}</white>`);
            const help = command_list.join(', ');
            term.echo(`List of available commands: ${help}`);
        }
    },
    "echo": {
        "description": "Echo the input arguments.",
        "execute": function(args) {
            term.echo(args.join(' '));
        }
    },
    "cd": {
        "description": "Change directory.",
        "execute": function(args) {
            const dir = args[0];
            if (!dir || dir === '~') {
                cwd = ['home', 'guest'];
            } else if (dir === '..') {
                if (cwd.length > 2) {
                    cwd.pop();
                }
            } else {
                const pathParts = getPathParts(dir);
                let newDir = (dir.startsWith('/') || dir.startsWith('\\')) ? pathParts : cwd.concat(pathParts);
                if (getDir(newDir)) {
                    cwd = newDir;
                } else {
                    term.error('No such directory');
                }
            }
        }
    },
    "ls": {
        "description": "List contents of the current directory.",
        "execute": function(args) {
            term.echo(listDir(getCurrentDir()));
        }
    },
    "credits": {
        "description": "Show the list of libraries used.",
        "execute": function(args) {
            term.echo([
                '',
                '<white>Used libraries:</white>',
                '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
                ''
            ].join('\n'));
        }
    },
    "sudo": {
        "description": "Execute a command as superuser.",
        "execute": function(args) {
            const [subCommand, ...subArgs] = args;
            switch (subCommand) {
                case 'mkdir':
                    term.echo(addDir(subArgs[0]));
                    break;
                case 'rmdir':
                    term.echo(removeDir(subArgs[0]));
                    break;
                case 'mv':
                    term.echo(moveDir(subArgs[0], subArgs[1]));
                    break;
                case 'cp':
                    term.echo(duplicateDir(subArgs[0], subArgs[1]));
                    break;
                default:
                    term.error('Invalid sudo command.');
            }
        }
    },
    "theme": {
        "description": "Switch the terminal theme.",
        "execute": function(args) {
            const theme = args[0];
            if (fileSystem.home.guest.themes[theme]) {
                term.echo(applyTheme(theme));
            } else {
                term.error('Theme not found.');
            }
        }
    }
};

const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

function prompt() {
    return `<blue>~/${cwd.slice(2).join('/')}</blue>$ `;
}

function executeCommand(command, args) {
    if (args.includes('--help')) {
        term.echo(commandDefinitions[command].description);
    } else if (commandDefinitions[command]) {
        commandDefinitions[command].execute(args);
    } else {
        term.error(`Command "${command}" not found.`);
    }
}

// Terminal Initialization
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
