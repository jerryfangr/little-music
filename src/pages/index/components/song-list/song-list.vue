<template>
  <view class="container">
    <!-- icon title start -->
    <view class="icon icon-bubble-background">
      <view class="iconfont icon-infinity"></view>
    </view>
    <!-- icon title end -->

    <!-- start -->
    <scroll-view class="song-list" scroll-y>
      <view 
        class="song-item" 
        v-for="(song, index) in songList" 
        :key="index"
        @click="chooseSong(index)"
        @changeSong="chooseSong"
      >
        {{ song.name }}
      </view>
    </scroll-view>
    <!-- end -->

  </view>
</template>

<script>

export default {
  created() {
    this.$store.dispatch('fetchMusic').then((songList) => {
      this.songList = songList;
    })
  },

  data() {
    return {
      songList: [],
    }
  },

  methods: {
    chooseSong(index) {
      this.$store.commit('chooseSong', index);
      this.$emit('switchView', 'PlayerView')
    }
  },
}
</script>

<style lang="scss" scoped>
  .container {
		@include flex-layout(space-between, center, column);
    width: 100%;
    height: 100%;

    .icon {
      @include flex-layout(center, center, column);
      height: 40%;
      width: 100%;

      .iconfont {
        color: #980baf;
        font-size: 220rpx;
        text-shadow: 0 0 30rpx #8919d4;
      }
    }

    .song-list {
      width: 100%;
      height: 60%;

      .song-item {
        margin: 0 auto;
        width: 85%;
        padding: 35rpx 0;
        text-align: left;
        text-indent: 1em;
        color: #f6f6f7;
        font-weight: 600;
        border-radius: 20rpx;
        word-break: keep-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
</style>