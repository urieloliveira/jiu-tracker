import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";

export default function AuthButton({ user }: { user: User | null }) {
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <form action={signOutAction as unknown as string}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    );
  }
  return (
    <Button asChild size="sm" variant="default">
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
