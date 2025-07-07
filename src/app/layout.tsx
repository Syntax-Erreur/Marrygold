import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";
import ProtectedLayout from "@/components/landing/ProtectedLayout";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marry Gold",
  description: "manage wedding planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EdgeStoreProvider>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </EdgeStoreProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
