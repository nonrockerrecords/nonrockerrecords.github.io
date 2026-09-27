import sharp from 'sharp';
for (const slug of ['roadside-marquee','roadside-terrazzo','county-citation-paper']) {
  const path=`public/assets/roadside/${slug}`;
  const metadata=await sharp(`${path}.png`).metadata();
  const stats=await sharp(`${path}.png`).stats();
  await sharp(`${path}.png`).resize({width:slug==='roadside-marquee'?1400:1200,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(`${path}.webp`);
  console.log(slug,metadata.width,metadata.height,'alpha:',metadata.hasAlpha,'alpha min:',metadata.hasAlpha?stats.channels.at(-1).min:'none');
}
