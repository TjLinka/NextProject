'use client'
import { SideMenu } from "@/components/Navigations/SideMenu";
import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "animate.css";
import moment from "moment";
import "moment/locale/ru";

import { Providers, ProvidersTanStack } from "./providers";
import { Header } from "@/components/Navigations/Header";
import { ClientWrapper } from "@/components/clientProvider";
import { Cormorant_Garamond, Manrope, Raleway } from "next/font/google";
import { useAgentStore } from "@/store/agentStore";
import { Metadata } from "next";
import { usePathname } from "next/navigation";




const inter = Manrope({
  subsets: ["latin"],
  display: "swap",
});

const playfair = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-h", // 👈 своя переменная
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  moment.locale("ru");
  const isAuth = useAgentStore((state) => state.isAuth)

  return (
    <html lang="en" className={`h-full antialiased 1`}>
      <ProvidersTanStack>
        <body
          className={`${inter.className} ${playfair.variable} min-h-screen flex`}
          style={{ fontVariantNumeric: "lining-nums" }}
        >
          <SideMenu />
          <div
            className={`grow flex flex-col min-w-0 ${isAuth || ["/catalog", "/cart"].includes(pathname) || pathname.startsWith("/catalog/product/") ? "md:ml-21" : ""}`}
          >
            <Header />
            <div className="md:px-7 px-3 py-7 grow flex justify-center">
              <div className="w-full max-w-360">
                <Providers>
                  <ClientWrapper>
                    <div className="h-full">{children}</div>
                  </ClientWrapper>
                </Providers>
              </div>
            </div>
          </div>
        </body>
      </ProvidersTanStack>
    </html>
  );
}
