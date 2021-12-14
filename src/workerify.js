const fs = require('fs');


const postalcodes={};

exports.workerify = (iso) => {
   const filename=iso.toUpperCase()+".txt";
   const json = './data/'+iso.toUpperCase()+".json";
  const template = './wrangler/template.js';
  const worker = './wrangler/index.js';
  return new Promise((resolve, reject) => {
    const data = "const postcodes="+fs.readFileSync(json) +";\n";
    const code = fs.readFileSync(template);
    fs.writeFileSync(worker,data+code);
    
  });
//  .pipe(json)
}

if (require.main === module) {
  var args = process.argv.slice(2);
  if (!args[0])
    process.exit(console.error("syntax: workerify.js {COUNTRY_ISO}"));
  const run = async (country) => {
    await exports.workerify(country);
  };
  run(args[0].toLowerCase());
}

