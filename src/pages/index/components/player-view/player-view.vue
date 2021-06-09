<template>
  <view class="container">
    <view :class="{'wrapper': true, 'appear': appear, 'leave': !appear}">

      <!-- start -->
      <view 
        class="back" 
        decode='true'
        @click="close"
      >
        {{'&lt;'}}
      </view>
      <!-- end -->

      <!-- start -->
      <view :class="{'cover': true, 'play': status === 'playing' }">
          <view class="cover-image" v-if="status !== 'playing'">
            <image class="image" v-if="song.cover" :src="song.cover" alt="" srcset=""></image>
          </view>
          <view class="iconfont icon-music-1" v-if="status === 'playing'"></view>
          <view class="iconfont icon-music-2" v-if="status === 'playing'"></view>
      </view>
      <!-- end -->

      <!-- start -->
      <view 
        :class="{'process': true, 'play': status === 'playing' }"
        @click="jumpProcess"
      >
        <view class="bar-value" :style="{'width': processPercent}"></view>

        <view 
          class="bar-button"
          @touchmove="updateBarValue"
          :style="{'left': processPercent}"
        ></view>

        <view class="time current-time">{{ currentTime }}</view>
        <view class="time end-time">{{ formatTime(songDuration) }}</view>
      </view>
      <!-- end -->

      <!-- start -->
      <view :class="{'title': true, 'play': status === 'playing' }">

        <view class="song-name">{{ song.name || 'Unknow' }}</view>

        <view class="author">{{ song.singer || 'Unknow' }}</view>

        <!-- 参考之前163music 案例 -->
        <view class="lyric">
          <li v-if="song.lyrics === undefined || song.lyrics.length === 0">No Lyric...</li>
          <li v-else>{{ currentLyric }}</li>
        </view>
      </view>
      <!-- end -->

      <!-- start -->
      <view :class="{'operate': true, 'play': status === 'playing' }">

        <view class="play-button" @click="switchStatus">
          <view class="iconfont icon-stop" v-if="status === 'playing'"></view>
          <view class="iconfont icon-play" v-else></view>

          <view class="bg-circle c-blue"></view>
          <view class="bg-circle c-dpurple"></view>
          <view class="bg-circle c-red"></view>
          <view class="bg-circle c-purple"></view>
          <view class="bg-circle c-pink"></view>
          <view class="bg-circle c-dblue"></view>
        </view>

        <view class="circle-operate pre-button" @click="changeSong('previous')">
          <view class="iconfont icon-previous"></view>
        </view>

        <view class="circle-operate next-button" @click="changeSong('next')">
          <view class="iconfont icon-next"></view>
        </view>

        <view class="circle-operate config-button" @click="$emit('switchView', 'PlayerConfig')">
          <view class="iconfont icon-set"></view>
        </view>

        <view class="circle-operate mode-button" @click="switchMode">
          <view class="iconfont icon-loop" v-if="mode === 'loop'"></view>
          <view class="iconfont icon-random" v-if="mode === 'random'"></view>
          <view class="iconfont icon-infinity" v-if="mode === 'infinity'"></view>
        </view>

      </view>
      <!-- end -->

    </view>
  </view>
</template>

