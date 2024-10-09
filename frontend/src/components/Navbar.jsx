"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateForm from "./CreateForm";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background max-w-screen-xl mx-auto">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" prefetch={false}>
          <span className="font-bold text-primary text-2xl">Portal</span>
        </Link>
        <nav className="flex space-x-16">
          <Link href="/">
            <span
              className={`font-bold transition-colors hover:text-primary ${
                pathname === "/"
                  ? "text-primary underline"
                  : "text-muted-foreground"
              }`}
            >
              Public
            </span>
          </Link>
          <Link href="/private">
            <span
              className={`font-bold transition-colors hover:text-primary ${
                pathname === "/private"
                  ? "text-primary underline"
                  : "text-muted-foreground"
              }`}
            >
              Private
            </span>
          </Link>
        </nav>
        <CreateForm />
      </div>
    </header>
  );
}
