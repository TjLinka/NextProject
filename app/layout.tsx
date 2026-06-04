import { SideMenu } from "@/components/Navigations/SideMenu";
import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "animate.css";

import { Providers, ProvidersTanStack } from "./providers";
import { Header } from "@/components/Navigations/Header";
import { Dialog } from "primereact/dialog";
import { ClientWrapper } from "@/components/clientProvider";
import { Raleway } from "next/font/google";

const inter = Raleway({
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
      <body
        className={`${inter.className} min-h-screen flex`}
        style={{ fontVariantNumeric: "lining-nums" }}
      >
        <SideMenu />
        <div className="grow flex flex-col min-w-0">
          <Header />
          <div className="px-7 pt-7 grow container mx-auto">
            <ProvidersTanStack>
              <Providers>
                <ClientWrapper>
                  <div>{children}</div>
                </ClientWrapper>
              </Providers>
            </ProvidersTanStack>
          </div>
        </div>
      </body>
    </html>
  );
}
