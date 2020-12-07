import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },

    //Routes Clients
    {
        path: '/client/inscription',
        name: 'Inscription Client',
        component: () =>
            import ( /* webpackChunkName: "register" */ '../views/Customer/register.vue')
    },
    {
        path: '/client/dashboard',
        name: 'Dashboard Client',
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Customer/dashboard.vue')
    },
    {
        path: '/client/modifier/adresse',
        name: 'UpadteAddrClient',
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Customer/updateAddr.vue')
    },
    {
        path: '/client/modifier/profil',
        name: 'UpadteProfilClient',
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Customer/updateProfil.vue')
    },
    {
        path: '/client/ajouter/adresse',
        name: 'AddAddrClient',
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Customer/addAddress.vue')
    },
    {
        path: '/client/commandes',
        name: 'Commandes Client',
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Customer/dashboard/commandes.vue')
    },
    {
        path:'/client/profile', 
        name:'Client Profile', 
        component: () => 
            import('../views/Customer/dashboard/profile.vue')
    }, 

    //Routes Partenaires
    {
        path: '/partenaire/connexion',
        name: 'Connexion Partenaire',
        component: () =>
            import ( /* webpackChunkName: "authentification" */ '../views/Runner/authentification.vue')
    },
    {
        path: '/partenaire/inscription',
        name: 'Inscription Partenaire',
        component: () =>
            import ( /* webpackChunkName: "register" */ '../views/Runner/register.vue')
    },
    {
        path: '/partenaire/profil',
        name: 'Profil Partenaire',
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Runner/dashboard.vue')
    }
]

const router = new VueRouter({
    mode:'history',
    base: process.env.BASE_URL,
    routes
})

export default router