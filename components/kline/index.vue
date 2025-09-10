<template>
	<view class="kline-container">
		<!-- 时间选择器 -->
		<view class="time-selector">
			<view 
				v-for="(item, index) in timeOptions" 
				:key="index"
				class="time-item"
				:class="{ active: currentTimeType === item.value }"
				@tap="selectTimeType(item.value)"
			>
				{{ item.label }}
			</view>
		</view>
		
		<!-- K线图表容器 -->
		<view class="chart-container" :style="{ height: chartHeight + 'px' }">
			<!-- 网格背景 -->
			<view class="chart-grid">
				<view 
					v-for="i in 5" 
					:key="'h' + i"
					class="grid-line horizontal"
					:style="{ top: (i * 20) + '%' }"
				></view>
				<view 
					v-for="i in 6" 
					:key="'v' + i"
					class="grid-line vertical"
					:style="{ left: (i * 16.67) + '%' }"
				></view>
			</view>
			
			<!-- K线主图区域 -->
			<view class="kline-chart" :style="{ height: mainChartHeight + 'px' }">
				<view class="kline-bars">
					<view 
						v-for="(item, index) in visibleKlineData" 
						:key="'kline-' + index"
						class="kline-bar"
						:style="getKlineBarStyle(item, index)"
						@tap="handleBarTap(item, index)"
					>
						<!-- 影线 (上影线和下影线) -->
						<view 
							class="kline-shadow" 
							:style="getShadowStyle(item)"
						></view>
						<!-- 实体 (开盘价到收盘价) -->
						<view 
							class="kline-body" 
							:style="getBodyStyle(item)"
						></view>
					</view>
				</view>
				
				<!-- 价格标签 -->
				<view class="price-labels">
					<view 
						v-for="price in priceLabels"
						:key="'price-' + price.value"
						class="price-label"
						:style="{ top: price.position + '%' }"
					>
						{{ price.text }}
					</view>
				</view>
			</view>
			
			<!-- 成交量图区域 -->
			<view class="volume-chart" :style="{ height: volumeChartHeight + 'px' }">
				<view class="volume-bars">
					<view 
						v-for="(item, index) in visibleKlineData" 
						:key="'volume-' + index"
						class="volume-bar"
						:style="getVolumeBarStyle(item, index)"
					></view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-overlay" :class="{ visible: loading }">
				<view class="loading-spinner"></view>
				<text class="loading-text">图表加载中...</text>
			</view>
		</view>
		
		<!-- 价格信息面板 -->
		<view class="price-info" v-if="selectedKline">
			<text class="info-item">开: {{ selectedKline.open.toFixed(2) }}</text>
			<text class="info-item">高: {{ selectedKline.high.toFixed(2) }}</text>
			<text class="info-item">低: {{ selectedKline.low.toFixed(2) }}</text>
			<text class="info-item">收: {{ selectedKline.close.toFixed(2) }}</text>
			<text class="info-item">量: {{ formatVolume(selectedKline.volume) }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'KlineChart',
	props: {
		height: {
			type: Number,
			default: 400
		},
		data: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			chartHeight: 400,
			mainChartHeight: 300,
			volumeChartHeight: 80,
			currentTimeType: '1m',
			loading: false,
			chartData: [],
			selectedKline: null,
			timeOptions: [
				{ label: '1分', value: '1m' },
				{ label: '5分', value: '5m' },
				{ label: '15分', value: '15m' },
				{ label: '30分', value: '30m' },
				{ label: '1时', value: '1h' },
				{ label: '4时', value: '4h' },
				{ label: '1日', value: '1d' }
			]
		}
	},
	computed: {
		// 显示的K线数据 (最多50根)
		visibleKlineData() {
			if (!this.chartData || this.chartData.length === 0) return [];
			return this.chartData.slice(-50);
		},
		
		// 价格范围计算
		priceRange() {
			if (this.visibleKlineData.length === 0) return { max: 0, min: 0, range: 0 };
			
			const prices = this.visibleKlineData.flatMap(item => [item.high, item.low]);
			const max = Math.max(...prices);
			const min = Math.min(...prices);
			return {
				max,
				min,
				range: max - min || 1
			};
		},
		
		// 成交量范围
		volumeRange() {
			if (this.visibleKlineData.length === 0) return { max: 0, min: 0, range: 0 };
			
			const volumes = this.visibleKlineData.map(item => item.volume);
			const max = Math.max(...volumes);
			const min = Math.min(...volumes);
			return {
				max,
				min,
				range: max - min || 1
			};
		},
		
		// 价格标签
		priceLabels() {
			const { max, min, range } = this.priceRange;
			if (range === 0) return [];
			
			const labels = [];
			for (let i = 0; i <= 4; i++) {
				const price = max - (range * i / 4);
				labels.push({
					value: price,
					text: price.toFixed(2),
					position: i * 25
				});
			}
			return labels;
		}
	},
	watch: {
		data: {
			handler(newData) {
				console.log('K线数据更新:', typeof newData, newData?.length || 0, '条记录');
				
				if (!newData || newData.length === 0) {
					console.log('K线数据为空，使用默认数据');
					this.chartData = this.getDefaultData();
				} else {
					console.log('K线数据验证通过，开始更新图表');
					this.chartData = this.formatData(newData);
				}
			},
			immediate: true,
			deep: true
		},
		
		height: {
			handler(newHeight) {
				this.chartHeight = newHeight;
				this.mainChartHeight = Math.floor(newHeight * 0.7);
				this.volumeChartHeight = Math.floor(newHeight * 0.2);
			},
			immediate: true
		}
	},
	mounted() {
		console.log('K线组件开始初始化...');
		this.initChart();
	},
	methods: {
		async initChart() {
			console.log('开始初始化纯CSS K线图表...');
			this.loading = true;
			
			try {
				// 简化初始化，只需要设置数据
				await this.$nextTick();
				this.loading = false;
				console.log('纯CSS K线图表初始化成功');
			} catch (err) {
				console.error('K线图表初始化失败:', err);
				this.loading = false;
			}
		},
		
		// 获取K线柱的样式
		getKlineBarStyle(item, index) {
			const barWidth = Math.max(4, Math.floor(100 / this.visibleKlineData.length));
			const leftPosition = (index / this.visibleKlineData.length) * 100;
			
			return {
				left: leftPosition + '%',
				width: barWidth + 'px',
				position: 'absolute',
				height: '100%'
			};
		},
		
		// 获取影线样式
		getShadowStyle(item) {
			const { max, min, range } = this.priceRange;
			if (range === 0) return {};
			
			const highPercent = ((max - item.high) / range) * 100;
			const lowPercent = ((max - item.low) / range) * 100;
			const shadowHeight = lowPercent - highPercent;
			
			return {
				top: highPercent + '%',
				height: Math.max(shadowHeight, 0.5) + '%',
				left: '50%',
				width: '1px',
				backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000',
				position: 'absolute',
				transform: 'translateX(-50%)'
			};
		},
		
		// 获取K线实体样式
		getBodyStyle(item) {
			const { max, min, range } = this.priceRange;
			if (range === 0) return {};
			
			const isRising = item.close >= item.open;
			const topPrice = Math.max(item.open, item.close);
			const bottomPrice = Math.min(item.open, item.close);
			
			const topPercent = ((max - topPrice) / range) * 100;
			const bottomPercent = ((max - bottomPrice) / range) * 100;
			const bodyHeight = Math.max(bottomPercent - topPercent, 0.8);
			
			return {
				top: topPercent + '%',
				height: bodyHeight + '%',
				left: '20%',
				width: '60%',
				backgroundColor: isRising ? '#00da3c' : '#ec0000',
				border: isRising ? '1px solid #00da3c' : '1px solid #ec0000',
				position: 'absolute'
			};
		},
		
		// 获取成交量柱样式
		getVolumeBarStyle(item, index) {
			const barWidth = Math.max(4, Math.floor(100 / this.visibleKlineData.length));
			const leftPosition = (index / this.visibleKlineData.length) * 100;
			const heightPercent = (item.volume / this.volumeRange.max) * 100;
			
			return {
				left: leftPosition + '%',
				width: barWidth + 'px',
				height: Math.max(heightPercent, 2) + '%',
				backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000',
				opacity: '0.7',
				position: 'absolute',
				bottom: '0'
			};
		},
		
		// 处理K线点击
		handleBarTap(item, index) {
			console.log('点击K线:', item);
			this.selectedKline = item;
		},
		
		// 选择时间周期
		selectTimeType(timeType) {
			this.currentTimeType = timeType;
			this.$emit('timeChange', timeType);
		},
		
		// 格式化数据
		formatData(rawData) {
			if (!Array.isArray(rawData)) return [];
			
			return rawData.map(item => ({
				time: item.time || item.timestamp || new Date().getTime(),
				open: parseFloat(item.open || item.o || 0),
				high: parseFloat(item.high || item.h || 0),
				low: parseFloat(item.low || item.l || 0),
				close: parseFloat(item.close || item.c || 0),
				volume: parseFloat(item.volume || item.v || 0)
			}));
		},
		
		// 格式化成交量显示
		formatVolume(volume) {
			if (volume >= 1000000) {
				return (volume / 1000000).toFixed(1) + 'M';
			} else if (volume >= 1000) {
				return (volume / 1000).toFixed(1) + 'K';
			}
			return volume.toString();
		},
		
		// 生成默认数据
		getDefaultData() {
			const now = Date.now();
			const data = [];
			
			for (let i = 0; i < 50; i++) {
				const time = now - (50 - i) * 60000;
				const base = 100 + Math.random() * 10;
				const open = base + (Math.random() - 0.5) * 2;
				const close = open + (Math.random() - 0.5) * 4;
				const high = Math.max(open, close) + Math.random() * 2;
				const low = Math.min(open, close) - Math.random() * 2;
				
				data.push({
					time,
					open: Number(open.toFixed(2)),
					high: Number(high.toFixed(2)),
					low: Number(low.toFixed(2)),
					close: Number(close.toFixed(2)),
					volume: Math.floor(Math.random() * 100000)
				});
			}
			
			return data;
		}
	}
}
</script>

