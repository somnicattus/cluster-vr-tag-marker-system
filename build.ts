import { argv } from 'bun';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const [_exe, _file, flag] = argv;
const minify = flag === '--minify' || flag === '-m';

const source = './scripts';
const destination = '../Assets/Scripts';

// Cleanup
const oldFiles = await readdir(destination);
for (const file of oldFiles) {
  await Bun.file(path.join(destination, file)).delete();
}

// Build
const files = await readdir(source);
const entrypoints = files.map((file) => path.join(source, file));
await Promise.all(
  entrypoints.map((entrypoint) =>
    Bun.build({ entrypoints: [entrypoint], outdir: destination, minify }),
  ),
);
