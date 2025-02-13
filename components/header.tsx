"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useSession } from "@/lib/auth-client";

export default function Header() {
  const { data: isPending } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-cenenter space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="inline-block font-bold text-xl">Vibes-check</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {!isPending && (
            <div className="hidden md:flex space-x-2 ml-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
