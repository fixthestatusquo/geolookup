const fs = require("fs");
const path = require("path");
const https = require("https");
const unzipper = require("unzipper");

exports.download = async (iso) => {
  return new Promise((resolve, reject) => {
    const filename = iso.toUpperCase() + ".zip";
    const file = fs.createWriteStream("./data/" + filename);

    https.get(
      "https://download.geonames.org/export/zip/" + filename,
      (response) => {
        var stream = response.pipe(file);

        stream.on("finish", function () {
          resolve(filename);
        });
      }
    );
  });
};

exports.unzip = async (iso) => {
  const filename = iso.toUpperCase() + ".zip";
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream("./data/" + filename);
    const out = fs.createWriteStream("./data/" + iso.toUpperCase() + ".txt");

    file
      .pipe(unzipper.Parse())
      .on("entry", function (entry) {
        const fileName = entry.path;
        const type = entry.type; // 'Directory' or 'File'
        const size = entry.vars.uncompressedSize; // There is also compressedSize;
        console.log(fileName);
        if (fileName === iso.toUpperCase() + ".txt") {
          entry.pipe(out);
        } else {
          entry.autodrain();
        }
      })
      .on("finish", () => {
        console.log("finish");
        resolve(path.basename(__dirname) + "/data");
      });
  });
};
