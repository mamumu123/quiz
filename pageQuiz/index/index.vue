<template>
	<view>
		<transition name="fade">
			<view class="" v-if="isReady">
				<button type="default" @click="()=>onSwitch(STATUS_MAP.playing)">开始</button>
			</view>

			<view class="" v-else-if="isPlaying">
				<view>第{{ currentIndex + 1 }} 题</view>
				<view class="">
					{{ currentQuiz.quiz }}
				</view>

				<view>
					<u-button :disabled="isSelected" type="primary" @click="()=>onSelect(index)" :plain="true" :text="quiz"
						v-for="(quiz, index) in currentQuiz.options"></u-button>
				</view>

				<button type="default" @click="onNext">{{ nextText }}</button>

			</view>
			<view class="" v-else>
				<button type="default" @click="()=>onSwitch(STATUS_MAP.ready)">再来一次</button>
			</view>
		</transition>
	</view>
</template>

<script>
	import {
		STATUS_MAP,
		TOTAL_NUMBER,
	} from '@/constants/index.js'
	import {
		getRandomArray
	} from '@/utils/index.js'

	export default {
		data() {
			return {
				// status: STATUS_MAP.ready,
				status: STATUS_MAP.playing,
				STATUS_MAP,
				quizList: [],
				currentIndex: 0,
				rankList: [],
				score: 0,
				selectIndex: -1,
				isSelected: false,
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
			},
			currentQuiz() {
				const {
					quizList
				} = this;
				const inx = this.rankList[this.currentIndex];
				const cur = quizList[inx] || {}
				console.log('cur', cur, this.currentIndex)
				return cur;
			},
			nextText() {
				return this.lastQuiz ? '交卷' : '下一题';
			},
			lastQuiz() {
				return this.currentIndex === (TOTAL_NUMBER - 1)
			}
		},
		created() {
			const that = this;
			uni.request({
				url: '/static/quiz.json',
				success(res) {
					if (res?.data?.length) {
						that.quizList = res.data;
						that.rankList = getRandomArray(0, that.quizList.length, TOTAL_NUMBER);
						console.log('rankList', that.rankList)
					}
				},
				fail() {
					uni.showToast({
						title: '数据请求失败，请稍后再试',
					})
				}
			})
		},
		methods: {
			onSwitch(val = STATUS_MAP.ready) {
				console.log('val', val)
				this.status = val;
			},
			onSelect(index) {
				console.log('index', index)
				this.isSelected = true;
				this.selectIndex = index;
				
			},
			onNext() {
				if (this.lastQuiz) {
					return
				}
				this.currentIndex += 1;
				this.isSelected = false;
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
