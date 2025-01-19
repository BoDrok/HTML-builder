const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, './secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err.message);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileExt = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExt}`);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err.message);
          return;
        }

        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
      });
    }
  });
});
