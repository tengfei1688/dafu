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
		
		<!-- K线图表容器 - 使用纯CSS实现 -->
		<view class="chart-container" :style="{ height: chartHeight + 'px' }">
			<!-- 纯CSS K线图表 - 适用于所有平台 -->
			<scroll-view class="chart-scroll" scroll-x="true">
				<view class="chart-content">
					<!-- 价格网格线 -->
					<view class="grid-lines">
						<view class="grid-line" v-for="i in 5" :key="'grid-' + i"></view>
					</view>
					
					<!-- K线数据展示 -->
					<view class="kline-bars">
						<view 
							v-for="(item, index) in displayData" 
							:key="'bar-' + index"
							class="kline-item"
							:class="{ 'rise': item.close >= item.open, 'fall': item.close < item.open }"
						>
							<!-- 影线 -->
							<view 
								class="shadow-line"
								:style="{
									height: getShadowHeight(item) + 'px',
									top: getShadowTop(item) + 'px'
								}"
							></view>
							
							<!-- K线实体 -->
							<view 
								class="kline-body"
								:style="{
									height: getBodyHeight(item) + 'px',
									top: getBodyTop(item) + 'px'
								}"
							></view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 加载状态 - 使用v-show替代v-if -->
			<view class="loading-overlay" :style="{ display: loading ? 'flex' : 'none' }">
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
			chartHeight: 300,
			currentTimeType: '1m',
			loading: false,
			chartData: [],
			displayData: [],
			maxPrice: 0,
			minPrice: 0,
			priceRange: 0,
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
		initChart() {
			console.log('开始初始化K线图表...');
			this.loading = true;
			
			try {
				// 使用纯CSS实现，无需平台特定代码
				this.updateDisplayData();
				this.loading = false;
				console.log('K线图表初始化成功');
			} catch (err) {
				console.error('K线图表初始化失败:', err);
				this.loading = false;
			}
		},
		
		updateChart() {
			if (!this.chartData || this.chartData.length === 0) return;
			
			try {
				this.updateDisplayData();
				console.log('图表数据更新完成，显示', this.displayData.length, '条数据');
			} catch (error) {
				console.error('图表更新失败:', error);
			}
		},
		
		updateDisplayData() {
			if (!this.chartData || this.chartData.length === 0) return;
			
			// 取最近50条数据
			const recentData = this.chartData.slice(-50);
			
			// 计算价格范围
			const prices = recentData.flatMap(item => [item.high, item.low]);
			this.maxPrice = Math.max(...prices);
			this.minPrice = Math.min(...prices);
			this.priceRange = this.maxPrice - this.minPrice || 1; // 防止除零
			
			this.displayData = recentData;
		},
		
		// 计算影线高度
		getShadowHeight(item) {
			const highPos = this.getPricePosition(item.high);
			const lowPos = this.getPricePosition(item.low);
			return Math.abs(lowPos - highPos);
		},
		
		// 计算影线顶部位置
		getShadowTop(item) {
			return this.getPricePosition(item.high);
		},
		
		// 计算K线实体高度
		getBodyHeight(item) {
			const openPos = this.getPricePosition(item.open);
			const closePos = this.getPricePosition(item.close);
			return Math.max(Math.abs(closePos - openPos), 2); // 最小高度2px
		},
		
		// 计算K线实体顶部位置
		getBodyTop(item) {
			const openPos = this.getPricePosition(item.open);
			const closePos = this.getPricePosition(item.close);
			return Math.min(openPos, closePos);
		},
		
		// 根据价格计算在图表中的位置
		getPricePosition(price) {
			const chartAreaHeight = this.chartHeight - 40; // 预留上下边距
			const normalizedPrice = (price - this.minPrice) / this.priceRange;
			return 20 + (1 - normalizedPrice) * chartAreaHeight; // 翻转Y轴
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
	transition: all 0.2s ease;
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

.chart-scroll {
	height: 100%;
	width: 100%;
}

.chart-content {
	position: relative;
	height: 100%;
	min-width: 100%;
	display: flex;
}

.grid-lines {
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
	left: 0;
	right: 0;
	height: 1px;
	background-color: rgba(255, 255, 255, 0.1);
}

.grid-line:nth-child(1) { top: 20%; }
.grid-line:nth-child(2) { top: 35%; }
.grid-line:nth-child(3) { top: 50%; }
.grid-line:nth-child(4) { top: 65%; }
.grid-line:nth-child(5) { top: 80%; }

.kline-bars {
	position: relative;
	display: flex;
	align-items: flex-end;
	height: 100%;
	padding: 0 10px;
	min-width: 100%;
	z-index: 2;
}

.kline-item {
	position: relative;
	width: 8px;
	height: 100%;
	margin-right: 2px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.shadow-line {
	position: absolute;
	left: 50%;
	width: 1px;
	transform: translateX(-50%);
	transition: none;
}

.kline-item.rise .shadow-line {
	background-color: #00da3c;
}

.kline-item.fall .shadow-line {
	background-color: #ec0000;
}

.kline-body {
	position: absolute;
	left: 0;
	right: 0;
	min-height: 2px;
	border-radius: 1px;
	transition: none;
}

.kline-item.rise .kline-body {
	background-color: #00da3c;
	border: 1px solid #00da3c;
}

.kline-item.fall .kline-body {
	background-color: #ec0000;
	border: 1px solid #ec0000;
}

.loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
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

/* 响应式设计 */
@media screen and (max-width: 400px) {
	.kline-item {
		width: 6px;
		margin-right: 1px;
	}
}

@media screen and (min-width: 800px) {
	.kline-item {
		width: 12px;
		margin-right: 3px;
	}
}
</style>
