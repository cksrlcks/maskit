import { PropsWithChildren } from "react";
import { Header } from "./Header";

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
