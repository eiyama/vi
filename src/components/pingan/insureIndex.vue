<template>
    <div  class="page-container">
        <div class="InsureBannner" style="margin-bottom: 1rem;">
            <div class="banner-img" :style="bannerImg">
                <img class="pingan-logo" src="../../assets/images/pingan/logo.png" alt="">
            </div>
            <div class="block">
                <p class="product-name">车主无忧</p>
                <p class="product-desc">E企宝</p>
            </div>
            <div class="">
                <div class="product-title">
                    <span class="cell-title title-bold">
                        <i class="cell-title-left-icon"></i>
                        产品特色
                    </span>
                </div>
                <div class="productDisplay">
                     <img src="../../assets/images/pingan/bottomBanner.jpg" alt="">
                </div>
            </div>
            <div class="page-footer bottom-fixed">
                <div class="foot-premium">--</div>
                <div class="footer-btn" @click="toInsurance">立即投保</div>
            </div>
        </div> 

    </div>
</template>
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js">
</script>
<script>
import "./../../assets/css/pingan.scss";
import "./../../assets/js/rem.js";
import wx from 'weixin-js-sdk';
import { Indicator } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI, axiosPutAPI } from './../../common/Axios';
export default {
    data(){
        return{
            bannerImg:{
                backgroundImage:"url("+require("@/assets/images/pingan/pinanBanner.jpg")+")"
            },
            appId:'',
            ProductCode:'',
        }
    },
    created(){
        if(this.$route.query.appId){
             this.appId = this.$route.query.appId;
            localStorage.setItem('appId',this.appId);
        }
        document.title =  '华康-车主无忧';
        sessionStorage.setItem('title','华康-车主无忧');
        this.ProductCode = this.$route.query.ProductCode;
    },
    mounted(){
        // wx.config({
        // debug: false, // 是否开启调试模式
        // appId: appid, //appid
        // timestamp: timestamp, // 时间戳
        // nonceStr: noncestr, // 随机字符串
        // signature: signature, // 签名
        // jsApiList: [
        //     'onMenuShareTimeline',
        //     'onMenuShareAppMessage',
        //     'onMenuShareQQ',
        //     'onMenuShareWeibo',
        //     'onMenuShareQZone'
        // ] // 需要使用的JS接口列表
        // })
    },
    methods:{
        toInsurance(){
            this.$router.push({path:'/pingan/insuranceType?ProductCode=' + this.ProductCode});
        }
    }
}
</script>
<style scoped>
.block{
    background: #fff;
    padding: .2rem .3rem;
    margin-bottom: .2rem;
}
.product-name {
    font-size: .44rem;
    font-weight: 700;
    font-family: PingFangSC-Semibold;
    margin-bottom: .17rem;
}
  .product-desc {
    font-size: .28rem;
    color: #666;
    font-family: PingFangSC-Light;
}

.productDisplay{
    background: #fff;
    padding: .1rem .15rem;
    margin-bottom: .1rem;
}
.productDisplay img{
    width: 100%;    
}




</style>