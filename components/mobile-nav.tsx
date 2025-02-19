"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "@/config/constants";
import { useSession } from "@/lib/auth-client";

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = useSession();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-border flex flex-col gap-8 border-r p-6"
      >
        <SheetHeader className="p-0 text-center text-lg sm:text-left">
          <SheetTitle>Vibes-check</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "hover:text-primary rounded-md p-2 text-base font-medium transition-colors",
                pathname === item.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          {!session && !isPending && (
            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              <Button asChild variant="outline" size="sm">
                <Link onClick={() => setIsOpen(false)} href="/sign-in">
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link onClick={() => setIsOpen(false)} href="/sign-up">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
