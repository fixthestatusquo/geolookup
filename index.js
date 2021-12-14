const geoname =require ('./src/download.js');
const csv = require ('./src/jsonify.js');

var args = process.argv.slice(2);

if (!args[0]) 
  process.exit(console.error("syntax: $node index.js {COUNTRY_ISO}"));
console.log('country: ', args[0]);

const run = async (country) =>{
let r= await geoname.download (country);
console.log("download",r);
r = await geoname.unzip (country);
console.log("unzip",r);
r= await csv.jsonify (country);
console.log("jsonify",r);
};

console.log ("todo: node src/workerify.js "+ country ";cd wrangler;wrangler publish -e "+country);
run(args[0]);
