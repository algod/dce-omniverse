import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { UserModeProvider } from "@/lib/contexts/UserModeContext";
import { AgentDataProvider } from "@/lib/contexts/AgentDataContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DCE OmniVerse | Pharmaceutical Omnichannel AI",
  description: "Next-generation omnichannel agentic AI solution for pharmaceutical companies",
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
        <UserModeProvider>
          <AgentDataProvider>
            {children}
            <DarkModeToggle />
          </AgentDataProvider>
        </UserModeProvider>
      </body>
    </html>
  );
}
