import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Light Sync - Holiday Systems Engineering',
  description: 'A logic puzzle where you repair a festive electrical grid by finding the right switch configuration',
  openGraph: {
    title: 'Light Sync',
    description: 'Repair the holiday grid. Find the right combination.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#faf9f7" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="select-none">{children}</body>
    </html>
  );
}
