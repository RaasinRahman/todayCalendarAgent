import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Today Calendar",
  description: "Add today's tasks to your Google Calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Today Calendar</h1>
            </div>
          </header>
          <main>
            <AuthProvider>{children}</AuthProvider>
          </main>
          <footer className="mt-12 py-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Today Calendar. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
