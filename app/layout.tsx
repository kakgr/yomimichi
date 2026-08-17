import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "漢字の読み練習 | よみみち",
  description: "出題された漢字の読みを答えて、楽しく身につける練習サイトです。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
