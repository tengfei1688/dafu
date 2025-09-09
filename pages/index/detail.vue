<template>
	<view>
		<guo-headerTitle :title="$t('home.gywm')"></guo-headerTitle>
		<view class="news text-main-color">
			 
			<view class="rule text-des-color text-md text-align-justify tui-header" style="margin-top: 16px;">
					<rich-text :nodes="getUserItem.gywm"></rich-text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		getUserIndex
	} from '@/api/user.js'
	export default {
		data() {
			return {
				Id: 0,
				getUserItem: {}
			};
		},
		onLoad(e) {
			this.Id = Number(e.Id)
		},
		onShow(){
			this.getUserIndex()
		},
		methods: {
			getUserIndex() {
				getUserIndex({
					hideLoading: true,
				}).then(({
					data
				}) => {
					
					console.log(data)
					this.getUserItem = data;
				});
			},
		}
	}
</script>

<style lang="less">
	.font-bolder {
		font-weight: 800;
	}

	.text-des-color {
		color: #98999d;
	}

	.mt-sm {
		margin-top: 8px;
	}

	.news {
		padding: 0 32rpx;
	}

	.mt-md {
		margin-top: 10px;
	}

	.text-des-color {
		color: #98999d;
	}

	.text-align-justify {
		text-align: justify;
	}

	.news .main .content {
		letter-spacing: 1px;
	}

	.title {
		font-size: 20px;
	}
</style>