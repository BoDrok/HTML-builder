const fs = require('node:fs').promises;
const path = require('node:path');
const os = require('node:os');

const stylesFolder = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

(async () => {
  try {
    const files = await fs.readdir(stylesFolder);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    let styles = '';
    for (const file of cssFiles) {
      const filePath = path.join(stylesFolder, file);
      const data = await fs.readFile(filePath, 'utf8');
      styles += data + os.EOL;
    }

    await fs.writeFile(bundleFile, styles);

    console.log('Styles file create: ".\\project-dist\\bundle.css"');
  } catch (err) {
    console.error(err.message);
  }
})();
