import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#6FCE91', //vert
                secondary: '#FFAAAA', //rose
                accent: '#8c9eff', //bleu
                warning: '#FF3636', //orange
            },
        },
    },
})
export default vuetify
