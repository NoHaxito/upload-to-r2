import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { ConfigProvider } from "@/components/config-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="app-ui-theme">
    <ConfigProvider>
      <App />
      <Toaster />
    </ConfigProvider>
  </ThemeProvider>
);
