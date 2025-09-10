import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialState = () => {
	// 从本地存储恢复token，避免页面刷新后丢失
	const savedToken = uni.getStorageSync('userToken') || '';
	const savedUserInfo = uni.getStorageSync('userInfo') || {};
	
	return {
		token: savedToken,
		//用户头像名称等
		userInfo: savedUserInfo,
		//公共配置
		appInfo: {},
		//注册信息
		registerInfo: {}
	};
};

const store = new Vuex.Store({
	state: initialState(),
	getters: {
		nickname: function(state) {
			return state.userInfo.nickname
		},
	},
	mutations: {
		setToken: function(state, data) {
			state.token = data;
			// 同步到本地存储，避免页面刷新后丢失
			if (data) {
				uni.setStorageSync('userToken', data);
			} else {
				uni.removeStorageSync('userToken');
			}
		},
		setUser: function(state, data) {
			state.userInfo = data;
			// 同步到本地存储
			if (data && Object.keys(data).length > 0) {
				uni.setStorageSync('userInfo', data);
			} else {
				uni.removeStorageSync('userInfo');
			}
		},
		setApp: function(state, data) {
			state.appInfo = data;
		},
		setRegister: function(state, data) {
			state.registerInfo = data;
		},
		RESET_STATE(state) {
			// 重置 state 到 initialState
			Object.assign(state, initialState());
			// 清除本地存储
			uni.removeStorageSync('userToken');
			uni.removeStorageSync('userInfo');
		}
	}
})

export default store;