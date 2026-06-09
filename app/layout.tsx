import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "HCLS AI Navigator Portal",
  description: "Healthcare and Life Sciences AI readiness assessment and value tracker.",
};

import AppShell from "@/components/AppShell";
import { ToastProvider } from "@/components/ui/Toast";
import { DemoProvider } from "@/context/DemoContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* Error listener to catch Next.js chunk/asset loading failures and force page reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('error', function(event) {
                  var target = event.target;
                  if (target && (target.tagName === 'LINK' || target.tagName === 'SCRIPT')) {
                    var url = target.src || target.href;
                    if (url && url.indexOf('/_next/static/') !== -1) {
                      console.warn('Next.js asset failed to load, forcing reload...', url);
                      window.location.reload();
                    }
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && (event.reason.name === 'ChunkLoadError' || (event.reason.message && event.reason.message.indexOf('Loading chunk') !== -1))) {
                    console.warn('Next.js chunk failed to load, forcing reload...');
                    window.location.reload();
                  }
                });
              })();
            `
          }}
        />
        {/* Font Awesome 6 CDN for icons as specified in requirements */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <DemoProvider>
            <AppShell>{children}</AppShell>
          </DemoProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
