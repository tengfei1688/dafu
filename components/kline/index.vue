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
			<!-- 价格网格线 -->
			<view class="price-grid">
				<view 
					v-for="(price, index) in priceGridLines" 
					:key="'grid-' + index"
					class="grid-line"
					:style="{ top: price.position + '%' }"
				>
					<text class="grid-label">{{ price.value }}</text>
				</view>
			</view>
			
			<!-- K线图表主体 -->
			<scroll-view class="chart-scroll" scroll-x="true" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
				<view class="chart-content" :style="{ width: chartContentWidth + 'px' }">
					<!-- K线柱 -->
					<view 
						v-for="(item, index) in displayKlineData" 
						:key="'kline-' + index"
						class="kline-bar"
						:class="{ 'selected': selectedIndex === index }"
						:style="getKlineBarStyle(item, index)"
						@tap="selectKline(index)"
					>
						<!-- 影线（高低价格线） -->
						<view 
							class="shadow-line"
							:style="getShadowLineStyle(item)"
						></view>
						<!-- 实体（开收盘价格矩形） -->
						<view 
							class="kline-body"
							:style="getKlineBodyStyle(item)"
						></view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 成交量柱状图 -->
			<view class="volume-section">
				<view class="volume-bars">
					<view 
						v-for="(item, index) in displayKlineData" 
						:key="'volume-' + index"
						class="volume-bar"
						:style="getVolumeBarStyle(item, index)"
					></view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-overlay">
				<view class="loading-spinner"></view>
				<text class="loading-text">图表加载中...</text>
			</view>
			
			<!-- 选中K线信息 -->
			<view v-if="selectedKlineInfo" class="kline-info">
				<text class="info-text">开: {{ selectedKlineInfo.open }}</text>
				<text class="info-text">高: {{ selectedKlineInfo.high }}</text>
				<text class="info-text">低: {{ selectedKlineInfo.low }}</text>
				<text class="info-text">收: {{ selectedKlineInfo.close }}</text>
				<text class="info-text">量: {{ selectedKlineInfo.volume }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'KlineChart',
	props: {
		height: {
			type: Number,
			default: 300
		},
		data: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			chartHeight: 300,
			currentTimeType: '1m',
			loading: false,
			chartData: [],
			selectedIndex: -1,
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
		displayKlineData() {
			return this.chartData.slice(-50);
		},
		
		priceRange() {
			if (!this.displayKlineData.length) return { min: 0, max: 100, range: 100 };
			
			const prices = this.displayKlineData.flatMap(item => [item.high, item.low]);
			const minPrice = Math.min(...prices);
			const maxPrice = Math.max(...prices);
			const priceRange = maxPrice - minPrice || 1;
			
			return {
				min: minPrice,
				max: maxPrice,
				range: priceRange
			};
		},
		
		volumeRange() {
			if (!this.displayKlineData.length) return { min: 0, max: 100 };
			
			const volumes = this.displayKlineData.map(item => item.volume);
			return {
				min: Math.min(...volumes),
				max: Math.max(...volumes)
			};
		},
		
		priceGridLines() {
			const { min, max } = this.priceRange;
			const lines = [];
			const stepCount = 5;
			
			for (let i = 0; i <= stepCount; i++) {
				const value = min + (max - min) * (i / stepCount);
				const position = 100 - (i / stepCount) * 100;
				lines.push({
					value: value.toFixed(2),
					position: position
				});
			}
			
			return lines;
		},
		
		chartContentWidth() {
			return Math.max(this.displayKlineData.length * 12, 375);
		},
		
		selectedKlineInfo() {
			if (this.selectedIndex >= 0 && this.displayKlineData[this.selectedIndex]) {
				return this.displayKlineData[this.selectedIndex];
			}
			return null;
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
				
				this.updateChart();
			},
			immediate: true,
			deep: true
		},
	},
	mounted() {
		console.log('K线组件开始初始化...');
		this.chartHeight = this.height;
		this.initChart();
	},
	methods: {
		async initChart() {
			console.log('开始初始化K线图表...');
			this.loading = true;
			
			try {
				// 纯CSS实现，无需Canvas初始化
				await this.$nextTick();
				this.loading = false;
				console.log('K线图表初始化成功');
			} catch (err) {
				console.error('K线图表初始化失败:', err);
				this.loading = false;
			}
		},
		
		updateChart() {
			// 纯CSS实现，数据更新会自动触发视图更新
			console.log('图表数据已更新');
		},
		
		getKlineBarStyle(item, index) {
			const { min, range } = this.priceRange;
			const barWidth = 8;
			const barSpacing = 4;
			
			return {
				left: (index * (barWidth + barSpacing)) + 'px',
				width: barWidth + 'px',
				position: 'absolute',
				height: '70%', // 为成交量预留30%空间
				top: '0'
			};
		},
		
		getShadowLineStyle(item) {
			const { min, range } = this.priceRange;
			const highPercent = ((item.high - min) / range) * 100;
			const lowPercent = ((item.low - min) / range) * 100;
			const top = (100 - highPercent) * 0.7; // 70%为K线区域
			const height = ((highPercent - lowPercent) * 0.7);
			
			return {
				position: 'absolute',
				left: '50%',
				transform: 'translateX(-50%)',
				top: top + '%',
				height: height + '%',
				width: '1px',
				backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000'
			};
		},
		
		getKlineBodyStyle(item) {
			const { min, range } = this.priceRange;
			const openPercent = ((item.open - min) / range) * 100;
			const closePercent = ((item.close - min) / range) * 100;
			const topPrice = Math.max(item.open, item.close);
			const bottomPrice = Math.min(item.open, item.close);
			const topPercent = ((topPrice - min) / range) * 100;
			const bottomPercent = ((bottomPrice - min) / range) * 100;
			const top = (100 - topPercent) * 0.7;
			const height = Math.max(((topPercent - bottomPercent) * 0.7), 0.5);
			
			const isBullish = item.close >= item.open;
			
			return {
				position: 'absolute',
				left: '50%',
				transform: 'translateX(-50%)',
				top: top + '%',
				height: height + '%',
				width: '60%',
				backgroundColor: isBullish ? '#00da3c' : '#ec0000',
				border: isBullish ? '1px solid #00da3c' : 'none'
			};
		},
		
		getVolumeBarStyle(item, index) {
			const { max } = this.volumeRange;
			const volumePercent = (item.volume / max) * 100;
			const barWidth = 8;
			const barSpacing = 4;
			
			return {
				position: 'absolute',
				left: (index * (barWidth + barSpacing)) + 'px',
				width: barWidth + 'px',
				height: Math.max(volumePercent * 0.8, 1) + '%', // 最大80%高度
				bottom: '0',
				backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000',
				opacity: '0.6'
			};
		},
		
		selectKline(index) {
			this.selectedIndex = this.selectedIndex === index ? -1 : index;
		},
		
		onTouchStart(e) {
			// 触摸开始
		},
		
		onTouchMove(e) {
			// 触摸移动 - 可以实现十字线功能
		},
		
		onTouchEnd(e) {
			// 触摸结束
		},
		
		selectTimeType(timeType) {
			this.currentTimeType = timeType;
			this.$emit('timeChange', timeType);
		},
		
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
					volume: Math.floor(Math.random() * 10000)
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
	background-color: #1a1a1a;
}

