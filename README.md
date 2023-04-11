This is to create a geolookup api postalcode->city name on cloudflare worker

It does download the list of data from the wonderful geonames site and build an optimised js worker

## the german case
bit of voodoo to add the constituency in germany

q ' select `﻿Wahlkreis-Nr` as constituency, `PLZ-GemVerwaltung` as postcode from  20200415_btw21_wkr_gemeinden_utf8.csv group by postcode' -d\; -H -O --as-text | sed -e 's/,/\t/g' > data/DE.constituencies.txt

#q 'select c4 as constituency, c6 as postcode, c5 as name from data/BTW20214Q2020.csv where postcode is not "" group by postcode' -O -d,  --as-text | sed -e 's/,/\t/g' > data/DE.constituencies.txt

mv data/DE.txt data/DE.postalcode.txt
q 'select p.*, c.c1 from data/DE.postalcode.txt p left join data/DE.constituencies.txt c on c.c2=p.c2' -t   --as-text > data/DE.txt

$node src/jsonify.js DE

https://workflow.proca.app/workflow/43
