import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [sveltekit()],
        define: {
            STRAPI_URL: env.STRAPI_URL,
            STRAPI_API_TOKEN: env.STRAPI_API_TOKEN,
        }
    }
});