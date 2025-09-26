import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Dashka • Next Entry Point',
  description: 'Clean Next.js core for product modules',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
