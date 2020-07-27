<template>
  <!-- <div :style="bodyBox">
    <div style="display: flex;justify-content: center;"><img style="height: 40%;width:40%" src="../../assets/images/img-joinUs.png" />
    </div>
    <div style="display: flex;justify-content: center;align-items: center;margin-top: 30px;">
      <img style="height: 42px;" :src="headImageUrl != '' ? headImageUrl : weixinImg " />
      <p style="font-size: 24px;color: #FFFFFF;margin-left: 15px;">{{nickName}}</p>
    </div>
    <div class="recommend">
      <p >我已在{{title}}入驻，这里保险展业体验真不错，你也一起加入吧~</p>
    </div>
    <div class="goReg"> 
        <span  class="joinBtn" @click="goReg">立即加入</span>
    </div>
    <div class="scanCode">
      <p v-show="iszxPage" style="padding:10px 0;color:#f44">长按识别二维码加入</p>
      <img v-show="iszxPage" style="width: 150px;height:150px;" :src="scanCode" alt="">
    </div>
    <div class="footerBox">
      <img style="width:100%" src="../../assets/images/img-txt-001.png" />
    </div>
  </div> -->
  <div class="home" style="min-height: inherit;">
    <div class="main-content">
         <div class="main">
            <h1 class='main_title'> 零成本，奖励高</h1>
            <p class="main_join">加入我的智能车团队，一起躺赢！</p>
        </div>
        <div class="content-img">
            <img src="./../../assets/images/zxInvite_c.png"  alt="">
        </div>
      <div class="tip-qr">
          <div class="content">
            <div class="headImg">
              <img  :src="headImageUrl != '' ? headImageUrl : weixinImg " />
              <!-- <p style="font-size: 24px;color: #FFFFFF;margin-left: 15px;">{{nickName}}</p> -->
            </div>
            <div class="recommend">
              <p >我已在{{title}}入驻，这里保险展业体验真不错，你也一起加入吧~</p>
            </div>
             <div class="goReg"> 
                  <span  class="joinBtn" @click="goReg">立即加入</span>
              </div>
            <!-- <div class="tip-title"><span>{{  nickName ? nickName: weixinInfor.nickname }}的名片</span></div>
            <p v-show="scanCode && userCode != undefined && userCode != 'null' " style="color:#000000;">我的邀请码：{{userCode}}</p>
            <p v-show="!scanCode && userCode != undefined && userCode != 'null'" style="color:#000000; height: 0.54rem;">我的邀请码：{{userCode}}</p>
            <div v-if="scanCode">
                <img :src="scanCode" style="height:2.14rem" alt="">
            </div>
            <div v-else class="qr-pos" id="qrcode" ref="qrcode"></div>
            <div style="display:block;" v-if="weixinInfor.headimgUrl"><img class="my-head" :src="weixinInfor.headimgUrl" alt=""></div>
            <div style="display:block;" v-else><img class="my-head" :src="headImageUrl ? headImageUrl: avatar" alt=""></div>
            <div class="tip-top"><span>使用微信扫码注册</span></div>
            <div class="tip_btn" v-show="!isShare"><span>点右上角 <van-icon name="weapp-nav" color="#fff"></van-icon>，发送给朋友</span></div>
            <div style="margin-top: 10px;font-size: 0.28rem;color: #0070D3;" v-show="isShare">
            <van-button style="color:#0070D3;font-size:12px;border:1px solid #0070D3" type="default" size="small" @click="goReg" plain>点此去注册</van-button>
            </div> -->
         </div>
      </div>
    </div>
    <div class="footer">
        <!-- <img src="../../assets/images/zxinvite_b.png" alt=""> -->
    </div>
  </div>
</template>
<script>
 import "./../../assets/css/car.scss";
import "./../../assets/js/rem.js";
  import {
    axiosGetAPI,
    axiosPostAPI
  } from './../../common/Axios';
  import {
    Indicator,
    Toast
  } from 'mint-ui';
  // import QRCode from 'qrcodejs2';
  import router from './../../router';
  // import echarts from "echarts";
  import store from './../../store/store';
  export default {
    data() {
      return {
        bodyBox: {
          'minHeight': '',
          'background': '#2965f9',
          'padding': '40px 0',
        },
        appId: '',
        nickName: '',
        title: '',
        referrerMobile: '',
        shareUrl:'',
        iszxPage:false,
        scanCode:'',
        userCode:'',
        weixinImg:this.src = require( "../../assets/images/icon-avatar.png"),
       headImageUrl:'',
      }
    },
    created: function() {
      var h = window.innerHeight;
      this.bodyBox.minHeight = h  + 'px';
       document.body.addEventListener('touchmove', function(e){
        e.preventDefault();
    }, { passive: false })
    },
    mounted() {
      this.iszxPage = this.$route.query.iszxPage;
      console.log(this.iszxPage);
      this.appId = this.$route.query.appId;
      // this.iszxPage = (this.appId == 'cx7190761141531rzi' || this.appId == 'cxa181211170855pxj');
      // if(this.iszxPage){
      //    axiosGetAPI("/Weixin/QRCode").then((res) => {
      //     if (res.status == 200 ) {
      //       this.scanCode = res.result;
      //       }
      //     })
      // }
      if(this.$route.query.headImageUrl){
        this.headImageUrl =  decodeURIComponent(this.$route.query.headImageUrl);
      }
      localStorage.setItem("appId", this.appId);
      this.nickName = decodeURIComponent(this.$route.query.nickName);
      // this.referralCode = this.$route.query.referralCode;
      this.title = decodeURIComponent(this.$route.query.title);
      // this.userId = this.$route.query.userId;
      this.referrerMobile = this.$route.query.ReferrerMobile;
      this.userCode = this.$route.query.userCode;
      // var domain =  document.location.toString().split("#")[0];
      //  this.shareUrl = domain + '#/regUser?appId=' + this.appId +
      // '&nickName=' + this.nickName +
      // // '&referralCode=' + this.referralCode +
      // '&title=' + this.title +
      // // '&UserId=' + this.userId +
      // '&ReferrerMobile=' + this.referrerMobile +
      // '&isShare=true';
       this.$nextTick(function() {
      // this.creatQrCode();
    })
    },
    methods: {
      goReg:function(){
          if(this.appId == 'cx7190761141531rzi' || this.appId == 'cxa181211170855pxj'){
               var param = '?appId=' + this.appId +'&nickName=' + this.nickName +'&title=' + this.title +
              '&ReferrerMobile=' + this.referrerMobile +'&isShare=true' + '&userCode=' + this.userCode;
              this.$router.push({ path: "/myInfo/zxregister" + param});
          }else{
              var param = '?appId=' + this.appId +'&nickName=' + this.nickName +'&title=' + this.title +
              '&ReferrerMobile=' + this.referrerMobile +'&isShare=true';
               this.$router.push({ path: "/regUser" + param});
          }
      },
    }
  }
