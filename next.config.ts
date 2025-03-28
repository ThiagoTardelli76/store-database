/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Habilita exportação estática
  images: {
    unoptimized: true, // Evita problemas com imagens no GitHub Pages
  },
  basePath: "/thiagotardelli76.github.io", // Substitua pelo nome exato do seu repositório
  assetPrefix: "/thiagotardelli76.github.io",
};

module.exports = nextConfig;