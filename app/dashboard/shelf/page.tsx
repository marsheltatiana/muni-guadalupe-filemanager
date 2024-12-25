import { ShelfManagement } from "@/components/shelf-management";
import { Contenedor, Estante, Tipo_Contenedor } from "@prisma/client";

interface EstanteWithContainers extends Estante {
  Contenedor: Contenedor[];
}

const ShelfPage = async () => {
  const shelfves: EstanteWithContainers[] = await fetch(
    `${process.env.APP_URL}/api/estantes`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const containerTypes: Tipo_Contenedor[] = await fetch(
    `${process.env.APP_URL}/api/contenedor/tipos`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  return <ShelfManagement shelves={shelfves} containerTypes={containerTypes} />;
};

export default ShelfPage;
