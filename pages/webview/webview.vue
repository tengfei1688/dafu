<template>
	<view class="webview-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" 
				@click="goBack" 
				@touchstart="onTouchStart" 
				@touchend="onTouchEnd"
				@touchcancel="onTouchCancel"
				@mousedown="onMouseDown"
				@mouseup="onMouseUp"
			>
				<text class="back-icon">←</text>
				<text class="back-text">返回</text>
				<!-- 透明覆盖层，确保事件不被webview拦截 -->
				<view class="event-overlay" @click.stop="goBack"></view>
			</view>
			<view class="nav-title">{{ title || '网页' }}</view>
			<view class="nav-right" @click="refresh">
				<text class="refresh-icon">↻</text>
			</view>
		</view>
		
		<!-- WebView内容 -->
		<web-view 
			:key="webviewKey"
			:src="url" 
			@message="handleMessage"
			@error="handleError"
			@loading="handleLoading"
			@navigation="handleNavigation"
			@redirect="handleRedirect"
			:progress="false"
			:webview-styles="{
				progress: {
					color: '#007aff'
				},
				titleNView: {
					buttons: []
				}
			}"
		></web-view>
		
		<!-- 加载提示 -->
		<view v-if="loading" class="loading-overlay">
			<view class="loading-content">
				<text class="loading-text">正在加载...</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: '',
			title: '',
			loading: true,
			fromPage: '', // 记录来源页面
			webviewStyles: {
				progress: {
					color: '#007aff'
				}
			},
			isReturning: false, // 新增：防止重复点击
			webviewKey: 0 // 新增：用于强制重新渲染webview
		}
	},
	
	onLoad(options) {
		console.log('WebView页面加载，参数:', options)
		
		// 获取URL和标题参数
		if (options.url) {
			this.url = decodeURIComponent(options.url)
			console.log('加载URL:', this.url)
		}
		
		if (options.title) {
			this.title = decodeURIComponent(options.title)
		}
		
		// 记录来源页面
		if (options.from) {
			this.fromPage = decodeURIComponent(options.from)
			console.log('记录来源页面:', this.fromPage)
		}
		
		// 调试：打印当前页面栈
		const pages = getCurrentPages()
		console.log('当前页面栈:', pages.map(p => p.route))
		console.log('页面栈长度:', pages.length)
		
		// 如果没有URL，显示错误
		if (!this.url) {
			uni.showToast({
				title: '无效的URL',
				icon: 'none'
			})
			setTimeout(() => {
				this.goBack()
			}, 1500)
		}
		
		// 拦截页面的返回事件
		this.interceptBackEvent()
	},
	
	onShow() {
		console.log('WebView页面显示')
		// 确保页面在APP内显示
		// 重新拦截返回事件
		this.interceptBackEvent()
	},
	
	onHide() {
		console.log('WebView页面隐藏')
		// 页面隐藏时的处理
	},
	
	onUnload() {
		console.log('WebView页面卸载')
		// 页面卸载时的清理工作
	},
	
	methods: {
		// 返回上一页
		goBack() {
			console.log('=== 开始返回操作 ===')
			console.log('来源页面:', this.fromPage)
			
			// 防止重复点击
			if (this.isReturning) {
				console.log('正在返回中，忽略重复点击')
				return
			}
			
			this.isReturning = true
			
			// 获取当前页面栈信息
			const pages = getCurrentPages()
			console.log('当前页面栈:', pages.map(p => p.route))
			console.log('页面栈长度:', pages.length)
			
			// 直接使用reLaunch回到登录页面，这是最可靠的方式
			// 避免webview的默认行为干扰
			console.log('直接使用reLaunch回到登录页面')
			
			// 使用setTimeout确保事件处理完成后再执行跳转
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/login/login',
					success: () => {
						console.log('reLaunch到登录页面成功')
						this.isReturning = false
					},
					fail: (error) => {
						console.error('reLaunch到登录页面失败:', error)
						this.isReturning = false
						// 如果reLaunch失败，尝试其他方式
						this.tryAlternativeReturn()
					}
				})
			}, 100) // 延迟100ms确保事件处理完成
			
			// 设置超时保护，防止卡死
			setTimeout(() => {
				if (this.isReturning) {
					console.log('返回操作超时，强制重置状态')
					this.isReturning = false
				}
			}, 5000)
		},
		
		// 阻止webview的默认行为
		preventWebviewDefault() {
			console.log('尝试阻止webview的默认行为')
			
			// 尝试阻止webview的默认返回行为
			try {
				// 强制重新渲染webview
				this.webviewKey++
				console.log('强制重新渲染webview，key:', this.webviewKey)
				
				// 在webview加载完成后，尝试注入JavaScript来阻止默认行为
				if (this.url) {
					console.log('尝试注入JavaScript阻止默认行为')
					// 这里可以尝试注入JavaScript代码来阻止webview的默认行为
				}
			} catch (error) {
				console.log('阻止webview默认行为失败:', error)
			}
		},
		
		// 备用返回方案
		tryAlternativeReturn() {
			console.log('=== 尝试备用返回方案 ===')
			
			// 尝试使用switchTab回到首页
			uni.switchTab({
				url: '/pages/index/index',
				success: () => {
					console.log('switchTab到首页成功')
				},
				fail: (error) => {
					console.error('switchTab到首页失败:', error)
					// 最后的备用方案：显示提示
					uni.showToast({
						title: '返回失败，请手动返回',
						icon: 'none',
						duration: 3000
					})
				}
			})
		},
		
		// 刷新页面
		refresh() {
			this.loading = true
			// 重新加载webview
			this.$forceUpdate()
		},
		
		// 处理webview消息
		handleMessage(event) {
			console.log('WebView消息:', event)
		},
		
		// 处理webview错误
		handleError(event) {
			console.error('WebView错误:', event)
			uni.showToast({
				title: '页面加载失败',
				icon: 'none'
			})
		},
		
		// 处理webview加载状态
		handleLoading(event) {
			console.log('WebView加载状态:', event)
			if (event.detail && event.detail.readyState === 'complete') {
				this.loading = false
			}
		},
		
		// 处理webview导航事件
		handleNavigation(event) {
			console.log('WebView导航事件:', event)
			// 可以在这里处理导航跳转，例如阻止默认跳转
			// if (event.detail.url.includes('login')) {
			// 	uni.reLaunch({ url: '/pages/login/login' })
			// 	return true // 阻止默认跳转
			// }
		},

		// 处理webview重定向事件
		handleRedirect(event) {
			console.log('WebView重定向事件:', event)
			// 可以在这里处理重定向，例如阻止默认重定向
			// if (event.detail.url.includes('login')) {
			// 	uni.reLaunch({ url: '/pages/login/login' })
			// 	return true // 阻止默认重定向
			// }
		},
		
		// 拦截页面的返回事件
		interceptBackEvent() {
			console.log('拦截页面返回事件')
			
			// 检查uni.onBackPress是否存在
			if (typeof uni.onBackPress === 'function') {
				uni.onBackPress((options) => {
					console.log('收到页面返回事件')
					if (this.isReturning) {
						console.log('正在返回中，忽略页面返回事件')
						return true // 阻止默认返回
					}
					this.goBack()
					return true // 阻止默认返回
				})
			} else {
				console.log('uni.onBackPress不存在，使用其他方法')
				// 使用页面级别的返回拦截
				this.interceptPageBack()
			}
		},
		
		// 页面级别的返回拦截（备用方案）
		interceptPageBack() {
			console.log('使用页面级别的返回拦截')
			// 在页面中添加返回按钮的点击事件拦截
			// 这个方法已经在goBack中实现了
		},

		// 自定义返回按钮的触摸开始事件
		onTouchStart() {
			console.log('自定义返回按钮触摸开始')
			this.isReturning = true // 开始返回操作
		},

		// 自定义返回按钮的触摸结束事件
		onTouchEnd() {
			console.log('自定义返回按钮触摸结束')
			// 这里可以添加一些延迟，确保触摸结束后的行为
			setTimeout(() => {
				this.isReturning = false // 结束返回操作
			}, 500) // 延迟500ms
		},

		// 自定义返回按钮的触摸取消事件
		onTouchCancel() {
			console.log('自定义返回按钮触摸取消')
			this.isReturning = false // 取消返回操作
		},

		// 自定义返回按钮的鼠标按下事件
		onMouseDown() {
			console.log('自定义返回按钮鼠标按下')
			this.isReturning = true // 开始返回操作
		},

		// 自定义返回按钮的鼠标释放事件
		onMouseUp() {
			console.log('自定义返回按钮鼠标释放')
			// 这里可以添加一些延迟，确保鼠标释放后的行为
			setTimeout(() => {
				this.isReturning = false // 结束返回操作
			}, 500) // 延迟500ms
		}
	}
}
</script>

<style lang="scss" scoped>
.webview-container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #fff;
}

.nav-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	background: #fff;
	border-bottom: 1rpx solid #e5e5e5;
	position: relative;
	z-index: 1000;
}

.nav-left {
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative; // 添加相对定位
}

.back-icon {
	font-size: 36rpx;
	color: #333;
	margin-right: 8rpx;
}

.back-text {
	font-size: 28rpx;
	color: #333;
}

// 事件覆盖层样式
.event-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: transparent;
	z-index: 10; // 确保在最上层
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	text-align: center;
}

.nav-right {
	display: flex;
	align-items: center;
}

.refresh-icon {
	font-size: 32rpx;
	color: #333;
	cursor: pointer;
}

.loading-overlay {
	position: fixed;
	top: 88rpx;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.loading-content {
	text-align: center;
}

.loading-text {
	font-size: 28rpx;
	color: #666;
}
</style>
