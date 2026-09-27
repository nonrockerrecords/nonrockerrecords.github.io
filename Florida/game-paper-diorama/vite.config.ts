import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
export default defineConfig({base:'./',build:{target:'es2022',outDir:'dist',assetsInlineLimit:0,rollupOptions:{input:{game:resolve(root,'index.html'),level2:resolve(root,'level2-preview.html')}}},server:{host:'127.0.0.1',port:8791,strictPort:true}});
