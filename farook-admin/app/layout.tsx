import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import './globals.css'
import ReduxProvider from "@/provider/ReduxProvider";
import { SocketProvider } from "@/provider/SocketProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Real Estate",
  description: "Real Estate Investor",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} ${manrope.variable} antialiased bg-[#0D0D0D] text-white`}
      >
        <ReduxProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ReduxProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
