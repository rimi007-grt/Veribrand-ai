import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriBrand AI | Automated Pre-Publication Governance",
  description: "Enterprise compliance verification platform for claims, visual contrast, trademarks, and ASCI standards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

