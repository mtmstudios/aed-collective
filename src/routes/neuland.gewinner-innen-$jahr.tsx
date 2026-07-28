import { createFileRoute, redirect } from "@tanstack/react-router";
import { jahrgaenge } from "@/data/neuland";

// Alt-URLs von aed-neuland.de: /neuland/gewinner-innen-2025 -> /neuland/gewinner/2025
export const Route = createFileRoute("/neuland/gewinner-innen-$jahr")({
  beforeLoad: ({ params }) => {
    const jahr = jahrgaenge.includes(params.jahr) ? params.jahr : jahrgaenge[0];
    throw redirect({ to: "/neuland/gewinner/$jahr", params: { jahr }, statusCode: 301 });
  },
});
