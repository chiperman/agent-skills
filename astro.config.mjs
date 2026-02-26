import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import prepareAssets from './src/integrations/prepare-assets';

// https://astro.build/config
export default defineConfig({
    site: 'https://chiperman.github.io',
    base: '/agent-skills',
    integrations: [tailwind(), prepareAssets()],
    prefetch: true,
    server: {
        host: true
    },
    build: {
        format: 'file',
        assets: '_astro',
        inlineStylesheets: 'always'
    }
});
