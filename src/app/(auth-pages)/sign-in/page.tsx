"use server";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form
      className="flex-1 flex flex-col min-w-64"
      method="post"
      action={signInAction as unknown as string}
    >
      <h1 className="text-2xl font-medium text-center">Sign in</h1>
      <div className="flex flex-col gap-2 mt-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            aria-label="Email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Sua Senha"
            required
            aria-label="Senha"
          />
        </div>

        <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
