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
					v-for="(line, index) in priceGridLines" 
					:key="'grid-' + index"
					class="grid-line"
					:style="{ bottom: line.position + '%' }"
				>
					<text class="grid-price">{{ line.price }}</text>
				</view>
			</view>
			
			<!-- K线图表主体 -->
			<scroll-view class="chart-scroll" scroll-x="true">
				<view class="chart-content">
					<!-- K线柱状图 -->
					<view class="kline-bars">
						<view 
							v-for="(item, index) in displayData" 
							:key="index"
							class="kline-bar"
							@tap="selectBar(item, index)"
						>
							<!-- 影线（最高最低价线） -->
							<view 
								class="shadow-line"
								:style="{
									height: getShadowHeight(item) + '%',
									bottom: getShadowBottom(item) + '%',
									backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000'
								}"
							></view>
							
							<!-- 实体（开盘收盘价矩形） -->
							<view 
								class="body-rect"
								:style="{
									height: getBodyHeight(item) + '%',
									bottom: getBodyBottom(item) + '%',
									backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000',
									borderColor: item.close >= item.open ? '#00da3c' : '#ec0000'
								}"
							></view>
						</view>
					</view>
					
					<!-- 成交量柱状图 -->
					<view class="volume-bars">
						<view 
							v-for="(item, index) in displayData" 
							:key="'vol-' + index"
							class="volume-bar"
							:style="{
								height: getVolumeHeight(item) + '%',
								backgroundColor: item.close >= item.open ? 'rgba(0, 218, 60, 0.6)' : 'rgba(236, 0, 0, 0.6)'
							}"
						></view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 价格信息悬浮框 -->
			<view v-if="selectedBar" class="price-info" :style="priceInfoStyle">
				<text class="info-time">{{ formatTime(selectedBar.time) }}</text>
				<text class="info-price">开: {{ selectedBar.open }}</text>
				<text class="info-price">高: {{ selectedBar.high }}</text>
				<text class="info-price">低: {{ selectedBar.low }}</text>
				<text class="info-price">收: {{ selectedBar.close }}</text>
				<text class="info-volume">量: {{ formatVolume(selectedBar.volume) }}</text>
			</view>
			
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-overlay">
				<view class="loading-spinner"></view>
				<text class="loading-text">图表加载中...</text>
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
			chartId: 'kline-chart-' + Date.now(),
			chartHeight: 300,
			currentTimeType: '1m',
			loading: false,
			chartData: [],
			displayData: [],
			selectedBar: null,
			priceRange: { min: 0, max: 100 },
			volumeRange: { min: 0, max: 1000 },
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
		priceGridLines() {
			if (!this.displayData.length) return [];
			
			const { min, max } = this.priceRange;
			const lines = [];
			const step = (max - min) / 4; // 5条网格线
			
			for (let i = 0; i <= 4; i++) {
				const price = (min + step * i).toFixed(2);
				const position = (i / 4) * 100;
				lines.push({ price, position });
			}
			
			return lines;
		},
		
		priceInfoStyle() {
			return {
				display: this.selectedBar ? 'block' : 'none'
			};
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
				await this.updateDisplayData();
				this.loading = false;
				console.log('K线图表初始化成功');
			} catch (err) {
				console.error('K线图表初始化失败:', err);
				this.loading = false;
			}
		},
		
		updateDisplayData() {
			if (!this.chartData || this.chartData.length === 0) return;
			
			// 取最新50条数据显示
			const data = this.chartData.slice(-50);
			this.displayData = data;
			
			// 计算价格范围
			const prices = data.flatMap(item => [item.high, item.low]);
			this.priceRange.max = Math.max(...prices);
			this.priceRange.min = Math.min(...prices);
			
			// 计算成交量范围  
			const volumes = data.map(item => item.volume);
			this.volumeRange.max = Math.max(...volumes);
			this.volumeRange.min = Math.min(...volumes);
		},
		
		// 计算影线高度（百分比）
		getShadowHeight(item) {
			const range = this.priceRange.max - this.priceRange.min;
			if (range === 0) return 0;
			return ((item.high - item.low) / range) * 80; // 80%为图表有效高度
		},
		
		// 计算影线底部位置（百分比）
		getShadowBottom(item) {
			const range = this.priceRange.max - this.priceRange.min;
			if (range === 0) return 10;
			return ((item.low - this.priceRange.min) / range) * 80 + 10; // 10%为底部留白
		},
		
		// 计算实体高度（百分比）
		getBodyHeight(item) {
			const range = this.priceRange.max - this.priceRange.min;
			if (range === 0) return 1;
			const bodyHeight = Math.abs(item.close - item.open);
			return Math.max((bodyHeight / range) * 80, 0.5); // 最小高度0.5%
		},
		
		// 计算实体底部位置（百分比）
		getBodyBottom(item) {
			const range = this.priceRange.max - this.priceRange.min;
			if (range === 0) return 10;
			const bottom = Math.min(item.open, item.close);
			return ((bottom - this.priceRange.min) / range) * 80 + 10;
		},
		
		// 计算成交量高度（百分比）
		getVolumeHeight(item) {
			const range = this.volumeRange.max - this.volumeRange.min;
			if (range === 0) return 0;
			return ((item.volume - this.volumeRange.min) / range) * 100;
		},
		
		// 选中K线柱
		selectBar(item, index) {
			this.selectedBar = item;
			console.log('选中K线:', item);
		},
		
		updateChart() {
			if (!this.chartData || this.chartData.length === 0) return;
			
			try {
				this.updateDisplayData();
			} catch (error) {
				console.error('图表更新失败:', error);
			}
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
		},
		
		// 格式化时间显示
		formatTime(timestamp) {
			const date = new Date(timestamp);
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		},
		
		// 格式化成交量显示
		formatVolume(volume) {
			if (volume >= 10000) {
				return (volume / 10000).toFixed(1) + '万';
			}
			return volume.toString();
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
	height: 75%; /* K线图占75%高度 */
	z-index: 1;
}

