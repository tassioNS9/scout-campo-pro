"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUp } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
  email: z.email().trim().min(1, { message: "E-mail é obrigatório" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  profileType: z.enum(["Treinador", "Analista", "Auxiliar", "Coordenador"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      profileType: "Analista",
    },
  });

  const handleRegister = async (data: RegisterFormData) => {
    await signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        // @ts-expect-error - campo adicional do Better-auth
        profileType: data.profileType,
      },
      {
        onSuccess: () => {
          toast.success("Conta criada com sucesso! Bem-vindo!");
          router.push("/");
          router.refresh();
        },
        onError: (context) => {
          toast.error(context.error.message ?? "Erro ao criar conta");
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="mt-4 space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="bg-black/40 font-semibold text-slate-400"
                  placeholder="Seu nome completo"
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                    type="password"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Perfil</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="bg-black/40 font-semibold text-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Treinador">Treinador</SelectItem>
                  <SelectItem value="Analista">Analista</SelectItem>
                  <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                  <SelectItem value="Coordenador">Coordenador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-emerald-700"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "CRIANDO CONTA..." : "CRIAR CONTA"}
        </Button>
      </form>
    </Form>
  );
};
