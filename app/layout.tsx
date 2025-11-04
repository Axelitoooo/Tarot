import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarot Français - Jeu en ligne",
  description: "Jouez au tarot français en ligne avec vos amis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="wood-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