.grid-line {
	position: absolute;
	left: 0;
	right: 0;
	height: 1px;
	background-color: rgba(255, 255, 255, 0.1);
	border-top: 1px dashed #333;
}

.grid-price {
	position: absolute;
	right: 5px;
	top: -10px;
	color: #666;
	font-size: 10px;
	background-color: #1a1a1a;
	padding: 0 3px;
}

/* 滚动容器 */
.chart-scroll {
	height: 100%;
	white-space: nowrap;
	z-index: 2;
}

.chart-content {
	display: inline-block;
	height: 100%;
	min-width: 100%;
	position: relative;
}

/* K线柱状图容器 */
.kline-bars {
	display: flex;
	align-items: flex-end;
	height: 75%; /* K线图占75%高度 */
	padding: 5px;
	position: relative;
}

.kline-bar {
	position: relative;
	width: 8px;
	height: 100%;
	margin-right: 2px;
	cursor: pointer;
}

/* 影线（最高最低价线） */
.shadow-line {
	position: absolute;
	left: 50%;
	width: 1px;
	transform: translateX(-50%);
	opacity: 0.8;
}

/* 实体（开盘收盘价矩形） */
.body-rect {
	position: absolute;
	left: 20%;
	width: 60%;
	border: 1px solid;
	opacity: 0.9;
}

/* 成交量柱状图 */
.volume-bars {
	display: flex;
	align-items: flex-end;
	height: 25%; /* 成交量占25%高度 */
	padding: 2px 5px;
	border-top: 1px solid #333;
}

.volume-bar {
	width: 8px;
	margin-right: 2px;
	min-height: 1px;
	border-radius: 1px 1px 0 0;
}

/* 价格信息悬浮框 */
.price-info {
	position: absolute;
	top: 10px;
	left: 10px;
	background-color: rgba(0, 0, 0, 0.8);
	border: 1px solid #333;
	border-radius: 4px;
	padding: 8px;
	z-index: 10;
	font-size: 12px;
	min-width: 120px;
}

.info-time {
	display: block;
	color: #ccc;
	font-weight: bold;
	margin-bottom: 4px;
}

.info-price {
	display: block;
	color: #fff;
	margin-bottom: 2px;
}

.info-volume {
	display: block;
	color: #999;
	margin-top: 4px;
}

/* 旧的样式保留兼容 */
.chart-bars {
	display: flex;
	align-items: flex-end;
	height: 100%;
	padding: 10px;
}

.bar-item {
	width: 6px;
	margin-right: 2px;
	min-height: 2px;
	border-radius: 1px;
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

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
} 
</style>
