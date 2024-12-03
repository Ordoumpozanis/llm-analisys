import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { FloatingDock } from "@/components/ui/floating-dock";
import { menuLInks } from "@/setup/menu-links";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LLM Interaction Counter",
  description: "What is you Environmental impact of LLMs usage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* desktop layout */}
          <div className="hidden lg:flex flex-col h-screen overflow-hidden">
            {/* Top div fills the remaining space */}
            <div className="flex-grow overflow-y-auto ">{children}</div>

            {/* Bottom div with fixed height */}
            <div className="h-[80px]">
              <FloatingDock items={menuLInks} desktopClassName="w-fit" />
            </div>
          </div>

          {/* mobile layout */}
          <div className="flex flex-col lg:hidden h-screen">
            {/* Top div fills the remaining space */}
            <div className="flex-grow">{children}</div>

            <FloatingDock
              items={menuLInks}
              mobileClassName="absolute top-10 right-10 w-fit h-fit"
            />
          </div>
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string}
          />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
