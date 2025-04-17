import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Home from '../views/home/index.vue';
import Test from '../views/test/index.vue';
import FormPage from '../views/mobile/FormPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/mobile',
    name: 'FormPage',
    component: FormPage
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

 // 检测是否为移动设备
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 添加路由守卫
router.beforeEach((to, from, next) => {
  if (isMobile() && to.path !== '/mobile') {
    next('/mobile');
  } else {
    next();
  }
});

export default router;