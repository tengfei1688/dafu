<template>
	<view class="modern-home-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>
		
		<!-- 现代头部 -->
		<view class="modern-header" :style="stickyStyle">
			<view class="header-content">
				<view class="logo-section">
					<image src="@/static/logo.png" mode="aspectFit" class="logo-image"></image>
					<text class="app-name">{{$t('app.yymc')}}</text>
				</view>
				<view class="language-switch" @click="$refs['langChange'].open()">
					<image src="@/static/diqiu.png" mode="aspectFit" class="lang-icon"></image>
				</view>
			</view>
		</view>
		
		<!-- 现代轮播图 -->
		<view class="modern-banner">
			<uni-swiper-dot class="uni-swiper-dot-box" :info="info" :current="current" :mode="mode"
				:dots-styles="dotsStyles" field="content">
				<swiper class="swiper-box" @change="change" autoplay>
					<swiper-item v-for="(item, index) in info" :key="index">
						<view class="swiper-item" :class="'swiper-item' + index">
							<image :src="item" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		
		<!-- 注释掉平台介绍和新闻中心，这些内容用不到 -->
		<!--
		<view :class="['platformIntroduction', { show: isFold }]" class="platform-intro">
			<view class="con-title">
				<image src="/static/title.png"></image>
				<text> {{$t('home.ptld')}} </text>
				<image src="/static/title.png"></image>
			</view>
			<view class="lightspot">
				{{$t('home.ptld.jj')}}
			</view>
			<lightspotImg></lightspotImg>
			<view class="con-title">
				<image src="/static/title.png"></image>
				<text> {{$t('home.xwzx')}} </text>
				<image src="/static/title.png"></image>
			</view>

			<view class="newList">
				<view class="newsItem">
					<view class="title">
						北大光华-广期所新能源产业高管研修课程圆满结业
					</view>
					<view class="con">
						10月22日，广州期货交易所"新能源产业高级管理人员研修课程"在北京大学光华管理学院举办结业仪式。光华管理学院党委书记马化祥、广期所总经理朱丽红出席仪式并致辞，广期所副总经理冷冰出席仪式。
					</view>
					<view class="btn">
						<view class="" @click="toNews(1)">
							查看详情
						</view>
					</view>
				</view>
				<view class="newsItem">
					<view class="title">
						广期所工业硅期货和期权荣获FOW最佳新合约奖
					</view>
					<view class="con">
						2023年9月21日，广期所工业硅期货和期权在期货和期权世界杂志（FOW）主办的"2023年度亚洲资本市场颁奖典礼"上荣获"年度最佳新合约——大宗商品"奖项。评审团认为，广期所作为创新型交易所，打造了绿色发展类产品基准，推动服务产业在绿色转型发展中的风险管理需求。
					</view>
					<view class="btn">
						<view class="" @click="toNews(2)">
							查看详情
						</view>
					</view>
				</view>
			</view>
			<view class="con-title">
				<image src="/static/title.png"></image>
				<text> {{$t('home.yszc')}} </text>
				<image src="/static/title.png"></image>
			</view>
			<view class="policy">
				{{ policyText }}
			</view>
			<view class="packUpBtn">
				<image src="/static/lucky_fold.png"></image>
				<view class="btnBox">
					<view class="" @click="isFold = false"> {{$t('home.dj.sq')}} </view>
				</view>
			</view>
		</view>
		-->
		<!-- 简洁内容区域 -->
		<view class="content-area">
			<!-- 公告栏 -->
			<view class="modern-notice" @click="onClickNotice">
				<view class="notice-content">
					<view class="notice-header">
						<view class="notice-icon-wrapper">
							<image src="/static/laba.png" mode="aspectFit" class="notice-icon"></image>
						</view>
						<text class="notice-label">重要公告</text>
					</view>
					<view class="notice-text-wrapper">
						<text class="notice-text">{{ getUserItem.gg_title }}</text>
					</view>
					<view class="notice-arrow">
						<image src="/static/youjian.png" mode="aspectFit" class="arrow-icon"></image>
					</view>
				</view>
			</view>
			
			<!-- 功能菜单 -->
			<view class="menu-section">
				<view class="menu-grid">
					<view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="onClickOpen(item, index)">
						<view class="menu-icon-wrapper">
							<image :src="item.icon" mode="aspectFit" class="menu-icon"></image>
							<view class="menu-badge" v-if="count != 0 && index === 0" :text="count"></view>
						</view>
						<text class="menu-title">{{ item.title }}</text>
					</view>
				</view>
			</view>
			

			
			<!-- 产品推荐 -->
			<view class="modern-product-section">
				<view class="section-header">
					<text class="section-title">{{$t('home.cptj')}}</text>
				</view>
				<scroll-view class="product-scroll" scroll-x="true">
					<view class="product-item" v-for="(item, index) in goodsList" :key="index" @click="onClickDetail(item)">
						<view class="product-header">
							<text class="product-name">{{ item.title }}</text>
							<text class="product-code">{{ item.codename }}</text>
						</view>
						<view class="product-chart">
							<image v-if="item.is_z == 1" class="chart-image"
								:src="require(`@/static/down_${getImgBg(item.zf)}.png`)" mode="aspectFit"></image>
							<image v-else class="chart-image" :src="require(`@/static/up_${getImgBg(item.zf)}.png`)"
								mode="aspectFit"></image>
						</view>
						<view class="product-price">
							<text class="price-value">{{ item.price }}</text>
						</view>
						<view class="product-change">
							<view class="change-info">
								<text class="change-label">{{ item.zf_d }}</text>
								<view class="change-value" :class="{'up': item.is_z == 1, 'down': item.is_z != 1}">
									<image class="change-icon" :src="require(`@/static/${item.is_z == 1?'red_up':'green_down'}.png`)" mode="aspectFit"></image>
									<text class="change-text">{{ item.zf }}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 公告 -->
		<uni-popup ref="popup" type="center">
			<view class="tui-popup">
				<view class="tui-desc">
					<view class="title">{{getUserItem.gg_title}} </view>
					<view class="time" style="padding: 30rpx 0;"> {{getUserItem.gg_time}}</view>
					<view class="desc">{{getUserItem.gg_con}} </view>
				</view>
			</view>
		</uni-popup>
		<langChange ref="langChange"></langChange>
		<tabbar :actIndex="0" v-show="!isFold"></tabbar>
	</view>
