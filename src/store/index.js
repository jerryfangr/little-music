import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: {
      voice: 100,
      playMode: 'random'
    },

    songs: {
      songList: [
        { name: '歌曲1asdsadasdsadsadsadasdasdasdsadsadasdasdsadsadasdsa', singer: '歌手1' },
        { name: '歌曲2', singer: '歌手2' },
        { name: '歌曲3', singer: '歌手3' },
        { name: '歌曲4', singer: '歌手5' },
        { name: '歌曲5', singer: '歌手5' },
        { name: '歌曲6', singer: '歌手6' },
        { name: '歌曲7', singer: '歌手7' },
        { name: '歌曲8', singer: '歌手8' },
        { name: '歌曲9', singer: '歌手9' },
      ],

      songIndex: undefined
    }
  },

  getters: {
    currentSong({ songs }) {
      return songs.songList[songs.songIndex]
    }
  },

  mutations: {
    updateConfig(state, newConfig) {
      for (const key in newConfig) {
        state.config[key] = newConfig[key];
      }
    },

    chooseSong({ songs }, songIndex) {
      if (songIndex >= 0 && songIndex < songs.songList.length) {
        console.log('new songIndex', songIndex);
        songs.songIndex = songIndex;
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