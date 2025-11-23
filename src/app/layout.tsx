import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Retiro de Carnaval",
  description: "Inscrição e gestão de participantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <a href="/" className="font-semibold">Retiro de Carnaval</a>
            <nav className="flex gap-4">
              <a href="/tickets" className="underline">Ingressos</a>
              <a href="/signup" className="underline">Inscreva-se</a>
              <a href="/login" className="underline">Login</a>
              <a href="/user" className="underline">Área do Usuário</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
