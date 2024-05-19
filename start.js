function showLoadingAnimation(term, callback) {
    const logs = [
        'Loading system files',
        'Initializing modules',
        'Connecting to the server',
        'Fetching user data'
    ];
    let index = 0;

    function log() {
        if (index < logs.length) {
            term.echo(`${logs[index]}...`);
            index++;
            setTimeout(log, 1000);
        } else {
            showProgressBar(term, callback);
        }
    }

    log();
}

function showProgressBar(term, callback) {
    const progressBarLength = 20;
    let progress = 0;

    function updateProgressBar() {
        const bar = '[' + '='.repeat(progress) + ' '.repeat(progressBarLength - progress) + ']';
        term.update(-1, `Loading: ${bar} ${progress * 5}%`);
        if (progress < progressBarLength) {
            progress++;
            setTimeout(updateProgressBar, 200);
        } else {
            showCookiePrompt(term, callback);
        }
    }

    term.echo('Loading: [                    ] 0%');
    updateProgressBar();
}

function showCookiePrompt(term, callback) {
    term.echo('Do you accept cookies? [Y/n]');
    term.push(function(response) {
        response = response.toLowerCase();
        if (response === 'y' || response === 'yes' || response === 'n' || response === 'no') {
            callback();
            term.pop();
        } else {
            term.echo('Please enter Y or n.');
        }
    });
}

$(document).ready(function() {
    const term = $('body').terminal();
    showLoadingAnimation(term, startTerminal);
});