<script>
export default {
  props: {
    updateConfig: {
      type: Function,
      required: true
    },
  },

  data() {
    return {
      song: {lyrics: []},
      status: 'choose',
      mode: 'infinity',
      lyricIndex: 0,
      process: 0,
      MAX_PROCESS: 275,
      appear: true,
      audioContext: null,
      currentTime: '0:00',
      songDuration: 0,
    }
  },

  created() {
    this.restoreConfig();
    this.song = this.$store.getters.currentSong;
  },

  beforeMount() {
    this.loadSong({autoStart: false, startTime: 0});
  },

  methods: {
    restoreConfig() {
      let storeConfig = this.$store.state.config;
      this.mode = storeConfig.playMode;
    },

    switchStatus() {
      this.status = this.status === 'choose' ? 'playing' : 'choose';
      if (this.status === 'choose') {
        this.audioContext.pause();
      } else {
        this.audioContext && this.audioContext.paused && this.audioContext.play();
      }
    },

    switchMode() {
      switch (this.mode) {
        case 'loop':
          this.mode = 'random'
          break;
        case 'random':
          this.mode = 'infinity'
          break;
        default:
          this.mode = 'loop'
      }

      this.updateConfig({playMode: this.mode});
    },

    changeSong(direction) {
      let songIndex = this.$store.state.songs.songIndex;
      if (direction === 'next') {
        this.$store.commit('chooseSong', songIndex + 1);
      } else {
        this.$store.commit('chooseSong', songIndex - 1);
      }

      this.audioContext?.destroy();
      this.audioContext = null;
      this.lyricIndex = 0;
      this.loadSong({ autoStart: this.status === 'playing', seek: 0});
    },

    loadSong(option) {
      this.$store.dispatch('getToken', (token) => {
        let songUrl = 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3';
        if(this.song.url && token) {
          songUrl = this.song.url + '?token=' + token;
        }
        option.url = songUrl;
        this.configSong(option);
      });
    },

    configSong(option) {
      option = option || {};
      this.audioContext = uni.createInnerAudioContext();
      this.audioContext.autoplay = true;
      this.audioContext.src = option.url;
      this.audioContext.volume = this.$store.state.config.volume;
      this.audioContext.onCanplay(() => {
        if (this.mode === 'loop') {
          this.audioContext.loop = true;
        }
      });

      this.audioContext.onPlay(() => {
        this.songDuration = Math.ceil(this.audioContext.duration);
        this.waitFor(() => {
          this.songDuration = Math.ceil(this.audioContext.duration);
          return this.audioContext.duration !== 0 && this.audioContext.duration !== undefined;
        }, 10);
        this.audioContext.startTime = (option.startTime || 0);
      });

      this.audioContext.onTimeUpdate(() => {
        this.updateTime();
        this.updateLyric();
      });

      this.audioContext.onEnded((res) => {
        if (this.mode === 'infinity') {
          this.changeSong('next');
        } else if (this.mode === 'random') {

        }
      });

      this.audioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });

      !option.autoStart && this.audioContext.pause();
    },

    waitFor(callback, maxWaitTime) {
      let timer = setInterval(() => {
        if(callback()) {
          clearInterval(timer)
        }
      }, 50);

      setTimeout(() => {
        clearInterval(timer);
      }, maxWaitTime * 1000)
    },

    updateTime() {
      let currentTime = Math.ceil(this.audioContext.currentTime);
      let newTime = this.formatTime(currentTime);
      if (newTime !== this.currentTime) {
        let process = currentTime / this.songDuration * this.MAX_PROCESS;
        this.process = process.toFixed(2);
        this.currentTime = newTime;
      }
    },

    updateLyric() {
      let currentTime = this.audioContext.currentTime - 0;
      if (this.lyricIndex === 0) {
        this.lyricIndex = 0;
        for (let i = 0; i < this.song.lyrics.length; i++) {
          const lyric = this.song.lyrics[i];
          if (currentTime <= lyric[0]) {
            this.lyricIndex = i;
            return;
          }
        }
        this.lyrics = -1;
      } else if (this.lyricIndex !== -1) {
        let lyric = this.song.lyrics[this.lyricIndex+1];
        if (lyric === undefined) {
          this.lyricIndex = -1;
          return;
        }
        if (lyric[0] <= currentTime) {
          this.lyricIndex++;
        }
      }
    },

    jumpProcess(event) {
      let x = event.touches[0].clientX - 55;
      x = x < 0 ? 0 : x;
      this.process = x / 300 * this.MAX_PROCESS;

      let timePosition = this.songDuration * x / 300;
      
      this.audioContext.pause();
      this.audioContext.onSeeked(() => {
        this.audioContext.play();
        this.audioContext.offSeeked();
      });
      this.audioContext.seek(Math.floor(timePosition));
    },

    updateBarValue(event) {
      event.stopPropagation();
      let currentX = event.touches[0].pageX;
			let currentY = event.touches[0].pageY;
			let tx = currentX - (this.lastX || currentX);
			let ty = currentY - (this.lastY || currentY);

			if (
        Math.abs(ty) < 20 
        && this.process >= 0 
        && this.process <= this.MAX_PROCESS
      ) {
        let newValue = this.process + tx;
        newValue = newValue > this.MAX_PROCESS ? this.MAX_PROCESS : newValue;
        newValue = newValue < 0 ? 0 : newValue;

        if (newValue !== this.process) {
          this.process = newValue;
        }
			}

			this.lastX = currentX;
			this.lastY = currentY;
    },

    close () {
      this.appear = false;
      this.audioContext?.pause();
      this.audioContext?.destroy();

      setTimeout(() => {
        this.$emit('switchView', 'back')
      }, 500)
    },

    formatTime(time) {
      let minutes = Math.floor(time / 60) ;
      let seconds = time - (60 * minutes);
      seconds = seconds < 10 ? '0' + seconds : seconds;
      return minutes + ':' + seconds;
    }
  },

  computed: {
    processPercent() {
      let value = this.process / 275 * 100;
      return value.toFixed(2) + '%';
    },

    currentLyric() {
      if( this.song.lyrics && this.song.lyrics.length > 0 ) {
        let index = this.lyricIndex;
        if (index === -1) {
          index = this.song.lyrics.length - 1;
        }
        return this.song.lyrics[index][1];
      }
      return '';
    }
  },

  watch: {
    '$store.state.songs.songIndex': {
      handler() {
        this.song = this.$store.getters.currentSong;
        this.process = 0;
      }
    },

    '$store.state.config.volume': {
      handler() {
        let volume = this.$store.state.config.volume / 100;
        this.audioContext.volume = volume;
      }
    },
  },
}
</script>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 10;
  }

  .container > .wrapper {
    width: 100%;
    height: 100%;
    padding: 30rpx;
    background: #281d38;
    background: linear-gradient(0deg, #281d38 0%, #22192e 30%, #1e1629 100%);    
    box-shadow: inset 0 0 40rpx 10rpx #3d2c53;
    color: #fff;
    @include flex-layout(flex-start, center, column);

    &.appear {
      animation: slideInUp .6s ease-out 0s;
    }

    &.leave {
      animation: slideOutDown .6s ease-out 0s;
    }

    .back {
      position: absolute;
      top: 10rpx;
      left: 35rpx;
      color: #594277;
      font-size: 52rpx;
      font-weight: 600;
      text-shadow: 1rpx 1rpx 5rpx #b988fa;
    }

    .cover {
      margin-top: 50rpx;
      width: 550rpx;
      height: 520rpx;
      border-radius: 50rpx;
      background: #000;

      &.play {
        animation: fadeIn .6s ease-out 0s;
        color: #de2398;
        font-size: 250rpx;
        background: #29193b;
        box-shadow: 
          inset 0 0 70rpx 20rpx #3f295a,
          0 0 40rpx 1rpx #0e0818;
        position: relative;
        
        .iconfont {
          position: absolute;
          text-shadow: 2rpx 0 30rpx #8604ad;

          &.icon-music-2 {
            left: 10%;
            top: 20%;
          }
          &.icon-music-1 {
            right: 15%;
            top: 40%;
          }
        }
      }

      .cover-image {
        width: 100%;
        height: 100%;
        border-radius: 50rpx;
        overflow: hidden;
        .image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .process {
      width: 550rpx;
      margin: 77rpx 0;
      display: none;
      position: relative;
      
      &.play {
        display: block;
        height: 10rpx;
        border-radius: 10rpx;
        background: #362649;
        animation: bounceIn .5s ease-out 0s;

        .bar-value {
          height: 100%;
          transition: width 30ms;
          background: linear-gradient(90deg, #63209b 0%, #f728a8 100%);
        }

        .bar-button {
          width: 38rpx;
          height: 38rpx;
          border-radius: 50%;
          box-shadow: 0 0 20rpx 1rpx #f728a8;
          background: #ffffff;
          position: absolute;
          top: -14rpx;
          margin-left: -19rpx;
          transition: left 30ms;

          &::after {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20rpx;
            height: 20rpx;
            border-radius: 50%;
            background: #e92092;
          }
        }

        .time {
          color: #6c6377;
          font-size: 22rpx;
          font-weight: 600;
          position: absolute;
          top: 300%;

          &.current-time {
            left: 0;
          }

          &.end-time {
            right: 0;
          }
        }
      }

    }

    .title {
      margin-top: 35rpx;
      width: 540rpx;
      text-align: center;

      .song-name,
      .author,
      .lyric {
        word-break: keep-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .song-name {
        margin-top: 0rpx;
        font-size: 40rpx;
        font-weight: 600;
      }

      .author {
        font-size: 32rpx;
        color: #918a9b;
      }

      .lyric {
        display: none;
        font-size: 30rpx;
        font-weight: 600;
        height: 43rpx;
        overflow: hidden;
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
      width: 600rpx;
      height: 310rpx;
      margin-top: 50rpx;
      text-align: center;
      position: relative;
      z-index: 1;
      @include flex-center();
      transition: all .5s;

      .play-button {
        width: 250rpx;
        height: 250rpx;
        border-radius: 50%;
        position: relative;
        background: #1c0f2e;
        font-size: 80rpx;
        @include flex-center();
        transition: all .5s;

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          z-index: -1;

          &.c-blue {
            background: #4b5dfc;
            width: 109%;
            height: 109%;
            left: -12%;
            top: -8%;
            box-shadow: 0 0 20rpx 1rpx #1c0f2e;
          }
          &.c-dpurple {
            background: #831af9;
            width: 90%;
            height: 98%;
            left: -9%;
            bottom: -3%;
          }
          &.c-red {
            background: #f7277e;
            width: 108%;
            height: 100%;
            right: -10%;
            bottom: -10%;
          }
          &.c-purple {
            background: #ae1ecb;
            width: 100%;
            height: 90%;
            right: -8%;
            top: -1%;
          }
          &.c-pink {
            background: #d523a3;
            width: 100%;
            height: 90%;
            right: -4%;
            bottom: -4%;
          }
          &.c-dblue {
            background: #5140ff;
            width: 90%;
            height: 90%;
            left: -3%;
            top: -3%;
          }
        }
      }

      .circle-operate {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: rgba(93, 70, 122, .5);
        @include flex-center();
        position: absolute;
        transition: all .5s;
      }

      .pre-button {
        left: 0;
      }

      .next-button {
        right: 0;
      }

      .config-button {
        top: 95%;
        left: 10%;
      }
      
      .mode-button {
        top: 95%;
        right: 10%;

        .icon-infinity {
          font-size: 26rpx;
        }
      }

      &.play {
        .play-button {
          width: 200rpx;
          height: 200rpx;
          font-size: 60rpx;

          .bg-circle {
            transition: box-shadow .5s;

            &.c-blue {
              box-shadow: 0 0 35rpx 2rpx #4b5dfc;
            }
            &.c-dpurple {
              box-shadow: 0 0 35rpx 2rpx #831af9;
            }
            &.c-red {
              box-shadow: 0 0 35rpx 2rpx #f7277e;
            }
            &.c-purple {
              box-shadow: 0 0 35rpx 2rpx #ae1ecb;
            }
            &.c-pink {
              box-shadow: 0 0 35rpx 2rpx #d523a3;
            }
            &.c-dblue {
              box-shadow: 0 0 40rpx 3rpx #5140ff;
            }
          }
        }

        .pre-button {
          left: 12%;
        }

        .next-button {
          right: 12%;
        }

        .config-button {
          top: 50%;
          transform: translateY(-50%);
          left: -6%;
        }
        
        .mode-button {
          top: 50%;
          transform: translateY(-50%);
          right: -6%;
        }
      }
    }
  }
</style>