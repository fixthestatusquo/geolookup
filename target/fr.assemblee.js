const fs = require("fs");
const path = require("path");

/*
alternative source (official)

http://data.assemblee-nationale.fr/static/openData/repository/16/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip
in 

  "depute": {
    "id": 1,
    "nom": "Thibault Bazin",
    "nom_de_famille": "Bazin",
    "prenom": "Thibault",
    "sexe": "H",
    "date_naissance": "1984-10-27",
    "lieu_naissance": "Nancy (Meurthe-et-Moselle)",
    "num_deptmt": "54",
    "nom_circo": "Meurthe-et-Moselle",
    "num_circo": 4,
    "mandat_debut": "2022-06-22",
    "groupe_sigle": "LR",
    "parti_ratt_financier": "Les Républicains",
    "profession": "Autre cadre (secteur privé)",
    "place_en_hemicycle": "109",
    "url_an": "https://www2.assemblee-nationale.fr/deputes/fiche/OMC_PA642847",
    "id_an": "642847",
    "slug": "thibault-bazin",
    "url_nosdeputes": "https://www.nosdeputes.fr/thibault-bazin",
    "url_nosdeputes_api": "https://www.nosdeputes.fr/thibault-bazin/json",
    "nb_mandats": 0,
    "twitter": "thibault_bazin"
  }
}

 out


[
  {
    "externalId": "",
    "name": "Sanae Abdi",
    "email": "",
    "area": "NW",
    "field": {
      "gender": "F",
      "party": "SPD",
      "salutation": "Sehr geehrte Frau Abdi",
      "constituency": 93,
      "sort": "abdi sanae"
    }


*/

const writeTarget = (filename, data) => {
  const file= path.resolve(__dirname, filename + ".json");
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
};


const readTarget = (targetName) => {
  const fileName = path.resolve(__dirname, targetName + ".json");
  const target = JSON.parse(fs.readFileSync(fileName));
  return target;
};

const transform = (d) => {
  return {
    externalId: "an_" + d.id_an,
    name: d.nom,
    email: d.emails[0].email,
    area: d.num_deptmt,
    field: {
      lang: 'fr',
      gender: d.sexe === "H" ? "M" : d.sexe,
      party: d.parti_ratt_financier,
      last_name: d.nom_de_famille,
      avatar: 'https://www2.assemblee-nationale.fr/static/tribun/16/photos/carre/'+d.id_an+'.jpg',
      constituency: d.num_deptmt.toString().padStart(2, '0') + d.num_circo.toString().padStart(2, '0'),
      screen_name: d.twitter,
      sort: d.nom_de_famille.toLowerCase() + " " + d.prenom.toLowerCase(),
    },
  };
};

(async () => {
  const source = readTarget("fr.nodeputes");
  const out = source.deputes.map((d) => transform(d.depute));
  const file =writeTarget("fr_deputes", out);
console.log("generated",file);
})();
