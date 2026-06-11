'use client'
import { SideMenu } from "@/components/Navigations/SideMenu";
import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "animate.css";

import { Providers, ProvidersTanStack } from "./providers";
import { Header } from "@/components/Navigations/Header";
import { ClientWrapper } from "@/components/clientProvider";
import { Raleway } from "next/font/google";
import { useAgentStore } from "@/store/agentStore";

const inter = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isAuth = useAgentStore((state) => state.isAuth)

  return (
    <html lang="en" className={`h-full antialiased`}>
      <body
        className={`${inter.className} min-h-screen flex`}
        style={{ fontVariantNumeric: "lining-nums" }}
      >
        <SideMenu />

        {/* эта обёртка уже есть у тебя — она правильно растягивается рядом с сайдбаром */}
        <div className={`grow flex flex-col min-w-0 ${isAuth ? 'md:ml-21' : ''}`}>
          <Header />

          {/* вот тут убираем pl-22 и mx-auto, добавляем flex + justify-center */}
          <div className="md:px-7 px-3 py-7 grow flex justify-center">
            {/* а max-width ставим на внутренний блок */}
            <div className="w-full max-w-360">
              <ProvidersTanStack>
                <Providers>
                  <ClientWrapper>
                    <div className="h-full">{children}</div>
                  </ClientWrapper>
                </Providers>
              </ProvidersTanStack>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
