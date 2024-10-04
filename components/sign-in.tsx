
import { signIn } from "@/lib/auth"
import { Button } from "./ui/button"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <Button type="submit">Iniciar session</Button>
    </form>
  )
} 