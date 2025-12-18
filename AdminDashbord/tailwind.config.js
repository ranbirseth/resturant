/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#ef4444', // Adjust to match Zink Zaika branding if known, else standard vibrant red
                    foreground: '#ffffff',
                }
            }
        },
    },
    plugins: [],
}
