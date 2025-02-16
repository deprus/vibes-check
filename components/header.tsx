"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useSession } from "@/lib/auth-client";
import MainNav from "./main-nav";
import MobileNav from "./mobile-nav";
import ProfileDropdown from "./profile-dropdown";
export default function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="flex items-center">
            <span className="inline-block font-bold text-xl">Vibes-check</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end">
          {!isPending &&
            (session ? (
              <ProfileDropdown />
            ) : (
              <div className="hidden md:flex space-x-2 ml-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}