.time-selector {
	display: flex;
	padding: 10px;
	background-color: #2a2a2a;
	border-bottom: 1px solid #333;
}

.time-item {
	padding: 8px 16px;
	margin-right: 8px;
	background-color: #333;
	color: #999;
	border-radius: 4px;
	font-size: 12px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.time-item:hover {
	background-color: #444;
}

.time-item.active {
	background-color: #007aff;
	color: #fff;
}

.chart-container {
	position: relative;
	width: 100%;
	background-color: #1a1a1a;
	overflow: hidden;
}

/* 价格网格线 */
.price-grid {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 70%; /* K线区域占70%高度 */
	z-index: 1;
}

.grid-line {
	position: absolute;
	left: 0;
	right: 0;
	height: 1px;
	background-color: rgba(255, 255, 255, 0.1);
	border-top: 1px dashed rgba(255, 255, 255, 0.05);
}

.grid-label {
	position: absolute;
	right: 5px;
	top: -10px;
	color: #666;
	font-size: 10px;
	background-color: rgba(26, 26, 26, 0.8);
	padding: 1px 3px;
	border-radius: 2px;
}

/* 图表滚动容器 */
.chart-scroll {
	height: 100%;
	white-space: nowrap;
	position: relative;
	z-index: 2;
}

.chart-content {
	position: relative;
	height: 100%;
	min-width: 100%;
}

/* K线柱样式 */
.kline-bar {
	position: relative;
	cursor: pointer;
	transition: all 0.1s ease;
}

.kline-bar:hover {
	transform: scale(1.05);
}

.kline-bar.selected {
	transform: scale(1.1);
	z-index: 10;
}

/* 影线样式 */
.shadow-line {
	border-radius: 0.5px;
}

/* K线实体样式 */
.kline-body {
	border-radius: 1px;
	min-height: 1px;
}

/* 成交量区域 */
.volume-section {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 30%; /* 成交量占30%高度 */
	background-color: rgba(0, 0, 0, 0.3);
	border-top: 1px solid #333;
}

.volume-bars {
	position: relative;
	height: 100%;
	width: 100%;
}

.volume-bar {
	border-radius: 1px 1px 0 0;
	transition: opacity 0.2s ease;
}

.volume-bar:hover {
	opacity: 1 !important;
}

/* 加载状态 */
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
	background-color: rgba(26, 26, 26, 0.8);
	z-index: 100;
}

