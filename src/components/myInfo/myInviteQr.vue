<template>
  <div class="home" style="background-color:RGB(9,52,131);min-height: inherit;">
    <mt-header fixed title="我的二维码名片" style="background-color:RGB(9,52,131)">
      <div slot="left" v-show='!isShare'>
        <mt-button icon="back" @click="openBack"></mt-button>
      </div>
      <!-- <div slot="right" v-show="isAndroid || isiOS" @click="shareAction">
          <p style="color:#fff;font-size:14px;">分享</p>
      </div> -->
    </mt-header>
    <div class="mint-content" style="margin-left:30px;margin-right:30px">
      <div class="tip-qr" style="background-color:#FFF;border-radius:8px;padding:30px">
        <div class="tip-title"><span>{{  nickName ? nickName: weixinInfor.nickname }}的名片</span></div>
        <p v-show="scanCode && userCode != undefined && userCode != 'null' " style="color:#d00000;">我的邀请码：{{userCode}}</p>
        <p v-show="!scanCode && userCode != undefined && userCode != 'null'" style="color:#d00000; height: 27px;">我的邀请码：{{userCode}}</p>
        <div v-if="scanCode">
            <img :src="scanCode" style="height:160px" alt="">
        </div>
        <div v-else class="qr-pos" id="qrcode" ref="qrcode"></div>
         <div style="display:block;" v-if="weixinInfor.headimgUrl"><img class="my-head" :src="weixinInfor.headimgUrl" alt=""></div>
        <div style="display:block;" v-else><img class="my-head" :src="headImageUrl ? headImageUrl: avatar" alt=""></div>
         <div class="tip-top"><span>使用微信扫码注册</span></div>
        <div class="tip-bottom"><span>加入我的团队，带你飞</span></div>
        <div style="margin-top: 10px;font-size: 14px;color: rgb(208, 0, 0);" v-show="!isShare"><span>点右上角 <van-icon name="weapp-nav" color="#000"></van-icon>，发送给朋友</span></div>
        <div style="margin-top: 10px;font-size: 14px;color: #0070D3;" v-show="isShare">
          <van-button style="color:#0070D3;font-size:12px;border:1px solid #0070D3" type="default" size="small" @click="goReg" plain>点此去注册</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2';
