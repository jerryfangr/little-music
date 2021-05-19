<template>
  <view class="container">
    <view class="cover"></view>

    <view :class="{'process': true, 'play': status === 'playing' }">
      <view class="bar-value"></view>

      <view class="bar-button"></view>

      <view class="time">
        <view class="current-time"></view>
        <view class="end-time"></view>
      </view>
    </view>

    <view class="{'title': true, 'play': status === 'playing' }">
      <view class="song-name">Ali LA LA</view>

      <view class="author">Apple, Trect</view>

      <view class="lyric">this is lyric</view>
    </view>

    <view :class="{'operate': true, 'play': status === 'playing' }">
      <view class="play">

      </view>

      <view class="pre"></view>

      <view class="next"></view>

      <view class="config"></view>

      <view class="mode"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      status: 'playing'
    }
  },

  methods: {
    switchStatus() {
      this.status = this.status === 'choose' ? 'playing' : 'choose';
    }
  },
}
</script>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    padding: 30rpx;
    background: #1d0f2f;
    box-shadow: inset 0 0 40rpx 10rpx #3d2c53;
    color: #fff;
    @include flex-layout(flex-start, center, column);


    .cover {
      width: 550rpx;
      height: 550rpx;
      background: rgb(196, 169, 19);
    }

    .process {
      width: 550rpx;
      height: 0;
      margin: 20rpx 0;
      &.play {
        height: 30rpx;
      }

      background: rgb(231, 84, 84);
    }

    .title {
      .song-name {
        font-size: 40rpx;
        font-weight: 600;
      }

      .author {
        font-size: 32rpx;
        color: #918a9b;
      }

      .lyric {
        display: none;
      }

      &.play {
        .song-name, .author {
          display: none;
        }

        .lyric {
          display: block;
        }
      }
    }

    .operate {
      .play {
        
      }
      .pre {
        
      }
      .next {
        
      }
      .config {
        
      }
      .mode {
        
      }
    }
  }
</style>