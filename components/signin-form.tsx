"use client";

import { signInWithCredentials } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signInError, setSignInError] = useState(false);

  const formSignIn = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting } = formSignIn.formState;

  async function onSubmitSignIn(values: z.infer<typeof signInSchema>) {
    setSignInError(false);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      await signInWithCredentials(formData);
      toast({
        title: `Bienvenido. 🎉`,
        description: `Has iniciado sesión correctamente.`,
      });
    } catch {
      setSignInError(true);
    }
  }

  return (
    <Form {...formSignIn}>
      <form
        onSubmit={formSignIn.handleSubmit(onSubmitSignIn)}
        className="space-y-5"
        noValidate
      >
        <FormField
          control={formSignIn.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="nombre@gob.pe"
                  autoComplete="email"
                  autoFocus
                  className="h-11 text-base md:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formSignIn.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-11 pr-11 text-base md:text-sm"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {signInError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            No se pudo iniciar sesión. Revisa tu correo y tu contraseña e
            inténtalo de nuevo.
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-[#F4B41A] text-base font-semibold text-[#1C1410] hover:bg-[#E5A50C]"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
};
