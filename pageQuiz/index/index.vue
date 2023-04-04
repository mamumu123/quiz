<template>
	<view>
		<transition name="fade">
			<view class="" v-if="isReady">
				<button type="default" @click="()=>onSwitch(STATUS_MAP.playing)">开始</button>
			</view>

			<view class="" v-else-if="isPlaying">
				playing
				<button type="default" @click="()=>onSwitch(STATUS_MAP.end)">结束</button>
			</view>
			<view class="" v-else>
				<button type="default" @click="()=>onSwitch(STATUS_MAP.ready)">再来一次</button>
			</view>
		</transition>
	</view>
</template>

<script>
	import {
		STATUS_MAP
	} from '@/constants/index.js'

	export default {
		data() {
			return {
				status: STATUS_MAP.ready,
				STATUS_MAP,
			}
		},
		computed: {
			isReady() {
				return this.status === STATUS_MAP.ready
			},
			isPlaying() {
				return this.status === STATUS_MAP.playing
			},
			isEnd() {
				return this.status === STATUS_MAP.end
			}
		},

		methods: {
			onSwitch(val = STATUS_MAP.ready){
				console.log('val',val)
				this.status = val;
			}	
		}
	}
</script>

<style>
	.fade-enter-active,
	.fade-leave-active {
	    transition: opacity .5s
	}
	
	.fade-enter,
	.fade-leave-to {
	    opacity: 0
	}

</style>
