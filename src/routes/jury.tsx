import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jury")({
  beforeLoad: () => {
    throw redirect({ to: "/neuland/jury", statusCode: 301 });
  },
});
