import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
