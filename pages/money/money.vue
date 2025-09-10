<template>
	<view class="modern-money-container">
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
					<text class="title-text">{{title}}</text>
				</view>
			</view>
		</view>
			<view style="padding: 60rpx 30rpx;background: #1150c2 ;width: 100%;height: 240rpx">
				<div style="float: left;width: 60%;margin-left: 1%;height: 100%;display: inline-block;font-size: 32rpx;color: #fff;line-height: 60rpx;font-weight: 600;">
					{{$t('ai1')}}<br>
					{{userInfo.aizmoney}}<span style="font-size: 20rpx;">USD</span>
				</div>
				<div  @click="myorder()" style="float: right;width: 38%;margin-right: 1%;height: 100%;display: inline-block;" >
					<div style="margin-top: 25rpx;line-height:70rpx;font-weight: 500 ;text-align: center;color: #fff;font-size: 24rpx;border-radius: 20rpx;width: 100%;height: 70rpx;background: linear-gradient(315deg, #fdcb83, #ddd0ad, #d6b372)  !important;;">
						{{$t('ai2')}}
					</div>
				</div>
				<div style="clear: both;">
					
				</div>
			</view>
			<div style="border-top: 2rpx solid #f0f0f0;box-sizing: border-box;display: flex;align-items: center;width: 100%;background: #1150c2 ;height: 140rpx;padding: 0rpx 30rpx 20rpx 0">
				<div class="flex-1">
					{{userInfo.aitoday}}<br>
					{{$t('ai3')}}
				</div>
				<div class="flex-1">
					{{userInfo.aitotal}}<br>
					{{$t('ai4')}}
				</div>
				<div class="flex-1" @click="myorder()">
					{{userInfo.ainum}}<br>
					{{$t('ai5')}}
				</div>
			</div>
			<view style="width: 100%;padding: 0 30rpx;">
				<view v-for="(item,index) in List" :key="index" style="margin-top: 20rpx;background: #fff;padding: 30rpx 20rpx;border-radius: 20rpx;">
					<div style="height: 100rpx;box-sizing: border-box;display: flex;align-items: center;width: 100%;">
						<view class="top1" style="flex: 1;">
							<img :src="item.img" style="width: 100rpx;height: 100rpx;">
						</view>
						<view class="top1" style="flex: 3;padding-left: 8rpx;;text-align: left;line-height: 50rpx;">
							{{item.name}}<br>
							<view style="color: crimson;">
								{{$t('ai6')}}
							</view>
						</view>
						<view class="top1" style="flex: 2;height:80rpx;margin-top: 10rpx">
							<div @click="dealPopupOpen(item.id,item.name,item.rate,item.min,item.max,item.content)" style="display: inline-block;width: 95%;height: 80rpx;line-height: 80rpx;border-radius: 30rpx;background: #0bb563 ;color: #fff;margin-left: 4%;">
								{{$t('ai7')}}
							</div>
						</view>
					</div>
					<div style="margin-top: 10rpx;box-sizing: border-box;display: flex;align-items: center;width: 100%;">
						<view class="top1" style="line-height: 40rpx;">
							{{item.rate}}%<br>
							{{$t('ai8')}}
						</view>
						<view class="top1" style="line-height: 40rpx;">
							{{item.period}}<br>
							{{$t('ai9')}}
						</view>
					</div>
					<div style="margin-top: 10rpx;box-sizing: border-box;display: flex;align-items: center;width: 100%;">
						<view class="top1" style="line-height: 40rpx;">
							{{item.min}}<br>
							{{$t('ai10')}}
						</view>
						<view class="top1" style="line-height: 40rpx;">
							{{item.max}}<br>
							{{$t('ai11')}}
						</view>
					</div>
				</view>
			</view>
			
		
		<uni-popup ref="popup" type="bottom">
			<view class="tui-bottomPopup">
				<view class="tui-purchase">
					<view class="tui-title">
						<view class="flex">
							<text class="name">{{$t('ai12')}}:{{teps.name}}</text>
							
						</view>
						<view class="tui-cancleText" @click="dealPopupClose">
							{{$t('detail.qx')}}
						</view>
					</view>
					<view style="margin-top: 20rpx;font-size: 26rpx;line-height: 60rpx;font-weight: 600">
						{{$t('ai13')}}:
					</view>
					<view style="font-size: 20rpx;line-height: 40rpx;text-indent: 2em">
						{{teps.content}}
					</view>
					<view class="tui-firstTitle" style="margin-top: 20rpx;line-height: 60rpx;font-weight: 600">
						{{$t('detail.je')}}
					</view>
					<view class="items">
						<view class="tui-item" v-for="(item,index) in deal.amountTab" :key="index"
							@click="deal.actAmount =item" :class="deal.actAmount == item ? 'tui-activite' : ''">
							{{item}}
						</view>
					</view>
					<view class="tui-inputBox" style="color:#333">
						<input class="tui-input" v-model="deal.actAmount" :placeholder="$t('detail.srje')"
							type="text" />
						<text></text>
					</view>
					<view class="flex flex-between flex-item" style="margin-top: 16rpx;color: #333">
						<view class="flex flex-item">
							<view class="tui-money" style="color: #333">
								{{$t('detail.ye')}}：<text>{{userInfo.money}}</text> <text class="tui-cny"></text>
							</view>
						</view>
					</view>
					<view class="tui-detail">
						<view class="flex flex-item flex-column">
							<view class="text-ts">
								{{$t('detail.je')}}
							</view>
							<view class="pice">
								{{deal.actAmount|| 0 }}
							</view>
						</view>
						<view class="flex flex-item flex-column">
							<view class="text-ts">
								{{$t('ai8')}}
							</view>
							<view class="pice">
								{{earnings.rate}}%
							</view>
						</view>
						<view class="flex flex-item flex-column">
							<view class="text-ts">
								{{$t('ai14')}}
							</view>
							<view class="pice">
								{{earnings.profit}}
							</view>
						</view>
					</view>
					<view class="tui-submit tui-ok"  @click="confirmDeal">
						{{$t('ai15')}}
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		addAi,
		aiList
	} from "@/api/detail.js";
	import {
		balanceInfo
	} from "@/api/money.js"
	import {
		userInfo,
		getUserIndex
	} from "@/api/user.js"
