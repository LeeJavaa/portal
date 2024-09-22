export default function Footer() {
  return (
    <footer className="bg-foreground dark:bg-muted max-w-screen-xl mx-auto">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <p className="text-sm text-muted dark:text-muted-foreground">
          &copy; 2023 Acme SaaS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
