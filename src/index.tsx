import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datetime/css/react-datetime.css";
import "react-dates/lib/css/_datepicker.css";
import "braft-editor/dist/index.css";
import "react-lightbox-component/build/css/index.css";
import "./css/App.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./utils/queryClient";
import { OrganisationProvider } from "./context/OrganisationContext";
if (process.env.NODE_ENV === "development") {
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

ReactDOM.render(
  <React.StrictMode>
    <OrganisationProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </OrganisationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
