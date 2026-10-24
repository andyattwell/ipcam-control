import { createWebHashHistory, createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import('@/frontend/components/Dashboard.vue')
  },
  {
    path: "/camera/:cameraID?",
    alias: "/camera/:cameraID?",
    name: "camera",
    props: true,
    component: () => import('@/frontend/components/Camera/Camera.vue')
  }
];

const router = createRouter({
  // history: createWebHistory(),
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes,
});

export default router;