import { Outlet } from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { langAtom } from "./atoms/lang";
import i18n from "./locales/i18n";

export default function App() {
  const lang = useAtomValue(langAtom);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return <Outlet />;
}
