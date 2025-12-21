import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("./components/home.vue") },
    { path: "/notes", component: () => import("./components/notes.vue") },
    { path: "/finance", component: () => import("./components/finance.vue") },
    // {path: '/cards/addCard',component: () => import('./components/cards/addCard.vue'),},
    // {path: '/cards/delCard',component: () => import('./components/cards/delCard.vue'),},
    // {path: '/roomList',component: () => import('./components/roomList.vue')},
    // {path: '/classroomManage',component: () => import('./components/manage.vue')},
    // {path: '/classroomReserve',component: () => import('./components/apply.vue')}
  ],
});
