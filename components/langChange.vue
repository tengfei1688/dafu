<template>
	<view>
		<!-- 语言切换组件 - 使用ActionSheet，无需模板 -->
	</view>
</template>

<script>
	import { setLanguage } from '@/i18n/index.js'
	
	export default {
		name: "langChange",
		data() {
			return {
				showLang: uni.getStorageSync('i18nLang') || 'zh-CN',
				langList: [
					{
						name: '简体中文',
						value: 'zh-CN'
					},
					{
						name: '繁體中文',
						value: 'zh-TW'
					}, {
						name: 'English',
						value: 'en-US'
					},
					{
						name: '日本語',
						value: 'ja-JP'
					},
					{
						name: 'ภาษาไทย',
						value: 'th-TH'
					},
					{
						name: 'Tiếng Việt',
						value: 'vi-VN'
					}, {
						name: 'IndonesiaName',
						value: 'id-ID'
					}, {
						name: '한국어',
						value: 'ko-KR'
					}, {
						name: 'Français',
						value: 'fr-FR'
					}, {
						name: 'Deutsch',
						value: 'de-DE'
					}
				]
			};
		},
		methods: {
			open() {
				console.log('语言切换组件open方法被调用')
				this.showLanguageOptions()
			},
			
			showLanguageOptions() {
				console.log('显示语言选择')
				const itemList = this.langList.map(item => item.name)
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						console.log('用户选择了语言:', res.tapIndex)
						const selectedLang = this.langList[res.tapIndex]
						if (selectedLang) {
							this.seletLang(selectedLang)
						}
					},
					fail: (error) => {
						console.error('显示语言选择失败:', error)
						uni.showToast({
							title: '语言选择失败',
							icon: 'none'
						})
					}
				})
			},
			
			seletLang(item) {
				console.log('选择语言:', item.name, item.value)
				
				// 使用动态语言切换方法
				if (setLanguage(item.value)) {
					// 更新当前显示的语言
					this.showLang = item.value
					
					// 显示切换成功提示
					uni.showToast({
						title: `已切换到${item.name}`,
						icon: 'success',
						duration: 1500
					})
					
					// 延迟刷新当前页面，让语言设置生效
					setTimeout(() => {
						console.log('开始刷新当前页面，目标语言:', item.value)
						
						// 获取当前页面路径
						const currentPages = getCurrentPages()
						const currentPage = currentPages[currentPages.length - 1]
						
						if (currentPage && currentPage.route) {
							const currentUrl = '/' + currentPage.route
							console.log('当前页面路径:', currentUrl)
							
							// 刷新当前页面
							uni.reLaunch({
								url: currentUrl,
								success: () => {
									console.log('语言切换成功，刷新当前页面')
								},
								fail: (error) => {
									console.error('刷新当前页面失败:', error)
									// 备用方案：回到登录页
									uni.reLaunch({
										url: '/pages/login/login'
									})
								}
							})
						} else {
							// 如果无法获取当前页面，回到登录页
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}, 1500)
				} else {
					uni.showToast({
						title: '语言切换失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 语言切换组件样式 - 使用ActionSheet，无需特殊样式 */
</style>