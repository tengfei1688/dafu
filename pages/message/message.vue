<template>
	<view class="modern-message-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>
		
		<!-- 现代头部 -->
		<view class="modern-header">
			<view class="header-content">
				<view class="back-button" @click="goBack">
					<uni-icons type="arrow-left" size="25" color="#fff"></uni-icons>
				</view>
				<view class="page-title">
					<text class="title-text">{{$t('home.xtxx')}}</text>
				</view>
			</view>
		</view>
		
		<!-- 消息列表 -->
		<view class="message-content">
			<view class="message-list" v-if="pageList.length">
				<view class="message-item" :class="[{read:item.is_read==2}]" v-for="(item,index) in pageList" :key="index">
					<view class="message-icon">
						<view class="icon-dot" v-if="item.is_read != 2"></view>
					</view>
					<view class="message-body">
						<view class="message-text">
							<view v-if="item.type==5">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('top.czdz')}}<br>{{$t('order.je')}}:<span class="amount positive">+{{item.money}}</span>
							</view>
							<view v-if="item.type==2">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('top.xdcg')}}<br>{{$t('order.je')}}:<span class="amount negative">-{{item.money}}</span>
							</view>	
							<view v-if="item.type==3">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('top.jscg')}}<br>{{$t('order.je')}}:<span class="amount neutral">{{item.money}}</span>
							</view>	
							<view v-if="item.type==4">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('top.txsb')}}<br>{{$t('order.je')}}:<span class="amount positive">+{{item.money}}</span>
							</view>	
							<view v-if="item.type==6">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('aibuy')}}<br>{{$t('order.je')}}:<span class="amount negative">-{{item.money}}</span>
							</view>	
							<view v-if="item.type==7">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('aidayfan')}}<br>{{$t('order.je')}}:<span class="amount positive">+{{item.money}}</span>
							</view>	
							<view v-if="item.type==8">
								{{$t('withdraw-list.ddbh')}}:{{item.order_sn}}<br>{{$t('aidayben')}}<br>{{$t('order.je')}}:<span class="amount positive">+{{item.money}}</span>
							</view>	
						</view>
						<view class="message-time">
							<text class="time-text">{{item.time}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<image src="../../static/dd.png" class="empty-image" mode="aspectFit"></image>
				<text class="empty-text">{{$t('home.xtxx.zwsj')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		msgList
	} from "@/api/app.js"
	export default {
		data() {
			return {
				pageList: []
			};
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				msgList().then(({
					data
				}) => {
					this.pageList = data
				})
			},
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="less">
	.modern-message-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
	}

	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		
		.circle {
			position: absolute;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.1);
			animation: float 6s ease-in-out infinite;
			
			&.circle-1 {
				width: 200rpx;
				height: 200rpx;
				top: 10%;
				left: 10%;
				animation-delay: 0s;
			}
			
			&.circle-2 {
				width: 150rpx;
				height: 150rpx;
				top: 60%;
				right: 15%;
				animation-delay: 2s;
			}
			
			&.circle-3 {
				width: 100rpx;
				height: 100rpx;
				bottom: 20%;
				left: 20%;
				animation-delay: 4s;
			}
		}
	}

	.modern-header {
		position: relative;
		z-index: 10;
		padding: 60rpx 30rpx 30rpx;
		
		.header-content {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			
			.back-button {
				position: absolute;
				left: 0;
				width: 60rpx;
				height: 60rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				backdrop-filter: blur(10px);
				transition: all 0.3s ease;
				
				&:active {
					transform: scale(0.95);
					background: rgba(255, 255, 255, 0.3);
				}
			}
			
			.page-title {
				.title-text {
					font-size: 36rpx;
					font-weight: bold;
					color: #fff;
					text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
				}
			}
		}
	}

	.message-content {
		position: relative;
		z-index: 10;
		margin: 0 30rpx;
		padding-bottom: 120rpx;
	}

	.message-list {
		.message-item {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(20px);
			border-radius: 20rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			display: flex;
			align-items: flex-start;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
			border: 1rpx solid rgba(255, 255, 255, 0.2);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.98);
			}
			
			&.read {
				opacity: 0.7;
			}
			
			.message-icon {
				width: 20rpx;
				height: 20rpx;
				margin-right: 20rpx;
				margin-top: 10rpx;
				position: relative;
				
				.icon-dot {
					width: 12rpx;
					height: 12rpx;
					background: #ff4757;
					border-radius: 50%;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
			
			.message-body {
				flex: 1;
				
				.message-text {
					font-size: 28rpx;
					color: #333;
					line-height: 1.5;
					margin-bottom: 15rpx;
					
					.amount {
						font-weight: bold;
						
						&.positive {
							color: #2ed573;
						}
						
						&.negative {
							color: #ff4757;
						}
						
						&.neutral {
							color: #667eea;
						}
					}
				}
				
				.message-time {
					.time-text {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
		
		.empty-image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
			opacity: 0.6;
		}
		
		.empty-text {
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.8);
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		}
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}
</style>