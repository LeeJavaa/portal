"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NewAnalysisForm from "@/components/new-analysis-form/NewAnalysisForm";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" prefetch={false}>
          <span className="font-bold text-primary text-2xl">PORTAL</span>
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
          <Link href="/custom">
            <span
              className={`font-bold transition-colors hover:text-primary ${
                pathname === "/custom"
                  ? "text-primary underline"
                  : "text-muted-foreground"
              }`}
            >
              Custom
            </span>
          </Link>
        </nav>
        <NewAnalysisForm />
      </div>
    </header>
  );
}
