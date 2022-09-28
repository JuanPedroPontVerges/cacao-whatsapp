/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'completed-tasks': "url('/assets/tareas-completas.png')",
                'pink-decoration': "url('/assets/decoracion-rosa.png')",
                'about-us-banner': "url('/assets/about-us-banner.png')",
                'form': "url('/assets/fondo-form.png')",
            },
            colors: {
                'c-grey': 'rgba(52, 50, 82, 0.5)',
                'c-blue': '#27253b',
                'c-yellow': '#f06e19'
            },
        }
    },
    plugins: [],
}