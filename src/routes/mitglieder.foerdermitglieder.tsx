import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mitglieder/foerdermitglieder")({
  beforeLoad: () => {
    throw redirect({ to: "/mitglieder", statusCode: 301 });
  },
});
