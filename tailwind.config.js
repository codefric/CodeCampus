// tailwind.config.ts

export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './content/**/*.md',
        './nuxt.config.{js,ts}',
        './content/**/*.md',
    ],
    fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
    },
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '100%',
                        color: 'inherit',
                        a: {
                            color: '#3182ce',
                            '&:hover': {
                                color: '#2c5282',
                            },
                        },
                        'h1,h2,h3,h4': {
                            color: 'inherit',
                            fontWeight: '600',
                        },
                        code: {
                            color: 'inherit',
                            padding: '0.2em 0.4em',
                            backgroundColor: 'rgb(31 41 55 / 0.05)',
                            borderRadius: '0.25rem',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
