/**
 * TailwindCSS için PostCSS yapılandırması.
 * Next.js, bu dosyayı bulduğunda `app/globals.css` içindeki
 * `@tailwind` direktiflerini derler ve stiller uygulanır.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};


