<template>
	<view class="modern-register-check-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>
		
		<!-- 顶部导航 -->
		<view class="header-section">
			<view class="back-button" @click="back">
				<uni-icons type="arrow-left" size="25" color="#fff"></uni-icons>
			</view>
			<view class="page-title">
				<text class="title-text">账户注册</text>
			</view>
		</view>
		
		<!-- 主要内容卡片 -->
		<view class="main-card">
			<view class="welcome-section">
				<text class="welcome-title">创建您的账户</text>
				<text class="welcome-subtitle">请填写基本信息</text>
			</view>
			
			<view class="form-section">
				<view class="input-group">
					<view class="input-label">
						<text class="label-icon">👤</text>
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
						<text class="label-icon">📱</text>
						<text class="label-text">{{$t('login.sjh')}}</text>
					</view>
					<uni-easyinput 
						:adjust-position="false" 
						v-model="formData.phone" 
						:placeholder="$t('login.qsrsjh')" 
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
						<text class="label-icon">🆔</text>
						<text class="label-text">{{$t('verify.xm')}}</text>
					</view>
					<uni-easyinput 
						:adjust-position="false" 
						v-model="formData.real_name" 
						:placeholder="$t('verify.srxm')" 
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
						<text class="label-icon">🎫</text>
						<text class="label-text">{{$t('login.khm')}}</text>
					</view>
					<uni-easyinput 
						:adjust-position="false" 
						v-model="formData.invitecode" 
						:placeholder="$t('login.qsrkhm')"
						:inputBorder="true" 
						:styles="modernStyles" 
						primaryColor="#667eea"  
						@focus="hideTabbar" 
						@blur="showTabbar" 
						class="modern-input"
					/>
				</view>
				
				<view class="next-button" :class="[{'disabled':btnDisabled}]" @click="checkInfo">
					<text class="button-text">{{$t('login.xyb')}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部政策 -->
		<view class="bottom-policy">
			<text class="policy-text">{{$t('login.bsty')}}</text>
			<text class="policy-link" @click="onClickYinsi">{{$t('login.yszc')}}</text>
		</view>
	</view>
</template>

<script>
	import {
		userCheckRegister
	} from "@/api/user.js"
	export default {
		data() {
			return {
				formData: {
					// account: 'user66',
					// phone: '18888888888',
					// real_name: '张三',
					// invitecode: '41',
					account: '',
					phone: '',
					real_name: '',
					invitecode: ''
				},
				modernStyles: {
					'borderColor': '#e0e0e0',
					'backgroundColor': '#f8f9fa'
				},
				tabbar: true,
				windowHeight: ''
			};
		},
		computed: {
			btnDisabled() {
				try {
					Object.values(this.formData).forEach(item => {
						if (!item) {
							throw ('有空值')
						}
					})
				} catch (e) {
					//TODO handle the exception
					return true
				}
				return false
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight;
				}
			});
			// uni.onWindowResize((res) => {
			// 	if (res.size.windowHeight < this.windowHeight) {
			// 		this.tabbar = false
			// 	} else {
			// 		this.tabbar = true
			// 	}
			// })
		},
		onUnload() {
			// uni.offWindowResize();
		},
		methods: {
			hideTabbar() {
				this.tabbar = false;
			},
			showTabbar() {
				this.tabbar = true;
			},
			back() {
				uni.navigateBack();
			},
			checkInfo() {
				if (this.btnDisabled) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}
				
				console.log('开始验证注册信息', this.formData);
				userCheckRegister(this.formData).then((res) => {
					console.log('验证成功', res);
					if (res.status === 1) {
						// 保存注册信息到store
						this.$store.commit('setRegister', this.formData);
						
						uni.showToast({
							title: '信息验证成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							// 跳转到设置密码页面
							uni.navigateTo({
								url: '/pages/login/register'
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.massage || res.message || '验证失败',
							icon: 'none'
						});
					}
				}).catch((error) => {
					console.error('验证失败', error);
					uni.showToast({
						title: '验证失败，请重试',
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
.modern-register-check-container {
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
			width: 160rpx;
			height: 160rpx;
			top: 20%;
			right: 20%;
			animation-delay: 0s;
		}
		
		&.circle-2 {
			width: 100rpx;
			height: 100rpx;
			bottom: 30%;
			left: 15%;
			animation-delay: 2s;
		}
		
		&.circle-3 {
			width: 60rpx;
			height: 60rpx;
			top: 80%;
			right: 30%;
			animation-delay: 4s;
		}
	}
}

.header-section {
	position: relative;
	z-index: 10;
	padding: 60rpx 40rpx 40rpx;
	display: flex;
	align-items: center;
	
	.back-button {
		width: 80rpx;
		height: 80rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
		flex-shrink: 0; /* 防止按钮被压缩 */
		
		&:active {
			transform: scale(0.95);
		}
	}
	
	.page-title {
		flex: 1;
		text-align: center;
		min-width: 0; /* 防止被压榨 */
		
		.title-text {
			font-size: 36rpx;
			font-weight: bold;
			color: #fff;
			flex-shrink: 0; /* 防止文字被压缩 */
			white-space: nowrap; /* 防止文字换行 */
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
			font-size: 44rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.welcome-subtitle {
			display: block;
			font-size: 26rpx;
			color: #666;
		}
	}
	
	.form-section {
		.input-group {
			margin-bottom: 35rpx;
			
			.input-label {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.label-icon {
					font-size: 30rpx;
					margin-right: 15rpx;
				}
				
				.label-text {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}
			}
		}
		
		.next-button {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 50rpx;
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

.bottom-policy {
	position: relative;
	z-index: 10;
	padding: 40rpx;
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
</style>