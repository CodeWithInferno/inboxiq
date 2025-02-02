
import { ThemeProvider } from 'next-themes';
import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';


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

export const metadata = {
  title: "InboxIQ",
  description: "Smart email management for you and your team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-white text-black">
        <UserProvider>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
        </UserProvider>
        </div>
      </body>
    </html>
  );
}
