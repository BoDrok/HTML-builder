const fs = require('node:fs').promises;
const path = require('node:path');
const os = require('node:os');

const stylesFolder = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'project-dist', 'style.css');
const assetsSrcPath = path.join(__dirname, 'assets');
const assetsDestPath = path.join(__dirname, 'project-dist', 'assets');

async function pathExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src, {
    withFileTypes: true,
  });

  for (let file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function clearDir(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (file) => {
      const currentPath = path.join(directory, file.name);
      try {
        if (file.isDirectory()) {
          await clearDir(currentPath);
          await fs.rm(currentPath, { recursive: true, force: true });
        } else {
          await fs.unlink(currentPath);
        }
      } catch (err) {
        console.error(err);
      }
    }),
  );
}

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesFolder);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    let styles = '';
    for (const file of cssFiles) {
      const filePath = path.join(stylesFolder, file);
      const data = await fs.readFile(filePath, 'utf8');
      styles += data + os.EOL;
    }

    await fs.writeFile(outputFilePath, styles);
  } catch (err) {
    console.error(err.message);
  }
}

async function main() {
  try {
    const distDir = path.join(__dirname, 'project-dist');
    if (await pathExists(distDir)) {
      await clearDir(distDir);
    }
    await fs.mkdir(distDir, { recursive: true });

    const templatePath = path.join(__dirname, 'template.html');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    const componentsDir = path.join(__dirname, 'components');
    const componentFiles = await fs.readdir(componentsDir);

    const replacePromises = componentFiles
      .filter((file) => path.extname(file) === '.html')
      .map(async (file) => {
        const name = path.basename(file, '.html');
        const componentContent = await fs.readFile(
          path.join(componentsDir, file),
          'utf-8',
        );
        const regex = new RegExp(`{{${name}}}`, 'g');
        return { regex, componentContent };
      });

    const replacements = await Promise.all(replacePromises);

    for (const { regex, componentContent } of replacements) {
      templateContent = templateContent.replace(regex, componentContent);
    }

    const indexPath = path.join(distDir, 'index.html');

    await fs.writeFile(indexPath, templateContent);
    await mergeStyles();
    await copyDir(assetsSrcPath, assetsDestPath);
  } catch (err) {
    console.error(err);
  }
}

main();
