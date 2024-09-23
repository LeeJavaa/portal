import Link from "next/link";
import CreateForm from "./CreateForm";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background max-w-screen-xl mx-auto">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#" prefetch={false}>
          <span className="font-bold text-primary text-2xl">Portal</span>
        </Link>
        <CreateForm />
      </div>
    </header>
  );
}
