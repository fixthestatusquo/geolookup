const csv = require("csv-parser");
const fs = require("fs");
const { Transform } = require("stream");

const headers = "country,postalcode,name,admin_name1,admin_code1,admin_name2,admin_code2,admin_name3,admin_code3,latitude,longitude,accuracy,constituency".split(
  ","
);

let first = true;
const postalcodes = {};

const simplify = new Transform({
  //	readableObjectMode: true,
  writableObjectMode: true,
  transform: (d, encoding, callback) => {
    let r = "";
    first ? (first = false) : (r = "\n,");
    if (d.constituency) {
      callback(false,r+'"'+d.postalcode + '":'+JSON.stringify({name:d.name,code1:d.admin_code1, constituency:d.constituency}));
      return;
    }
    callback(false,r+'"'+d.postalcode + '":'+JSON.stringify({name:d.name,code1:d.admin_code1}));
//    callback(false, r + '"' + d.postalcode + '":' + d.name);
  },
});

exports.jsonify = (iso) => {
  const filename = iso.toUpperCase() + ".txt";
  const file = fs.createReadStream("./data/" + filename);
  const json = "./data/" + iso.toUpperCase() + ".json";
  const area = "./data/" + iso.toUpperCase() + ".area.json";
  const areas = {};

  return new Promise((resolve, reject) => {
    file
      .pipe(csv({ separator: "\t", headers: headers }))
      //.on('data', (d) => {postalcodes[d.postalcode]=d.name})
      .on('data', (d) => {
         if (!areas[d.admin_code1])
           areas[d.admin_code1] = d.admin_name1;
         let data={name:d.name,area:d.admin_code1};
         if(d.constituency)
           data.constituency= parseInt(d.constituency,10);
         postalcodes[d.postalcode]=data
      })
      .on("end", () => {
        fs.writeFileSync(json, JSON.stringify(postalcodes,null,2));
        fs.writeFileSync(area, JSON.stringify(areas,null,2));
        resolve({postcodes: Object.keys(postalcodes).length, areas: Object.keys(areas).length});
      });
  });
  //  .pipe(json)
};

if (require.main === module) {
  var args = process.argv.slice(2);
  if (!args[0])
    process.exit(console.error("syntax: $node index.js {COUNTRY_ISO}"));
  const run = async (country) => {
    await exports.jsonify(country);
  };
  run(args[0].toLowerCase());
}
