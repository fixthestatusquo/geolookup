const csv = require('csv-parser')
const fs = require('fs');
const { Transform } = require('stream');


const headers="country,postalcode,name,admin_name1,admin_code1,admin_name2,admin_code2,admin_name3,admin_code3,latitude,longitude,accuracy".split(",");

let first = true;
const postalcodes={};

const simplify = new Transform({
//	readableObjectMode: true,
	writableObjectMode: true,
	transform: (d, encoding, callback) => {
	  let r='';
	  first ? first=false: r='\n,';
	  callback(false,r+'"'+d.postalcode + '":'+JSON.stringify({name:d.name,code1:d.admin_code1}));
	}
});

exports.jsonify = (iso) => {
   const filename=iso+".txt";
   const file = fs.createReadStream('./data/'+filename);
   const json = './data/'+iso+".json";
const results = [];
 file.pipe(csv({separator: '\t', headers:headers }))
  //.on('data', (d) => {postalcodes[d.postalcode]=d.name})
  .on('data', (d) => {console.log(d);postalcodes[d.postalcode]={name:d.name,area:d.admin_code1}})
  .on('end', () => {
    console.log(postalcodes);
    fs.writeFileSync(json, JSON.stringify(postalcodes));
    console.log("close json");
  })
//  .pipe(json)
}
