// /js/commands.js

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
    "touch": {
        "description": "Create an empty file.",
        "execute": function(args) {
            term.echo(addFile(args[0]));
        }
    },
    "mkdir": {
        "description": "Create a directory.",
        "execute": function(args) {
            term.echo(addDir(args[0]));
        }
    },
    "rm": {
        "description": "Remove a file or directory.",
        "execute": function(args) {
            const path = args[0];
            if (path.endsWith('/')) {
                term.echo(removeDir(path.slice(0, -1)));
            } else {
                term.echo(removeFile(path));
            }
        }
    },
    "mv": {
        "description": "Move a file or directory.",
        "execute": function(args) {
            const [src, dest] = args;
            if (src.endsWith('/')) {
                term.echo(moveDir(src.slice(0, -1), dest));
            } else {
                term.echo(moveFile(src, dest));
            }
        }
    },
    "cp": {
        "description": "Copy a file or directory.",
        "execute": function(args) {
            const [src, dest] = args;
            if (src.endsWith('/')) {
                term.echo(duplicateDir(src.slice(0, -1), dest));
            } else {
                term.echo(duplicateFile(src, dest));
            }
        }
    },
    "cat": {
        "description": "Display the contents of a file.",
        "execute": function(args) {
            term.echo(readFile(args[0]));
        }
    },
    "write": {
        "description": "Write content to a file.",
        "execute": function(args) {
            const [path, ...content] = args;
            term.echo(writeFile(path, content.join(' ')));
        }
    },
    "sudo": {
        "description": "Execute a command as superuser.",
        "execute": function(args) {
            isSudo = true;
            const command = args.join(' ');
            term.echo(`Executing with elevated privileges: ${command}`);
            term.exec(command, false, () => {
                isSudo = false;
            });
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
    }
};
