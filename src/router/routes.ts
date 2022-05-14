import { PomodoroRouter, TodoListRouter } from "src/enums/routes";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: TodoListRouter.Path,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: TodoListRouter.Name,
        path: TodoListRouter.Path,
        component: () => import("pages/TodoList.vue"),
        meta: { title: TodoListRouter.Title },
      },
      {
        name: PomodoroRouter.Name,
        path: PomodoroRouter.Path,
        component: () => import("pages/Pomodoro.vue"),
        meta: { title: PomodoroRouter.Title },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
