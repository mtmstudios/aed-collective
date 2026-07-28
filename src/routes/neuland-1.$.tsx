import { createFileRoute, redirect } from "@tanstack/react-router";

// Alte, kaputte URL-Struktur /neuland-1/... der Bestands-Site
export const Route = createFileRoute("/neuland-1/$")({
  beforeLoad: () => {
    throw redirect({ to: "/neuland", statusCode: 301 });
  },
});
