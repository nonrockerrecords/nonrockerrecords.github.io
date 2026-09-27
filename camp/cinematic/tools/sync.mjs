import fs from 'node:fs/promises';
for(const lane of ['field-guide','surreal']){
 await fs.mkdir(`../${lane}/assets/dist`,{recursive:true});
 for(const name of ['site.css','claim.js'])await fs.copyFile(`assets/${name}`,`../${lane}/assets/${name}`);
 const css=await fs.readFile(`../${lane}/assets/site.css`,'utf8');await fs.writeFile(`../${lane}/assets/site.css`,css.replace("url('generated/forest-arrival.webp') center/cover",'none'));
 await fs.mkdir(`../${lane}/assets/generated`,{recursive:true});
 await fs.copyFile('assets/generated/store-pass.webp',`../${lane}/assets/generated/store-pass.webp`);
 const files=await fs.readdir('assets/dist');
 for(const file of files.filter(f=>f.startsWith('site.')||f.startsWith('chunk-')))await fs.copyFile(`assets/dist/${file}`,`../${lane}/assets/dist/${file}`);
}
console.log('Synced standalone landing page styles and scripts.');
