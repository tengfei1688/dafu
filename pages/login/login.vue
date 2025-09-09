<template>
	<view class="modern-login-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>
		
		<!-- 顶部Logo区域 -->
		<view class="header-section">
			<view class="logo-container">
				<image src="../../static/logo.png" mode="aspectFit" class="logo-image"></image>
				<text class="app-name">{{$t('app.yymc')}}</text>
			</view>
			<view class="language-switch" @click="onClickLanguage">
				<image src="../../static/diqiu.png" mode="aspectFit" class="lang-icon"></image>
			</view>
		</view>
		
		<!-- 主要内容卡片 -->
		<view class="main-card">
			<view class="welcome-section">
				<text class="welcome-title">欢迎回来！</text>
				<text class="welcome-subtitle">请登录您的账户</text>
			</view>
			
			<view class="form-section">
				<view class="input-group">
					<view class="input-label">
						<text class="label-icon">📧</text>
						<text class="label-text">{{$t('login.zh')}}</text>
					</view>
					<uni-easyinput 
						:adjust-position="false" 
						v-model="formData.account"
						:placeholder="$t('login.qsrzh')" 
						:inputBorder="true" 
						:styles="modernStyles" 
						primaryColor="#667eea"
						@focus="hideTabbar" 
						@blur="showTabbar" 
						class="modern-input"
					/>
				</view>
				
				<view class="input-group">
					<view class="input-label">
						<text class="label-icon">🔒</text>
						<text class="label-text">{{$t('login.mm')}}</text>
					</view>
					<uni-easyinput 
						:adjust-position="false" 
						type="password" 
						v-model="formData.passwd"
						:placeholder="$t('login.qsrmm')" 
						:inputBorder="true" 
						:styles="modernStyles" 
						primaryColor="#667eea"
						@focus="hideTabbar" 
						@blur="showTabbar" 
						class="modern-input"
					/>
				</view>
				
				<view class="login-button" :class="[{'disabled':btnDisabled}]" @click="onClickLogin">
					<text class="button-text">{{$t('login.dl')}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部操作区域 -->
		<view class="bottom-actions" v-if="tabbar">
			<view class="action-row">
				<view class="action-button register-btn" @click="onClickRegister">
					<text class="action-text">{{$t('login.ljzc')}}</text>
				</view>
				<view class="divider"></view>
				<view class="action-button service-btn" @click="onClickMessage">
					<text class="action-text">{{$t('home.zxkf')}}</text>
				</view>
			</view>
			
			<view class="policy-section">
				<text class="policy-text">{{$t('login.bsty')}}</text>
				<text class="policy-link" @click="onClickYinsi">{{$t('login.yszc')}}</text>
			</view>
		</view>
		
		<langChange ref="langChange"></langChange>
	</view>
</template>

<script>
	import {
		userLogin,
		userInfo,
		getUserIndex
	} from "@/api/user.js"
	export default {
		components: {
			langChange: () => import("@/components/langChange.vue"),
		},
		data() {
			return {
				formData: {
					// 测试账号 - 取消注释即可使用
					// account: 'user66', 
					// passwd: '123456', 
					// account: 'mumu',
					// passwd: '123456'
					account: '',
					passwd: ''
				},
				modernStyles: {
					'borderColor': '#e0e0e0',
					'backgroundColor': '#f8f9fa'
				},
				tabbar: true,
				windowHeight: ''
			};
		},

		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight;
				}
			});
			uni.onWindowResize((res) => {
				this.windowHeight = res.size.windowHeight;
			});
		},
		onUnload() {
			uni.offWindowResize();
		},
		computed: {
			btnDisabled() {
				return !this.formData.account || !this.formData.passwd;
			}
		},
		methods: {
			hideTabbar() {
				this.tabbar = false;
			},
			showTabbar() {
				this.tabbar = true;
			},
			onClickLanguage() {
				this.$refs.langChange.open();
			},
			onClickLogin() {
				if (this.btnDisabled) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}
				console.log('点击登录', this.formData);
				userLogin(this.formData).then((res) => {
					console.log('登录成功', res);
					if (res.status === 1) {
						uni.setStorageSync('userToken', res.data.token);
						uni.setStorageSync('userInfo', res.data);
						this.$store.commit('setToken', res.data.token);
						this.$store.commit('setUser', res.data);
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.massage || res.message || '登录失败',
							icon: 'none'
						});
					}
				}).catch((error) => {
					console.error('登录失败', error);
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					});
				});
			},
			onClickRegister() {
				uni.navigateTo({
					url: '/pages/login/registerCheck'
				});
			},
			onClickMessage() {
				console.log('点击在线客服');
				getUserIndex({
					checkFree: true
				}).then((res) => {
					console.log('获取客服链接成功', res);
					if (res.status === 1 && res.data.kefu_url) {
						// #ifdef APP-PLUS
						uni.navigateTo({
							url: `/pages/webview/webview?url=${encodeURIComponent(res.data.kefu_url)}&from=login`
						});
						// #endif
						// #ifdef H5
						window.location.href = res.data.kefu_url;
						// #endif
						// #ifdef MP-WEIXIN
						uni.setClipboardData({
							data: res.data.kefu_url,
							success: () => {
								uni.showToast({
									title: '客服链接已复制到剪贴板',
									icon: 'success'
								});
							}
						});
						// #endif
					} else {
						uni.showToast({
							title: '获取客服链接失败',
							icon: 'none'
						});
					}
				}).catch((error) => {
					console.error('获取客服链接失败', error);
					uni.showToast({
						title: '获取客服链接失败',
						icon: 'none'
					});
				});
			},
			onClickYinsi() {
				uni.navigateTo({
					url: '/pages/yinsi/yinsi'
				});
			}
		}
	}
