<template>
	<view>
		<guo-headerTitle :title="$t('myaiorder')"></guo-headerTitle>

		<view class="tui-headerTitle" v-if="!isData">
			<view class="tui-card" v-for="(item,index) in List" :key="index">
				<view style="box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;width: 100%;">
				<view class="tui-left" >
					<view class="title">
						{{$t('jiaoyih')}}
					</view>
					<view class="title">
						{{$t('aidname')}}
					</view>
					<view class="title">
						{{$t('aidmoney')}}
					</view>
					<view class="title">
						{{$t('aidzt')}}
					</view>
					<view class="title">
						{{$t('aidljsy')}}
					</view>
					<view class="title">
						{{$t('aidjljs')}}
					</view>
					<view class="title">
						{{$t('aidwjs')}}
					</view>
					<view class="title">
						 {{$t('aidbtime')}}
					</view>
					<view class="title">
						{{$t('aidetime')}}
					</view>
					
				</view>
				<view class="tui-right" style="width: 300rpx;;">
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.order_sn}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.name}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.money}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						<span v-if="item.status=='1'">{{$t('aid1')}}</span>
						<span v-if="item.status=='2'">{{$t('aid2')}}</span>
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.leiji}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.num}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.period}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.buytime}} 
					</view>
					
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.endtime}}
					</view>
					
				</view>
				
			</view>
				
				
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
			<tui-nomore :visible="!pullUpOn" :text="$t('app.mtgd')"></tui-nomore>
			<!--加载loadding-->
		</view>
	</view>
</template>

<script>
	import {
		upmark_record,
		top_log
	} from '@/api/money.js'
	import {
		useraiList
	} from "@/api/detail.js";
	export default {

		data() {
			return {
				List: [],
				PageIndex: 1,
				PageSize: 10,
				loadding: false,
				pullUpOn: true,
				isData: true,
				pageCount: 0
			};
		},
		onLoad() {
			this.top_log()
		},
		// 上拉加载
		async onReachBottom() {
			if (!this.pullUpOn) return;
			this.PageIndex = this.PageIndex + 1;
			this.loadding = true;
			if (this.PageIndex <= this.pageCount) {
				await this.top_log()
			} else {
				this.loadding = false;
				this.pullUpOn = false
			}

			console.log(this.FileInfoList.length)
		},
		methods: {
			top_log() {
				useraiList({
					page: this.PageIndex
				}).then(({
					data
				}) => {
					console.log(data)
					if (data.lists.length !== 0) {
						this.isData = false
					}
					this.pageCount = data.lastPage
					if (!data.lists || data.lists.length < this.PageSize) {
						this.pullUpOn = false;
					}
					this.loadding = false;
					if (this.PageIndex == 1) {
						this.List = data.lists
					} else {
						this.List = this.List.concat(data.lists)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.tui-headerTitle {
		padding: 0 36rpx;

		.tui-card {
			background-color: #fff;
			border-radius: 13px;
			padding: 26rpx;
			width: 100%;
			margin-top: 20rpx;

			.tui-right {
				display: flex;
				flex-direction: column;
				line-height: 48rpx;
				.message {
					font-size: 20rpx;
					color: #f33b50;
					text-align: right;
				}

				.time {
					color: #a8a9ac;
					font-size: 20rpx;
				}
			}

			.tui-left {
				display: flex;
				flex-direction: column;
				line-height: 48rpx;

				.title {
					font-size: 24rpx;
					color: #222;
				}

				.time {
					color: #a8a9ac;
					font-size: 24rpx;
					padding-top: 6rpx;

					text {
						padding-left: 10rpx;
					}
				}
			}
		}
	}
</style>