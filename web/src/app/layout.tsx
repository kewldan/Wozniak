import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Wozniak",
  description: "Мониторинг запусков задач по расписанию",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-4 sm:px-8">
            <span className="text-lg font-semibold tracking-tight">
              Wozniak
            </span>
            <nav aria-label="Основная навигация">
              <Link
                href="/"
                className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200"
              >
                Задачи
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
