import sharp from 'sharp';
import fs from 'node:fs/promises';
for(const name of ['darlene','ron','manager','dj','cheryl','mara']){
  const source=`public/assets/characters/${name}.png`;
  const metadata=await sharp(source).metadata();
  if(!metadata.hasAlpha)throw new Error(`${name}: missing transparency`);
  await sharp(source).resize({height:1200}).webp({quality:90,alphaQuality:100}).toFile(`public/assets/characters/${name}.webp`);
  console.log(name,metadata.width,metadata.height,(await fs.stat(`public/assets/characters/${name}.webp`)).size);
}
