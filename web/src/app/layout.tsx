import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import darkLogo from "@/assets/wozniak-dark.png";
import { ThemeToggle, UtcClock } from "@/components/header-controls";
import { themeInitializationScript } from "@/lib/theme";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Wozniak",
  description: "Мониторинг запусков задач по расписанию",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script>{themeInitializationScript}</script>
      </head>
      <body className="min-h-screen">
        <header className="bg-card border-b">
          <div className="mx-auto flex min-h-16 max-w-[90rem] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:px-8">
            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/"
                className="flex items-center gap-2.5 text-base font-semibold tracking-tight sm:text-lg"
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-950 text-white dark:hidden"
                  aria-hidden="true"
                >
                  W
                </span>
                <Image
                  src={darkLogo}
                  alt=""
                  width={36}
                  height={36}
                  className="hidden size-9 shrink-0 rounded-[36%] dark:block"
                />
                Wozniak
              </Link>
              <nav
                aria-label="Основная навигация"
                className="border-l pl-3 sm:pl-5"
              >
                <Link
                  href="/"
                  className="inline-flex h-9 items-center rounded-lg bg-blue-100/80 px-2.5 text-sm font-semibold text-blue-950 hover:bg-blue-100 sm:px-3 dark:bg-blue-400/15 dark:text-blue-200 dark:hover:bg-blue-400/25"
                >
                  Задачи
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <UtcClock />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[90rem] px-4 py-7 sm:px-8 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
