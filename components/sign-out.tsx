import { signOut } from "@/lib/auth";

export const SignOut = async () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="text-red-600" type="submit">
        Cerrar sessión
      </button>
    </form>
  );
};
