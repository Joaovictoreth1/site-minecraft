import tailwindcss from 'tailwindcss';

export default {
  plugins: [tailwindcss({ content: ['./index.html', './src/**/*.js'] })],
};
