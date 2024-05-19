// /js/main.js

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
