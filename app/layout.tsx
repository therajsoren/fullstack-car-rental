import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VELOCE - Premium Car Rental Service",
  description:
    "Experience luxury on the open road with VELOCE. Premium car rentals featuring sports cars, luxury sedans, and SUVs for every journey.",
  keywords: [
    "car rental",
    "premium cars",
    "luxury vehicle rental",
    "sports cars",
    "VELOCE",
  ],
  openGraph: {
    title: "VELOCE - Premium Car Rental Service",
    description:
      "Luxury Meets the Open Road. Choose from 10+ premium vehicles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
