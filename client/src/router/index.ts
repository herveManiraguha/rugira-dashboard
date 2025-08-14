import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Bots from '../views/Bots.vue'
import Strategies from '../views/Strategies.vue'
import Exchanges from '../views/Exchanges.vue'
import Compliance from '../views/Compliance.vue'
import Reports from '../views/Reports.vue'
import Backtesting from '../views/Backtesting.vue'
import Monitoring from '../views/Monitoring.vue'
import Admin from '../views/Admin.vue'
import Help from '../views/Help.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview,
      meta: { title: 'Trading Overview' }
    },
    {
      path: '/bots',
      name: 'bots',
      component: Bots,
      meta: { title: 'Trading Bots' }
    },
    {
      path: '/strategies',
      name: 'strategies',
      component: Strategies,
      meta: { title: 'Strategies' }
    },
    {
      path: '/exchanges',
      name: 'exchanges',
      component: Exchanges,
      meta: { title: 'Exchanges' }
    },
    {
      path: '/compliance',
      name: 'compliance',
      component: Compliance,
      meta: { title: 'Compliance' }
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      meta: { title: 'Reports' }
    },
    {
      path: '/backtesting',
      name: 'backtesting',
      component: Backtesting,
      meta: { title: 'Backtesting' }
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: Monitoring,
      meta: { title: 'Monitoring' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { title: 'Admin' }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: { title: 'Help' }
    }
  ]
})

router.beforeEach((to) => {
  document.title = `${to.meta.title} - Rugira Trading Dashboard`
})

export default router
