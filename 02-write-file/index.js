const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');

const outputStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Enter your text (or write "exit" to leave):');

readlineInterface.on('line', (input) => {
  if (input.toString().toLowerCase().trim() === 'exit') {
    readlineInterface.close();
  } else {
    outputStream.write(input + os.EOL);
  }
});

readlineInterface.on('close', () => {
  console.log('Finishing writing, exiting the program.');
  outputStream.close();
});

process.on('SIGINT', () => {
  readlineInterface.close();
  outputStream.close();
});
