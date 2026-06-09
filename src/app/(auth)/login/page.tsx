"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signUp, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerProfileType, setRegisterProfileType] = useState("Analista");

  if (session?.user) {
    router.push("/");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: loginEmail,
        password: loginPassword,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Erro ao fazer login");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signUp.email({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
        // @ts-expect-error - campo adicional do Better-auth
        profileType: registerProfileType,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Erro ao criar conta");
      } else {
        toast.success("Conta criada com sucesso! Bem-vindo!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="from-primary to-sidebar-primary flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br">
            <span className="text-lg font-bold">⚽</span>
          </div>
          <h1 className="text-background text-xl font-bold">Scout Campo Pro</h1>
        </div>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Acesse sua conta</CardTitle>
            <CardDescription className="text-slate-400">
              Entre ou crie uma nova conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger
                  value="login"
                  className="text-slate-300 data-[state=active]:text-green-500"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-slate-300 data-[state=active]:text-green-500"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-slate-300">
                      E-mail
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-slate-300">
                      Senha
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="register-name" className="text-slate-300">
                      Nome
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email" className="text-slate-300">
                      E-mail
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="register-password"
                      className="text-slate-300"
                    >
                      Senha
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                      className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="register-profile"
                      className="text-slate-300"
                    >
                      Perfil
                    </Label>
                    <Select
                      value={registerProfileType}
                      onValueChange={setRegisterProfileType}
                    >
                      <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Treinador">Treinador</SelectItem>
                        <SelectItem value="Analista">Analista</SelectItem>
                        <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            ← Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
