
import { SideMenu } from "@/components/Navigations/SideMenu";
import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Roboto } from "next/font/google";
import Providers from "./providers";
import { Header } from "@/components/Navigations/Header";

const inter = Roboto({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className={`${inter.className} min-h-screen flex`}>
        <SideMenu />
        <div className="grow flex flex-col">
          <Header />
          <div className="px-7 pt-7 grow">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
