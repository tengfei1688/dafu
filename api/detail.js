
import request from '@/utils/request.js';

//商品详情
export const goodDetail = function(data = {}) {
	return request.get('/index/goods_dec', data)
}
//量化下单
export const addAi = function(data = {}) {
	return request.get('/goods/addai', data)
}
//量化产品列表
export const aiList = function(data = {}) {
	return request.get('/index/ailist', data)
}
//用户量化产品列表
export const useraiList = function(data = {}) {
	return request.get('/goods/userailist', data)
}
//商品k线图
export const goodKline = function(data = {}) {
	return request.get('/index/goods_stock', data)
}
//商品下单
export const goodMicrotrade = function(data = {}) {
	return request.post('/goods/microtrade', data)
}