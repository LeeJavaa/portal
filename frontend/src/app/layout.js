import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Portal Engine",
  description: "A competitive call of duty analysis engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("antialiased", inter.className)}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