import wx from 'weixin-js-sdk';
import { Indicator } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI, axiosPutAPI } from './../../common/Axios';
import { isatty } from 'tty';
export default {
  data() {
    return {
      appId: '',
      nickName: '',
      title: '',
      referralCode: '',
      downloadUrl: '',
      shareUrl: '',
      isShare: false,
      userId: '',
      referrerMobile: '',
      headImageUrl: '',
      avatar: this.src = require('../../assets/images/img-avatar.png'),
      zxImg:this.src = require('../../../static/imgs/zxlogo.png'),
      isWeixin: false,
      weixin: {},
      shareLink:'',
      weixinInfor:{},
      userCode:'',
      scanCode:'',
      headimgUrl:'',
      isAndroid:false,
      isiOS:false,
      sharewx:[],
      shareData:[],
      // zxImg:''
    }
  },
  mounted:function(){
    var self = this;
    this.appId = this.$route.query.appId;
    self.redirectUri = window.location.href;
    var ua = navigator.userAgent.toLowerCase();
    self.isWeixin = ua.indexOf('micromessenger') != -1;
    if (self.isWeixin) {
      var wxUrl = window.location.href.split('#')[0];
      var url = '/Configurations?types=weixin&weixin_url=' + encodeURIComponent(wxUrl);
      axiosGetAPI(url).then((res) => {
        if (res.status == 200 && res.result && res.result.weixin) {
          self.weixin = res.result.weixin;
          wx.config({
            debug: false, // 开启调试模式,
            appId: self.weixin.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: self.weixin.timestamp, // 必填，生成签名的时间戳
            nonceStr: self.weixin.nonceStr, // 必填，生成签名的随机串
            signature: self.weixin.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'updateAppMessageShareData', 'updateTimelineShareData','closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          var shareImg = self.headImageUrl ? self.headImageUrl : self.avatar;
          if(this.appId == 'cx7190761141531rzi' || this.appId == 'cxa181211170855pxj'){
            // self.title = this.zxImg;
            shareImg = self.headimgUrl ||  "https://bjzxbx.bandins.com/zxhome/img/zxlogo.png";
          }
          // console.log('shareLink', self.shareLink);
          self.initWx(self.title, self.nickName, shareImg, self.shareLink);
        }
      });
    }else{
      
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!window.localStorage.getItem('isReload')) {
        window.localStorage.setItem('isReload', window.location.href)
        // 微信分享需要重新设置URL
        window.location.href = window.location.href
      }
    })
  },
  created() {
   if(sessionStorage.getItem("weixinInfor") ){
      this.weixinInfor = JSON.parse(sessionStorage.getItem("weixinInfor"));
      this.headimgUrl = this.weixinInfor.headimgUrl
    } 
    this.userCode = sessionStorage.getItem('userCode') || this.$route.query.userCode || '';
    var headImg = sessionStorage.getItem('headImageUrl');
    if (headImg != '' && headImg != null && headImg != 'undefined') {
      this.headImageUrl = headImg;
    }
    this.isShare = this.$route.query.isShare;
    if (this.isShare == 'undefined') {
      this.isShare = false;
    }
    this.appId = this.$route.query.appId;
    localStorage.setItem("appId", this.appId);
    this.nickName = this.$route.query.nickName || this.weixinInfor.nickname ;
    // this.referralCode = this.$route.query.referralCode;
    this.title = this.$route.query.title;
    // this.userId = this.$route.query.userId;
    this.referrerMobile = this.$route.query.referrerMobile;
    document.title = '[' + this.title + '] ' + this.nickName + "的名片";
    var domain = '';
    var currentUrl = document.location.toString();
    if (currentUrl) {
      var arrUrl = currentUrl.split("#");
      domain = arrUrl[0];
    };
    if (this.referrerMobile == 'undefined') {
      this.referrerMobile = '';
    };
    this.shareUrl = domain + '#/regUser?appId=' + this.appId +
      '&nickName=' + this.nickName +
      // '&referralCode=' + this.referralCode +
      '&title=' + this.title +
      // '&UserId=' + this.userId +
      '&ReferrerMobile=' + this.referrerMobile +
      '&isShare=true';
    // + '&downloadUrl=' + this.downloadUrl;
    this.shareLink = domain + '#/salesman/invitation?appId=' + this.appId +
      '&nickName=' + encodeURIComponent(this.nickName) +
      // '&referralCode=' + this.referralCode +
      '&title=' + encodeURIComponent(this.title) +
      // '&UserId=' + this.userId +
      '&ReferrerMobile=' + this.referrerMobile +
      '&isShare=true';
      // this.zxImg = domain + ''
      if(this.appId == 'cx7190761141531rzi' || this.appId == 'cxa181211170855pxj'){
        // var self = this;
        // Indicator.open('请稍等...');
        //  axiosGetAPI("/Weixin/QRCode?userCode=" + this.userCode).then((res) => {
        //    Indicator.close();
        //   if (res.status == 200 ) {
        //     self.scanCode = res.result;
        //     }
        //   });
          this.shareLink = domain + '#/salesman/invitation?appId=' + this.appId +
        '&nickName=' + encodeURIComponent(this.nickName) + '&title=' + encodeURIComponent(this.title) +
        '&ReferrerMobile=' + this.referrerMobile +
        '&isShare=true' + "&userCode=" + this.userCode + "&iszxPage=true"; 
        if(this.headimgUrl){
          this.shareLink = this.shareLink + '&headImageUrl='+ encodeURIComponent(this.headimgUrl);
        }   
         this.shareUrl = this.shareLink;
         console.log(this.headimgUrl)
        // console.log(this.shareUrl);
      }
    // console.log('shareLink', this.shareLink);
    this.$nextTick(function() {
      this.creatQrCode();
    })
  },
  methods: {
  
       shareAction( ex) {  
        alert("分享操作：");  
        var  s = this.sharewx;
        if (!s) {  
            alert("无效的分享服务！");  
            return;  
        }  
        if (s.authenticated) {  
            alert("---已授权---");  
            this.shareMessage(this.sharewx, ex);  
        } else {  
            alert("---未授权---");  
            s.authorize(function() {  
                this.shareMessage(this.sharewx, ex);  
            }, function(e) {  
                alert("认证授权失败：" + e.code + " - " + e.message);  
            });  
        }           
    },
     shareMessage(s,ex){ 
        var domain = '';
        var currentUrl = document.location.toString();
        if (currentUrl) {
          var arrUrl = currentUrl.split("#");
          domain = arrUrl[0];
        };           
          let msg = {
        　　　　type: 'web',　　//分享的内容的类型 
        　　　　title: '爱保云服分享',
        　　　　content: '测试分享，爱保云服',
        　　　　thumbs: ['http://img-cdn-qiniu.dcloud.net.cn/icon3.png'],
        　　　　href:  domain + '#/?appId=' + this.appId,
        　　　　extra:{scene:"WXSceneSession"} // 'WXSceneSession'分享给好友，'WXSceneTimeline'分享到朋友圈
        　　}
          this.sharewx.send( msg, function(){  
              alert( "分享到\""+s.description+"\"成功！ " );  
          }, function(e){  
              alert( "分享到\""+s.description+"\"失败: "+e.code+" - "+e.message );  
          } );  
    },
    goReg:function(){
      var param = '?appId=' + this.appId +'&nickName=' + this.nickName +'&title=' + this.title +
      '&ReferrerMobile=' + this.referrerMobile +'&isShare=true';
      this.$router.push({ path: "/regUser" + param});
    },
    openBack: function() {
      window.history.back();
    },
    creatQrCode() {
      var qrcode = new QRCode('qrcode', {
        text: this.shareUrl,
        width: 160,
        height: 160,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      })
    },
    initWx: function(title, name, shareImg, shareLink) {
      // var shareImg = shareImg;
      // console.log(shareImg)
      wx.ready(function() { //通过ready接口处理成功验证
        // config信息验证成功后会执行ready方法
        // var shareLink = this.redirectUri;
        // if (this.redirectUri.indexOf("&share=true") < 0) {
        //     shareLink = this.redirectUri+"&share=true";
        // };
        // console.log('link', shareLink);
        // var href = window.location.href;
        // var linkUrl = href;
        if (shareLink.indexOf("&isShare=true") < 0) {
          shareLink = shareLink + "&isShare=true"
        };
        var pTitle = name + '邀您加入' + title;
        // console.log('linkUrl', shareLink);
        wx.updateAppMessageShareData({ // 分享给朋友  ,在config里面填写需要使用的JS接口列表，然后这个方法才可以用 
          title: pTitle, // 分享标题
          desc: '--来自' + name + '的邀请, 快来加入我的团队，让我带你飞', // 分享描述
          link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImg, // 分享图标
          success: function() {
            // 设置成功
          }
        });
        wx.updateTimelineShareData({ //分享朋友圈
          title: pTitle, // 分享标题
          desc: '--来自' + name + '的邀请, 快来加入我的团队，让我带你飞', // 分享描述
          link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImg, // 分享图标
          success: function() {
            // 设置成功
          }
        });
      });
      wx.error(function(res) { //通过error接口处理失败验证
        // config信息验证失败会执行error函数
        console.log(res);
      });
    },
  },
}

</script>
<style >
.mint-content .tip-qr {
  margin-top: 60px;
  margin-bottom: 100px;
  text-align: center;
  display: block;
}

.mint-content .tip-field {
  font-size: 14px;
  color: #4192E8;
  letter-spacing: 0;
  height: 30px;
  line-height: 15px;
  margin-top: 10px;
}

.mint-content .tip-title {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  letter-spacing: 0;
  /* height: 30px;
  line-height: 15px; */
}

.mint-content .tip-top {
  /* margin-top: 10px; */
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  /* height: 30px; */
  /* line-height: 15px; */
  /* margin-bottom: 5px; */
}

.mint-content .tip-bottom {
  margin-top: 10px;
  font-size: 20px;
  color: #032f82;
  letter-spacing: 0;
  height: 30px;
}

.mint-content .my-head {
  width: 36px;
  height: 36px;
  background-color: #eee;
  border-radius: 50%;
  border: 1px solid #eee;
  position: absolute;
  margin-top: -109px;
  margin-left: -18px;
}

.mint-content .tip-qr .qr-pos {
  /* margin-top: -10px; */
  display: inline-block;
}

</style>
