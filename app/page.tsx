import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/lib/auth";
import { Bricolage_Grotesque } from "next/font/google";
import Image from "next/image";
import { redirect } from "next/navigation";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div
      className={`${display.variable} grid min-h-screen bg-[#16100c] font-[family-name:var(--font-geist-sans)] lg:grid-cols-[minmax(0,1.2fr)_minmax(440px,0.8fr)]`}
    >
      <section className="relative isolate flex min-h-[46vh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-8 text-center text-white lg:min-h-screen lg:py-10">
        <Image
          src="/guadalupe-background.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/25 to-black/70"
        />
        <div className="flex flex-col items-center duration-1000 fade-in slide-in-from-bottom-3 motion-safe:animate-in">
          <Image
            src="/muni-guadalupe-logo.png"
            alt="Municipalidad Distrital de Guadalupe"
            width={500}
            height={500}
            priority
            className="h-auto w-56 sm:w-64 lg:w-[26rem]"
          />
          <h1 className="-mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl lg:-mt-8 lg:text-7xl">
            Archivo General
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/75 lg:mt-4 lg:text-base">
            Documentos, préstamos y búsqueda del archivo municipal en un solo
            lugar.
          </p>
        </div>
        <p className="absolute bottom-6 hidden text-sm text-white/60 lg:block">
          Guadalupe, La Libertad, Perú
        </p>
      </section>
      <main className="relative -mt-6 flex items-center justify-center rounded-t-3xl bg-background px-6 py-12 sm:px-10 lg:mt-0 lg:rounded-none">
        <ProfileForm />
      </main>
    </div>
  );
}
