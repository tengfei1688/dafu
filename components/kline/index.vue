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
			<!-- H5环境：简化为canvas直接渲染 -->
			<!-- #ifdef H5 -->
			<canvas 
				ref="chartCanvas"
				:id="chartId"
				canvas-id="kline-canvas"
				class="chart-canvas"
				:style="{ width: '100%', height: '100%' }"
				@touchstart="handleTouch"
				@touchmove="handleTouch"
				@touchend="handleTouch"
			></canvas>
			<!-- #endif -->
			
			<!-- APP环境：使用简单的柱状图模拟 -->
			<!-- #ifdef APP-PLUS -->
			<scroll-view class="chart-scroll" scroll-x="true">
				<view class="chart-bars">
					<view 
						v-for="(item, index) in displayData" 
						:key="index"
						class="bar-item"
						:style="{
							height: getBarHeight(item) + 'px',
							backgroundColor: item.close >= item.open ? '#00da3c' : '#ec0000'
						}"
					></view>
				</view>
			</scroll-view>
			<!-- #endif -->
			
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
			canvasContext: null,
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
				// #ifdef H5
				await this.initH5Canvas();
				// #endif
				
				// #ifdef APP-PLUS
				await this.initAppChart();
				// #endif
				
				this.loading = false;
				console.log('K线图表初始化成功');
			} catch (err) {
				console.error('K线图表初始化失败:', err);
				this.loading = false;
			}
		},
		
		// #ifdef H5
		async initH5Canvas() {
			await this.$nextTick();
			this.canvasContext = uni.createCanvasContext('kline-canvas', this);
			if (this.chartData && this.chartData.length > 0) {
				this.drawCanvasChart();
			}
		},
		
		drawCanvasChart() {
			if (!this.canvasContext || !this.chartData.length) return;
			
			const ctx = this.canvasContext;
			const data = this.chartData.slice(-50);
			const canvasWidth = 375;
			const canvasHeight = this.chartHeight;
			const barWidth = canvasWidth / data.length;
			
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			
			const prices = data.flatMap(item => [item.high, item.low]);
			const maxPrice = Math.max(...prices);
			const minPrice = Math.min(...prices);
			const priceRange = maxPrice - minPrice;
			
			data.forEach((item, index) => {
				const x = index * barWidth + barWidth / 2;
				const openY = canvasHeight - ((item.open - minPrice) / priceRange) * canvasHeight;
				const closeY = canvasHeight - ((item.close - minPrice) / priceRange) * canvasHeight;
				const highY = canvasHeight - ((item.high - minPrice) / priceRange) * canvasHeight;
				const lowY = canvasHeight - ((item.low - minPrice) / priceRange) * canvasHeight;
				
				const color = item.close >= item.open ? '#00da3c' : '#ec0000';
				ctx.setStrokeStyle(color);
				ctx.setFillStyle(color);
				
				ctx.beginPath();
				ctx.moveTo(x, highY);
				ctx.lineTo(x, lowY);
				ctx.stroke();
				
				const bodyTop = Math.min(openY, closeY);
				const bodyHeight = Math.abs(closeY - openY);
				const bodyWidth = barWidth * 0.6;
				
				ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight || 1);
			});
			
			ctx.draw();
		},
		
		handleTouch(e) {
			console.log('图表触摸事件:', e.type);
		},
		// #endif
		
		// #ifdef APP-PLUS
		async initAppChart() {
			this.updateDisplayData();
		},
		
		updateDisplayData() {
			if (!this.chartData || this.chartData.length === 0) return;
			
			this.displayData = this.chartData.slice(-50).map(item => ({
				...item,
				barHeight: this.getBarHeight(item)
			}));
		},
		
		getBarHeight(item) {
			const baseHeight = 20;
			const maxHeight = this.chartHeight - 40;
			const range = Math.abs(item.high - item.low);
			return Math.min(baseHeight + range * 2, maxHeight);
		},
		// #endif
		
		updateChart() {
			if (!this.chartData || this.chartData.length === 0) return;
			
			try {
				// #ifdef H5
				this.drawCanvasChart();
				// #endif
				
				// #ifdef APP-PLUS
				this.updateDisplayData();
				// #endif
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
}

.chart-canvas {
	width: 100%;
	height: 100%;
}

.chart-scroll {
	height: 100%;
	white-space: nowrap;
}

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
