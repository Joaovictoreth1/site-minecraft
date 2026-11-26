import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  appType: 'mpa',
  build: { assetsInlineLimit: 0 },
  plugins: [
    {
      name: 'third-party-licenses',
      apply: 'build',
      generateBundle() {
        for (const name of [
          'three',
          '@fontsource/inter',
          '@fontsource/press-start-2p',
        ]) {
          const directory = import.meta.resolve(`${name}/package.json`);
          this.emitFile({
            type: 'asset',
            fileName: `licenses/${name.split('/').at(-1)}.txt`,
            source: readFileSync(new URL('LICENSE', directory)),
          });
        }
      },
    },
  ],
});
