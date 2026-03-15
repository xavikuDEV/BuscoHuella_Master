import "@/app/globals.css";

// 🛡️ El RootLayout en un entorno con [locale] solo debe pasar los hijos.
// Las etiquetas <html> y <body> deben vivir EXCLUSIVAMENTE en src/app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
