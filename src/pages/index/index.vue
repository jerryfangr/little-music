<template>
	<view class="container">
		<div class="wrapper">
			<song-list
				v-if="activeView === 'SongList'"
				:updateConfig="updateConfig"
				:switchView="switchView"
			></song-list>

			<player-view
				v-if="activeView === 'PlayerView'"
				:updateConfig="updateConfig"
				:switchView="switchView"
			></player-view>

			<player-config
				v-if="activeView === 'PlayerConfig'"
				:updateConfig="updateConfig"
				:switchView="switchView"
			></player-config>

		</div>
	</view>
</template>

<script>
	import SongList from './components/song-list/song-list.vue';
	import PlayerView from './components/player-view/player-view.vue';
	import PlayerConfig from './components/player-config/player-config.vue';


	export default {
		data() {
			return {
				activeView: 'SongList',
				config: {
					voice: 100,
					playOrder: 'random'
				}
			}
		},

		components: {
			SongList,
			PlayerView,
			PlayerConfig
		},

		onLoad() {
			uni.getStorage({
				key: 'config',
				success: ({ data }) => {
					data && this.updateConfig(data);
				}
			})
		},

		methods: {
			/**
			 * * update player config
			 * @param {Object} config
			 * @param {Function} success success callback function
			 * @param {Function} fail fail callback function
			 */
			updateConfig(config, success, fail) {
				if (config !== undefined && config instanceof Object) {
					for (const key in config) {
						this.config[key] = config[key];
					}

					uni.setStorage({
						key: 'config',
						data: this.config,
						success,
						fail
					})
				}
			},

			/**
			 * * switch view component
			 * @param {Object} config
			 */
			switchView(viewName) {
				this.activeView = viewName
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
		position: relative;
		background: #413153;
		background: 
			linear-gradient(90deg, #372949 0%, #28173d 5%, #28173d 95%, #372949 100%);
		
		.wrapper {
			width: 100%;
			height: 100%;
		}
	}

	

</style>