</template>

<script>
	import {
		goods,
		get_count
	} from "@/api/money.js";
	import {
		policyText
	} from "./data.js";
	import {
		getUserIndex
	} from '@/api/user.js'
	export default {
		components: {
			lightspotImg: () => import("@/components/lightspotImg.vue"),
			langChange: () => import("@/components/langChange.vue"),
			tabbar: () => import("@/components/tabbar.vue"),
		},

		data() {
			return {
				value: 0,
				policyText,
				isFold: false,
				current: 0,
				mode: "dot",
				act_type:1,
				info: [],
				dotsStyles: {
					selectedBackgroundColor: "#fff",
					selectedBorder: "#fff",
				},
				menuList: [{
						title: this.$t("home.kjrj"),
						icon: require("@/static/kjrj.png"),
					},
					// {
					// 	title: this.$t("home.cpjy"),
					// 	icon: require("@/static/cpjy.png"),
					// },
					{
						title: this.$t("lianghua"),
						icon: require("@/static/tabbar/ai2.jpg"),
					},
					{
						title: this.$t("home.wddd"),
						icon: require("@/static/wddd.png"),
					},
					{
						title: this.$t("home.ckfs"),
						icon: require("@/static/ckfs.png"),
					},
					// {
					// 	title: this.$t("lianghua"),
					// 	icon: require("@/static/tabbar/ai2.jpg"),
					// },
					{
						title: this.$t("home.gywm"),
						icon: require("@/static/about.png"),
					},
					{
						title: this.$t("home.xtxx"),
						icon: require("@/static/xtxx.png"),
					},
					
				],
				goodsList: [],
				timer: null,
				stickyStyle: "", // 吸顶元素的样式
				upImage: [
					require("@/static/up_0.png"),
					require("@/static/up_1.png"),
					require("@/static/up_2.png"),
					require("@/static/up_3.png"),
				],
				downImage: [
					require("@/static/down_0.png"),
					require("@/static/down_1.png"),
					require("@/static/down_2.png"),
					require("@/static/down_3.png"),
				],
				count: 0,
				getUserItem: {}
			};
		},
		onUnload() {
			// 页面销毁时清除定时器
			if (this.timer) {
				clearInterval(this.timer);
			}
			this.stickyStyle = "";
		},
		onHide() {
			this.stickyStyle = "";
			if (this.timer) {
				clearInterval(this.timer);
			}
		},
onPageScroll(e) {
    // 监听页面滚动事件
    if (e.scrollTop > 100) {
        // 当滚动距离超过100时，固定在顶部
        this.stickyStyle =
            "position: fixed; top: 0; left: 0; width: 100%; z-index: 99999;background-color: #f6f7fb;";
    } else {
        // 取消吸顶效果
        this.stickyStyle = "";
    }
},
onLoad() {
    this.getGoods();
},
onShow() {
    this.getUserIndex();
    this.get_count();
    // 增加定时器间隔，减少频繁刷新
    this.timer = setInterval(() => {
        goods({
            hideLoading: true,
            cid: this.act_type,
        }).then(({ data }) => {
            this.goodsList = data;
        }).catch(error => {
            console.log('定时刷新商品列表失败:', error);
        });
    }, 30000); // 改为30秒刷新一次，减少频繁请求
},
methods: {
    toNews(id) {
        uni.navigateTo({
            url: `/pages/index/detail?Id=${id}`,
        });
    },
    getUserIndex() {
        getUserIndex({
            hideLoading: true,
        }).then(({ data }) => {
            this.info = data.banner;
            this.getUserItem = data || {};

            // 拼接完整公告内容（字段名替换成接口真实的完整内容字段）
            if (this.getUserItem.gg_content) {
                this.getUserItem.gg_title =
                    `${this.getUserItem.gg_title} ${this.getUserItem.gg_content}`;
            }
        });
    },
    get_count() {
        get_count({
            hideLoading: true,
        }).then(({ data }) => {
            this.count = data.count;
        });
    },
    getImgBg(num) {
        return Math.floor(Math.random() * (4 + 1));
    },
    getGoods() {
        goods({
            hideLoading: true,
            cid: this.act_type,
        }).then(({ data }) => {
            this.goodsList = data;
        });
    },
    shops_act(data) {
        this.act_type = data;
        goods({
            hideLoading: true,
            cid: data,
        }).then(({ data }) => {
            this.goodsList = data;
        });
    },
    onClickDetail({ id, codename, title }) {
        uni.navigateTo({
            url: `/pages/Detail/Detail?id=${id}&codename=${codename}&title=${title}`,
        });
    },
    onClickNotice() {
        this.$refs.popup.open();
    },
    change(e) {
        this.current = e.detail.current;
    },
    onClickOpen(item, index) {
        switch (index) {
            case 5:
                uni.navigateTo({ url: "/pages/message/message" });
                break;
            case 3:
                uni.navigateTo({ url: "/pages/account/account" });
                break;
            case 2:
                uni.navigateTo({ url: "/pages/order/order" });
                break;
            case 1:
                uni.navigateTo({ url: "/pages/money/money" });
                break;
            case 4:
                uni.navigateTo({ url: "/pages/index/detail" });
                break;
            case 6:
                getUserIndex({ hideLoading: true }).then(({ data }) => {
                    // 使用uni-app的跨平台方法
                    // #ifdef H5
                    // H5环境使用window.location.href
                    window.location.href = data.kefu_url;
                    // #endif
                    // #ifdef APP-PLUS
                    // APP环境使用plus.runtime.openURL
                    plus.runtime.openURL(data.kefu_url);
                    // #endif
                    // #ifdef MP-WEIXIN
                    // 微信小程序使用uni.navigateToMiniProgram或复制链接
                    uni.setClipboardData({
                        data: data.kefu_url,
                        success: () => {
                            uni.showToast({
                                title: '客服链接已复制到剪贴板',
                                icon: 'success'
                            })
                        }
                    })
                    // #endif
                });
                break;
            case 0:
                getUserIndex({ hideLoading: true }).then(({ data }) => {
                    // 使用uni-app的跨平台方法
                    // #ifdef H5
                    // H5环境使用window.location.href
                    window.location.href = data.kefu_url;
                    // #endif
                    // #ifdef APP-PLUS
                    // APP环境使用plus.runtime.openURL
                    plus.runtime.openURL(data.kefu_url);
                    // #endif
                    // #ifdef MP-WEIXIN
                    // 微信小程序使用uni.navigateToMiniProgram或复制链接
                    uni.setClipboardData({
                        data: data.kefu_url,
                        success: () => {
                            uni.showToast({
                                title: '客服链接已复制到剪贴板',
                                icon: 'success'
                            })
                        }
                    })
                    // #endif
                });
                break;
        }
    }
} // ← 结束 methods
} // ← 结束 export default
</script>

