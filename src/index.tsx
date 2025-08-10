import React from "react";
import { createRoot } from "react-dom/client";
// Removed Bootstrap CSS – now using Tailwind
import "react-datetime/css/react-datetime.css";
// Removed legacy CSS imports for react-dates, braft-editor, and react-lightbox-component
import "./css/App.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./utils/queryClient";
import { OrganisationProvider } from "./context/OrganisationContext";

if (
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development"
) {
  const disableOverlayIframes = () => {
    document.querySelectorAll("iframe").forEach((iframe) => {
      const rect = iframe.getBoundingClientRect();
      const style = window.getComputedStyle(iframe);

      if (
        rect.width >= window.innerWidth * 0.98 &&
        rect.height >= window.innerHeight * 0.98 &&
        style.position === "fixed"
      ) {
        iframe.style.pointerEvents = "none";
      }
    });
  };

  setInterval(disableOverlayIframes, 1000);
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <OrganisationProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </OrganisationProvider>
    </React.StrictMode>
  );
}

reportWebVitals();
