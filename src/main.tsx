import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource/atkinson-hyperlegible/400.css"
import "@fontsource/atkinson-hyperlegible/700.css"
import "./index.css"
import App from "./App.tsx"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { applyPrefs, getPrefs } from "@/lib/prefs"

// Apply saved text-size/theme before first paint to avoid a flash of the wrong theme.
applyPrefs(getPrefs())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
