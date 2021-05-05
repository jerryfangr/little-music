<template>
  <i :class="'iconfont icon-' + iconName"></i>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      required: true
    }
  }
}
</script>