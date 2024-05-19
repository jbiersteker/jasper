// /js/filesystem.js

let fileSystem = {};
let cwd = ['home', 'guest'];
let isSudo = false;

// Function to initialize the file system from GitHub
async function initializeFileSystem() {
    const response = await fetch('https://raw.githubusercontent.com/jhbiersteker/site/main/site_files/home/guest/file-system.json');
    if (response.ok) {
        fileSystem = await response.json();
        console.log('File system initialized:', fileSystem);
    } else {
        console.error('Failed to initialize file system');
    }
}

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
