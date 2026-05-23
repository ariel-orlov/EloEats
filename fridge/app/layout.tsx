import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FridgeWise',
  description: 'Smart fridge health scoring and leaderboard',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FridgeWise',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg min-h-screen">{children}</body>
    </html>
  );
}
