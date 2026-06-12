const XLSX = require('./app/node_modules/xlsx');
const IA = 'progetto muba/IA scenario 976.xlsx';
function sheet(file,name){const rows=XLSX.utils.sheet_to_json(XLSX.readFile(file).Sheets[name],{header:1,defval:null});const h=rows[0];return rows.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])));}

// distinct sectors with codes
const prod = sheet(IA,'production');
const secs = {};
for(const r of prod){ secs[r.sec_cod] = r.sec_des; }
console.log('SECTORS ('+Object.keys(secs).length+'):');
Object.entries(secs).forEach(([c,d])=>console.log('  ',c,d));

// look for tax sector
console.log('\nTAX-like sectors:');
Object.entries(secs).filter(([c,d])=>/tass|impost|fiscal/i.test(d)).forEach(([c,d])=>console.log('  ',c,d));

// metadata kpi field?
const meta = sheet(IA,'metadata');
console.log('\nMETADATA:', JSON.stringify(meta));