import { number } from "echarts";
	export default {
		
		data() {
			return {
				title:this.$t('lianghua'),
				pageDetail:{},
				userInfo: {},
				teps:{
					'rate':1,
					'name':'',
					'min':'',
					'max':'',
					'id':'',
				},
				deal: {
					amountTab: ['100', '500', '1000', '2000', '5000', '10000'],
					actAmount: '0',
					actTime: '',
					isType: '',
				},
				List:[
					
				],
			};
		},
		onReady() {

		},
		mounted() {
			
		},
		onShow() {
			
		},
		onLoad() {
			this.getGoods();
			this.getDetailUserInfo()
		},
		computed:{
			earnings() {
				const profit_ratio=this.deal.actAmount;
				const rate=this.teps.rate;
				console.log(profit_ratio);
				return {
					rate:this.teps.rate,
					min:this.teps.min,
					max:this.teps.max,
					
					profit: profit_ratio * rate / 100
				}
			},
		},		
		methods: {
			goBack() {
				uni.navigateBack();
			},
			getGoods() {
				aiList({
					status:1
				}).then(({
					data
				}) => {
					this.List = data;
				});
			},
			myorder(){
				uni.navigateTo({
					url: "/pages/money/detail",
				});
			}
			,
			dealPopupClose() {
				this.$refs.popup.close()
				
			},
			getDetailUserInfo() {
				userInfo({
					hideLoading: true
				}).then(({
					data
				}) => {
					this.userInfo = data
				})
			},
			confirmDeal() {
				
				const paramData = {
					number: this.deal.actAmount,
					ai_id: this.teps.id,
				}
				if(this.deal.actAmount<this.teps.min){
					return uni.showToast({
						title: this.$t('ai16')+this.teps.min,
						icon: 'none'
					})
				}
				if(this.deal.actAmount>this.teps.max){
					return uni.showToast({
						title: this.$t('ai17')+this.teps.max,
						icon: 'none'
					})
				}
				if(this.deal.actAmount>this.userInfo.money){
					return uni.showToast({
						title: this.$t('ai19'),
						icon: 'none'
					})
				}
				addAi(paramData).then(_ => {
					uni.showModal({
						title: this.$t('ai18'),
						content: this.$t('ai18'),
						showCancel: false,
					
					}).then(_ => {
						this.$refs.popup.close()
					})
				})
				
				
			},
			dealPopupOpen(id,name,rate,min,max,content) {
				
				this.getDetailUserInfo()
				console.log(name)
				this.teps.rate=rate,
				this.teps.id=id,
				this.teps.name=name,
				this.teps.min=min,
				this.teps.max=max,
				this.teps.content=content,
				this.$refs.popup.open()
			},
		}
	}
