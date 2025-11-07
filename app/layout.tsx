import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Meauxbility | Mobility Grants for SCI Survivors",
  description: "Providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana's Acadiana region. 501(c)(3) nonprofit organization.",
  keywords: ["meauxbility", "mobility grants", "SCI", "spinal cord injury", "Louisiana", "Acadiana", "nonprofit", "accessibility"],
  authors: [{ name: "Meauxbility Team" }],
  creator: "Meauxbility",
  publisher: "Meauxbility",
  openGraph: {
    title: "Meauxbility | Mobility Grants for SCI Survivors",
    description: "Supporting spinal cord injury survivors with grants for adaptive equipment and accessibility services.",
    url: "https://meauxbility.org",
    siteName: "Meauxbility",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meauxbility | Mobility Grants for SCI Survivors",
    description: "Supporting SCI survivors across Louisiana's Acadiana region.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body data-theme="light">
        <Navigation />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
