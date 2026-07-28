import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/verein/mitglied-werden")({
  beforeLoad: () => {
    throw redirect({ to: "/mitglied-werden", statusCode: 301 });
  },
});
