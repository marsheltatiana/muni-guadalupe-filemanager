
import { signIn } from "@/lib/auth"
import { Button } from "./ui/button"
 
type SignInProps = {
  className?: string
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
}

const SignIn: React.FC<SignInProps> = ({className, variant}) => {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <Button type="submit" variant={variant}>Iniciar session</Button>
    </form>
  )
} 

export default SignIn