.loading-spinner {
	width: 30px;
	height: 30px;
	border: 3px solid #333;
	border-top: 3px solid #007aff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-text {
	margin-top: 10px;
	color: #999;
	font-size: 14px;
}

/* 选中K线信息 */
.kline-info {
	position: absolute;
	top: 10px;
	left: 10px;
	background-color: rgba(42, 42, 42, 0.9);
	padding: 8px 12px;
	border-radius: 6px;
	border: 1px solid #444;
	z-index: 20;
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.info-text {
	color: #fff;
	font-size: 11px;
	line-height: 1.3;
}

/* 响应式设计 */
@media screen and (max-width: 480px) {
	.time-selector {
		padding: 8px;
	}
	
	.time-item {
		padding: 6px 12px;
		font-size: 11px;
	}
	
	.grid-label {
		font-size: 9px;
	}
	
	.kline-info {
		padding: 6px 10px;
		top: 8px;
		left: 8px;
	}
	
	.info-text {
		font-size: 10px;
	}
}

/* 动画 */
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* 滚动条样式 */
.chart-scroll::-webkit-scrollbar {
	height: 4px;
}

.chart-scroll::-webkit-scrollbar-track {
	background-color: #333;
}

.chart-scroll::-webkit-scrollbar-thumb {
	background-color: #666;
	border-radius: 2px;
}

.chart-scroll::-webkit-scrollbar-thumb:hover {
	background-color: #888;
}

/* 触摸优化 */
.kline-bar {
	-webkit-tap-highlight-color: transparent;
}

.time-item {
	-webkit-tap-highlight-color: transparent;
}

/* 专业金融主题增强 */
.chart-container {
	box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
}

.kline-bar.selected::before {
	content: '';
	position: absolute;
	top: -5px;
	left: -2px;
	right: -2px;
	bottom: -5px;
	border: 1px solid rgba(0, 122, 255, 0.5);
	border-radius: 3px;
	pointer-events: none;
}

/* 毛玻璃效果 */
.kline-info {
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}
</style>
