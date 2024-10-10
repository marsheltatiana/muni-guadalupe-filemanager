import SignIn from "@/components/sign-in";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: 'url("/guadalupe-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <main className="flex flex-col sm:flex-row justify-center items-center w-full gap-16">
        <section className="flex flex-col gap-8 text-center sm:text-left">
          <h1 className="text-2xl lg:text-6xl font-bold text-white">
            Administrador de archivos
          </h1>
          <h5 className="text-md font-[family-name:var(--font-geist-mono)] text-white">
            Municipalidad Distrital de Guadalupe
          </h5>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <SignIn variant={"secondary"}/>
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Button variant={"default"}>Leer manual</Button>
            </Link>
          </div>
        </section>
        <section className="flex justify-center items-center">
          <Image
            src={"/muni-guadalupe-logo.png"}
            alt="logo muni guadalupe"
            width={200}
            height={200}
          />
        </section>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center mt-8">
        <span>Municipalidad Distrital de Guadalupe | La Libertad, Perú</span>
      </footer>
    </div>
  );
}