<style scoped>
.kline-container {
	width: 100%;
	background-color: #0e1419;
	color: #ffffff;
	font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.time-selector {
	display: flex;
	padding: 12px 16px;
	background-color: #1a1e23;
	border-bottom: 1px solid #2a3040;
	gap: 8px;
}

.time-item {
	padding: 6px 12px;
	background-color: #2a3040;
	color: #8a9cad;
	border-radius: 4px;
	font-size: 12px;
	line-height: 1.4;
	cursor: pointer;
	transition: all 0.2s ease;
}

.time-item.active {
	background-color: #1976d2;
	color: #ffffff;
}

.time-item:hover {
	background-color: #3a4550;
}

.chart-container {
	position: relative;
	width: 100%;
	background-color: #0e1419;
	overflow: hidden;
}

.chart-grid {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 1;
}

.grid-line {
	position: absolute;
	background-color: #1a1e23;
}

.grid-line.horizontal {
	left: 0;
	right: 0;
	height: 1px;
}

.grid-line.vertical {
	top: 0;
	bottom: 0;
	width: 1px;
}

.kline-chart {
	position: relative;
	width: 100%;
	padding: 10px;
	z-index: 2;
}

.kline-bars {
	position: relative;
	width: 100%;
	height: 100%;
}

.kline-bar {
	position: absolute;
	cursor: pointer;
	transition: opacity 0.2s ease;
}

.kline-bar:hover {
	opacity: 0.8;
}

.kline-shadow {
	position: absolute;
}

.kline-body {
	position: absolute;
	min-height: 1px;
	border-radius: 1px;
}

.price-labels {
	position: absolute;
	right: 10px;
	top: 0;
	bottom: 0;
	width: 60px;
	pointer-events: none;
}

.price-label {
	position: absolute;
	right: 0;
	font-size: 10px;
	color: #8a9cad;
	background-color: rgba(14, 20, 25, 0.8);
	padding: 1px 4px;
	border-radius: 2px;
	transform: translateY(-50%);
	white-space: nowrap;
}

.volume-chart {
	position: relative;
	width: 100%;
	margin-top: 10px;
	padding: 0 10px;
	border-top: 1px solid #2a3040;
}

.volume-bars {
	position: relative;
	width: 100%;
	height: 100%;
}

.volume-bar {
	position: absolute;
	border-radius: 1px 1px 0 0;
	transition: opacity 0.2s ease;
}

.volume-bar:hover {
	opacity: 1 !important;
}

.loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: rgba(14, 20, 25, 0.9);
	z-index: 100;
	opacity: 0;
	visibility: hidden;
	transition: all 0.3s ease;
}

