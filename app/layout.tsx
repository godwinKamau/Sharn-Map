import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./providers";

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
      <body className="antialiased min-h-screen bg-parchment text-brown-body font-garamond">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
