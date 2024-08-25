import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "./globals.scss";
import styles from "./layout.module.scss";

const inter = Inter({ subsets: ["latin"] });

const title = "人口推移";
const description =
  "ゆめみパスポート・フロントエンドコーディング試験、人口推移グラフの実装です。";

export const metadata: Metadata = { title, description };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className={styles["container"]}>
          <header className={styles["header"]}>
            <Link href="/">{title}</Link>
          </header>
          <div className={styles["main-wrapper"]}>{children}</div>
          <footer className={styles["footer"]}>
            &copy; 2024 yawarakacream
          </footer>
        </div>
      </body>
    </html>
  );
}
