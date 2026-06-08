import { SideMenu } from "@/components/Navigations/SideMenu";
import "../globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "animate.css";

import { Providers, ProvidersTanStack } from "../providers";
import { Header } from "@/components/Navigations/Header";
import { ClientWrapper } from "@/components/clientProvider";
import { Raleway } from "next/font/google";
import { validateOrRefreshToken } from "@/lib/auth2";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const inter = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await validateOrRefreshToken();

  if (!token) {
    redirect("/login");
  }
  return children
}
