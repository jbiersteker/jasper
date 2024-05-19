// /js/helpers.js

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
