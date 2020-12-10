// Ce fichier sert a stocker des variables global. Comme la methodes $_SESSION de php 


import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    // state sont les variables globales initialisées 
    state: {
        customerId: null,
        runnerId: null,
        addrCustomerId: null,
    },
    // mutations sont les fonctions quoi permettent de modifier les state
    mutations: {
        // loginCustomer(state, customerId) stocke dans customerId l'id du Customer qui est connectée
        loginCustomer(state, customerId) {
            state.customerId = customerId;
        },

        // logoutCustomer(state) A la deconnexion reinitialise customerId à null pour la prochaine connection
        logoutCustomer(state) {
            state.customerId = null;
            state.addrCustomerId = null
        },
        // loginRunner(state, runnerId) stocke dans runnerId l'id du Runner qui est connectée
        loginRunner(state, runnerId) {
            state.runnerId = runnerId;
        },
        // logoutRunner(state) A la deconnexion reinitialise runnerId à null pour la prochaine connection
        logoutRunner(state) {
            state.runnerId = null;
        },
        addAddrCustomer(state, addrCustomerId) {
            state.addrCustomerId = addrCustomerId
        },
        removeAddrCustomer(state) {
            state.addrCustomerId = null
        },


    },
    actions: {

    },
    modules: {},
    plugins: [createPersistedState()]
})