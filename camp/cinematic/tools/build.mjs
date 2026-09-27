import {build} from 'esbuild';
await import('./pages.mjs');
await build({entryPoints:['src/cabinet.mjs','src/arcade.mjs','src/site.mjs'],outdir:'assets/dist',bundle:true,minify:true,format:'esm',splitting:true,target:'es2022',metafile:true,legalComments:'linked'}).then(async r=>{
  const fs=await import('node:fs/promises');
  await fs.writeFile('assets/dist/meta.json',JSON.stringify(r.metafile,null,2));
});
await import('./sync.mjs');
