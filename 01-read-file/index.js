const fs = require('node:fs');
const path = require('node:path');

const readStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

readStream.on('error', (error) => {
  console.error('Произошла ошибка при чтении файла: ', error);
});
