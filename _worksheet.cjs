const fs = require('fs');
const txt = fs.readFileSync('app/src/poc/data/poc_docfap/kpi_benefits_layer2.ts', 'utf8');
const kpiRe = /id:\s*'([^']*)',\s*beneficio_label:\s*'((?:[^'\\]|\\.)*)',\s*label_utente:[\s\S]*?categoria_beneficio:\s*'((?:[^'\\]|\\.)*)',\s*metodo_valorizzazione:\s*'([^']*)',\s*variables:\s*\[([\s\S]*?)\],\s*formula:/g;
const varRe = /\{\s*var_name:\s*'([^']*)',\s*description:\s*'((?:[^'\\]|\\.)*)',\s*table:\s*'([^']*)',\s*code:\s*'([^']*)',\s*val_check:\s*([^,]+),\s*label_utente:\s*'((?:[^'\\]|\\.)*)'/g;

// key = description||code  → aggregate context
const agg = new Map();
let k;
while ((k = kpiRe.exec(txt))) {
  const [, kpiId, benLabel, cat, metodo, block] = k;
  let v;
  while ((v = varRe.exec(block))) {
    if (v[3] !== 'fixed_params' && v[3] !== 'monetization_factors') continue;
    const desc = v[2].trim(), code = v[4], val = v[5].trim(), curLabel = v[6];
    const key = desc + ' @@ ' + code;
    if (!agg.has(key)) agg.set(key, { desc, code, table: v[3], val, curLabel, metodi: new Set(), cats: new Set(), exBen: benLabel, n: 0 });
    const a = agg.get(key);
    a.metodi.add(metodo); a.cats.add(cat); a.n++;
  }
  varRe.lastIndex = 0;
}

const isSymbol = s => { s = s.trim(); return s.length <= 4 || /^[A-Za-zα-ωΑ-Ω_Δεαβγδ][A-Za-z0-9_α-ωΑ-Ω.]*$/.test(s); };
const rows = [...agg.values()].filter(a => isSymbol(a.desc)).sort((a, b) => [...a.metodi][0].localeCompare([...b.metodi][0]) || a.desc.localeCompare(b.desc));
const out = rows.map(a =>
  [a.desc, a.code, a.table === 'monetization_factors' ? 'MF' : 'FP', a.val, a.n, [...a.metodi].join('/'), [...a.cats].slice(0, 2).join(' ; '), 'CUR=' + a.curLabel, 'EX=' + a.exBen].join('\t')
);
fs.writeFileSync('_worksheet.tsv', 'DESC\tCODE\tTAB\tVAL\tN\tMETODO\tCATEGORIE\tCUR_LABEL\tEX_KPI\n' + out.join('\n'), 'utf8');
console.log('simboli FP/MF distinti (desc@code):', rows.length, '→ _worksheet.tsv');
