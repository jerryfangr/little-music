<template>
  <view class="container">
    <!-- start -->
    <view class="config-bar">
      <view class="bar-list">
        <view class="bar-item" v-for="(config, index) in configItems" :key="index">
          
          <view class="bar-wrapper"></view>

          <view class="bar-button">
            <li></li>
            <li></li>
            <li></li>
          </view>

        </view>
      </view>

      <view class="bar-name">{{ configName }}</view>
    </view>
    <!-- end -->

    <!-- start -->
    <view class="operate">
      <button class="save"></button>
    </view>
    <!-- end -->

  </view>
</template>

<script>
export default {
  props: {
    updateConfig: {
      type: Function,
      required: true
    }
  },

  created() {
    console.log('created');
    console.log('configItems', this.configItems);
  },

  data() {
    return {
      currentConfig: 1,

      configItems: [
        {
          name: 'config1',
          value: 50
        },
        {
          name: 'voice',
          value: 50
        },
        {
          name: 'config3',
          value: 50
        },
      ]
    }
  },

  computed: {
    configName() {
      return this.configItems[this.currentConfig].name;
    },

    saveConfig() {
      let newConfig = {};
      this.configItems.forEach(config => {
        newConfig[config.name] = config.value;
      })

      this.updateConfig(newConfig);
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
  }
</style>