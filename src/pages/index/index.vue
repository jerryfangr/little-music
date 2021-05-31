<template>
	<view class="container">
		<song-list
			:updateConfig="updateConfig"
			@switchView="changeView"
		></song-list>

		<player-view
			v-if="openPlayer"
			:updateConfig="updateConfig"
			@switchView="changeView"
		></player-view>

		<player-config
			v-if="openConfig"
			:updateConfig="updateConfig"
			@switchView="changeView"
		></player-config>
	</view>
</template>

<script>
	import SongList from './components/song-list/song-list.vue';
	import PlayerView from './components/player-view/player-view.vue';
	import PlayerConfig from './components/player-config/player-config.vue';

	export default {
		components: {
			SongList,
			PlayerView,
			PlayerConfig
		},

		beforeCreate() {
			this.$store.dispatch('restoreConfig');
		},

		data() {
			return {
				openConfig: false,
				openPlayer: false,

				appHistory: {
					routers: ['SongList'],
					index: 0,
					get currentRouter() {
						return this.routers[this.index]
					},
					get preRouter() {
						return this.routers[this.index-1]
					},
					get nextRouter() {
						return this.routers[this.index+1]
					},
					set currentRouter(routerName) {
						this.routers[this.index] = routerName;
					},
					addRouter(routerName) {
						this.index++;
						this.currentRouter = routerName;
					},
				}
			}
		},

		methods: {
			/**
			 * * update player config
			 * @param {Object} config
			 * @param {Function} success success callback function
			 * @param {Function} fail fail callback function
			 */
			updateConfig(config, success, fail) {
				if (config && config instanceof Object) {
					this.$store.dispatch('updateConfig', config, success, fail)
				}
			},

			/**
			 * * switch view component(fake router)
			 * @param {Object} config
			 */
			changeView(viewName) {
				// set config pop-up windows
				if (viewName === 'PlayerConfig') {
					this.openConfig = !this.openConfig;
					this.openConfig && this.appHistory.addRouter(viewName);
				// set player pop-up windows
				} else if (viewName === 'PlayerView') {
					this.openPlayer = !this.openPlayer;
					this.openPlayer && this.appHistory.addRouter(viewName);
				// back to previous view
				} else if (viewName === 'back' && (this.appHistory.index - 1) >= 0) {
					this.changeView(this.appHistory.currentRouter);
					this.appHistory.index--;
				// open next view in history
				} else if (viewName === 'next' && (this.appHistory.index + 1) < this.appHistory.routers.length) {
					this.appHistory.index++;
					this.changeView(this.appHistory.currentRouter);
				} 
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 95%;
		height: 98%;
		position: relative;
		border-radius: 40rpx;
		overflow: hidden;
	}
</style>
