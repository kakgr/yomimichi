import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学習ドリル | よみみち",
  description: "漢字の読みや植物・道具の名前を、10問ずつ楽しく練習できるサイトです。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
