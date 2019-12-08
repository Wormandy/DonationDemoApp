import Vue from 'vue'
import VueRouter from 'vue-router'
import DonationForm from '@/views/DonationForm.vue'
import Login from '@/views/Login.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import NotFound from '@/views/NotFound.vue'
import EditProfile from '@/views/EditProfile.vue'
import EditRecurring from '@/views/EditRecurring.vue'
import ViewProfile from '@/views/ViewProfile.vue'
import AuthGuard from './auth-guard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Donate' }
  },
  {
    path: '/donate',
    name: 'Donate',
    component: DonationForm,
    props: true,
    ref: 'DonationForm',
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/profile',
    component: ProfilePage,
    beforeEnter: AuthGuard,
    children: [
      {
        path: '/',
        name: 'ViewProfile',
        component: ViewProfile,
        beforeEnter: AuthGuard
      },
      {
        path: 'edit',
        name: 'ProfileEdit',
        component: EditProfile,
        beforeEnter: AuthGuard
      },
      {
        path: 'recurring',
        name: 'EditRecurring',
        component: EditRecurring,
        beforeEnter: AuthGuard
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  beforeEach: (from, to, next) => {
    console.log(from, to)
    next()
  }
})

export default router
