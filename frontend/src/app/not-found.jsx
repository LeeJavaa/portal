import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] *:px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Please
          check the URL or return home.
        </p>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
