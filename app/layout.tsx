import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Python MCQ Arena · 50 In-Depth Questions (W3Schools Core Curriculum)',
  description: 'Master Python fundamentals and core nuances with 50 in-depth questions covering Syntax, Output, Comments, Variables, Scope, Data Types, Numbers, Casting, Strings, and Booleans.',
  keywords: ['Python', 'MCQ', 'Quiz', 'Programming', 'Python Basics', 'W3Schools', 'Python Intermediate', 'Data Types'],
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
