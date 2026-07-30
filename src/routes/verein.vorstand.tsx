import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/verein/vorstand")({
  component: VorstandLayout,
});

function VorstandLayout() {
  return <Outlet />;
}