</script>

<style lang="less">
.modern-login-container {
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

.header-section {
	position: relative;
	z-index: 10;
	padding: 60rpx 40rpx 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20rpx; /* 添加间距 */
	
	.logo-container {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0; /* 防止被压榨 */
		max-width: calc(100% - 120rpx); /* 给语言切换按钮留出空间 */
		
		.logo-image {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			flex-shrink: 0; /* 防止图片被压缩 */
			object-fit: contain; /* 保持图片比例 */
			/* 确保图片不被压榨 */
			min-width: 80rpx;
			min-height: 80rpx;
			max-width: 80rpx;
			max-height: 80rpx;
		}
		
		.app-name {
			font-size: 36rpx;
			font-weight: bold;
			color: #fff;
			flex-shrink: 0; /* 防止文字被压缩 */
			white-space: nowrap; /* 防止文字换行 */
			min-width: 0; /* 允许文字在必要时收缩 */
			/* 确保文字有足够空间 */
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	
	.language-switch {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		padding: 20rpx;
		border-radius: 50rpx;
		backdrop-filter: blur(10px);
		flex-shrink: 0; /* 防止按钮被压缩 */
		width: 80rpx;
		height: 80rpx;
		
		.lang-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}
}

.main-card {
	position: relative;
	z-index: 10;
	margin: 0 40rpx;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-radius: 30rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
	
	.welcome-section {
		text-align: center;
		margin-bottom: 60rpx;
		
		.welcome-title {
			display: block;
			font-size: 48rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.welcome-subtitle {
			display: block;
			font-size: 28rpx;
			color: #666;
		}
	}
	
	.form-section {
		.input-group {
			margin-bottom: 40rpx;
			
			.input-label {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.label-icon {
					font-size: 32rpx;
					margin-right: 15rpx;
				}
				
				.label-text {
					font-size: 30rpx;
					color: #333;
					font-weight: 500;
				}
			}
		}
		
		.login-button {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 60rpx;
			box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
			transition: all 0.3s ease;
			
			&:active {
				transform: translateY(2rpx);
				box-shadow: 0 5rpx 15rpx rgba(102, 126, 234, 0.3);
			}
			
			&.disabled {
				background: #ccc;
				box-shadow: none;
			}
			
			.button-text {
				color: #fff;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
}

.bottom-actions {
	position: relative;
	z-index: 10;
	padding: 40rpx;
	
	.action-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
		
		.action-button {
			padding: 25rpx 40rpx;
			border-radius: 50rpx;
			background: rgba(255, 255, 255, 0.2);
			backdrop-filter: blur(10px);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.95);
			}
			
			&.register-btn {
				background: rgba(255, 255, 255, 0.3);
			}
			
			&.service-btn {
				background: rgba(255, 255, 255, 0.2);
			}
			
			.action-text {
				color: #fff;
				font-size: 28rpx;
				font-weight: 500;
			}
		}
		
		.divider {
			width: 2rpx;
			height: 40rpx;
			background: rgba(255, 255, 255, 0.3);
			margin: 0 40rpx;
		}
	}
	
	.policy-section {
		text-align: center;
		
		.policy-text {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.7);
		}
		
		.policy-link {
			font-size: 24rpx;
			color: #fff;
			text-decoration: underline;
			margin-left: 10rpx;
		}
	}
}

@keyframes float {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-20px); }
}

// 输入框样式覆盖
/deep/ .uni-easyinput__content {
	border-radius: 20rpx !important;
	border: 2rpx solid #e0e0e0 !important;
	background: #f8f9fa !important;
	transition: all 0.3s ease;
	
	&:focus-within {
		border-color: #667eea !important;
		box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1) !important;
	}
}

/deep/ .uni-easyinput__content-input {
	height: 80rpx !important;
	padding: 0 30rpx !important;
	font-size: 28rpx !important;
}

// 响应式设计 - 确保LOGO在不同屏幕下都正常显示
@media screen and (max-width: 750rpx) {
	.header-section {
		padding: 40rpx 30rpx 30rpx;
		
		.logo-container {
			max-width: calc(100% - 100rpx);
			
			.logo-image {
				width: 70rpx;
				height: 70rpx;
				min-width: 70rpx;
				min-height: 70rpx;
				max-width: 70rpx;
				max-height: 70rpx;
			}
			
			.app-name {
				font-size: 32rpx;
			}
		}
		
		.language-switch {
			width: 70rpx;
			height: 70rpx;
			
			.lang-icon {
				width: 35rpx;
				height: 35rpx;
			}
		}
	}
}

@media screen and (min-width: 1200rpx) {
	.header-section {
		padding: 80rpx 50rpx 50rpx;
		
		.logo-container {
			.logo-image {
				width: 90rpx;
				height: 90rpx;
				min-width: 90rpx;
				min-height: 90rpx;
				max-width: 90rpx;
				max-height: 90rpx;
			}
			
			.app-name {
				font-size: 40rpx;
			}
		}
		
		.language-switch {
			width: 90rpx;
			height: 90rpx;
			
			.lang-icon {
				width: 45rpx;
				height: 45rpx;
			}
		}
	}
}
</style>