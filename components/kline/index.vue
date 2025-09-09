<template>
	<view class="chart">
		<view :id="chartId" class="kline">
		</view>
		<!-- 价格变化指示器 -->
		<view v-if="priceChange.show" :class="['price-change', priceChange.direction, priceChange.show ? 'show' : '']">
			{{ priceChange.direction === 'up' ? '+' : '-' }}{{ priceChange.value }}
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	export default {
		props: ['data'],
		data() {
			return {
				chartInstance: null,
				chartId: 'Kline_' + Math.random().toString(36).substr(2, 9), // 唯一ID
				realKlineData: [], // 真实K线数据
				displayKlineData: [], // 显示用的K线数据
				updateTimer: null, // 5秒更新定时器
				lastUpdateTime: 0, // 上次更新时间
				priceChange: {
					show: false,
					direction: 'up',
					value: '0.0000'
				}
			}
		},
		watch: {
			data: {
				handler(newData) {
					if (newData && newData.length > 0) {
						this.realKlineData = [...newData];
						this.displayKlineData = [...newData];
						this.startDisplayUpdate();
						// 确保图表实例已创建后再更新
						if (this.chartInstance) {
							this.updateChart();
						}
					}
				},
				immediate: true,
				deep: true
			}
		},
		mounted() {
			// 设置ECharts环境
			if (this.$echarts) {
				this.$echarts.env.touchEventsSupported = true;
				this.$echarts.env.wxa = false;
				this.$echarts.env.canvasSupported = false;
				this.$echarts.env.svgSupported = true;
				this.$echarts.env.domSupported = true;
			} else {
				console.error('ECharts not available');
				return;
			}
			
			// 延迟初始化，确保DOM已渲染
			this.$nextTick(() => {
				setTimeout(() => {
					this.initWithRetry();
				}, 100);
			});
		},
		methods: {
			// 带重试机制的初始化
			initWithRetry(retryCount = 0) {
				const maxRetries = 3;
				
				try {
					this.init();
					// 如果初始化成功但没有图表实例，进行重试
					if (!this.chartInstance && retryCount < maxRetries) {
						console.log(`初始化失败，重试第 ${retryCount + 1} 次`);
						setTimeout(() => {
							this.initWithRetry(retryCount + 1);
						}, 500 * (retryCount + 1)); // 递增延迟
					}
				} catch (error) {
					console.error('K线初始化错误:', error);
					if (retryCount < maxRetries) {
						console.log(`初始化异常，重试第 ${retryCount + 1} 次`);
						setTimeout(() => {
							this.initWithRetry(retryCount + 1);
						}, 1000 * (retryCount + 1)); // 递增延迟
					} else {
						console.error('K线初始化最终失败');
					}
				}
			},
			
			init() {
				// 检查是否已经初始化过
				if (this.chartInstance) {
					return;
				}
				
				// 检查ECharts是否可用
				if (!this.$echarts) {
					console.error('ECharts未加载');
					return;
				}
				
				// #ifdef H5
				const element = document.getElementById(this.chartId);
				if (element) {
					try {
						this.chartInstance = this.$echarts.init(element);
						console.log('H5环境下ECharts初始化成功');
						// 如果有数据，立即渲染
						if (this.displayKlineData && this.displayKlineData.length > 0) {
							this.renderChart();
						}
					} catch (error) {
						console.error('H5环境ECharts初始化失败:', error);
						throw error;
					}
				} else {
					console.error('找不到DOM元素:', this.chartId);
					throw new Error('DOM element not found');
				}
				// #endif
				
				// #ifdef APP-PLUS
				// 手机端使用uni-app的方式获取元素
				try {
					const query = uni.createSelectorQuery().in(this);
					query.select('#' + this.chartId).boundingClientRect((data) => {
						if (data && !this.chartInstance) {
							try {
								// 在APP环境中，需要使用不同的初始化方式
								this.chartInstance = this.$echarts.init(null, null, {
									width: data.width,
									height: data.height
								});
								console.log('APP环境下ECharts初始化成功');
								// 如果有数据，立即渲染
								if (this.displayKlineData && this.displayKlineData.length > 0) {
									this.renderChart();
								}
							} catch (error) {
								console.error('APP环境ECharts初始化失败:', error);
							}
						} else if (!data) {
							console.error('APP环境无法获取DOM信息');
						}
					}).exec();
				} catch (error) {
					console.error('APP环境查询元素失败:', error);
					throw error;
				}
				// #endif
			},
			
			// 开始5秒显示更新
			startDisplayUpdate() {
				if (this.updateTimer) {
					clearInterval(this.updateTimer);
				}
				
				this.updateTimer = setInterval(() => {
					this.updateDisplayData();
				}, 5000); // 5秒更新一次
			},
			
			// 更新显示数据
			updateDisplayData() {
				if (this.displayKlineData.length === 0) return;
				
				// 获取最新一根K线
				const latestKline = this.displayKlineData[this.displayKlineData.length - 1];
				const previousClose = this.displayKlineData[this.displayKlineData.length - 2]?.close || latestKline.close;
				
				// 生成小幅波动 (-0.1% 到 +0.1%)
				const volatility = (Math.random() - 0.5) * 0.002; // ±0.1%
				const priceChange = latestKline.close * volatility;
				
				// 更新最新K线数据
				const newClose = latestKline.close + priceChange;
				const newHigh = Math.max(latestKline.high, newClose);
				const newLow = Math.min(latestKline.low, newClose);
				
				// 更新显示数据
				this.displayKlineData[this.displayKlineData.length - 1] = {
					...latestKline,
					close: newClose,
					high: newHigh,
					low: newLow
				};
				
				// 显示价格变化效果
				const change = newClose - previousClose;
				if (Math.abs(change) > 0.0001) {
					this.showPriceChange(change > 0 ? 'up' : 'down', Math.abs(change));
				}
				
				// 重新渲染图表
				this.updateChart();
			},
			
			// 显示价格变化效果
			showPriceChange(direction, change) {
				this.priceChange = {
					show: true,
					direction: direction,
					value: change.toFixed(4)
				};
				
				// 3秒后隐藏
				setTimeout(() => {
					this.priceChange.show = false;
				}, 3000);
			},
			
			renderChart() {
				if (!this.chartInstance) {
					console.warn('图表实例不存在，尝试重新初始化');
					this.initWithRetry();
					return;
				}
				
				try {
					const upColor = '#00da3c';
					const downColor = '#ec0000'
					let data = this.formatData(this.displayKlineData);

					if (this.displayKlineData && this.displayKlineData.length) {
						let option = this.createChartOption(data, upColor, downColor);
						this.chartInstance.setOption(option);
						console.log('图表渲染成功，数据量:', this.displayKlineData.length);
					} else {
						console.warn('没有可渲染的K线数据');
					}
				} catch (error) {
					console.error('图表渲染失败:', error);
					// 尝试重新初始化
					this.chartInstance = null;
					this.initWithRetry();
				}
			},
			
			// 更新图表显示
			updateChart() {
				if (this.chartInstance) {
					try {
						this.renderChart();
					} catch (error) {
						console.error('更新图表失败:', error);
						// 图表实例可能已损坏，重新初始化
						this.chartInstance = null;
						this.initWithRetry();
					}
				} else {
					console.warn('图表实例不存在，尝试初始化');
					this.initWithRetry();
				}
			},
			
			formatData(rawData) {
				if (!rawData || !Array.isArray(rawData)) {
					console.warn('K线数据格式错误:', rawData);
					return { categoryData: [], values: [], volumes: [] };
				}
				
				let categoryData = [];
				let values = [];
				let volumes = [];
				
				try {
					rawData.forEach((item, index) => {
						// 验证数据完整性
						if (item && typeof item === 'object' && 
							item.hasOwnProperty('time') && 
							item.hasOwnProperty('open') && 
							item.hasOwnProperty('close') && 
							item.hasOwnProperty('low') && 
							item.hasOwnProperty('high') &&
							item.hasOwnProperty('volume')) {
							
							categoryData.push(item.time);
							values.push([
								parseFloat(item.open) || 0,
								parseFloat(item.close) || 0,
								parseFloat(item.low) || 0,
								parseFloat(item.high) || 0
							]);
							volumes.push([index, parseFloat(item.volume) || 0, parseFloat(item.open) > parseFloat(item.close) ? 1 : -1]);
						} else {
							console.warn('无效的K线数据项:', item, 'index:', index);
						}
					});
					
					console.log('数据格式化完成，有效数据量:', values.length);
				} catch (error) {
					console.error('数据格式化失败:', error);
				}
				
				return {
					categoryData: categoryData,
					values: values,
					volumes: volumes
				};
			},
			
			calculateMA(dayCount, data) {
				let result = [];
				for (let i = 0, len = data.values.length; i < len; i++) {
					if (i < dayCount) {
						result.push('-');
						continue;
					}
					let sum = 0;
					for (let j = 0; j < dayCount; j++) {
						sum += data.values[i - j][1];
					}
					result.push(+(sum / dayCount).toFixed(3));
				}
				return result;
			},
			
			createChartOption(data, upColor, downColor) {
				return {
					animation: true,
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						textStyle: {
							color: '#333'
						},
						className: 'klineTooltip',
						position: function(pos, params, el, elRect, size) {
							var obj = {
								top: 10
							};
							obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
							return obj;
						},
						formatter: function(params) {
							try {
								if (!params || !Array.isArray(params) || params.length === 0) {
									return '';
								}
								
								const param = params[0];
								if (!param || !param.data) {
									return '';
								}
								
								// 安全地获取颜色
								let themeColor = upColor; // 默认颜色
								if (params.length > 5 && params[5] && params[5].value && params[5].value.length > 3) {
									themeColor = params[5].value[3] > 0 ? upColor : downColor;
								} else if (param.data && param.data.length >= 2) {
									themeColor = param.data[1] > param.data[0] ? upColor : downColor;
								}
								
								return `
							<ul style="border-color:${themeColor}">
								<li> 
									<div class="dot" style="background-color:${themeColor}"></div>
									 <span>${param.name || ''}</span> 
								</li>
								<li>
									 <div class="dot" style="background-color:${themeColor}"></div> 
									 <span>open <span>${param.data[0] || 0}</span></span>
								</li>
								<li> 
									<div class="dot" style="background-color:${themeColor}"></div>
									 <span>close <span>${param.data[1] || 0}</span></span> 
								</li>
								<li> 
									<div class="dot" style="background-color:${themeColor}"></div>
									 <span>low <span>${param.data[2] || 0}</span></span> 
								</li>
								<li> 
									<div class="dot" style="background-color:${themeColor}"></div>
									 <span>high <span>${param.data[3] || 0}</span></span> 
								</li>
								<li> 
									<div class="dot" style="background-color:${themeColor}"></div>
									 <span>volume <span>${(params[5] && params[5].data && params[5].data[1]) || 0}</span></span> 
								</li>
							</ul>
						`
							} catch (error) {
								console.error('Tooltip格式化错误:', error);
								return '';
							}
						}
					},
					legend: {
						data: ['K线', 'MA5', 'MA10', 'MA20', 'MA30'],
						selected: {
							'MA5': true,
							'MA10': true,
							'MA20': true,
							'MA30': true
						}
					},
					grid: [{
						left: '10%',
						right: '10%',
						height: '50%'
					}, {
						left: '10%',
						right: '10%',
						top: '63%',
						height: '16%'
					}],
					xAxis: [{
						type: 'category',
						data: data.categoryData,
						scale: true,
						boundaryGap: false,
						axisLine: { onZero: false },
						splitLine: { show: false },
						min: 'dataMin',
						max: 'dataMax'
					}, {
						type: 'category',
						gridIndex: 1,
						data: data.categoryData,
						scale: true,
						boundaryGap: false,
						axisLine: { onZero: false },
						axisTick: { show: false },
						splitLine: { show: false },
						axisLabel: { show: false },
						min: 'dataMin',
						max: 'dataMax'
					}],
					yAxis: [{
						scale: true,
						splitArea: {
							show: true
						}
					}, {
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: { show: false },
						axisLine: { show: false },
						axisTick: { show: false },
						splitLine: { show: false }
					}],
					dataZoom: [{
						type: 'inside',
						xAxisIndex: [0, 1],
						start: 50,
						end: 100
					}, {
						show: true,
						xAxisIndex: [0, 1],
						type: 'slider',
						bottom: '0%',
						start: 50,
						end: 100
					}],
					series: [{
						name: 'K线',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: upColor,
							borderColor0: downColor
						}
					}, {
						name: 'MA5',
						type: 'line',
						data: this.calculateMA(5, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					}, {
						name: 'MA10',
						type: 'line',
						data: this.calculateMA(10, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					}, {
						name: 'MA20',
						type: 'line',
						data: this.calculateMA(20, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					}, {
						name: 'MA30',
						type: 'line',
						data: this.calculateMA(30, data),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					}, {
						name: 'Volume',
						type: 'bar',
						xAxisIndex: 1,
						yAxisIndex: 1,
						data: data.volumes
					}]
				};
			}
		},
		
		beforeDestroy() {
			// 清理定时器
			if (this.updateTimer) {
				clearInterval(this.updateTimer);
				this.updateTimer = null;
			}
			
			// 清理图表实例
			if (this.chartInstance) {
				this.chartInstance.dispose();
				this.chartInstance = null;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chart {
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.kline {
		width: 100%;
		height: 400px;
	}
	
	/* 价格变化指示器 */
	.price-change {
		position: absolute;
		top: 20px;
		right: 20px;
		padding: 8px 16px;
		border-radius: 20px;
		font-weight: bold;
		font-size: 14px;
		z-index: 1000;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.3s ease;
	}
	
	.price-change.up {
		background: rgba(76, 175, 80, 0.9);
		color: white;
	}
	
	.price-change.down {
		background: rgba(244, 67, 54, 0.9);
		color: white;
	}
	
	.price-change.show {
		opacity: 1;
		transform: translateY(0);
		animation: priceChange 3s ease-out;
	}
	
	@keyframes priceChange {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		20% {
			opacity: 1;
			transform: translateY(0);
		}
		80% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(-20px);
		}
	}
</style>