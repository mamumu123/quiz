<template>
	<view class='container'>
		<transition name="fade">
			<view class="start-container" v-if="isReady">
				<view>
					答对三道题则过关
				</view>
				<image src="../../static/2.png" mode="widthFix" class="img_start"></image>
				<image src="../../static/3.png" mode="widthFix" class="img_start"></image>
				<image src="../../static/4.png" mode="widthFix" class="img_start"></image>

				<button type="" :plain="true" @click="()=>onSwitch(STATUS_MAP.playing)">开始挑战</button>
			</view>

			<view class="" v-else-if="isPlaying">
				<view class="title">
					<view class="t">第{{ currentIndex + 1 }} 题</view>
					<view class="content">
						{{ currentQuiz.quiz }}
					</view>
				</view>


				<view class="btn_box">
					<view class="btn" v-for="(quiz, index) in currentQuiz.options">
						<u-button :disabled="isSelected" :type="currentType(index)" @click="()=>onSelect(index)"
							:plain="true" :text="quiz" :key="index" />
					</view>
				</view>

				<button :disabled="!isSelected" type="default" @click="onNext" v-if="!lastQuiz">{{ nextText }}</button>
				<button :disabled="!isSelected" open-type="chooseAvatar" v-else @chooseavatar="choose">{{ nextText }}</button>
				<view>
					<u-rate :count="countError" v-model="COUNT_ERROE" readonly></u-rate>
				</view>
				<view class="">
					{{ feedbackText }}
				</view>


			</view>
			<view class="end-container" v-else>
				<img class="img1"
					src="https://upload.wikimedia.org/wikipedia/commons/9/94/%E6%9D%9C%E5%A6%82%E6%99%A6.jpg"
					width="50%" alt="">
				<img class="img2"
					src="https://upload.wikimedia.org/wikipedia/commons/a/a7/%E6%88%BF%E7%8E%84%E9%BE%84.jpg"
					width="50%" alt="">
				<view class="avatar">
					<u-avatar :src="avatar" ></u-avatar>
				</view>
				<button type="default" @click="()=>onSwitch(STATUS_MAP.ready)">再来一次</button>
			</view>
		</transition>
	</view>
</template>

<script>
	import {
		STATUS_MAP,
		TOTAL_NUMBER,
		ERROR_TOAST,
		COUNT_ERROE,
		GOOD_WORDS,
		COUNT_CORRECT,
		IMG_URL,
	} from '@/constants/index.js'
	import {
		getRandomArray
	} from '@/utils/index.js'
	import ql from '@/constants/quiz.js'

	export default {
		data() {
			return {
				// status: STATUS_MAP.ready, // 当前状态， 准备 / 开始 /结束
				status: STATUS_MAP.playing,
				// status: STATUS_MAP.end,
				STATUS_MAP,
				quizList: [], // all data
				currentIndex: 0, // 当前题号
				rankList: [], // 随机 n 个不重复数字
				score: 0, // 分数
				selectIndex: -1, // 当前题目中选择到的 index
				isSelected: false, // 是否已选择
				countError: COUNT_ERROE, // 错误机会
				goodList: [], // 夸人列表
				GOOD_WORDS,
				COUNT_ERROE,
				avatar: IMG_URL.avatar
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
				const inx = this.rankList[this.currentIndex];
				return this.quizList[inx] || {}
			},
			currentRealAnswer() {
				return (this.currentQuiz?.answer - 1);
			},
			nextText() {
				return this.lastQuiz ? '去拍照' : '下一题';
			},
			lastQuiz() {
				// 10 道题目
				// return this.currentIndex === (TOTAL_NUMBER - 1)
				// 达到阈值
				return this.score === COUNT_CORRECT || this.countError === 0
			},
			isCorrect() {
				return this.selectIndex === this.currentRealAnswer;
			},
			feedbackText() {
				// !: 这个 console 不好删
				console.log('isCorrect', this.isCorrect, this.currentRealAnswer)
				if (!this.isSelected) {
					return ''
				}
				if (this.isCorrect) {
					// TODO：这里随机上几百个夸人的次
					return GOOD_WORDS[this.goodList[this.currentGoodIndex]];
				} else {
					return ERROR_TOAST[this.countError]
				}
			},
			currentGoodIndex() {
				return this.score - 1;
			}
		},
		created() {
			const data = ql;
			this.quizList = data;
			this.rankList = getRandomArray(0, this.quizList.length, TOTAL_NUMBER);
			this.goodList = getRandomArray(0, GOOD_WORDS.length, COUNT_CORRECT);
			console.log('rankList', this.rankList)

		},
		methods: {
			onSwitch(val = STATUS_MAP.ready) {
				this.status = val;
			},
			onSelect(index) {
				this.isSelected = true;
				this.selectIndex = index;
				if (this.isCorrect) {
					this.score += 1;
				} else {
					this.countError -= 1;
				}
			},
			onNext() {
				if (this.lastQuiz) {
					this.onSwitch(STATUS_MAP.end);
					return
				}
				this.currentIndex += 1;
				this.reset();
			},
			reset() {
				this.isSelected = false;
				this.selectIndex = -1;
			},
			resetAll() {
				this.reset();
				this.currentIndex = 0;
				this.countError = COUNT_ERROE;
			},
			choose(e) {
				this.avatar = e.detail.avatarUrl;
				this.onNext();
			},
			currentType(index) {
				if (!this.isSelected) {
					return 'primary';
				}
				if (index === this.currentRealAnswer) {
					return 'success'
				}
				if (this.selectIndex === index && index !== this.currentRealAnswer) {
					return 'error'
				}
				return 'primary';
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		/* background-image: url('@/static/bg.png'); */
		position: relative;
		background-color: #E1E0C7;
	}

	.start-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		/* position: absolute; */
		/* top: 50%; */
		/* transform: translateY(-50%); */
	}

	.img_start {}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0
	}

	.btn {
		margin: 10px auto;
	}

	.btn_box {}

	.title {
		position: relative;

		.t {
			text-align: center;
		}

		;

		.content {
			text-align: center;
		}
	}

	.end-container {
		position: relative;

		.img1 {
			width: 50%;
		}

		.img2 {
			width: 50%;
		}

		.avatar {
			left: 50%;
			transform: translateX(-50%);
			top: 10%;
			position: absolute;
			z-index: 100;
		}
	}
</style>