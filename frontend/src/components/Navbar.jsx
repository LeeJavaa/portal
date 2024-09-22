import Link from "next/link";
import CreateForm from "./CreateForm";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-muted-foreground max-w-screen-xl mx-auto">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold text-primary dark:text-primary-foreground">
            Portal
          </span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary-foreground"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary-foreground"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary-foreground"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary-foreground"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
        <CreateForm />
      </div>
    </header>
  );
}