</script>

<style lang="less">
	.flex-1{
		display: flex;
		flex-direction: column;
		text-align: center;
		color: #fff;
		font-size: 24rpx;
		height: 100%;
		line-height: 60rpx;
		font-weight: 500;
		overflow: hidden;
		flex: 1;
	}
	.top1{
		display: flex;
		flex-direction: column;
		text-align: center;
		color: #000;
		font-size: 24rpx;
		height: 100%;
		line-height: 100rpx;
		font-weight: 600;
		overflow: hidden;
		flex: 1;
	}
	.tui-submit {
	
		width: 178px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx;
		padding: 30rpx 0;
		font-size: 32rpx;
		margin: 0 auto;
		margin-top: 44rpx;
	}
	
	.tui-ok {
		background-color: rgb(11, 181, 99) !important;
		color: #fff !important;
	}
	.tui-detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
	
		.text-ts {
			color: #333;
			font-weight: 600;
			font-size: 12px;
		}
	
		.pice {
			color: #222;
			font-size: 12px;
			font-weight: 600;
			padding-top: 8rpx;
		}
	}
	
	.flex-item {
		align-items: center;
	}
.tui-bottomPopup {

		padding: 48rpx 0 0;
		border-radius: 48rpx 48rpx 0 0;
		background-color: #fff;
		z-index: 9999;

		.tui-purchase {
			padding: 0 32rpx;
			padding-bottom: 40rpx;

			.tui-firstTitle {
				color: #333;
				font-size: 28rpx;
				margin-top: 60rpx;

			}

			.tui-alling {
				color: #f56c6c;
				font-size: 24rpx;
			}

			.tui-money {
				display: flex;
				justify-content: flex-start;
				color: #c9c9c9;
				font-size: 24rpx;

				.tui-cny {
					margin-left: 4rpx;
					font-size: 8px;
					line-height: 17px;
				}
			}

			.tui-inputBox {
				padding: 0px 30rpx;
				border-radius: 12px;
				caret-color: #a8a9ac;
				background-color: #f6f7fb;
				display: flex;
				align-items: center;

				.tui-input:placeholder {
					color: #c9c9c9;
					font-size: 24rpx;
				}

				.tui-input {
					border-radius: 12px !important;
					flex: 1;
					padding: 26rpx 30rpx !important;
					caret-color: #c9c9c9;
					height: 100rpx;
					font-size: 26rpx;
				}

				text {
					font-size: 24rpx;
					color: #333;
				}
			}

			.items {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-content: space-between;
				padding: 20rpx 0 0 0;

				.tui-activite {
					//border: 1px solid #0bb563 !important;
					// background: #0bb563 !important;
					// color: #fff !important;
					background: linear-gradient(315deg, #fdcb83, #ddd0ad, #d6b372)  !important;
					color: #000 !important;
				}
				.tui-activite1 {
					background: linear-gradient(315deg, #fdcb83, #ddd0ad, #d6b372)  !important;
					color: #000 !important;
				}
				
				.tui-item {
					margin-bottom: 20rpx;
					width: 210rpx;
					height: 116rpx;
					color: #333;
					opacity: 1;
					background-color: #f6f7fb;
					border-radius: 12px !important;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.tui-item1 {
					margin-bottom: 20rpx;
					padding: 55rpx 0rpx;
					width: 210rpx;
					height: 210rpx;
					border-radius: 105rpx !important;
					opacity: 1;
					background-color: #f6f7fb;
					color: #bcc4c9;
					font-size: 28rpx;
					
					align-items: center;
					justify-content: center;
				}
			}

			.tui-title {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tui-cancleText {
					color: #a8a9ac;
					font-size: 28rpx;
				}

				.name {
					font-size: 32rpx;
					font-weight: 500;
					display: flex;
					position: relative;
					color: #222;
				}

				.bade {
					border-radius: 10px;
					height: 46rpx;
					padding: 4rpx 12rpx;
					color: #fff;
					// background-color: #0bb563 !important;
					font-weight: 800;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 10rpx;
					font-size: 20rpx;
				}
			}
		}
	}

	/* 现代样式 */
	.modern-money-container {
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

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}
</style>