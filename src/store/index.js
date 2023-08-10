/**
 * @author YuGao
 */
// import { createStore } from "vuex";
// export default createStore({
//   state: {},
//   mutations: {},
//   actions: {},
//   modules: {},
// });

// https://pinia.vuejs.org/zh/core-concepts/
import { createPinia } from 'pinia'
// https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
import { createPersistedState } from 'pinia-plugin-persistedstate'
// import { theme } from './theme';


const pinia = createPinia()
pinia.use(createPersistedState())

// export { theme };
export default pinia;
