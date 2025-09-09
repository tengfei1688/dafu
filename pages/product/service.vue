
<template>
  <view class="modern-service-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <!-- 现代头部 -->
    <view class="modern-header">
      <view class="header-content">
        <view class="back-button" @click="goBack">
          <uni-icons type="arrow-left" size="25" color="#fff"></uni-icons>
        </view>
        <view class="page-title">
          <text class="title-text">在线客服</text>
        </view>
      </view>
    </view>
    
    <!-- 客服入口 -->
    <view class="service-entry">
      <view class="service-card" @click="contactService">
        <view class="service-icon">
          <image src="/static/kefu.png" mode="aspectFit" class="icon-img"></image>
        </view>
        <view class="service-content">
          <text class="service-title">7x24小时专业客服</text>
          <text class="service-desc">点击访问在线客服，为您提供专业服务</text>
        </view>
        <view class="service-arrow">
          <image src="/static/youjian.png" mode="aspectFit" class="arrow-img"></image>
        </view>
      </view>
    </view>
    

    <!-- FAQ 列表 -->
    <scroll-view class="faq-wrap" scroll-y>
      <view class="faq-section">
        <text class="faq-title">常见问题解答</text>

        <view
          v-for="(item, i) in faqList"
          :key="i"
          class="faq-card"
          @click="toggleFaq(i)"
        >
          <view class="faq-header">
            <text class="faq-question">{{ item.q }}</text>
            <text class="faq-arrow" :class="{ 'faq-arrow--active': activeIndex === i }">></text>
          </view>
          <view class="faq-answer" v-if="activeIndex === i">
            <text class="faq-answer-text">{{ item.a }}</text>
          </view>
        </view>
      </view>
    </scroll-view>


  </view>
</template>

<script>
import { getUserIndex } from "@/api/user.js"

export default {
  name: 'Service',
  data() {
    return {
      activeIndex: -1,
      faqList: [
        { q: '如何充值？支持哪些支付方式？', a: '答：本系统对多个国家开放，我们提供国际化的支付方式:USDT（TRC20 ERC20）BTC ETH,同时我们还针对不同国家支持本国货币。' },
        { q: '如何开始投资？投资前需要了解哪些事项？', a: '答:你可以充值获得初始资金，然后选择推荐产品进行下单就能大概率获得一定收益，所有资金都可以提现到您绑定的银行卡或者USDT钱包。' },
        { q: '如何邀请朋友加入会员并获得奖励？', a: '答：平台采用邀请制注册新会员，为了保证已注册会员的收益，防止过度注册降低收益，新会员只能在现有会员获得邀请码后帮助注册。新注册会员通过邀请码注册，双方均有不同奖励' },
        { q: '平台的单笔或单日交易金额有限制吗？', a: '答：工作日内资金一般会在提现后30分钟内到达您绑定的提现账户，非工作日会稍许延迟至1小时，银行出款系统维护或者其他原因造成超时，请联系在线客服咨询处理。首次提现资金，建议联系在线客服确认提交的银行卡信息或者USDT钱包信息正确，避免造成资金损失。' },
        { q: '当提现资金未到账时，应该如何处理？', a: '答：提现资金没有通过审核，可能是出款系统正在维护，或者是您的提现信息填写错误造成，请您仔细确认提现信息正确，更正后重新申请提现。' },
        { q: '忘记资金密码了，该如何找回或重置？', a: '答：请联系在线客服，提供账号信息和您的证件信息，客服人员确认你提供的信息正确后，会协助您更改新密码。' },
        { q: '遇到页面加载错误或按钮不可点击问题？', a: '答：你随时可以联系在线客服协助完成所有操作。' }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toggleFaq(i) {
      this.activeIndex = this.activeIndex === i ? -1 : i
    },
    contactService() {
      // 获取客服链接并直接跳转
      getUserIndex({ hideLoading: true }).then((res) => {
        console.log('获取客服链接成功', res);
        if (res.status === 1 && res.data.kefu_url) {
          // #ifdef APP-PLUS
          uni.navigateTo({
            url: `/pages/webview/webview?url=${encodeURIComponent(res.data.kefu_url)}&from=service`
          });
          // #endif
          // #ifdef H5
          window.location.href = res.data.kefu_url;
          // #endif
          // #ifdef MP-WEIXIN
          uni.setClipboardData({
            data: res.data.kefu_url,
            success: () => {
              uni.showToast({
                title: '客服链接已复制到剪贴板',
                icon: 'success'
              });
            }
          });
          // #endif
        } else {
          uni.showToast({
            title: '获取客服链接失败',
            icon: 'none'
          });
        }
      }).catch((error) => {
        console.error('获取客服链接失败', error);
        uni.showToast({
          title: '获取客服链接失败',
          icon: 'none'
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>

// 现代客服页面样式 - 按照登录页面风格
.modern-service-container {
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

// 现代头部样式
.modern-header {
  position: relative;
  z-index: 10;
  padding: 60rpx 30rpx 30rpx;
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    .back-button {
      position: absolute;
      left: 0;
      width: 60rpx;
      height: 60rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.95);
        background: rgba(255, 255, 255, 0.3);
      }
    }
    
    .page-title {
      .title-text {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
      }
    }
  }
}

// 客服入口样式
.service-entry {
  position: relative;
  z-index: 10;
  padding: 0 30rpx 30rpx;
  
  .service-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.15);
    }
    
    .service-icon {
      width: 80rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .icon-img {
        width: 50rpx;
        height: 50rpx;
        filter: brightness(0) invert(1);
      }
    }
    
    .service-content {
      flex: 1;
      
      .service-title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .service-desc {
        display: block;
        font-size: 26rpx;
        color: #666;
        line-height: 1.4;
      }
    }
    
    .service-arrow {
      .arrow-img {
        width: 24rpx;
        height: 24rpx;
        opacity: 0.6;
      }
    }
  }
}





.faq-wrap {
  height: calc(100vh - 400rpx);
  padding: 0 30rpx;
}

.faq-section {
  margin-bottom: 30rpx;
}

.faq-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
  text-align: center;
}

.faq-card {
  background: white;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid #e0e0e0;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  cursor: pointer;
  background: #fafafa;
}

.faq-question {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
  line-height: 1.4;
  font-weight: 500;
}

.faq-arrow {
  font-size: 32rpx;
  color: #666666;
  transition: transform 0.3s ease;
  font-weight: bold;
}

.faq-arrow--active {
  transform: rotate(90deg);
}

.faq-answer {
  padding: 0 30rpx 30rpx;
  border-top: 1rpx solid #e0e0e0;
  background: white;
}

.faq-answer-text {
  font-size: 28rpx;
  color: #555555;
  line-height: 1.6;
  padding-top: 20rpx;
}



@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
</style>
