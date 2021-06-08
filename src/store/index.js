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
      ],

      songIndex: undefined,

      token: undefined
    }
  },

  getters: {
    currentSong({ songs }) {
      let song = songs.songList[songs.songIndex];

      let regex = /\[([\d :：.  ]+)\](.+)/i;
      song.lyrics = song.lyric.split('\n').map(content => {
        let result = [];
        let matches = content.match(regex);
        if (matches) {
          let timeParts = matches[1].split(/[:：]{1}/);
          let secondsFormat = (timeParts[0] - 0) * 60 + (timeParts[1] - 0);
          result = [secondsFormat, matches[2]]
        } else {
          result = [undefined, content]
        }
        return result;
      });
      return song;
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