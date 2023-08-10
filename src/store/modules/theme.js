import {
  defineStore
} from 'pinia';
import {
  createPersistedState
} from 'pinia-plugin-persistedstate';

export const themeStore = defineStore('main', {
      state: () => ({
        //theme: "light"
        theme: localStorage.getItem('theme') || 'light'
      }),
      actions: {
        changeTheme(theme) {
          this.theme = theme;
          localStorage.setItem('theme', theme);
        }
      },
      getters: {
        themeName: (themeName) => themeName,
      },
      persist: true
      // plugins: [createPersistedState()]
      })

    // export default createStore({
    //   state: () => ({
    //     theme: 'light', // 默认主题颜色为浅色
    //   }),
    //   mutations: {
    //     setTheme(state, theme) {
    //       state.theme = theme;
    //     },
    //   },
    //   getters: {
    //     theme: state => state.theme,
    //   },
    // });