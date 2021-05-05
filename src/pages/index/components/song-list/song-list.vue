<template>
  <view class="container">
    <!-- icon title start -->
    <icon-font iconName="infinity"></icon-font>
    <!-- icon title end -->

    <scroll-view class="song-list" scroll-y>
      <view class="song-item" v-for="(song, index) in songList" :key="index">
        {{song.name}}
      </view>
    </scroll-view>


  </view>
</template>

<script>
import IconFont from '@/components/icon-font/icon-font.vue';

export default {
  options: { styleIsolation: 'shared' },

  components: {
    IconFont
  },

  data() {
    return {
      songList: [
        {name: '歌曲1', singer: '歌手1'},
        {name: '歌曲2', singer: '歌手2'},
        {name: '歌曲3', singer: '歌手3'},
        {name: '歌曲4', singer: '歌手4'},
        {name: '歌曲4', singer: '歌手4'},
        {name: '歌曲4', singer: '歌手4'},
        {name: '歌曲4', singer: '歌手4'},
        {name: '歌曲4', singer: '歌手4'},
        {name: '歌曲4', singer: '歌手4'},
      ]
    }
  },


  methods: {
    chooseSong(index) {

    }
  },
}
</script>

<style lang="scss" scoped>
  .container {
		@include flex-layout(space-between, center, column);
    width: 100%;
    height: 100%;

    & /deep/ .iconfont {
      color: #980baf;
      font-size: 230rpx;
      text-shadow:16rpx 16rpx 7rpx #6f14ac;
    }

    .song-list {
      width: 100%;
      height: 75%;

      .song-item {
        margin: 0 auto;
        width: 90%;
        padding: 40rpx 0;
        text-align: center;
        color: #f6f6f7;
        background: #2c1b40;
        font-weight: 600;
        margin-top: 18rpx;
        border-radius: 20rpx;
        box-shadow: inset 0 0 20rpx 18rpx #452c61;

      }
    }
  }
</style>