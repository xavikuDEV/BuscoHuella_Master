// apps/web-pro/src/app/[locale]/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { SYSTEM_NAME } from "@buscohuella/shared";
import "../globals.css"; // Ajustamos la ruta relativa al estar ahora dentro de [locale]

// 1. Configuración de Fuentes
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Metadatos Institucionales (SEO & Branding)
export const metadata = {
  title: `${SYSTEM_NAME} PRO - Infraestructura de Bienestar Animal`,
  description:
    "Plataforma de gestión operativa para ayuntamientos, fuerzas de seguridad y ciudadanos.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Mantenemos la promesa para Next.js 15/16
}) {
  // 3. Esperamos los parámetros de la URL
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-slate-950 
          text-slate-50 
          selection:bg-emerald-500/30 
          selection:text-emerald-200
        `}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
