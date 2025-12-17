import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import("../pages/Dashboard");
          return { Component: module.default };
        },
      },
      {
        path: "signUp",
        lazy: async () => {
          const module = await import("../pages/auth/signUp/signUp");
          return { Component: module.default };
        },
      },
      {
        path: "signIn",
        lazy: async () => {
          const module = await import("../pages/auth/signIn/signIn");
          return { Component: module.default };
        },
      },
      {
        path: "progress",
        lazy: async () => {
          const module = await import("../pages/fitSnap/progress");
          return { Component: module.default };
        },
      },
      {
        path: "add-progress",
        lazy: async () => {
          const module = await import("../pages/fitSnap/addProgress");
          return { Component: module.default };
        },
      },
      {
        path: "comment",
        lazy: async () => {
          const module = await import("../pages/fitSnap/comment");
          return { Component: module.default };
        },
      },
      {
        path: "dashboard",
        lazy: async () => {
          const module = await import("../pages/Dashboard");
          return { Component: module.default };
        },
      },
    ],
  },
]);

export default router;
