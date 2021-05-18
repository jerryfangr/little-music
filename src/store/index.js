import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: {
      voice: 100,
      playOrder: 'random'
    }
  },

  mutations: {
    updateConfig(state, newConfig) {
      for (const key in newConfig) {
        state.config[key] = newConfig[key];
      }
    }
  },

  actions: {
    updateConfig(context, config, success, fail) {
      context.commit('updateConfig', config);
      uni.setStorage({
        key: 'config',
        data: this.config,
        success,
        fail
      })
    },

    restoreConfig(context, success, fail) {
      uni.getStorage({
        key: 'config',
        success: ({ data }) => {
          context.commit('updateConfig', data);
          success?.(data);
        },
        fail
      })
    }
  },

  // modules: {}
})

export default store;