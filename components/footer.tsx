import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container">
        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://github.com/deprus/vibes-check"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            <Image
              src="/github.svg"
              alt="Github"
              width={20}
              height={20}
              className="h-5 w-5 brightness-0 invert"
            />{" "}
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://discord.gg/eqX6sbA5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            <Image
              src="/discord.svg"
              alt="Discord"
              width={20}
              height={20}
              className="h-5 w-5 brightness-0 invert"
            />
            <span className="sr-only">Discord</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
