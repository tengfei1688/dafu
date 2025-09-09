var Fly = require("flyio/dist/npm/wx")
import store from "@/store"
import utils from '@/utils/util'
var fly = new Fly;
fly.config.baseURL = utils.getQueryUrl()

// 添加请求拦截器
fly.interceptors.request.use((request) => {
	const token = store.state.token;
	const currentPage = utils.getUrl();
	
	// 检查是否在登录相关页面
	const isLoginPage = currentPage.includes('/pages/login/') || 
					   currentPage.includes('/pages/register/') || 
					   currentPage.includes('/pages/registerCheck/');
	
	// 检查是否是公开API（不需要登录的接口）
	const isPublicAPI = request.body['checkFree'] || 
					   request.url.includes('/api/public/') ||
					   request.url.includes('/api/common/');
	
	// 如果已经在登录页面，或者是公开API，或者有token，则允许请求
	if (isLoginPage || isPublicAPI || token) {
		if (token) {
			// 已登录，自动携带token
			request.headers.token = token;
			request.headers.lang = uni.getStorageSync('i18nLang');
		}
		
		// 删除标记
		if (request.body['checkFree']) {
			delete request.body['checkFree'];
		}
		
		// 处理loading
		if (!request.body['hideLoading']) {
			uni.showLoading({
				title: "Loading..."
			});
		} else {
			delete request.body['hideLoading'];
		}
		
		return request;
	} else {
		// 需要登录但未登录，跳转到登录页面
		console.log('跳转登录', currentPage);
		uni.setStorageSync('lastVisitedPage', currentPage);
		uni.reLaunch({
			url: '/pages/login/login'
		});
		return Promise.reject("Jump to login page");
	}
}, function(error) {
	uni.showToast({
		title: 'Failed to send request!',
		icon: 'none'
	});
	// 对请求错误做些什么
	return Promise.reject(error)
})

// 添加响应拦截器
fly.interceptors.response.use((res) => {
	uni.hideLoading()
	const token = store.state.token;
	if (![1].includes(res.data.status)) {
		//错误码
		console.error('API响应错误:', res.data)
		uni.showToast({
			title: res.data.massage || res.data.message || '请求失败',
			icon: 'none',
			duration: 3000
		});
		return Promise.reject(res.data.massage || res.data.message || '请求失败')
	}
	return res.data
}, (error) => {
	uni.hideLoading()
	console.error('请求失败:', error)
	
	// 只有在明确是401认证失败时才清除token
	if (error.status === 401 && error.response && error.response.data && error.response.data.message === 'token无效') {
		console.log('Token无效，清除用户信息', utils.getUrl());
		uni.setStorageSync('lastVisitedPage', utils.getUrl());
		store.commit('RESET_STATE');
		
		// 跳转到登录页面
		uni.reLaunch({
			url: '/pages/login/login'
		});
	} else if (error.status === 401) {
		// 其他401错误，可能是网络问题，不立即清除token
		console.log('401响应，可能是网络问题', error);
	} else {
		// 网络错误或其他错误
		uni.showToast({
			title: '网络连接失败，请检查网络设置',
			icon: 'none',
			duration: 3000
		});
	}
	return Promise.reject(error)
})
export default fly