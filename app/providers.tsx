"use client";

import { PrimeReactProvider } from "primereact/api";
import { addLocale, locale } from "primereact/api";

import ru from "primelocale/ru.json";

addLocale("ru", ru.ru);
locale("ru");

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PrimeReactProvider>{children}</PrimeReactProvider>;
}
