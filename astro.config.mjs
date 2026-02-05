import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: 'https://chiperman.github.io',
    base: '/agent-skills',
    integrations: [tailwind()],
    server: {
        host: true
    },
    build: {
        format: 'file',
        assets: '_astro',
        inlineStylesheets: 'always'
    }
});
