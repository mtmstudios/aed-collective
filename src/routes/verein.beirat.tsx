import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/verein/beirat")({
  component: BeiratLayout,
});

function BeiratLayout() {
  return <Outlet />;
}
