<template>
  <view class="container">
    <view class="set-bar">
      <view class="bar-list"></view>
      <view class="bar-name"></view>
    </view>
    <view class="operate">
      <button class="save"></button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    updateConfig: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>