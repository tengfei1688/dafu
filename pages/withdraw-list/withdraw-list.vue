<template>
	<view>
		<guo-headerTitle :title="$t('withdraw-list.cjmx')"></guo-headerTitle>

		<view class="tui-headerTitle" v-if="!isData">
			<view class="tui-card" v-for="(item,index) in List" :key="index">
				<view style="box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;width: 100%;line-height: 48rpx;">
					<view class="tui-left">
						<view class="title" style="font-size: 24rpx;">
							{{$t('top.txlx')}}
						</view>
						<view class="title" style="font-size: 24rpx;">
							{{$t('top.code')}}
						</view>
						
						<view class="title" style="font-size: 24rpx;">
							{{$t('top.txje')}}
						</view>
						<view class="title" style="font-size: 24rpx;">
							{{$t('withdraw-list.ddbh')}} 
						</view>
						<view class="title" style="font-size: 24rpx;">
							{{$t('top.time')}} 
						</view>
					</view>
					<view class="tui-right" style="text-align: right;">
						<view class="title" style="font-size: 24rpx;">
							<view v-if="item.pay_type=='网银出金' || item.pay_type=='BANK_CARD'">
								{{$t('withdraw-money.yhk')}}
							</view>
							<view v-else>
								{{item.pay_type}}
							</view>
						</view>
						<view class="message"
							:style="{color:item.status == 1 ? '#25BC73' : item.status == 2 ? '#222' : '#f33b50'}">
							{{item.status == 1 ? $t('withdraw-list.cg') : item.status == 2 ? $t('withdraw-list.shz') : $t('withdraw-list.sb')}}
						</view>
						<view class="title" style="font-size: 24rpx;">
							{{item.money}}
						</view>
						<view class="title" style="font-size: 24rpx;">
							{{item.order_sn}}
						</view>
						
						<view class="title" style="font-size: 24rpx;">
							{{item.time}}
						</view>
					</view>
				</view>
				<div  style="text-indent: 2em;width: 100%;font-size:24rpx;color: orangered;line-height: 48rpx;" v-if="item.status==3">
					{{item.check_remark}}
				</div>
				
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
			<tui-nomore :visible="!pullUpOn" :text="$t('app.mtgd')"></tui-nomore>
			<!--加载loadding-->
		</view>

		<template v-else>
			<tui-noData :title="$t('withdraw-list.zwcjjl')">
				<image src="../../static/cj.png" class="tui-allImage" mode=""></image>
			</tui-noData>
		</template>
	</view>
</template>

<script>
	import {
		withdraw_record
	} from '@/api/money.js'

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
			this.withdraw_record()
		},
		// 上拉加载
		async onReachBottom() {
			if (!this.pullUpOn) return;
			this.PageIndex = this.PageIndex + 1;
			this.loadding = true;
			if (this.PageIndex <= this.pageCount) {
				await this.withdraw_record()
			} else {
				this.loadding = false;
				this.pullUpOn = false
			}

			console.log(this.FileInfoList.length)
		},
		methods: {
			withdraw_record() {
				withdraw_record({

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
			
			margin-top: 20rpx;

			.tui-right {
				display: flex;
				flex-direction: column;

				.message {
					font-size: 24rpx;
					color: #f33b50;
					text-align: right;
				}

				.time {
					color: #a8a9ac;
					font-size: 24rpx;
				}
			}

			.tui-left {
				display: flex;
				flex-direction: column;

				.title {
					font-size: 24rpx;
					color: #222;
				}

				.time {
					color: #a8a9ac;
					font-size: 20rpx;
					padding-top: 6rpx;

					text {
						padding-left: 10rpx;
					}
				}
			}
		}
	}
</style>