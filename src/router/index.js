import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminView'),
    redirect: '/admin/Coupon',
    children: [
      {
        path: 'Coupon',
        component: () => import(/* webpackChunkName: "about" */ '../views/CouponView.vue')
      },
      {
        path: 'RmBooks',
        component: () => import(/* webpackChunkName: "about" */ '../views/RmBookView.vue')
      },
      {
        path: 'NewBooks',
        component: () => import(/* webpackChunkName: "about" */ '../views/NewBooksView.vue')
      },
      {
        path: 'BookType',
        component: () => import(/* webpackChunkName: "about" */ '../views/BookTypeView.vue')
      }
      // 用户详情页的路由规则
      // { path: 'userinfo/:id', component: UserDetail, props: true }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
