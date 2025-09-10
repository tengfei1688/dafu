<template>
	<view class="modern-user-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>
		
		<!-- 用户信息区域 -->
		<view class="user-profile-section">
			<view class="profile-header">
				<view class="avatar-container">
					<view class="avatar-ring">
						<image src="/static/logo.png" mode="aspectFit" class="avatar-image"></image>
					</view>
					<view class="status-indicator"></view>
				</view>
				<view class="user-details">
					<view class="name-section">
						<text class="username">{{userInfo.username}}</text>
						<view class="vip-tag">
							<image src="/static/vip.png" mode="aspectFit" class="vip-icon"></image>
							<text class="vip-label">{{$t('user.ptyh')}}</text>
						</view>
					</view>
					<view class="info-row">
						<text class="real-name">{{userInfo.real_name.substr(0,1)+new Array(userInfo.real_name.length).join('*')}}</text>
						<view class="credit-score">
							<image src="/static/xinyong.png" mode="aspectFit" class="credit-icon"></image>
							<text class="score-text">{{userInfo.credit_score}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="account-info" @click="onClickFuzhi(userInfo.code)">
				<view class="info-content">
					<text class="info-label">{{$t('user.khm')}}</text>
					<text class="info-value">{{userInfo.code}}</text>
				</view>
				<view class="copy-button">
					<image src="../../static/fuzhi.png" mode="aspectFit" class="copy-icon"></image>
				</view>
			</view>
		</view>
		<!-- 资产信息区域 -->
		<view class="assets-overview">
			<view class="assets-main">
				<view class="balance-section">
					<text class="balance-label">{{$t('user.zzc')}}</text>
					<view class="balance-amount">
						<text class="amount-value">{{userInfo.money}}</text>
						<text class="amount-unit">USD</text>
					</view>
					<text class="balance-conversion">≈ {{userInfo.usdt_money}} USDT</text>
				</view>
			</view>
			<view class="stats-grid">
				<view class="stat-card">
					<view class="stat-icon-wrapper">
						<image src="/static/shouyi.png" mode="aspectFit" class="stat-icon"></image>
					</view>
					<view class="stat-details">
						<text class="stat-title">{{$t('user.zhyk')}}</text>
						<text class="stat-amount">{{userInfo.yk}}</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon-wrapper">
						<image src="/static/shouyilu.png" mode="aspectFit" class="stat-icon"></image>
					</view>
					<view class="stat-details">
						<text class="stat-title">{{$t('user.jryk')}}</text>
						<text class="stat-amount">{{userInfo.yk_today}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮区域 -->
		<view class="action-buttons-section">
			<view class="button-group">
				<view class="action-btn deposit-action" @click="getUserIndex">
					<view class="btn-icon-wrapper">
						<image src="/static/rujin.png" mode="aspectFit" class="btn-icon"></image>
					</view>
					<text class="btn-label">{{$t('user.rj')}}</text>
				</view>
				<view class="action-btn withdraw-action" @click="onClickMoney">
					<view class="btn-icon-wrapper">
						<image src="/static/chujin.png" mode="aspectFit" class="btn-icon"></image>
					</view>
					<text class="btn-label">{{$t('user.cj')}}</text>
				</view>
			</view>
		</view>
		
		<!-- 菜单列表 -->
		<view class="menu-sections">
			<view class="menu-category">
				<view class="category-header">
					<text class="category-title">账户管理</text>
				</view>
				<view class="menu-items">
					<view class="menu-item" v-for="(item,index) in settingList.slice(0, 4)" :key="index" @click="onClickPath(item,index)">
						<view class="item-icon">
							<image :src="item.icon" mode="aspectFit" class="icon-image"></image>
						</view>
						<text class="item-title">{{item.title}}</text>
						<view class="item-arrow">
							<image src="../../static/youjian.png" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menu-category">
				<view class="category-header">
					<text class="category-title">系统设置</text>
				</view>
				<view class="menu-items">
					<view class="menu-item" v-for="(item,index) in settingList.slice(4)" :key="index + 4" @click="onClickPath(item,index + 4)">
						<view class="item-icon">
							<image :src="item.icon" mode="aspectFit" class="icon-image"></image>
						</view>
						<text class="item-title">{{item.title}}</text>
						<view class="item-arrow">
							<image src="../../static/youjian.png" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<tabbar :actIndex="3"></tabbar>
	</view>
</template>

<script>
	import {
		userInfo,
		getUserIndex
	} from "@/api/user.js"
	export default {
		components: {
			tabbar: () => import("@/components/tabbar.vue"),
		},
		data() {
			return {
				userInfo: {
					real_name: '',
				},
				settingList: [
					
					{
						title: this.$t("user.ddjl"),
						icon: require("@/static/wddd.png")
					}, {
						title: this.$t("user.rjmx"),
						icon: require("@/static/kjrj.png")
					}, {
						title: this.$t("user.cjmx"),
						icon: require("@/static/chujin.png")
					}, {
						title: this.$t("user.zjjl"),
						icon: require("@/static/cwjl.png")
					}, {
						title: this.$t("user.ckzh"),
						icon: require("@/static/ck.png")
					}, {
						title: this.$t("user.sz"),
						icon: require("@/static/sz.png")
					},	{
						title: this.$t("user.smrz"),
						icon: require("@/static/smrz.png")
					}, {
						title: this.$t("user.tcdl"),
						icon: require("@/static/tcdl.png")
					},
				]
			};
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			onClickFuzhi(text) {
				uni.setClipboardData({
					data: text,
					success: ()=> {
						console.log('复制成功');
						// 可以添加用户友好的提示，例如使用uni.showToast提示复制成功
						uni.showToast({
							title: this.$t('user.fzcg'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			getUserIndex() {
			    // 调用接口获取客服链接
			    getUserIndex({
			        hideLoading: true
			    }).then(({ data }) => {
			
			        // H5 端直接跳外链
			        // #ifdef H5
			        window.location.href = data.kefu_url;
			        // #endif
			
			        // APP端使用plus.runtime.openURL
			        // #ifdef APP-PLUS
			        plus.runtime.openURL(data.kefu_url);
			        // #endif
			
			        // 小程序端用 webview 打开
			        // #ifndef H5
			        const url = encodeURIComponent(data.kefu_url);
			        uni.navigateTo({
			            url: `/pages/webview/index?url=${url}`
			        });
			        // #endif
			
			    });
			},
			
			getDetail() {
			    userInfo({
			        hideLoading: true
			    }).then(({ data }) => {
			        this.userInfo = data
			    });
			},

			onClickMoney() {
				uni.navigateTo({
					url: '/pages/withdraw-money/withdraw-money'
				})
			},
			onClickPath(item, index) {
				switch (index) {
					case 5:
						uni.navigateTo({
							url: '/pages/set/set'
						})
						break;
					
					case 7:
						uni.showModal({
							title: this.$t("user.tcdl"),
							content: this.$t("user.qdtc"),
							confirmText: "OK",//这块是确定按钮的文字
							cancelText:"Cancel",
							confirmColor: '#222',
							cancelColor: '#222',
							success: function(res) {
								if (res.confirm) {
									uni.reLaunch({
										url: '/pages/login/login'
									})
								}
							}
						});
						break;
					case 4:
						uni.navigateTo({
							url: '/pages/account/account'
						})
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/money-record/money-record'
						})
						break;
					case 0:
						uni.navigateTo({
							url: '/pages/order/order'
						})
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/withdraw-list/withdraw-list'
						})
						break;
					case 1:
						uni.navigateTo({
							url: '/pages/withdraw-list/withdraw-open'
						})
						break;
					case 6:
						uni.navigateTo({
							url: '/pages/verify/verify'
						})
						break;
				}

			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #f6f7fb;
	}

	.tui-kaihuHover {
		background-color: #f1f3fb !important;
		transform: scale(1.03);
	}

	.tui-kaihu {
		color: #98999d;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 16px;
		padding: 16rpx;
		font-size: 24rpx;

		image {
			width: 28rpx;
			height: 28rpx;
			margin-left: 14rpx;
		}
	}

	.tui-list {
		padding-bottom: 40px;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		width: 100%;

		.tui-listItem {
			width: 100%;
			font-size: 30rpx;
			background-color: #fff;
			border-radius: 13px;
			padding: 20rpx;
			box-sizing: border-box;
			display: flex;
			margin-top: 20rpx;
			display: flex;

			align-items: center;
			justify-content: space-between;

			.tui-rightIcon {
				width: 6px;
				height: 11px;
			}

			.title {
				font-size: 30rpx;
				color: #222;
			}

			.logo {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
		}
	}

	.tui-spendMoney {
		font-size: 26rpx;
		display: flex;
		margin-top: 20rpx;

		.tui-rightItem {
			margin-left: 20rpx;
			padding: 28rpx;
			width: 180rpx;
			background-color: #fff;
			border-radius: 13px;
			display: flex;
			flex-direction: column;
			align-items: center;

			.text {
				font-size: 32rpx;
				font-weight: 500;
				padding-top: 18rpx;
				color: #222;
			}

			image {
				width: 55rpx;
				height: 55rpx;
			}
		}

		.tui-spendMoneyItem {
			padding: 28rpx;
			width: 300rpx;
			align-items: flex-start;
			background-color: #fff;
			border-radius: 13px;
			display: flex;
			flex-direction: column;

			.cny {
				color: #a8a9ac;
				font-size: 20rpx;
			}

			.pice {
				font-size: 32rpx;
				font-weight: 500;
				padding-top: 20rpx;
			}
		}
	}

	.all-size {
		font-size: 20rpx;
		text-align: center;
		color: #222;
	}

	.big-size {
		font-size: 26rpx;
		color: #222;
		padding-top: 10rpx;
	}

	.flex-1 {
		flex: 1;
	}

	.tui-money {
		margin-top: 44rpx;

		.normal {
			background: url(/static/money-bg.png) 0% 0% / cover no-repeat;
			border-radius: 13px;
			padding: 26rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.tui-position {
				width: 100rpx;
				height: 60rpx;
				right: 26rpx;
				top: 26rpx;
				position: absolute;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.mt-sm {
				color: #a8a9ac;
				font-size: 20rpx;
				padding-top: 10rpx;
				display: flex;
				align-items: center;
			}

			.pice {
				font-size: 36rpx;
				font-weight: 500;
				padding-top: 20rpx;
			}

			.text-xs {
				font-size: 20rpx;
				color: #222;
			}
		}
	}

	.tui-header {
		padding: 0 32rpx;

		.tui-userInfo {
			display: flex;
			align-items: center;
			justify-content: space-between;

			padding-top: 64rpx;

			.tui-credit {
				background-color: #fff;
				color: rgb(37, 188, 115);
				font-size: 21rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-radius: 12px;
				margin-left: 12rpx;
				height: 40rpx;
				padding: 0 10rpx;
				margin-top: 20rpx;

				image {
					width: 26rpx;
					height: 26rpx;
					margin-right: 6rpx;
				}
			}

			.desc {
				display: flex;
				align-items: center;



				.tui-vip {
					background-color: #e4e3ff;
					color: #3f427e;
					font-size: 21rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-radius: 12px;
					margin-left: 12rpx;
					height: 40rpx;
					padding: 0 10rpx;

					image {
						width: 26rpx;
						height: 26rpx;
						margin-right: 6rpx;
					}
				}

				.rellname {
					font-size: 32rpx;
					font-weight: 500;
					padding-top: 6rpx;
					color: #222;
				}
			}

			.name {
				font-size: 44rpx;
				font-weight: bold;
				color: #222;
			}
		}
	}
</style>

<!-- 现代样式 -->
<style lang="less" scoped>
.modern-user-container {
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
			right: 10%;
			animation-delay: 0s;
		}
		
		&.circle-2 {
			width: 150rpx;
			height: 150rpx;
			bottom: 20%;
			left: 5%;
			animation-delay: 2s;
		}
		
		&.circle-3 {
			width: 100rpx;
			height: 100rpx;
			top: 60%;
			right: 20%;
			animation-delay: 4s;
		}
	}
}

.user-profile-section, .assets-overview, .action-buttons-section {
	position: relative;
	z-index: 10;
	margin: 0 30rpx 25rpx;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 35rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.user-profile-section {
	.profile-header {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		
		.avatar-container {
			position: relative;
			margin-right: 25rpx;
			
			.avatar-ring {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				background: linear-gradient(135deg, #667eea, #764ba2);
				padding: 4rpx;
				
				.avatar-image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background: #fff;
					padding: 8rpx;
				}
			}
			
			.status-indicator {
				position: absolute;
				bottom: 8rpx;
				right: 8rpx;
				width: 24rpx;
				height: 24rpx;
				background: #2ed573;
				border-radius: 50%;
				border: 3rpx solid #fff;
			}
		}
		
		.user-details {
			flex: 1;
			
			.name-section {
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;
				
				.username {
					font-size: 38rpx;
					font-weight: bold;
					color: #333;
					margin-right: 15rpx;
				}
				
				.vip-tag {
					display: flex;
					align-items: center;
					background: linear-gradient(135deg, #ffd700, #ffed4e);
					padding: 6rpx 12rpx;
					border-radius: 15rpx;
					box-shadow: 0 4rpx 12rpx rgba(255, 215, 0, 0.3);
					
					.vip-icon {
						width: 20rpx;
						height: 20rpx;
						margin-right: 6rpx;
					}
					
					.vip-label {
						font-size: 20rpx;
						color: #333;
						font-weight: bold;
					}
				}
			}
			
			.info-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.real-name {
					font-size: 26rpx;
					color: #666;
				}
				
				.credit-score {
					display: flex;
					align-items: center;
					background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
					padding: 6rpx 12rpx;
					border-radius: 15rpx;
					border: 1rpx solid rgba(102, 126, 234, 0.2);
					
					.credit-icon {
						width: 20rpx;
						height: 20rpx;
						margin-right: 6rpx;
					}
					
					.score-text {
						font-size: 22rpx;
						color: #667eea;
						font-weight: 600;
					}
				}
			}
		}
	}
	
	.account-info {
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
		padding: 25rpx;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: all 0.3s ease;
		border: 1rpx solid rgba(102, 126, 234, 0.15);
		
		&:active {
			transform: scale(0.98);
			background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
		}
		
		.info-content {
			.info-label {
				display: block;
				font-size: 24rpx;
				color: #666;
				margin-bottom: 8rpx;
			}
			
			.info-value {
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
			}
		}
		
		.copy-button {
			width: 40rpx;
			height: 40rpx;
			background: rgba(102, 126, 234, 0.1);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.copy-icon {
				width: 24rpx;
				height: 24rpx;
			}
		}
	}
}

.assets-overview {
	.assets-main {
		.balance-section {
			text-align: center;
			margin-bottom: 30rpx;
			
			.balance-label {
				display: block;
				font-size: 28rpx;
				color: #666;
				margin-bottom: 15rpx;
			}
			
			.balance-amount {
				display: flex;
				align-items: baseline;
				justify-content: center;
				margin-bottom: 10rpx;
				
				.amount-value {
					font-size: 48rpx;
					font-weight: bold;
					color: #333;
					margin-right: 8rpx;
				}
				
				.amount-unit {
					font-size: 28rpx;
					color: #667eea;
					font-weight: 600;
				}
			}
			
			.balance-conversion {
				display: block;
				font-size: 24rpx;
				color: #667eea;
				font-weight: 500;
			}
		}
	}
	
	.stats-grid {
		display: flex;
		gap: 20rpx;
		
		.stat-card {
			flex: 1;
			background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
			border-radius: 15rpx;
			padding: 25rpx 20rpx;
			display: flex;
			align-items: center;
			border: 1rpx solid rgba(102, 126, 234, 0.1);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.98);
				background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
			}
			
			.stat-icon-wrapper {
				width: 50rpx;
				height: 50rpx;
				background: rgba(102, 126, 234, 0.1);
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 15rpx;
				
				.stat-icon {
					width: 30rpx;
					height: 30rpx;
				}
			}
			
			.stat-details {
				flex: 1;
				
				.stat-title {
					display: block;
					font-size: 22rpx;
					color: #666;
					margin-bottom: 8rpx;
				}
				
				.stat-amount {
					display: block;
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
				}
			}
		}
	}
}

.action-buttons-section {
	.button-group {
		display: flex;
		gap: 20rpx;
		
		.action-btn {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 35rpx 25rpx;
			border-radius: 20rpx;
			transition: all 0.3s ease;
			position: relative;
			overflow: hidden;
			
			&:active {
				transform: scale(0.95);
			}
			
			&.deposit-action {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
				
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
					opacity: 0;
					transition: opacity 0.3s ease;
				}
				
				&:active::before {
					opacity: 1;
				}
				
				.btn-label {
					color: #fff;
				}
			}
			
			&.withdraw-action {
				background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
				box-shadow: 0 10rpx 30rpx rgba(240, 147, 251, 0.3);
				
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
					opacity: 0;
					transition: opacity 0.3s ease;
				}
				
				&:active::before {
					opacity: 1;
				}
				
				.btn-label {
					color: #fff;
				}
			}
			
			.btn-icon-wrapper {
				width: 60rpx;
				height: 60rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 15rpx;
				position: relative;
				z-index: 1;
				
				.btn-icon {
					width: 35rpx;
					height: 35rpx;
				}
			}
			
			.btn-label {
				font-size: 26rpx;
				font-weight: bold;
				position: relative;
				z-index: 1;
			}
		}
	}
}

.menu-sections {
	position: relative;
	z-index: 10;
	margin: 0 30rpx 30rpx;
	
	.menu-category {
		margin-bottom: 30rpx;
		
		.category-header {
			margin-bottom: 20rpx;
			
			.category-title {
				font-size: 28rpx;
				font-weight: bold;
				color: #fff;
				text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
			}
		}
		
		.menu-items {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(20px);
			border-radius: 20rpx;
			overflow: hidden;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
			border: 1rpx solid rgba(255, 255, 255, 0.2);
			
			.menu-item {
				padding: 30rpx 25rpx;
				display: flex;
				align-items: center;
				transition: all 0.3s ease;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
				position: relative;
				
				&:last-child {
					border-bottom: none;
				}
				
				&:active {
					background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
				}
				
				.item-icon {
					width: 50rpx;
					height: 50rpx;
					background: rgba(102, 126, 234, 0.1);
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 20rpx;
					
					.icon-image {
						width: 30rpx;
						height: 30rpx;
					}
				}
				
				.item-title {
					flex: 1;
					font-size: 30rpx;
					color: #333;
					font-weight: 500;
				}
				
				.item-arrow {
					width: 24rpx;
					height: 24rpx;
					opacity: 0.6;
					
					.arrow-icon {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
}

@keyframes float {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-20px); }
}
</style>