.loading-overlay.visible {
	opacity: 1;
	visibility: visible;
}

.loading-spinner {
	width: 32px;
	height: 32px;
	border: 3px solid #2a3040;
	border-top: 3px solid #1976d2;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-text {
	margin-top: 12px;
	color: #8a9cad;
	font-size: 14px;
}

.price-info {
	display: flex;
	gap: 16px;
	padding: 12px 16px;
	background-color: #1a1e23;
	border-top: 1px solid #2a3040;
	overflow-x: auto;
}

.info-item {
	font-size: 12px;
	color: #8a9cad;
	white-space: nowrap;
	min-width: fit-content;
}

.info-item:first-child {
	color: #ffffff;
	font-weight: 500;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* 响应式适配 */
@media (max-width: 480px) {
	.time-selector {
		padding: 8px 12px;
	}
	
	.time-item {
		padding: 4px 8px;
		font-size: 11px;
	}
	
	.kline-chart,
	.volume-chart {
		padding: 8px;
	}
	
	.price-info {
		padding: 8px 12px;
		gap: 12px;
	}
}

/* 深色主题增强 */
.kline-bar:active {
	transform: scale(1.02);
}

.volume-bar:active {
	transform: scaleY(1.1);
}

/* 专业金融图表效果 */
.kline-body {
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.kline-shadow {
	box-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
}

.chart-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(180deg, 
		rgba(14, 20, 25, 0) 0%, 
		rgba(14, 20, 25, 0.1) 50%, 
		rgba(14, 20, 25, 0.2) 100%);
	pointer-events: none;
	z-index: 0;
}
</style>
