const geoname =require ('./src/download.js');
const csv = require ('./src/jsonify.js');

var args = process.argv.slice(2);

if (!args[0]) 
  process.exit(console.error("syntax: $node index.js {COUNTRY_ISO}"));
console.log('country: ', args[0]);

//await geoname.download (args[0]);
//await geoname.unzip (args[0]);
await csv.jsonify (args[0]);
