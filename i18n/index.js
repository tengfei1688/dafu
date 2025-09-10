import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zhCN from './zh-CN';
import zhTW from './zh-TW';
import enUS from './en-US';
import jaJP from './ja-JP';
import thTH from './th-TH';
import viVN from './vi-VN';
import idID from './id-ID';
import koKR from './ko-KR';
import frFR from './fr-FR';
import deDE from './de-DE';

// 组合语言包
const messages = {
	'zh-CN': zhCN,
	'zh-TW': zhTW,
	'en-US': enUS,
	'ja-JP': jaJP,
	'th-TH': thTH,
	'vi-VN': viVN,
	'id-ID': idID,
	'ko-KR': koKR,
	'fr-FR': frFR,
	'de-DE': deDE,
};

// 修复nvue兼容性问题 - 使用uni.getStorageSync替代localStorage
let savedLang;
try {
	savedLang = uni.getStorageSync('i18nLang');
} catch (e) {
	console.warn('读取语言设置失败:', e);
	savedLang = null;
}

if (!savedLang) {
	try {
		uni.setStorageSync('i18nLang', 'zh-CN');
		savedLang = 'zh-CN';
	} catch (e) {
		console.warn('保存语言设置失败:', e);
		savedLang = 'zh-CN';
	}
}

const locale = savedLang || 'zh-CN';
let i18nConfig = {
	locale, // 获取已设置的语言
	messages
}

Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

// 添加动态语言切换方法
export function setLanguage(lang) {
	try {
		uni.setStorageSync('i18nLang', lang);
		i18n.locale = lang;
		console.log('语言切换成功:', lang);
		return true;
	} catch (e) {
		console.error('语言切换失败:', e);
		return false;
	}
}

// 获取当前语言
export function getCurrentLanguage() {
	return i18n.locale;
}

// 导出
export default i18n;