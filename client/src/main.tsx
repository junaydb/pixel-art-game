import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ViewProvider from "./providers/ViewProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ViewProvider>
      <App />
    </ViewProvider>
  </React.StrictMode>,
);
