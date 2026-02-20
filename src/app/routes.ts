import { createBrowserRouter } from "react-router";
import Studio from "./pages/Studio";
import Intro from "./pages/Intro";
import Resources from "./pages/Resources";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Intro,
  },
  {
    path: "/studio",
    Component: Studio,
  },
  {
    path: "/resources",
    Component: Resources,
  },
  {
    path: "*",
    Component: Intro, // Fallback to intro for any unknown routes
  },
]);