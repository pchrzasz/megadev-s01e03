import { createServer } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
const server = await createServer({ server: {middlewareMode: true}, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('svelte/server');
  const walk = async dir => (await Promise.all((await fs.readdir(dir, {withFileTypes:true})).map(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]))).flat();
  for (const filename of (await walk('src/routes')).filter(f => f.endsWith('+page.svx'))) {
    const mod = await server.ssrLoadModule('/'+filename);
    const out = render(mod.default);
    const head = out.head.replace(/\/\*# sourceMappingURL=[\s\S]*?\*\//g, '');
    const dest = path.join('rendered', path.relative('src/routes',path.dirname(filename)), 'index.html');
    await fs.mkdir(path.dirname(dest), {recursive:true});
    await fs.writeFile(dest, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}</head><body>${out.body}</body></html>`);
    console.log(dest);
  }
} finally { await server.close(); }
