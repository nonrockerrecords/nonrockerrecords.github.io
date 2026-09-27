import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile('artwork/manifest.json','utf8'));
const accepted=JSON.parse(await fs.readFile('artwork/accepted.json','utf8'));
for(const source of accepted){
 const asset=manifest.assets.find(a=>a.slug===source.slug);if(!asset)throw Error('Unknown asset '+source.slug);
 const out=path.resolve(asset.target);await fs.mkdir(path.dirname(out),{recursive:true});
 const original=out.replace('.webp','.png');await fs.copyFile(source.path,original);
 await sharp(original).resize({width:1680,withoutEnlargement:true}).webp({quality:84,effort:5}).toFile(out);
 if(source.slug==='forest-arrival')await sharp(original).resize(800,1120,{fit:'cover',position:'right'}).webp({quality:84}).toFile(out.replace('.webp','-mobile.webp'));
 asset.status='copied';asset.source=source.path;asset.review=source.review;asset.bytes=(await fs.stat(out)).size;
}
await fs.writeFile('artwork/manifest.json',JSON.stringify(manifest,null,2));
for(const [dir,slug] of [['.','forest-arrival'],['../field-guide','field-campsite'],['../surreal','surreal-camp']]){
 if(accepted.some(a=>a.slug===slug))await sharp(`${dir}/assets/generated/${slug}.png`).resize(1200,630,{fit:'cover'}).jpeg({quality:86}).toFile(`${dir}/assets/generated/social-preview.jpg`);
}
console.log('Optimized '+accepted.length+' accepted production images.');
