import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Stratiq — Outthink Your Market",
  description: "AI-powered business intelligence. Deep market analysis, competitor intelligence, SEO audit, brand positioning, and growth strategy in minutes.",
  keywords: ["market analysis", "competitor intelligence", "business strategy", "SEO audit", "AI analytics"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main style={{ paddingTop: 64 }}>{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#1A1A2E",
                color: "#F9FAFB",
                border: "1px solid #2a2a40",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
