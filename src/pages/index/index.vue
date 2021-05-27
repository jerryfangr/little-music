<template>
	<view class="container">
		<song-list
			v-if="activeView === 'SongList'"
			:updateConfig="updateConfig"
			@switchView="changeView"
			key="SongList"
		></song-list>

		<player-view
			v-if="activeView === 'PlayerView'"
			:updateConfig="updateConfig"
			@switchView="changeView"
			key="PlayerView"
		></player-view>

		<player-config
			v-if="activeView === 'PlayerConfig'"
			:updateConfig="updateConfig"
			@switchView="changeView"
			key="PlayerConfig"
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
				activeView: 'PlayerView',
				history: {
					routers: ['PlayerView'],
					index: 0,
					get currentRouter() {
						return this.routers[this.index]
					},
					set currentRouter(routerName) {
						this.routers[this.index] = routerName;
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
				// history back
				if (viewName === 'back' && (this.history.index - 1) >= 0) {
					this.history.index--;
					this.activeView = this.history.currentRouter;
				// history next
				} else if (viewName === 'next' && (this.history.index + 1) < this.history.routers.length) {
					this.history.index++;
					this.activeView = this.history.currentRouter;
				// add router
				} else {
					this.activeView = viewName;
					this.history.index++;
					this.history.currentRouter = this.activeView;
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
    animation: slideInUp .6s ease-out 0s;
	}
</style>
