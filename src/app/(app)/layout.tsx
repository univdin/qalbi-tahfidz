import type { ReactNode } from "react";
import { AppNav } from "@/components/nav/AppNav";
import { FloatingAudioPlayer } from "@/components/audio/FloatingAudioPlayer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="flex-1 pb-20">{children}</main>
      <FloatingAudioPlayer />
    </div>
  );
}
