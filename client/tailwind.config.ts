module.exports = {
  content: [
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        lato: ['Lato', 'sans-serif'],
        fondamento: ['Fondamento', 'cursive'],
        parisienne: ['Parisienne', 'cursive'],
        artifika: ['Artifika', 'serif'],
      },
    },
  },

  plugins: [require('daisyui')],
};
