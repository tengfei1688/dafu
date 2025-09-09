<template>
	<view>
		<guo-headerTitle :title="$t('withdraw-open.rjmx')"></guo-headerTitle>

		<view class="tui-headerTitle" v-if="!isData">
			<view class="tui-card" v-for="(item,index) in List" :key="index">
				<view style="box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;width: 100%;">
				<view class="tui-left">
					<view class="title">
						{{$t('top.rjfs')}}
					</view>
					<view class="title">
						{{$t('top.money')}}
					</view>
					<view class="title" v-if="item.status==1">
						{{$t('top.sjdz')}}
					</view>
					<view class="title">
						{{$t('top.code')}}
					</view>
					<view class="title">
						{{$t('withdraw-list.ddbh')}} 
					</view>
					<view class="title">
						{{$t('top.time')}} 
					</view>
					
				</view>
				<view class="tui-right">
					<view class="title" style="text-align: right;font-size: 24rpx;">
						<span v-if="item.pay_type=='usdt-trc20'">USDT-TRC20</span>
						<span v-if="item.pay_type=='usdt-erc20'">USDT-ERC20</span>
						<span v-if="item.pay_type=='btc'">BTC</span>
						<span v-if="item.pay_type=='eth'">ETH</span>
						<span v-if="item.pay_type=='bank_card'">{{$t('withdraw-money.yhk')}}</span>
					</view>
					<view class="title" style="text-align: right;">
						{{item.money}} 
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;" v-if="item.status==1">
						{{item.act_money}}
					</view>
					<view style="text-align: right;font-size: 24rpx;" class="title"
						:style="{color:item.status == 1 ? '#25BC73' : item.status == 0 ? '#222' : '#f33b50'}">
						{{item.status == 1 ? $t('withdraw-list.cg') : item.status == 0 ? $t('withdraw-list.shz') : $t('withdraw-list.sb')}}
					</view>
					<view class="title" style="text-align: right;font-size: 24rpx;">
						<text>{{item.order_sn || 'null'}}</text>
					</view>
					
					<view class="title" style="text-align: right;font-size: 24rpx;">
						{{item.time}}
					</view>
					
				</view>
				
			</view>
				<div  style="text-indent: 2em;width: 100%;font-size:24rpx;color: orangered;line-height: 48rpx;" v-if="item.status==2">
					{{item.remark}}
				</div>
				
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
			<tui-nomore :visible="!pullUpOn" :text="$t('app.mtgd')"></tui-nomore>
			<!--加载loadding-->
		</view>
		<template v-else>
			<tui-noData :title="$t('withdraw-open.zwrjjl')">
				<image src="../../static/rj.png" class="tui-allImage" mode=""></image>
			</tui-noData>
		</template>
	</view>
</template>

<script>
	import {
		upmark_record,
		top_log
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
				top_log({
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
					font-size: 28rpx;
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