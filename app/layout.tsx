import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhysFun — Physics Learning Platform",
  description: "Platform เรียนฟิสิกส์ สนุกได้สาระ เข้าใจง่าย ด้วยเวลาอันสั้น",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* Preconnect so fonts are fetched before first paint — eliminates font-swap blur */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load all required fonts in one request with display=swap */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anuphan:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}