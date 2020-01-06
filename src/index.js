import Vue from 'vue';
import App from './App.vue';
import 'babel-polyfill';
import '@styles/index.css';
import '@styles/index.scss';

new Vue({
    render: h => h(App)
}).$mount('#app')
