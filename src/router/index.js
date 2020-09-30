import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/cs',
    name: 'Cs',
    component: ()=>import('@/views/Cs'),
    children: [
      {
        path: 'audit',
        name: 'Audit',
        component: ()=>import('@/components/Audit') // 审计分析
      },
      {
        path: 'log',
        name: 'Log',
        component:()=>import('@/components/Log')  // 日志管理
      },
      {
        path: 'rule',
        name: 'Rule',
        component:()=>import('@/components/Rule')  // 规则管理
      },
      {
        path: 'alarm',
        name: 'Alarm',
        component:()=>import('@/components/Alarm')  // 告警管理
      },
      {
        path: 'auditResult',
        name: 'AuditResult',
        component:()=>import('@/components/AuditResult')  // 审计结果
      },
      {
        path: 'alarmResult',
        name: 'AlarmResult',
        component:()=>import('@/components/AlarmResult')  // 告警结果
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
