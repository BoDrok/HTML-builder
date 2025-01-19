const fs = require('node:fs').promises;
const path = require('node:path');

(async () => {
  const sourceDirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');

  await fs.rm(copyDirPath, { recursive: true, force: true });
  await fs.mkdir(copyDirPath, { recursive: true });

  const files = await fs.readdir(sourceDirPath, {
    withFileTypes: true,
  });

  for (const file of files) {
    if (file.isFile()) {
      const sourceFilePath = path.join(sourceDirPath, file.name);
      const copyFilePath = path.join(copyDirPath, file.name);
      await fs.copyFile(sourceFilePath, copyFilePath);
    }
  }
})();
