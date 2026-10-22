import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Python Beginner Practice · 25 Coding Problems & Interactive Quiz',
  description: 'Master Python fundamentals with 25 hands-on coding problems across 5 levels, automated test verification, internal execution breakdowns, and 25 correlated MCQ quiz questions.',
  keywords: ['Python', 'Beginner Python', 'Python Practice', 'Coding Problems', 'Python Quiz', 'Ternary Operator', 'Logical Operators', 'Data Types'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#306998',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
