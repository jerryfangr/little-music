import Vue from 'vue'
import Vuex from 'vuex'
import request from '../utils/reuqest';
import API from '@/assets/api';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    config: {
      voice: 100,
      playMode: 'random'
    },

    songs: {
      songList: [
        { name: '占位歌曲1', singer: '歌手1' },
        { name: '占位歌曲2', singer: '歌手2' },
        { name: '占位歌曲3', singer: '歌手3' },
      ],

      songIndex: undefined,

      token: undefined
    }
  },

  getters: {
    currentSong({ songs }) {
      return songs.songList[songs.songIndex]
    },
  },

  mutations: {
    updateConfig(state, newConfig) {
      for (const key in newConfig) {
        state.config[key] = newConfig[key];
      }
    },

    chooseSong({ songs }, songIndex) {
      if (songIndex >= 0 && songIndex < songs.songList.length) {
        songs.songIndex = songIndex;
      }
    },

    setSongs({ songs }, songList) {
      songs.songList = songList;
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
    },

    fetchMusic({ commit }) {
      return request({
        url: API.music,
        title: '载入歌曲..',
        limitTime: 20 * 1000,
      }).then(data => {
        let songList = data.result || {};
        let songListCopy = JSON.parse(JSON.stringify(songList));
        songListCopy.forEach(song => {
          song.url = API.base + song.url;
        });

        commit('setSongs', songListCopy);
        return songListCopy;
      })
    },

    getToken(store, callback) {
      return uni.request({
        url: API.token,
        success: (res) => {
          callback(res.data?.result?.token)
        }
      });
    }
  },

  // modules: {}
})

export default store;