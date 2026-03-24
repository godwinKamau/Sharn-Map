import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sharn Map",
  description: "Interactive map of Sharn — Upper, Middle, and Lower Wards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
