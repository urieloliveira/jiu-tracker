"use client";
import { TimerProvider } from "@/components/timer/hook";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return <TimerProvider>{children}</TimerProvider>;
}
