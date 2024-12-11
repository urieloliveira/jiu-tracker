"use client";
import { TimerProvider } from "@/components/timer/hook";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <TimerProvider>{children}</TimerProvider>;
}
