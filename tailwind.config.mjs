/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                notebook: {
                    base: '#fdfcfb',
                    grid: '#f7f3f0',
                    decor: '#e8e2dd',
                    ink: '#3a3430',
                    secondary: '#736b63',
                    interactive: '#b56d4d',
                    accent: '#7b8c7c'
                }
            },
            fontFamily: {
                body: ['"Inter"', 'sans-serif'],
                heading: ['"Outfit"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            backgroundImage: {
                'page-texture': "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
