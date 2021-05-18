<template>
	<view class="container">
		<div class="wrapper">
			<song-list
				v-if="activeView === 'SongList'"
				:updateConfig="updateConfig"
				@switchView="changeView"
			></song-list>

			<player-view
				v-if="activeView === 'PlayerView'"
				:updateConfig="updateConfig"
				@switchView="changeView"
			></player-view>

			<player-config
				v-if="activeView === 'PlayerConfig'"
				:updateConfig="updateConfig"
				@switchView="changeView"
			></player-config>

		</div>
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
				activeView: 'PlayerConfig',
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
			 * * switch view component
			 * @param {Object} config
			 */
			changeView(viewName) {
				this.activeView = viewName
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
		background: #1d0f2f;
		overflow: hidden;

		.wrapper {
			width: 100%;
			height: 100%;
		}
	}

	

</style>
