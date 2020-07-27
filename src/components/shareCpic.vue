<template>
  <div class="home"  ref="imageWrapper"  >
    <div class="shareBg">
      <div style="display: flex;justify-content: space-between;padding: 15px;  align-items: center;">
          <van-icon  v-show="showHeader" style="" name="arrow-left" color="#ffffff" size="22" @click="openBack" />
          <p  v-show="showHeader" style=" color:#ffffff" @click="toImage">分享</p>
      </div>
      <div class="qrCodeBox">
        <div class="Discreption">
            <h3>扫描二维码</h3>
            <p>即可在线报价出单</p>
        </div>       
        <div class="followBox">         
            <div ref="qrcodeContainer" style="display: none"></div>
            <div class="qr tc" ref="qrCode"></div>             
        </div>
      </div>                    
    </div>    
    <van-popup v-model="shareinsuranImg" style="width:72%;">
        <div>             
              <img style="width:100%" :src="shareImgUrl" alt="">
              <p style="text-align:center;color:#f44;height: 30px;">长按保存或分享给好友</p>
        </div>
    </van-popup>   
  </div>
</template>
<script>
import QRCode from 'qrcodejs2';
import wx from 'weixin-js-sdk';
import html2canvas from 'html2canvas';
import { Indicator } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI, axiosPutAPI } from './../common/Axios';
// import { isatty } from 'tty';
export default {
  data() {
    return {
      appId: '',
      nickName: '',
      title: '',
      shareinsuranImg:false,
      showHeader:true,
      shareImgUrl:'',
      referralCode: '',
      downloadUrl: '',
      shareUrl: '',
      isShare: false,
      userId: '',
      referrerMobile: '',
      headImageUrl: '',
      isFollow:false,
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
      qrCodeShare:''
      // zxImg:''
    }
  },
  mounted:function(){
 
  },
  watch:{
    shareinsuranImg(newValue,oldValue){
        if(newValue){
          this.showHeader = false;
        }else{
          this.showHeader = true;
        }
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
 async created() {
    var self = this;
    var domain = '';
    var currentUrl = document.location.toString();
    if (currentUrl) {
      var arrUrl = currentUrl.split("#");
      domain = arrUrl[0];
    };
    self.salesmanId = sessionStorage.getItem('salesmanId');
    this.shareUrl = domain + '#/shareCpic?appId=cxa181211170855pxj&showTabbar=false';

    this.qrCodeShare = domain + '#/?appId='+ localStorage.getItem('appId') + '&showTabbar=false' 
    self.shareLink = domain + '#/?appId='+ localStorage.getItem('appId') + '&showTabbar=false'  +"&salesmanId=" + self.salesmanId ;   
    var model = {};
    model.link = self.shareLink;
    await axiosPostAPI('/Share/Links',model).then(res=>{
        if(res.status == 200){
            self.shareLink = res.result.tokenLink;
            self.shareToken = res.result.shareToken;                                                                                                                  
        }
    })
     this.$nextTick(function() {
            this.creatQrCode();
        }) 
    // console.log('shareLink', this.shareLink); 
  },
  methods: {
    openBack: function() {
      window.history.back();
    },
  
    creatQrCode() {
      var qrcode = new QRCode(this.$refs.qrcodeContainer, {
        text: this.shareLink,
        width: 160,
        height: 160,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.Q
      });
        let canvas = document.getElementsByTagName('canvas')[0];
        let img = this.convertCanvasToImage(canvas);
        this.$refs.qrCode.append(img);       
        // console.log(this.shareLink);
    },
    toImage() {   
        this.showHeader = false   
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;       
        var self = this;        
        setTimeout(() => {          
          html2canvas(this.$refs.imageWrapper).then(canvas => {
            let dataURL = canvas.toDataURL("image/png");
            self.shareImgUrl = dataURL;
            if (self.imgUrl !== "") {
              self.shareinsuranImg = true;
            }
            // console.log(imgUrl)
          });
        },500)
      },
    // crateQrcode(){
    // let qrcode = new QRCode(this.$refs.qrcodeContainer, {
    //     text: this.qrUrl,  
    //     width: 80,  
    //     height: 80,
    //     colorDark: '#000',  
    //     colorLight: '#fff'
    // })  
    // },
    // 从 canvas 提取图片 image
    convertCanvasToImage(canvas) {  
        let image = new Image(); 
        image.src = canvas.toDataURL("image/png");  
        return image;  
    },
    cancel(){
        // this.isFollow = false;
        this.$emit('closeFollow');
        this.$refs.qrCode.innerHTML = '';  //解决重复生成多个二维码
    },
    followOverlay(){
        this.$refs.qrCode.innerHTML = '';
    },

  },
}

</script>
<style scoped >
.home{
  background-image: linear-gradient(to bottom, #ef1d1d,#e75050);
  height: 100vh; 
}
.shareBg{
  /* background: #ef1d1d; */
   height: 100vh;
  background: url('../assets/images/img_bottom@3x.png') 0 bottom no-repeat;
  background-size: 100%;
}
.followBox{ 
    margin: auto;
    width: 4rem;
    height: 4rem;
    background: #fff;
    border-radius: 10px;
    margin-top: 15px; 
}
.Discreption{
    color: #fff;    
    text-align: center;
    /* margin-top: 40%; */
}
.Discreption h3{
  font-size: 24px;
  font-weight: bold;

}
.Discreption p{
  font-size: 16px;  
}
.followBox .qr {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;   
}

.gray{
    border-top: 5px solid #eeeeee;    
}
.qrCodeBox{
  margin-top: 2.5rem;
}
</style>
