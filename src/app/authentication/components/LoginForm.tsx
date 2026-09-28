"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.email().trim().min(1, { message: "E-mail é obrigatório" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [viewPassword, setViewPassword] = useState(false);
  console.log("viewPassword", viewPassword);

  const handleLogin = async (data: LoginFormData) => {
    await signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/home");
        },
        onError: () => {
          toast.error("E-mail ou senha inválidos.");
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="mt-4 space-y-4"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-2 -translate-y-1/2 text-slate-400" />
                  <FormControl>
                    <Input
                      className="bg-black/40 px-10 font-semibold text-slate-400"
                      placeholder="E-mail"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-2 -translate-y-1/2 text-slate-400" />
                  <FormControl>
                    <Input
                      className="bg-black/40 px-10 font-semibold text-slate-400"
                      placeholder="Senha"
                      {...field}
                      type={viewPassword ? "text" : "password"}
                    />
                  </FormControl>
                  {viewPassword ? (
                    <Eye
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400"
                      onClick={() => setViewPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400"
                      onClick={() => setViewPassword(true)}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-emerald-700"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "ENTRANDO..." : "ENTRAR"}
        </Button>
      </form>
    </Form>
  );
};
