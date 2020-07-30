const fs = require("fs");
const https = require("https");
const unzipper = require("unzipper");

exports.download = (iso) => {
	const filename=iso+".zip";
	const file = fs.createWriteStream("./data/"+filename);

	https.get("https://download.geonames.org/export/zip/"+filename, response => {
	  var stream = response.pipe(file);

	  stream.on("finish", function() {
	    console.log("done");
	  });
	});
}

exports.unzip = (iso) => {
	const filename=iso+".zip";
   const file = fs.createReadStream('./data/'+filename)
  .pipe(unzipper.Extract({ path: './data' }));
}
