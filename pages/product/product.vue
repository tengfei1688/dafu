<template>
    <view class="modern-product-container">
        <!-- 背景装饰 -->
        <view class="bg-decoration">
            <view class="circle circle-1"></view>
            <view class="circle circle-2"></view>
            <view class="circle circle-3"></view>
        </view>
        
        <!-- 现代头部 -->
        <view class="modern-header">
            <view class="header-content">
                <view class="page-title">
                    <text class="title-text">产品中心</text>
                </view>
            </view>
        </view>
        
        <!-- 现代搜索栏 -->
        <view class="modern-search">
            <view class="search-container">
                <uni-easyinput 
                    class="modern-search-input" 
                    suffixIcon="search" 
                    :placeholder="$t('product.ss')" 
                    :inputBorder="true"
                    :styles="modernStyles" 
                    primaryColor="#667eea" 
                    placeholderStyle="color:#999;font-size:28rpx"
                    v-model="searchText">
                </uni-easyinput>
            </view>
        </view>

        
        <!-- 现代产品列表 -->
        <view class="modern-product-list">
            <view class="product-grid">
                <view 
                    v-for="(item, index) in goodsList" 
                    :key="index" 
                    @click="onClickDetail(item)" 
                    class="modern-product-item">
                    <view class="product-image-container">
                        <image :src="item.image" mode="aspectFill" class="product-image"></image>
                        <view class="product-overlay"></view>
                    </view>
                    <view class="product-info">
                        <view class="product-title">
                            <text class="title-text">{{ item.title }}</text>
                        </view>
                        <view class="product-price">
                            <text class="price-text">{{ item.price }}</text>
                        </view>
                        <view class="product-stats">
                            <view class="volume-info">
                                <text class="volume-text">24H vol: {{ item.vol }}</text>
                            </view>
                            <view class="change-info" :class="item.is_z == 1 ? 'change-up' : 'change-down'">
                                <image 
                                    class="change-icon" 
                                    :src="require(`@/static/${item.is_z == 1 ? 'red_up' : 'green_down'}.png`)" 
                                    mode="aspectFit">
                                </image>
                                <text class="change-text">{{ item.zf }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <tabbar :actIndex="1"></tabbar>
    </view>
</template>

<script>
    import { goods } from '@/api/money.js'
    export default {
        components: {
            tabbar: () => import("@/components/tabbar.vue"),
        },
        data() {
            return {
                styles: {
                    'borderColor': '#fff'
                },
                modernStyles: {
                    borderColor: '#e0e0e0',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '25rpx'
                },
                current: 0,
                act_type: 1,
                tabs: [this.$t('product.hbzl')],
                goodsList: [],
                timer: null,
                searchText: ''
            };
        },
        onUnload() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            console.log('页面销毁1')
        },
        onHide() {
            console.log('页面销毁1')
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        onLoad() {
            this.getGoods()
        },
        onShow() {
            // 增加定时器间隔，减少频繁刷新
            this.timer = setInterval(() => {
                goods({
                    hideLoading: true,
                    cid: this.act_type,
                }).then(({ data }) => {
                    this.goodsList = data
                }).catch(error => {
                    console.log('定时刷新商品列表失败:', error);
                })
            }, 30000); // 改为30秒刷新一次
        },
        methods: {
            onClickDetail({ id, codename, title }) {
                uni.navigateTo({
                    url: `/pages/Detail/Detail?id=${id}&codename=${codename}&title=${title}`
                })
            },
            setColor(e) {
                if (this.searchText.indexOf(e) != -1) {
                    return 'color:#1150c2'
                }
            },
            getGoods() {
                goods({
                    hideLoading: true,
                    cid: this.act_type,
                }).then(({ data }) => {
                    this.goodsList = data
                })
            },
            changeTab(index) {
                console.log('当前选中的项：' + index)
            },

        }
    }
</script>

<style lang="less">
    page {
        background-color: #f6f7fb;
    }

    .tui-variety {
        position: relative;
        padding: 0 30rpx;
        padding-bottom: 60rpx;
    }
    .tui-search {
        padding: 30rpx;
        box-sizing: border-box;
    }

    /deep/.uni-easyinput__content {
        border-radius: 30px;
    }
    /deep/.uni-easyinput__content-input {
        height: 90rpx;
        border-radius: 30px;
    }
    /deep/.uni-easyinput {
        background-color: #fff;
        border-radius: 30px;
    }
    /deep/.uni-forms-item__label {
        color: #a8a9ac !important;
    }
</style>

<!-- 现代样式 -->
<style lang="less" scoped>
.modern-product-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;
	overflow: hidden;
}

.bg-decoration {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	
	.circle {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		animation: float 6s ease-in-out infinite;
		
		&.circle-1 {
			width: 200rpx;
			height: 200rpx;
			top: 10%;
			right: 10%;
			animation-delay: 0s;
		}
		
		&.circle-2 {
			width: 150rpx;
			height: 150rpx;
			bottom: 20%;
			left: 5%;
			animation-delay: 2s;
		}
		
		&.circle-3 {
			width: 100rpx;
			height: 100rpx;
			top: 60%;
			right: 20%;
			animation-delay: 4s;
		}
	}
}

.modern-header {
	position: relative;
	z-index: 10;
	padding: 60rpx 40rpx 40rpx;
	
	.header-content {
		display: flex;
		justify-content: center;
		align-items: center;
		
		.page-title {
			.title-text {
				font-size: 48rpx;
				font-weight: bold;
				color: #fff;
				text-align: center;
			}
		}
	}
}

.modern-search {
	position: relative;
	z-index: 10;
	margin: 0 40rpx 30rpx;
	
	.search-container {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 30rpx;
		padding: 20rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
	}
}

.modern-product-list {
	position: relative;
	z-index: 10;
	margin: 0 40rpx 30rpx;
	
	.product-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
	}
}

.modern-product-item {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-radius: 30rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	border: 2rpx solid transparent;
	
	&:active {
		transform: scale(0.95);
		border-color: #667eea;
		box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
	}
	
	.product-image-container {
		position: relative;
		height: 200rpx;
		overflow: hidden;
		
		.product-image {
			width: 100%;
			height: 100%;
		}
		
		.product-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
		}
	}
	
	.product-info {
		padding: 30rpx 20rpx;
		
		.product-title {
			margin-bottom: 15rpx;
			
			.title-text {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				text-align: center;
				line-height: 1.4;
			}
		}
		
		.product-price {
			margin-bottom: 20rpx;
			
			.price-text {
				font-size: 28rpx;
				color: #667eea;
				font-weight: bold;
				text-align: center;
			}
		}
		
		.product-stats {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.volume-info {
				.volume-text {
					font-size: 24rpx;
					color: #666;
				}
			}
			
			.change-info {
				display: flex;
				align-items: center;
				padding: 8rpx 16rpx;
				border-radius: 20rpx;
				
				&.change-up {
					background: rgba(11, 181, 99, 0.1);
					
					.change-text {
						color: #0bb563;
						font-size: 24rpx;
						font-weight: bold;
						margin-left: 8rpx;
					}
				}
				
				&.change-down {
					background: rgba(243, 59, 80, 0.1);
					
					.change-text {
						color: #f33b50;
						font-size: 24rpx;
						font-weight: bold;
						margin-left: 8rpx;
					}
				}
				
				.change-icon {
					width: 16rpx;
					height: 16rpx;
				}
			}
		}
	}
}

@keyframes float {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-20px); }
}
</style>
