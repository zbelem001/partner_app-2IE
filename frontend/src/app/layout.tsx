import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WorkflowProvider } from "../contexts/WorkflowContext";
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
  title: "2iE - Gestion des Partenariats",
  description: "Système de gestion des prospects, conventions et partenariats pour l'Institut International d'Ingénierie de l'Eau et de l'Environnement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WorkflowProvider>
          {children}
        </WorkflowProvider>
      </body>
    </html>
  );
}
