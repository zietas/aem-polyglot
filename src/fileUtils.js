const fs = require('fs');

async function readFile (path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

async function writeFile (path, content, options) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, options, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

module.exports = {
  readFile: readFile,
  writeFile: writeFile
};
