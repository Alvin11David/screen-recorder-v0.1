import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";

function bootstrap() {
  const hasSsrPayload =
    typeof window !== "undefined" && Boolean((window as { $_TSR?: unknown }).$_TSR);

  if (hasSsrPayload) {
    // SSR/hydration mode (web / Vercel): match the default TanStack Start entry.
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <StartClient />
        </StrictMode>,
      );
    });
    return;
  }

  // Client-only mode (Capacitor WebView, no server): bootstrap the router directly.
  const router = getRouter();
  const container = document.getElementById("root");
  if (!container) return;
  startTransition(() => {
    createRoot(container).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    );
  });
}

bootstrap();
