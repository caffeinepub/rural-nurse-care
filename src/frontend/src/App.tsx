import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { NurseProfilePage } from "./pages/NurseProfilePage";
import { NurseRegisterPage } from "./pages/NurseRegisterPage";
import { NursesPage } from "./pages/NursesPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster richColors position="top-right" />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const nursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nurses",
  component: NursesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    pincode: typeof search.pincode === "string" ? search.pincode : undefined,
  }),
});

const nurseProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nurses/$id",
  component: NurseProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminHiddenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-hidden-access",
  component: AdminDashboardPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: NurseRegisterPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  nursesRoute,
  nurseProfileRoute,
  adminRoute,
  adminHiddenRoute,
  registerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
