<template>
  <view class="container">
    <!-- start -->
    <view class="config-bar">
      <view class="bar-list">
        <view class="bar-item" v-for="(config, index) in configItems" :key="index">
          
          <view class="bar-value" :style="{'height': config.value + '%'}"></view>

          <view 
            class="bar-button"
            :style="{'bottom': config.value + '%'}"
            @click="changeItem(index)"
            @touchmove="updateBarValue($event, index)"
          >
            <li class="icon-line"></li>
            <li class="icon-line"></li>
            <li class="icon-line"></li>
          </view>

        </view>
      </view>

      <view class="bar-name">{{ configInfo }}</view>
    </view>
    <!-- end -->

    <!-- start -->
    <view class="operate">
      <button class="save" @click="saveConfig">save</button>
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
    configInfo() {
      let item = this.configItems[this.currentConfig];
      return item.name + ': ' + item.value;
    }
  },

  methods: {
    changeItem(index) {
      this.currentConfig = index;
    },

    saveConfig() {
      let newConfig = {};
      this.configItems.forEach(config => {
        newConfig[config.name] = config.value;
      })

      this.updateConfig(newConfig);
    },

    updateBarValue(event, index) {
      if (index !== this.currentConfig) {
        this.changeItem(index);
      }
      let currentX = event.touches[0].pageX;
			let currentY = event.touches[0].pageY;
      let lastX = this.lastX || currentX;
      let lastY = this.lastY || currentY;
			let tx = currentX - lastX;
			let ty = currentY - lastY;
      let value = ty >= 0 ? -1 : 1;

			if (Math.abs(tx) < 20) {
        let configItem = this.configItems[this.currentConfig];

				if (configItem.value >= 0 && configItem.value <= 100) {
          configItem.value += value;
          configItem.value = configItem.value > 100 ? 100 : configItem.value;
          configItem.value = configItem.value < 0 ? 0 : configItem.value;
				}
			}
			this.lastX = currentX;
			this.lastY = currentY;
    }
  },

}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;

    .config-bar {
      width: 100%;
      height: 70%;
      color: #fff;
      @include flex-layout(space-between, center, column);

      .bar-list {
        width: 60%;
        height: 70%;
        @include flex-layout(space-between, center);

        .bar-item {
          height: 80%;
          width: 20rpx;
          align-self: flex-end;
          border-radius: 20rpx;
          background: #342648;
          box-shadow: 0 0 5rpx 0 #4a3864;
          position: relative;
          @include flex-center();

          .bar-value {
            align-self: flex-end;
            width: 100%;
            border-radius: 20rpx;
            background: linear-gradient(0deg, #881afc 0%, #8f1bec 20%, #c3227f 100%);
          }

          .bar-button {
            width: 40rpx;
            height: 55rpx;
            padding: 8rpx 0;
            background: #ffffff;
            border-radius: 10rpx;
            box-shadow: 0 0 30rpx 1rpx rgba(209, 37, 160, 0.8);
            position: absolute;
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);

            @include flex-layout(space-evenly, center, column);

            .icon-line {
              width: 80%;
              height: 5rpx;
              border-radius: 5rpx;
              background: linear-gradient(0deg, #c3227f 0%, #881afc 100%);
            }
          }
        }
      }

      .bar-name {
        width: 60%;
        height: 120rpx;
        border-radius: 48rpx;
        background: #362648;
        @include flex-center();
        font-size: 35rpx;
        font-weight: 600;
      }
    }

    .operate {
      width: 100%;
      height: 30%;
      @include flex-center();

      .save {
        color: #fff;
        background: linear-gradient(90deg, #c3227f 0%, #881afc 100%);
        width: 90%;
        font-size: 38rpx;
        font-size: 600;
        padding: 17rpx 0;
        border-radius: 40rpx;
      }
    }

  }
</style>