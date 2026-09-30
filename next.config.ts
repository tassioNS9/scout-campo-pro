import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.SUPABASE_URL?.split("://")[1]}`,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Defina o tamanho mÃ¡ximo desejado (ex: 5mb, 10mb)
    },
  },
};

export default nextConfig;
