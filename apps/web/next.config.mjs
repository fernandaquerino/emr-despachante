/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@emr/ui"],
  images: {
    // Sem `remotePatterns`: toda imagem da área pública é versionada em
    // `public/images`. Hotlink de banco de imagem é ponto único de falha
    // visual e vazamento de referer para terceiro (ADR-017).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
