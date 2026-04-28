// apps/web-pro/src/app/[locale]/(marketing)/layout.tsx
// Zona Pública: Landing, Precios, Contacto — Sin sidebar.

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 🌐 Navbar público — implementar cuando exista el componente */}
      <main>{children}</main>
      {/* 🦶 Footer público — implementar cuando exista el componente */}
    </>
  );
}