</script>
<style scoped>
  /* .recommend {
    background: url("../../assets/images/bg-pop-dashline.png")no-repeat center;
    height: 100px;
    background-size: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .recommend p {
    width: 260px;
    color: #fcf8f0;
    font-size: 14px;
  }

  .joinBtn {
    background: #fec22c;
    color: #FFFFFF;
    margin: 30px 40px;
    text-align: center;
    padding: 10px 0;
    display: block;
    border-radius: 8px;
    font-size: 16px;
  }

  .footerBox{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 160px;
  }

  .qr-pos {
  margin-top: -10px;
  display: inline-block;
}

.scanCode{
    text-align: center;
    max-width: 250px;
    margin: auto;
    background: #f2f2f2;
    margin-top: 20px;
    border-radius: 5px;
    padding-bottom: 10px;
}
.goReg{
    max-width: 250px;
    margin: auto;
} */

.home{background: url('../../assets/images/zxInvitebg.png')no-repeat 0 0 ;background-size: 100% 100%;}
.home .main .main_title{font-size: 0.5rem;text-align: center;color: #ffffff;padding-top: 0.1rem}
.home .main .main_join{font-size:0.3rem;text-align: center;color: #ffffff;padding-top: 0.1rem;}
.main-content{margin-left:.8rem;margin-right:0.8rem}
.content-img{display: flex;justify-content: center;margin-top: 0.5rem;}
.content-img img{text-align: center;height:2.5rem}
.headImg{border-radius: 50%;border: 0.04rem solid #ffca7c; height: 1.3rem;width: 1.3rem;margin: auto;}
.headImg img{    height: 1.22rem; border-radius: 50%;}
.goReg{
    max-width: 5.1rem;
    margin:0.6rem auto;
} 
.joinBtn {
    background: #0c3484;
    color: #FFFFFF;
    text-align: center;
    display: block;
    border-radius: 0.08rem;
    font-size: 0.26rem;
    height: 0.68rem;
    line-height: 0.68rem;
  }
.recommend {
    background: url("../../assets/images/zxInvite_box.png")no-repeat center;
    height:1.3rem ;
    width: 5rem;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.15rem auto;
  }
.recommend p {
    width: 4.6rem;
    color: #0c3484;
    font-size: 0.28rem;
    margin-top: 0.3rem;
  }


.main-content{padding-top: 0.91rem}
.main-content .tip-qr {
  margin-top: -0.18rem;
  margin-bottom: 100px;
  text-align: center;
  display: block;
  height: 7rem;
  background-color:#ffca7c;
  border-radius:0.08rem;
  padding:0.16rem
}

 .content {
    background: #fff;
    border-radius: 0.08rem;
    height: 6.6rem;
    padding-top: 0.4rem; 
 }
.main-content .tip-field {
  color: #4192E8;
  letter-spacing: 0;
  height: 30px;
  line-height: 15px;
  margin-top: 10px;
}

.main-content .tip-title {
  font-size: 0.4rem;
  color: #0c3484;
  font-weight: bold;
  letter-spacing: 0;
  padding-top: 0.3rem;
}

.main-content .tip-top {
  /* margin-top: 10px; */
  font-size: 0.28rem;
  color: #000000;
  letter-spacing: 0;
  /* height: 30px; */
  /* line-height: 15px; */
  /* margin-bottom: 5px; */
}

.main-content .tip-bottom {
  margin-top: 10px;
  font-size: 20px;
  color: #032f82;
  letter-spacing: 0;
  height: 30px;
}

.main-content .my-head {
  width: 0.72rem;
  height: 0.72rem;
  background-color: #eee;
  border-radius: 50%;
  border: 1px solid #eee;
  position: absolute;
  margin-top: -100px;
  margin-left: -18px;
}

.main-content .tip-qr .qr-pos {
  display: inline-block;
}

.tip_btn{padding: 0.18rem 0.52rem; margin: 0.1rem 0.38rem; background: #0c3484;font-size: 0.30rem;color: #fff;border-radius: 0.08rem}

.footer{
    height: 2.1rem;
    position: fixed;bottom: 0;left: 0;right: 0;background: url('../../assets/images/zxinvite_b.png') no-repeat 0 0;    background-size: 100% 100%;
}
.footer img{width: 100%;position: fixed;bottom: 0;}

</style>
