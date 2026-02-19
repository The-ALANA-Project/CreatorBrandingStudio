import { createBrowserRouter } from "react-router";
import Studio from "./pages/Studio";
import Intro from "./pages/Intro";

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
    path: "*",
    Component: Intro, // Fallback to intro for any unknown routes
  },
]);