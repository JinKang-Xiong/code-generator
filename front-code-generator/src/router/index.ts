import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useCounterStore } from '../stores/counter'
import { UserCurrentAPI } from '../api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: (to, from) => {
        const counter = useCounterStore()
        const token = localStorage.getItem('token')
        UserCurrentAPI(token).then(res => {
          if (res.code === 0) {
            counter.userlogin = { ...res.data }
            console.log(counter.userlogin)
            return { path: to.path }
          } else {
            return false
          }
        })
      },
      children: [
        {
          path: 'code-manager',
          name: 'code-manager',
          component: () => import('../views/Home/CodeManager.vue')
        },
        {
          path: 'search-manager',
          name: 'search-manager',
          component: () => import('../views/Home/SearchManager.vue')
        },
        {
          path: 'add-code/:id',
          name: 'add-code',
          props: true,
          component: () => import('../views/Home/AddCodeGenerator.vue')
        },
        {
          path: 'detail-code/:id',
          name: 'detail-code',
          props: true,
          component: () => import('../views/Home/DetailCode.vue')
        },
        {
          path: 'use-code:/:id',
          name: 'use-code',
          props: true,
          component: () => import('../views/Home/UseCode.vue')
        }
      ],

    }

  ]
})

export default router
