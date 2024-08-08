import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

await fs.promises.rm('build', {
  force: true,
  recursive: true
});

const isProduction = process.env.NODE_ENV === 'production';
const isWatchMode = process.env.WATCH === 'true';

await build({
  entryPoints: [ path.join('src', 'main.ts') ],

  assetNames: '[name]-[hash]',
  chunkNames: '[ext]/[name]-[hash]',
  outdir: '.',

  bundle: true,
  minify: isProduction,
  sourcemap: isProduction ? false : 'inline',
  platform: 'node',
  target: [ 'node20' ],
  logLevel: 'info',
  watch: isWatchMode,

  plugins: []
});
