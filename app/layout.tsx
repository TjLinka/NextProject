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

const inter = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
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
        <SideMenu/>
        <div className="grow flex flex-col min-w-0">
          <Header />
          <div className="md:px-7 px-3 py-7 md:pl-22! grow container mx-auto">
            <ProvidersTanStack>
              <Providers>
                <ClientWrapper>
                  <div className="h-full">{children}</div>
                </ClientWrapper>
              </Providers>
            </ProvidersTanStack>
          </div>
        </div>
      </body>
    </html>
  );
}
