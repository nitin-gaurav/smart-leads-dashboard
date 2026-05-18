// React application entry point.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { MESSAGES } from "./constants/messages";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(MESSAGES.ROOT_ELEMENT_MISSING);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
