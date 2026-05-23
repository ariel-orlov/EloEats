import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FridgeWise',
  description: 'Smart fridge health scoring and leaderboard',
  // PWA / Add to Home Screen config — removes browser chrome on iOS
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FridgeWise',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">{children}</body>
    </html>
  );
}
