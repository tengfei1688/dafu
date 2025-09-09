<template>
	<view class="chart">
		<view :id="chartId" class="kline" v-if="!useWebView">
		</view>
		<!-- WebView回退机制 -->
		<web-view v-else :src="webViewUrl" class="kline-webview"></web-view>
		<!-- 数据为空提示 -->
		<view v-if="!hasValidData && !useWebView" class="no-data-tip">
			<text>{{ $t ? $t('detail.zwsj') : '暂无数据' }}</text>
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
				useWebView: false, // 是否使用WebView回退
				webViewUrl: '', // WebView URL
				priceChange: {
					show: false,
					direction: 'up',
					value: '0.0000'
				},
				// 默认测试数据
				defaultKlineData: [
					{
						time: '09:30',
						open: 100.5,
						close: 102.3,
						high: 103.1,
						low: 99.8,
						volume: 15000
					},
					{
						time: '09:35',
						open: 102.3,
						close: 101.8,
						high: 103.5,
						low: 101.2,
						volume: 12000
					},
					{
						time: '09:40',
						open: 101.8,
						close: 103.2,
						high: 104.0,
						low: 101.5,
						volume: 18000
					},
					{
						time: '09:45',
						open: 103.2,
						close: 102.9,
						high: 104.2,
						low: 102.1,
						volume: 14000
					},
					{
						time: '09:50',
						open: 102.9,
						close: 104.1,
						high: 104.8,
						low: 102.5,
						volume: 16000
					}
				]
			}
		},
		computed: {
			hasValidData() {
				return this.displayKlineData && this.displayKlineData.length > 0;
			}
		},
		watch: {
			data: {
				handler(newData) {
					console.log('K线数据更新:', newData ? newData.length : 0, '条记录');
					
					// 数据验证和处理
					if (newData && Array.isArray(newData) && newData.length > 0) {
						// 验证数据结构
						const isValidData = this.validateKlineData(newData);
						if (isValidData) {
							this.realKlineData = [...newData];
							this.displayKlineData = [...newData];
							console.log('K线数据验证通过，开始更新图表');
						} else {
							console.warn('K线数据格式不正确，使用默认数据');
							this.realKlineData = [...this.defaultKlineData];
							this.displayKlineData = [...this.defaultKlineData];
						}
					} else {
						console.warn('K线数据为空，使用默认数据');
						this.realKlineData = [...this.defaultKlineData];
						this.displayKlineData = [...this.defaultKlineData];
					}
					
					this.startDisplayUpdate();
					// 确保图表实例已创建后再更新
					if (this.chartInstance) {
						this.updateChart();
					} else {
						// 如果图表未初始化，延迟初始化
						this.$nextTick(() => {
							this.init();
						});
					}
				},
				immediate: true,
				deep: true
			}
		},
		mounted() {
			console.log('K线组件开始初始化...');
			
			// 检查ECharts是否可用
			if (!this.$echarts) {
				console.error('ECharts库未加载，当前环境不支持原生渲染');
				// #ifdef APP-PLUS
				this.initWebViewFallback();
				// #endif
				return;
			}
			
			// 设置ECharts环境
			this.$echarts.env.touchEventsSupported = true;
			this.$echarts.env.wxa = false;
			this.$echarts.env.canvasSupported = false;
			this.$echarts.env.svgSupported = true;
			this.$echarts.env.domSupported = true;
			
			// 延迟初始化，确保DOM已渲染
			this.$nextTick(() => {
				setTimeout(() => {
					this.init();
				}, 100);
			});
		},
		methods: {
			init() {
				// 检查是否已经初始化过
				if (this.chartInstance || this.useWebView) {
					return;
				}
				
				console.log('开始初始化K线图表...');
				
				// #ifdef H5
				try {
					const element = document.getElementById(this.chartId);
					if (element) {
						this.chartInstance = this.$echarts.init(element);
						console.log('H5环境图表初始化成功');
						// 如果有数据，立即渲染
						if (this.hasValidData) {
							this.renderChart();
						}
					} else {
						console.error('H5环境：找不到图表DOM元素', this.chartId);
					}
				} catch (error) {
					console.error('H5环境图表初始化失败:', error);
				}
				// #endif
				
				// #ifdef APP-PLUS
				try {
					// APP环境下使用uni-app方式
					const query = uni.createSelectorQuery().in(this);
					query.select('#' + this.chartId).fields({
						node: true,
						size: true
					}).exec((res) => {
						if (res && res[0]) {
							try {
								// 在APP环境中，我们需要创建canvas context
								const canvas = res[0].node;
								if (canvas) {
									const ctx = canvas.getContext('2d');
									this.chartInstance = this.$echarts.init(canvas, null, {
										width: res[0].width,
										height: res[0].height,
										devicePixelRatio: uni.getSystemInfoSync().pixelRatio || 1
									});
									console.log('APP环境图表初始化成功');
									// 如果有数据，立即渲染
									if (this.hasValidData) {
										this.renderChart();
									}
								} else {
									throw new Error('无法获取canvas节点');
								}
							} catch (error) {
								console.error('APP环境图表初始化失败:', error);
								this.initWebViewFallback();
							}
						} else {
							console.error('APP环境：无法获取节点信息');
							this.initWebViewFallback();
						}
					});
				} catch (error) {
					console.error('APP环境查询节点失败:', error);
					this.initWebViewFallback();
				}
				// #endif
			},
			
			// 验证K线数据格式
			validateKlineData(data) {
				if (!Array.isArray(data) || data.length === 0) {
					return false;
				}
				
				// 检查第一个数据项的结构
				const firstItem = data[0];
				const requiredFields = ['time', 'open', 'close', 'high', 'low', 'volume'];
				
				return requiredFields.every(field => {
					return firstItem.hasOwnProperty(field) && 
						   (field === 'time' || typeof firstItem[field] === 'number');
				});
			},
			
			// WebView回退机制
			initWebViewFallback() {
				console.log('初始化WebView回退机制...');
				try {
					// 构建WebView URL，传递数据
					const baseUrl = '/static/kline-h5.html';
					const klineData = encodeURIComponent(JSON.stringify(this.displayKlineData));
					this.webViewUrl = `${baseUrl}?data=${klineData}`;
					this.useWebView = true;
					console.log('WebView回退初始化成功');
				} catch (error) {
					console.error('WebView初始化失败:', error, 'K线数据为空');
					this.useWebView = false;
				}
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
				if (!this.chartInstance) return;
				
				const upColor = '#00da3c';
				const downColor = '#ec0000'
				let data = this.formatData(this.displayKlineData);

				if (this.displayKlineData && this.displayKlineData.length) {
					let option = this.createChartOption(data, upColor, downColor);
					this.chartInstance.setOption(option);
				}
			},
			
			// 更新图表显示
			updateChart() {
				if (this.chartInstance) {
					this.renderChart();
				}
			},
			
			formatData(rawData) {
				if (!rawData || !Array.isArray(rawData)) return { categoryData: [], values: [], volumes: [] };
				
				let categoryData = [];
				let values = [];
				let volumes = [];
				rawData.forEach((item, index) => {
					categoryData.push(item.time);
					values.push([item.open, item.close, item.low, item.high])
					volumes.push([index, item.volume, item.open > item.close ? 1 : -1]);
				})
				return {
					categoryData: categoryData,
					values: values,
					volumes: volumes
				}
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
							const themeColor = params[5].value[3] > 0 ? upColor : downColor
							const param = params[0];
							return `
						<ul style="border-color:${themeColor}">
							<li> 
								<div class="dot" style="background-color:${themeColor}"></div>
								 <span>${param.name}</span> 
							</li>
							<li>
								 <div class="dot" style="background-color:${themeColor}"></div> 
								 <span>open <span>${param.data[0]}</span></span>
							</li>
							<li> 
								<div class="dot" style="background-color:${themeColor}"></div>
								 <span>close <span>${param.data[1]}</span></span> 
							</li>
							<li> 
								<div class="dot" style="background-color:${themeColor}"></div>
								 <span>low <span>${param.data[2]}</span></span> 
							</li>
							<li> 
								<div class="dot" style="background-color:${themeColor}"></div>
								 <span>high <span>${param.data[3]}</span></span> 
							</li>
							<li> 
								<div class="dot" style="background-color:${themeColor}"></div>
								 <span>volume <span>${params[5].data[1]}</span></span> 
							</li>
						</ul>
					`
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
	
	.kline-webview {
		width: 100%;
		height: 400px;
	}
	
	.no-data-tip {
		width: 100%;
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f6f7fb;
		color: #a8a9ac;
		font-size: 14px;
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