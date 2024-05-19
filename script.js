document.addEventListener('DOMContentLoaded', () => {
  const prompt = document.getElementById('prompt');
  const userInput = document.getElementById('user-input');
  const hiddenInput = document.getElementById('hidden-input');
  const output = document.getElementById('output');

  const commands = {
    "help": {
      description: "Lists all available commands",
      action: function() {
        const commandList = Object.keys(commands).join(', ');
        displayOutput(`Available commands: ${commandList}`);
      }
    },
    "greet": {
      description: "Greets the user",
      action: function() {
        displayOutput("Hello, user!");
      }
    }
  };

  hiddenInput.addEventListener('input', (e) => {
    userInput.textContent = hiddenInput.value;
  });

  hiddenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const input = hiddenInput.value.trim();
      const command = commands[input];
      
      displayOutput(`$ ${input}`);

      if (command) {
        command.action();
      } else {
        displayOutput(`An error occurred: command not found. Type 'help' for a list of all commands.`);
      }

      hiddenInput.value = '';
      userInput.textContent = '';
      event.preventDefault();  // Prevent form submission
    }
  });

  function displayOutput(text) {
    const newOutput = document.createElement('div');
    newOutput.textContent = text;
    output.appendChild(newOutput);
  }
});
