import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: 'url("/guadalupe-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <main className="flex flex-col sm:flex-row justify-around items-center w-full gap-16">
        <section className="flex flex-col gap-8 text-center sm:text-left items-start">
          <h1 className="text-2xl lg:text-6xl font-bold text-white">
            Archivo General
          </h1>
          <h4 className="text-lg text-white -mt-6">
            Municipalidad Distrital de Guadalupe
          </h4>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <ProfileForm />
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
