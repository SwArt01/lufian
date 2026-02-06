import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserAuthProvider } from "@/context/UserAuthContext";

export const metadata: Metadata = {
  title: {
    default: "LUFIAN | Premium Erkek Giyim",
    template: "%s | LUFIAN"
  },
  description: "Premium kalite erkek giyim koleksiyonu. Kapüşonlu sweatshirt, bisiklet yaka ve daha fazlası. Hızlı teslimat, güvenli alışveriş.",
  keywords: ["erkek giyim", "sweatshirt", "kapüşonlu", "türk markası", "premium giyim", "lufian"],
  authors: [{ name: "LUFIAN" }],
  creator: "LUFIAN",
  publisher: "LUFIAN",
  metadataBase: new URL("https://lufian.com.tr"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lufian.com.tr",
    siteName: "LUFIAN",
    title: "LUFIAN | Premium Erkek Giyim",
    description: "Premium kalite erkek giyim koleksiyonu. Kapüşonlu sweatshirt, bisiklet yaka ve daha fazlası.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LUFIAN Premium Erkek Giyim"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LUFIAN | Premium Erkek Giyim",
    description: "Premium kalite erkek giyim koleksiyonu.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "google-site-verification-code"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-sans bg-background text-text-primary flex flex-col min-h-screen transition-colors duration-200`}
      >
        <LanguageProvider>
          <ThemeProvider>
            <UserAuthProvider>
              <UserProvider>
                <CartProvider>
                  <ToastProvider>
                    <Navbar />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                  </ToastProvider>
                </CartProvider>
              </UserProvider>
            </UserAuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
