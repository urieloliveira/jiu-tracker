import HeaderAuth from "@/components/header-auth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <main className="min-h-screen flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-2xl">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"}>Jiu Tracker</Link>
          </div>
          <HeaderAuth user={user} />
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-2 items-center justify-center max-w-5xl p-5">
        <p className="text-lg text-muted-foreground">
          {user ? `Welcome, ${user.email}` : "Welcome"}
        </p>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
          Jiu Tracker helps you keep track of your Jiu Jitsu matches.
        </p>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
        <Button variant="default" size="lg" className="flex gap-2 items-center">
          <Link href="/protected">Gerenciar Lutas</Link>
        </Button>
      </div>
    </main>
  );
}
