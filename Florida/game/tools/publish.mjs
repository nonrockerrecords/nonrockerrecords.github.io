import {cpSync, existsSync, renameSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const sourceEntry = join(dist, 'index.source.html');
if (existsSync(sourceEntry)) renameSync(sourceEntry, join(dist, 'index.html'));
if (!existsSync(join(dist, 'index.html'))) throw new Error('Run npm run build first.');
if (!process.argv.includes('--prepare')) {
  cpSync(join(dist, 'assets'), join(root, 'assets'), {recursive:true});
  cpSync(join(dist, 'index.html'), join(root, 'index.html'));
  console.log('Published browser build to Florida/game/index.html and assets/. Commit both to deploy.');
}
