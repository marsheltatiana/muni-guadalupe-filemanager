import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <section className="flex flex-col">
      <h1 className="text-2xl lg:text-6xl font-bold">Adminitrador de archivos</h1>
        <h5 className="text-md font-[family-name:var(--font-geist-mono)]">Municipalidad Distrital de Guadalupe</h5>
      </section>
      
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Iniciar sesión
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer manual
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <span>Municipalidad Ditrital de Guadalupe | La Libertad, Perú</span>
      </footer>
    </div>
  );
}
