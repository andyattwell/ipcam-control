// import Vue from 'vue';
import { createStore } from 'vuex';
import camera from './camera';

// Vue.use(Vuex);

const store = createStore({
  modules: {
    camera
  }
});

export default store;