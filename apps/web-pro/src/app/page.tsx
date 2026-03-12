import Image from "next/image";
import { SYSTEM_NAME } from "@buscohuella/shared";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-3xl flex-col items-center gap-12 px-8 py-16 sm:items-start">
        {/* Logo con Soporte de Accesibilidad */}
        <header
          role="banner"
          className="w-full flex justify-center sm:justify-start"
        >
          <Image
            className="dark:invert"
            src="/next.svg"
            alt={`${SYSTEM_NAME} Logo`}
            width={180}
            height={37}
            priority
          />
        </header>

        <section className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {/* Título Institucional */}
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bienvenido a la consola{" "}
            <span className="text-emerald-600">{SYSTEM_NAME} PRO</span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Infraestructura crítica para el bienestar animal. El búnker está
            operativo y vinculado al{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
              shared-core
            </code>
            .
          </p>
        </section>

        {/* Panel de Acciones Rápidas */}
        <nav
          aria-label="Enlaces principales"
          className="flex flex-col gap-4 sm:flex-row"
        >
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-all hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            href="#"
          >
            Panel Autoridades
          </a>
          <a
            className="flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            href="#"
          >
            Documentación DUA
          </a>
        </nav>

        <footer className="mt-8 text-xs text-zinc-400">
          Versión del Sistema: 0.1.0-alpha | Cimientos Sellados ✅
        </footer>
      </main>
    </div>
  );
}
