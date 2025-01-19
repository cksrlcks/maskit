// src/locales/i18n.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationKO from "./translation.ko.json";

const resources = {
  ko: {
    translation: translationKO,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
