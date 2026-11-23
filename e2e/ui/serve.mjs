import { readFileSync, cpSync, mkdtempSync, symlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';

const source = fileURLToPath(new URL('../../frontend/', import.meta.url));
const root = mkdtempSync('/tmp/weather-footer-source-');
cpSync(source, root, { recursive: true, filter: path => !/(^|\/)(node_modules|dist|\.git)(\/|$)/.test(path) });
symlinkSync(fileURLToPath(new URL('./node_modules/', import.meta.url)), `${root}/node_modules`, 'dir');
const packagePath = `${root}/package.json`;
const metadata = JSON.parse(readFileSync(packagePath, 'utf8'));

// An in-memory metadata substitution exercises a future rebuild without editing application files.
for (const [port, version] of [[5173, metadata.version], [5174, '9.8.7-e2e']]) {
  const outDir = `/tmp/weather-footer-build-${port}`;
  await build({
    root,
    configFile: false,
    define: { 'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://127.0.0.1:5080') },
    plugins: port === 5174 ? [{
      name: 'test-next-package-version',
      enforce: 'pre',
      load(id) {
        if (id === packagePath) return JSON.stringify({ ...metadata, version });
      },
    }] : [],
    build: { outDir, emptyOutDir: true },
  });
  await preview({ root, configFile: false, build: { outDir }, preview: { host: '127.0.0.1', port, strictPort: true } });
}
