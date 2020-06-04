import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/store"
  },
  {
    path: "/ebook",
    component: () => import("../views/ebook/Ebook.vue"),
    children: [
      {
        path: ":fileName",
        component: () => import("../components/ebook/EbookReader.vue")
      }
    ]
  },
  {
    path: "/store",
    redirect: "/store/home",
    component: () => import("../views/store/Store.vue"),
    children: [
      {
        path: "shelf",
        component: () => import("../views/store/StoreShelf.vue")
      },
      {
        path: "home",
        component: () => import("../components/store/StoreHome.vue")
      },
      {
        path: "detail",
        component: () => import("../views/store/StoreDetail.vue")
      },
      {
        path: "list",
        component: () => import("../views/store/StoreList.vue")
      },
      {
        path: "category",
        component: () => import("../views/store/StoreCategory.vue")
      },
      {
        path: "speaking",
        component: () => import("../views/store/StoreSpeaking.vue")
      },
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
