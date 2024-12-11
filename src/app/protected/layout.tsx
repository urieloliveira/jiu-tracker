import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  return children;
}
