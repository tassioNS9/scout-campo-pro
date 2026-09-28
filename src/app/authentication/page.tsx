import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

export default async function AuthenticationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/home");
  }
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url('/background_image_login.jpeg')",
      }}
    >
      <div className="w-full max-w-md space-y-2">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center gap-1">
          <Image
            src="/logo_scout_pro.png"
            alt="Logo"
            width={250}
            height={250}
            loading="eager"
          />
          <h3 className="text-center text-xl font-bold text-white">
            Bem-vindo de volta!
          </h3>
        </div>

        <Card className="border-0 bg-transparent">
          <CardHeader className="text-center"></CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900">
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
                <LoginForm />
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <RegisterForm />
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
