<template>
  <view class="container">
    <!-- icon title start -->
    <view class="icon icon-bubble-background">
      <icon-font iconName="infinity"></icon-font>
    </view>
    <!-- icon title end -->

    <scroll-view class="song-list" scroll-y>
      <view 
        class="song-item" 
        v-for="(song, index) in songList" 
        :key="index"
        @click="chooseSong(index)"  
      >
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

    .icon {
      @include flex-layout(center, center, column);
      height: 40%;
      width: 100%;

      & /deep/ .iconfont {
        color: #980baf;
        font-size: 220rpx;
        // text-shadow:14rpx 14rpx 7rpx #6f14ac;
        text-shadow: 0 0 10rpx #7c11c4;
      }
    }


    .song-list {
      width: 100%;
      height: 60%;

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