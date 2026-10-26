import fs from 'node:fs';
const assets=JSON.parse(fs.readFileSync('assets.json','utf8'));
const tokens=JSON.parse(fs.readFileSync('tokens.json','utf8'));
let src=fs.readFileSync('src.html','utf8');

// CSS variables generated from tokens
function flat(o,path,out){for(const k in o){const v=o[k];if(v&&typeof v==='object'){if('value' in v&&typeof v.value==='string')out[[...path,k].join('-')]=v.value;else flat(v,[...path,k],out)}}return out}
const vars={...flat(tokens.color,['color'],{})};
for(const k in tokens.spacing)vars['space-'+k]=tokens.spacing[k];
for(const k in tokens.radius)vars['radius-'+k]=tokens.radius[k];
for(const k in tokens.shadow)vars['shadow-'+k]=tokens.shadow[k];
const root=':root{'+Object.entries(vars).map(([k,v])=>`--${k}:${v}`).join(';')+'}';
const hc='html[data-contrast=high]{'+Object.entries(tokens.theme.highContrast).map(([k,v])=>`--${k.replace(/\./g,'-')}:${v}`).join(';')+';--color-border-strong:#4A4A4A}';
src=src.replace('/*__CSSVARS__*/',root+'\n'+hc);
src=src.replace('/*__ASSETS__*/null',JSON.stringify(assets));
src=src.replace('/*__TOKENS__*/null',JSON.stringify(tokens));
fs.mkdirSync('dist/assets/icons',{recursive:true});fs.mkdirSync('dist/assets/illustrations',{recursive:true});
fs.writeFileSync('dist/index.html',src);
fs.writeFileSync('dist/tokens.json',JSON.stringify(tokens,null,2));
const wrap=i=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${i}</svg>\n`;
for(const [n,i] of Object.entries(assets.icons))fs.writeFileSync(`dist/assets/icons/${n}.svg`,wrap(i));
for(const [n,s] of Object.entries(assets.illustrations))fs.writeFileSync(`dist/assets/illustrations/${n}.svg`,s+'\n');
fs.writeFileSync('dist/assets/logo.svg',assets.logo+'\n');
console.log('built',Object.keys(assets.icons).length,'icons,',Object.keys(assets.illustrations).length,'illustrations');
