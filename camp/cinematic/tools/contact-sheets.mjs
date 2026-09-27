import fs from 'node:fs/promises';
import sharp from 'sharp';
const files=(await fs.readdir('verification/screenshots')).filter(f=>f.endsWith('.png')&&!f.startsWith('review-'));
for(let start=0;start<files.length;start+=6){
 const selected=files.slice(start,start+6),overlays=[];
 for(let i=0;i<selected.length;i++){
  const name=selected[i];const input=await sharp('verification/screenshots/'+name).resize({width:360,height:1100,fit:'inside'}).png().toBuffer();
  overlays.push({input,top:38,left:i*375});
  const label=Buffer.from(`<svg width="370" height="32"><rect width="370" height="32" fill="#ffffff"/><text x="6" y="21" font-family="Arial" font-size="12">${name.replace('.png','')}</text></svg>`);
  overlays.push({input:label,top:0,left:i*375});
 }
 await sharp({create:{width:2250,height:1150,channels:3,background:'#cccccc'}}).composite(overlays).jpeg({quality:85}).toFile(`verification/review-${start/6+1}.jpg`);
}
for(const file of ['cinematic-index-1440.png','field-guide-index-1440.png','surreal-index-1440.png']){
 await sharp('verification/screenshots/'+file).extract({left:0,top:0,width:1440,height:1000}).jpeg({quality:90}).toFile('verification/'+file.replace('.png','-top.jpg'));
}
console.log('Created visual review sheets.');
