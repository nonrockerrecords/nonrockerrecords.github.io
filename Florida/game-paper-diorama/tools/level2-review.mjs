import sharp from 'sharp';
import {fileURLToPath} from 'node:url';

const root = new URL('../', import.meta.url);
const asset = name => new URL(`artwork/level-2-masters/${name}.png`, root);
const sized = (name, width, height) => sharp(fileURLToPath(asset(name))).resize({width, height, fit:'inside'}).png().toBuffer();

const [clubhouse, windmill, serpent] = await Promise.all([
  sized('vortex-putt-putt-clubhouse', 1050, 600),
  sized('crooked-windmill-obstacle', 340, 510),
  sized('fiberglass-sea-serpent', 870, 430)
]);
const slab = Buffer.from('<svg width="1500" height="420"><path d="M80 100 L1380 25 L1480 325 L130 405 Z" fill="#5d655d" stroke="#ece0c2" stroke-width="5" opacity="0.92"/></svg>');

await sharp({create:{width:1600,height:900,channels:4,background:'#143f3d'}})
  .composite([
    {input:slab,left:50,top:445},
    {input:clubhouse,left:420,top:30},
    {input:windmill,left:80,top:250},
    {input:serpent,left:650,top:460}
  ])
  .png()
  .toFile(fileURLToPath(new URL('artwork/level-2-core-review.png', root)));
