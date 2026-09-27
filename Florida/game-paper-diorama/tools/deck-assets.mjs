import sharp from 'sharp';
for(const slug of ['possum','chihuahua','noodle','crystal','iguana','flamingo','bass-possum','boombox','putt-putt','putter','raccoon','multitool']){
  await sharp(`artwork/deck-masters/${slug}.png`).resize({width:900}).webp({quality:88}).toFile(`public/assets/cards/${slug}.webp`);
  console.log(slug,'optimized');
}
