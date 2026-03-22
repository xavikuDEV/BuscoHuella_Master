import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BuscoHuella | DUA",
  description: "Sistema Operativo de Bienestar Animal",
};

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // En Next.js 16, params es una Promise
  const { locale } = await props.params;

  return (
    <main data-locale={locale} className="min-h-screen">
      {props.children}
    </main>
  );
}
