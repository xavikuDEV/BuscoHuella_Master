import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: any = {
  // Usamos 'any' temporalmente para saltar el error de tipos de la versión Canary

  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
