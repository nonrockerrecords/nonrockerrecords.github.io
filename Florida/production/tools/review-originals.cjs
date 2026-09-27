const fs = require('fs');
const path = require('path');
const sharp = require('../../../../camp/cinematic/node_modules/sharp');
const root = path.resolve(__dirname, '../..');
const out = path.resolve(__dirname, '../review');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const files = ['Cards', 'characters'].flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.png')).map(f => path.join(root, dir, f)));
  for (let start = 0; start < files.length; start += 4) {
    const composites = [];
    for (let i = start; i < Math.min(start + 4, files.length); i++) {
      const input = await sharp(files[i]).resize(512, 768, {fit:'contain', background:'#202525'}).png().toBuffer();
      composites.push({input, left:((i-start)%2)*512, top:Math.floor((i-start)/2)*768});
    }
    const target = path.join(out, `originals-${start/4+1}.jpg`);
    await sharp({create:{width:1024,height:1536,channels:3,background:'#202525'}}).composite(composites).jpeg({quality:92}).toFile(target);
    console.log(target);
    console.log(files.slice(start,start+4).map(f=>path.basename(f)).join(', '));
  }
})();
