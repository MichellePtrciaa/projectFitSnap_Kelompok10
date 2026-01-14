import { createBrowserRouter } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./protectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import("../pages/auth/signIn/signIn");
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
        path: "comment/:id",
        lazy: async () => {
          const module = await import("../pages/fitSnap/comment");
          return { Component: module.default };
        },
      },
      {
        path: "post",
        lazy: async () => {
          const module = await import("../pages/Dashboard");
          return { Component: module.default };
        },
      },
      {
        path: "postModel",
        lazy: async () => {
          const module = await import("../pages/fitSnap/postModel");
          return { Component: module.default };
        },
      },
      {
        path: "addPost",
        lazy: async () => {
          const module = await import("../pages/fitSnap/addPost");
          return { Component: module.default };
        },
      },
      {
        element: React.createElement(ProtectedRoute),
        children: [
          {
            path: "profile",
            lazy: async () => {
              const module = await import("../pages/profile/profile");
              return { Component: module.default };
            },
          },
        ],
      },
    ],
  },
]);

export default router;
