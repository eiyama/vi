<template>
    <div class="page-container">
        <div class="freightBannner" style="margin-bottom: 1rem;">
            <div class="banner-img" :style="bannerImg">
                <img class="pingan-logo" src="../../assets/images/pingan/logo.png" alt="">
            </div>
            <div class="block">
                <p class="product-name">货运无忧</p>
                <p class="product-desc"></p>
            </div>
            <div class="m20">
                 <div class="product-title">
                        <span class="cell-title title-bold">
                            <i class="cell-title-left-icon"></i>
                            适用客户
                        </span>
                </div>
                <div class="block">
                    <div class="applicable-customers">
                        <p>本保单不承担下述货物发生的任何损失赔偿责任： （1）长度在14米以上或宽度在3.5米以上或高度在3米以上或重量在20吨以上的大件货物； （2）商品车、工艺品、艺术品、现金、有价证券、珠宝、贵金属、鲜活动植物（瓜果/蔬菜除外）以及疫苗、血液制品； （3）对运输有特殊的防震动、防倾斜、防尘要求的设备或仪器； （4）单件货物价值超过人民币200万元人民币的设备或仪器；</p>
                    </div>
                </div>
            </div>
            <div class="">
                <div class="product-title">
                    <span class="cell-title title-bold">
                        <i class="cell-title-left-icon"></i>
                        产品特色
                    </span>
                </div>
                <div class="productDisplay">
                     <img src="../../assets/images/pingan/freight_01.jpg" alt="">
                     <img src="../../assets/images/pingan/freight_02.jpg" alt="">
                     <img src="../../assets/images/pingan/freight_03.jpg" alt="">
                </div>
            </div>
            <div class="page-footer bottom-fixed">
                <div class="foot-premium">--</div>
                <div class="footer-btn" @click="toInsurance">立即投保</div>
            </div>
        </div> 

    </div>
</template>
<script>
import "./../../assets/css/pingan.scss";
import "./../../assets/js/rem.js";
export default {
    data(){
        return{
            bannerImg:{
                backgroundImage:"url("+require("@/assets/images/pingan/freight_banner.jpg")+")"
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
    methods:{
        toInsurance(){
            this.$router.push({path:'/pingan/insuranceType?ProductCode=PAIC-HK-HYWY'});
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
.applicable-customers {
    background: #fefaee;
    padding: .2rem;
    font-size: .28rem;
    line-height: .4rem;
    color: #333;
    font-family: PingFangSC-Regular;
}



</style>