<style lang="less">
	page {
		height: 100%;
		background-color: #f6f7fb;
	}

	// 现代首页样式 - 按照登录页面风格
	.modern-home-container {
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
		padding: 40rpx;
		
		.header-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.logo-section {
				display: flex;
				align-items: center;
				flex: 1;
				
				.logo-image {
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
				}
				
				.app-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #fff;
				}
			}
			
			.language-switch {
				display: flex;
				align-items: center;
				justify-content: center;
				background: rgba(255, 255, 255, 0.2);
				padding: 20rpx;
				border-radius: 50rpx;
				backdrop-filter: blur(10px);
				width: 80rpx;
				height: 80rpx;
				
				.lang-icon {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}

	.modern-banner {
		position: relative;
		z-index: 10;
		margin: 0 40rpx 40rpx;
		
		.swiper-box {
			height: 300rpx;
			border-radius: 30rpx;
			overflow: hidden;
			box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
			
			.swiper-item {
				width: 100%;
				height: 100%;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.content-area {
		position: relative;
		z-index: 10;
		margin: 0 30rpx;
		padding-bottom: 120rpx;
	}

	.modern-notice {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 20rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
		border: 1rpx solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.98);
		}
		
		.notice-content {
			padding: 25rpx;
			
			.notice-header {
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;
				
				.notice-icon-wrapper {
					width: 50rpx;
					height: 50rpx;
					background: linear-gradient(135deg, #667eea, #764ba2);
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 15rpx;
					
					.notice-icon {
						width: 30rpx;
						height: 30rpx;
						filter: brightness(0) invert(1);
					}
				}
				
				.notice-label {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
				}
			}
			
			.notice-text-wrapper {
				margin-bottom: 15rpx;
				
				.notice-text {
					font-size: 26rpx;
					color: #666;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}
			
			.notice-arrow {
				display: flex;
				justify-content: flex-end;
				
				.arrow-icon {
					width: 24rpx;
					height: 24rpx;
					opacity: 0.6;
				}
			}
		}
	}

	.menu-section {
		margin-bottom: 25rpx;
		
		.menu-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 15rpx;
			
			.menu-item {
				background: rgba(255, 255, 255, 0.9);
				border-radius: 15rpx;
				padding: 25rpx 15rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.08);
				transition: all 0.3s ease;
				
				&:active {
					transform: scale(0.95);
					background: rgba(255, 255, 255, 1);
				}
				
				.menu-icon-wrapper {
					position: relative;
					margin-bottom: 12rpx;
					
					.menu-icon {
						width: 50rpx;
						height: 50rpx;
					}
					
					.menu-badge {
						position: absolute;
						top: -8rpx;
						right: -8rpx;
						background: #ff4757;
						color: #fff;
						font-size: 18rpx;
						padding: 4rpx 8rpx;
						border-radius: 15rpx;
						min-width: 25rpx;
						text-align: center;
					}
				}
				
				.menu-title {
					font-size: 22rpx;
					color: #333;
					text-align: center;
					line-height: 1.2;
				}
			}
		}
	}



	.modern-product-section {
		.section-header {
			margin-bottom: 20rpx;
			
			.section-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #fff;
				text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
			}
		}
		
		.product-scroll {
			white-space: nowrap;
			overflow-x: auto;
			overflow-y: hidden;
			-webkit-overflow-scrolling: touch;
			
			.product-item {
				display: inline-block;
				width: 260rpx;
				background: rgba(255, 255, 255, 0.9);
				border-radius: 12rpx;
				padding: 20rpx;
				margin-right: 15rpx;
				vertical-align: top;
				box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
				transition: all 0.3s ease;
				
				&:last-child {
					margin-right: 0;
				}
				
				&:active {
					transform: scale(0.95);
				}
				
				.product-header {
					margin-bottom: 15rpx;
					
					.product-name {
						display: block;
						font-size: 26rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 6rpx;
					}
					
					.product-code {
						display: block;
						font-size: 20rpx;
						color: #666;
					}
				}
				
				.product-chart {
					height: 70rpx;
					margin-bottom: 15rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.chart-image {
						width: 100%;
						height: 100%;
					}
				}
				
				.product-price {
					margin-bottom: 12rpx;
					
					.price-value {
						font-size: 24rpx;
						font-weight: bold;
						color: #333;
					}
				}
				
				.product-change {
					.change-info {
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.change-label {
							font-size: 18rpx;
							color: #666;
						}
						
						.change-value {
							display: flex;
							align-items: center;
							
							&.up {
								color: #ff4757;
							}
							
							&.down {
								color: #2ed573;
							}
							
							.change-icon {
								width: 18rpx;
								height: 18rpx;
								margin-right: 6rpx;
							}
							
							.change-text {
								font-size: 18rpx;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}
	.shops{
		font-size: 24rpx;
		margin-top: 20rpx;
		padding: 20rpx 0rpx;
		display: flex;
		width:100%;
		height: 104rpx;
		justify-content: space-around;
		align-items: center;
		.shop1{
			flex: 1;
			background: #e74c3c;
			border-radius: 10rpx;
			line-height: 48rpx;
			margin-left: 2rpx;
			padding: 10rpx 10rpx;
			color: #fff;
			font-size: 24rpx;
			white-space: nowrap;
			overflow: hidden;
			text-align: center;
		}
		.tui-activite{
			background: #33a854;
		}
	}
	
	.tui-desc {
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;

		.desc {
			color: #33a854;
			font-size: 26rpx;
		}

		.title {
			color: #222;
			font-size: 26rpx;
		}

		.time {
			color: #a8a9ac;
			font-size: 20rpx;
			padding-top: 10rpx;
		}
	}

	/deep/.uni-popup {
		z-index: 999 !important;
	}

	.tui-hover {
		background-color: #fffaf9 !important;
		transform: seale(1.03);
	}

	.tui-popup {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.tui-variety {
		margin-top: 64rpx;
		position: relative;

		.tui-varietyContent {
			display: flex;
			flex-direction: column;
			padding-bottom: 30px;

			.tui-varietyContentItem {
				width: 100%;
				background-color: #fff;
				border-radius: 13px;
				margin-top: 26rpx;
				padding: 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;

				.tui-end {
					padding: 10rpx;
					width: 80px;
					color: #fff;
					border-radius: 5px;
					font-size: 28rpx;
					box-sizing: border-box;
					text-align: center;

					&.up {
						background-color: #f33b50 !important;
					}

					&.down {
						background-color: #0bb563 !important;
					}
				}

				.code {
					flex: 1;
					max-width: 170rpx;
					overflow-wrap: break-word;
					font-size: 26rpx;
				}

				.name {
					display: flex;
					flex-direction: column;
					flex: 1;

					.piceName {
						font-size: 32rpx;
						color: #222;
						font-weight: 500;
						padding-bottom: 15rpx;
					}
				}
			}
		}

		.tui-classify {
			color: #a8a9ac;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			padding: 30rpx;

			.tui-rightVariety {
				width: 300rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}

		.title {
			font-size: 32rpx;
			color: #222;
			padding-bottom: 20rpx;
		}
	}

	.tui-recommend {
		margin-top: 64rpx;
		margin-bottom: 60rpx;
		position: relative;

		.prefer-scroll {
			white-space: nowrap;
			/* 防止换行 */
			overflow-x: auto;
			/* 开启横向滚动 */
			overflow-y: hidden;
			/* 隐藏纵向滚动条 */
			-webkit-overflow-scrolling: touch;
			/* 针对移动端使滚动更流畅 */
			width: 100%;
		}

		.image-box {
			display: inline-block;
			width: 245upx;

			background-color: #fff;
			border-radius: 13px;
			margin-left: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;

			.tui-shitu {
				width: 90%;
				height: 110rpx;
				left: 50%;
				transform: translateX(-50%);
				margin-top: 12rpx;
			}

			.parities {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 20rpx;
				color: #222;

				.tui-rightParities {
					display: flex;
					align-items: center;
					padding-top: 10rpx;

					.rise {
						padding-left: 10rpx;
						color: #f33b50;
					}

					.down {
						width: 18rpx;
						height: 18rpx;
					}
				}
			}

			.proportion {
				font-size: 24rpx;
				color: #222;
				margin-top: 12rpx;
			}

			.name {
				font-size: 32rpx;
				font-weight: 500;
				color: #222;
			}

			.desc {
				color: #a8a9ac;
				font-size: 20rpx;
				padding-top: 6rpx;
			}
		}
		
		.image-box:nth-of-type(1) {
			margin-left: 0;
		}

		.title {
			font-size: 32rpx;
			color: #222;
			padding-bottom: 20rpx;
		}
	}

	@keyframes wave {
		0% {
			transform: translateY(-5px);
		}

		50% {
			transform: translateY(-20px);
		}
	}

	@keyframes responsiveAnimation {
		0% {
			transform: scale(0.8);
			/* 动画开始时图片大小正常 */
		}

		50% {
			transform: scale(1);
			/* 动画中间时图片放大50% */
		}

		100% {
			transform: scale(0.8);
			/* 动画结束时图片恢复正常大小 */
		}
	}

	.tui-notice {
		margin-top: 44rpx;
		background-color: #fff;
		padding:4rpx 30rpx;
		border-radius: 8px;
		font-size: 32rpx;
		display: flex;
		align-items: center;



		image {
			width: 80rpx;
			height: 80rpx;
			animation: responsiveAnimation 2s infinite;
			/* 应用动画 */
		}
	}

	.tui-card {
		z-index: 333;
		width: 100%;
		overflow: hidden;
		padding: 0 36rpx;
		padding-bottom: 110rpx;
		background-color: #f6f7fb;
		position: absolute;
		margin-top: 0rpx;

		.tui-content {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;



			.item:nth-child(7) {
				width: 335rpx;
				padding: 30rpx;
				background: url(/static/kf-bg.png) no-repeat;
				background-size: 100% 100%;
				display: flex;
				align-items: center;
				justify-content: space-between !important;
				flex-direction: row;
			}

			.item {
				width:33%;
				height: 160rpx;
				padding: 30rpx 0rpx;
				border-radius: 26rpx;
				font-size: 32rpx;
				background-color: #fff;
				margin-top: 20rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				position: relative;

				.tui-positionBadge {
					position: absolute;
					top: -20rpx;
					right: -20rpx;
				}

				.tui-itemRight {
					width: 120rpx;
					height: 100rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.tui-itemLeft {
					display: flex;
					flex-direction: column;

					.kefu {
						font-size: 26rpx;
					}

					.fuwu {
						font-size: 20rpx;
						color: #a8a9ac;
						padding-top: 5rpx;
					}
				}

				.title {
					width: 100%;
					text-align: center;
					padding-top: 4rpx;
					font-size: 24rpx;
				}

				image {
					width: 70rpx;
					
					height: 70rpx;
				}
			}
		}
	}

	.platformIntroduction {
		transition: all 0.3s ease;
		height: 0;
		padding: 50rpx 40rpx;
		padding-bottom: 0;
		overflow-y: auto;
		position: relative;
		z-index: 999;
		overflow: hidden;

		.con-title {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 16rpx;

			&>image {
				width: 46rpx;
				height: 22rpx;
				position: relative;
				top: 3rpx;
			}

			&>text {
				color: #1150c2;
				font-size: 32rpx;
				margin: 0 18rpx;
				font-weight: bold;
			}
		}

		.lightspot {
			color: #222;
			font-size: 24rpx;
			text-align: center;
		}

		.policy {
			color: #222;
			font-size: 24rpx;
			line-height: 38rpx;
		}

		.newList {
			margin-bottom: 80rpx;
			margin-top: 40rpx;

			.newsItem {
				padding: 12px 12px;
				border-radius: 12px;
				background-color: #fff;
				margin-top: 10px;

				.title {
					font-size: 26rpx;
					color: #323232;
				}

				.con {
					text-indent: 2em;
					font-size: 28rpx;
					color: rgb(51, 51, 51);
					margin-top: 10px;
					margin-bottom: 10px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.btn {
					border-top: 1px solid #eee;
					padding-top: 12px;
					display: flex;
					justify-content: flex-end;
					font-size: 24rpx;
					color: #1150c2;
				}
			}
		}

		.packUpBtn {
			transition: bottom 0.4s cubic-bezier(0, 0.5, 1, 2);
			position: fixed;
			bottom: 70vh;
			left: 0;
			// background-color: #f6f7fb;
			visibility: hidden;
			z-index: 9999;

			image {
				width: 100vw;
				height: 168rpx;
			}

			.btnBox {
				background-color: #f6f7fb;
				padding-bottom: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: -34px;
				position: relative;

				&>view {
					width: 99px;
					height: 26px;
					background-color: unset;
					border: 1px solid #1150c2;
					color: #1150c2;
					text-align: center;
					line-height: 24px;
					font-size: 12px;
				}
			}
		}

		&.show {
			height: auto;
			padding-bottom: 260rpx;

			.packUpBtn {
				visibility: visible;
				bottom: 0;
			}
		}
	}

	.conBox {
		&.hide {
			display: none;
		}
	}



	.tui-banner {
		padding: 20rpx 36rpx;

		.swiper-box {
			height: 320rpx;

			.swiper-item {
				width: 100%;
				height: 100%;
				border-radius: 55rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.tui-NavHeader {
		padding: 20rpx 36rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		height: 100rpx;
		background: url(/static/bg.png) no-repeat;

		.tui-img {
			width: 188rpx;
			height: 54rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.tui-right {
			background-color: rgba(235, 239, 241, 0.43);
			padding: 20rpx 20rpx;
			border-radius: 21px;
			display: flex;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			text {
				padding-left: 20rpx;
				font-size: 32rpx;
				font-weight: bold;
				font-family: "myfont";
			}
		}
	}

	.tui-header {
		height: 100%;
		background: url(/static/bg.png) no-repeat;
		background-size: 860rpx 1026rpx;
		background-position-y: -106rpx;
	}
	.uni-scroll-view::-webkit-scrollbar {
	    display: none; /* 隐藏滚动条 */
	}

	/* #ifndef APP-PLUS-NVUE */
	/* H5和微信小程序支持的隐藏样式 */
	.platform-intro {
		display: none;
	}
	.hidden-desc {
		display: none;
	}
	/* #endif */

	/* #ifdef APP-PLUS-NVUE */
	/* nvue中支持的隐藏样式 */
	.platform-intro {
		opacity: 0;
		visibility: hidden;
	}
	.hidden-desc {
		opacity: 0;
		visibility: hidden;
	}
	/* #endif */

    .notice-bar {
        display: flex;
        align-items: center;
        background-color: #fffbe8;
        border-bottom: 1px solid #f0e1b0;
        padding: 6rpx 10rpx;
        overflow: hidden;
        white-space: nowrap;
    }
    .notice-track {
        display: inline-block;
        color: #E53935;
		font-size: 36rpx;
		animation: scroll-left 15s linear infinite;
    }
    
    @keyframes scroll-left {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(-100%);
        }
    }
</style>