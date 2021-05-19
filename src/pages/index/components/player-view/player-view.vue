<template>
  <view class="container">
    <view class="cover"></view>

    <view class="process">
      <view class="bar-value"></view>

      <view class="bar-button"></view>

      <view class="time">
        <view class="current-time"></view>
        <view class="end-time"></view>
      </view>
    </view>

    <view class="title">
      <view class="song-name"></view>

      <view class="author"></view>
    </view>

    <view class="operate">
      <view class="play"></view>

      <view class="pre"></view>

      <view class="next"></view>
      
      <view class="config"></view>
    </view>
  </view>
</template>

<script>
export default {

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
    font-weight: 600;
    @include flex-layout(flex-start, center, column);


    .cover {
      width: 550rpx;
      height: 550rpx;
      background: #ccc;
    }

    .process {

    }

    .title {

    }

    .operate {

    }
  }
</style>