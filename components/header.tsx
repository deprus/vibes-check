"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useSession } from "@/lib/auth-client";
import MainNav from "./main-nav";
import MobileNav from "./mobile-nav";
import ProfileDropdown from "./profile-dropdown";
import { Skeleton } from "./ui/skeleton";
export default function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="flex items-center">
            <span className="inline-block text-xl font-bold">Vibes-check</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end">
          {isPending && <Skeleton className="h-6 w-6 rounded-full" />}
          {!isPending &&
            (session ? (
              <ProfileDropdown />
            ) : (
              <div className="ml-2 hidden space-x-2 md:flex">
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
