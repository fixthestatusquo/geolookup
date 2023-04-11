const fs = require('fs');


const postalcodes={};

exports.workerify = (iso) => {
   const filename=iso.toUpperCase()+".txt";
   const json = './data/'+iso.toUpperCase()+".json";
  const template = './wrangler/template.js';
  const worker = './wrangler/index.js';
  return new Promise((resolve, reject) => {
    console.log("using",json);
    const data = "const postcodes="+fs.readFileSync(json);
    const code = fs.readFileSync(template);
//    const r= fs.writeFileSync(worker,data.replace(/(\r\n|\n|\r)/gm, "") +";\n"+code);
    const r= fs.writeFileSync(worker,data +";\n"+code);
    
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

