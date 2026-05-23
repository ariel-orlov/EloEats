import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FridgeWise',
  description: 'Smart fridge health scoring and leaderboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">{children}</body>
    </html>
  );
}
