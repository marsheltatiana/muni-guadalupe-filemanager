import { auth } from "@/lib/auth";
import DashboardPageClient from "./page.client";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {

  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <section className="flex flex-col">
      <section className="pl-6 py-5">
        <h1 className="text-lg">Hola <span className="font-semibold">{session?.user?.name}</span></h1>
        <Image src={session?.user.image!} width={24} height={24} alt="avatar"/>
      </section>
      <DashboardPageClient />
    </section>
  );
}
