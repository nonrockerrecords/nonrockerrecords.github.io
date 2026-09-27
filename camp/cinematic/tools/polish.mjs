import fs from 'node:fs/promises';
const file='tools/pages.mjs';let s=await fs.readFile(file,'utf8');
s=s.replace('Good things<br>come to<br>those who<br><span class="script">grab.</span>','Make your<br><span class="script">move.</span>');
s=s.replace('<h3>Your sample store pass.</h3><code>DEMO-CAMP</code>','<h3>Your sample store pass.</h3><div class="ticket-art"><img src="${prefix}assets/generated/store-pass.webp" alt="" loading="lazy"><code>DEMO-CAMP</code></div>');
s=s.replace("${image('machine-surface','Engraved forest-green camp cabinet surface')}","${image('cabinet-preview','The freshly built playable 3D camp claw cabinet')}");
s=s.replace("'machine-surface','Play / 3D'","'cabinet-preview','Play / 3D'");
s=s.replace("'arcade-interior','Play / 2.5D'","'arcade-preview','Play / 2.5D'");
await fs.writeFile(file,s);
