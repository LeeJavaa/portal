"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NewAnalysisForm from "@/components/new-analysis-form/NewAnalysisForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = ({ onLinkClick }) => (
    <>
      <Link href="/" onClick={onLinkClick}>
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
      <Link href="/custom" onClick={onLinkClick}>
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
      <div className="hidden">
        <NewAnalysisForm />
      </div>
    </>
  );

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" prefetch={false}>
          <span className="font-bold text-primary text-2xl">PORTAL</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-16">
          <NavLinks />
        </nav>

        {/* Desktop New Analysis Button */}
        <div className="hidden lg:block">
          <NewAnalysisForm />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64">
            <nav className="flex flex-col space-y-8 mt-8">
              <NavLinks onLinkClick={handleLinkClick} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
