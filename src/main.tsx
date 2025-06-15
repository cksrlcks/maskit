import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CanvasPage from "./pages/canvas/index.tsx";
import PrivacyPage from "./pages/privacy/index.tsx";
import { Error } from "./components/Common";
import "./locales/i18n.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <CanvasPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
