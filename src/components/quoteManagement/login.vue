<template>
  <div class="login" style="background-color:#FFF;">
    <mt-header fixed class="def-header" title="" v-show="false">
      <mt-button class="mint-head-close" icon="more" @click="closePage" slot="right"><i class="ico-login ico-close"></i></mt-button>
    </mt-header>
    <div class="login-images">
      <img src="../../assets/images/login-banner.png" alt="">
    </div>
    <div class="mint-content mint-region">
      <span class="mint-login-hd">
        <!-- Hello!<br> -->
        欢迎登录{{title}}
      </span>
      <div style="margin-top:20px">
        <mt-field class="mint-formItm" :disabled="true">
          <img :src="phoneImg" style="width:20px;" >
          <input class="mint-input" v-model="login.userName" type="text" placeholder="请输入用户名">
        </mt-field>
        <mt-field class="mint-formItm" :disabled="true">
          <img :src="pswImg" style="width:20px;">
          <input class="mint-input" v-model="login.password" type="password" placeholder="请输入密码">
        </mt-field>
        <mt-button class="btn-login" type="primary" @click="subLogin" size="large">登录</mt-button>
        <div style="margin-top: 15px;" v-show="canReg" >
        <!-- <div v-show="appId == 'cxv190614111634a4f'" style="margin-top: 15px;"> -->
          <div class="fn-clear fn-clear-j">
            <p>如果还没有账号，请先注册</p>
          </div>
          <mt-button  style="margin-top: 5px;border-color:#4A66FE;color:#4A66FE;" type="primary" @click="jumpreg" size="large" plain>注册</mt-button>
        </div>
      </div>
       <!-- <van-dialog v-model="showConfirm" show-cancel-button :overlay='overlay' :close-on-click-overlay='overlay' :show-confirm-button='btn' :showCancelButton='btn'>
           <div class="btns-hao" style="margin-top:30px">
              <span @click="cancel" style="font-size:14px">取消</span>
              <mt-button type="primary" @click="confirm" size="large" style=" background: #357bfd;font-size:12px;height:30px;width:85px">确定</mt-button>
            </div>
       </van-dialog> -->
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import * as types from './../../store/types';
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
import { Dialog } from 'vant';
export default {
  name: 'login',
  data() {
    return {
      title: '',
      appId:'',
      login: {
        userName: '',
        password: '',
      },
      phoneImg: this.src = require('../../assets/images/username.png'),
      pswImg: this.src = require('../../assets/images/password.png'),
      canReg: false,
     enableLogin:true,
    }
  },
  methods: {
    //注册
    jumpreg() {
      if(this.appId == 'cx7190761141531rzi' ){
        this.$router.push({ path: "/myInfo/zxregister?appId=" + this.appId + '&showOrg=true'});
      }else{
        this.$router.push({ path: "/regUser", query: { appId: this.appId } });
      }
      
    },
    closePage: function() {
      this.$router.push({ path: "/", query: { appId: this.appId } });
    },
     getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
 async subLogin() {
      var self = this;
      if (!self.login.userName) {
        Toast('请输入用户名');
        return;
      }
      if (!self.login.password) {
        Toast('请输入密码');
        return;
      }
      localStorage.removeItem('permissions');
      localStorage.setItem('hasManage', false);
      localStorage.setItem('hasViewCars', false);
      Indicator.open('加载中...');
      var token = '';var wxappId = '';var isWeixin = ''; 
    await axiosPostAPI('/token', self.login).then((res) => {
      if(res.status == 200){
        self.$store.commit(types.LOGININFO, self.login);
        self.$store.commit(types.LOGIN, res.result.token);
        self.appId = localStorage.getItem('appId');
        localStorage.setItem('token', self.appId + '_' + res.result.token);
        token = res.result.token;
      }else{
        return
      }
        Indicator.close();
        // self.$router.push({ path: "/", query: { appId: self.appId } });
      });
         var ua = navigator.userAgent.toLowerCase();
           isWeixin = ua.indexOf('micromessenger') != -1;
            if(isWeixin  &&  token ){ //在微信环境下登录成功
              // var url = window.location.href;
              // var code = this.getUrlParam("code");
              // if(code === '' || code === null ){
                var wxUrl = window.location.href.split('#')[0];
                var url = '/Configurations?types=weixin&weixin_url=' + encodeURIComponent(wxUrl);
                await axiosGetAPI(url).then((res) => {
                    if (res.status == 200 && res.result && res.result.weixin) {
                      wxappId = res.result.weixin.appId;
                     self.enableLogin = res.result.weixin.enableLogin  || false;
                      sessionStorage.setItem("wxappId" , wxappId);
                      sessionStorage.setItem('enableLogin',self.enableLogin);
                    }
                    })
                    if(wxappId && self.enableLogin){ //enableLogin是否有微信登录功能（站点配置）
                      var isToHome = false;
                    await axiosGetAPI('Weixin').then(res=>{ //判断是否绑定微信，如果没有弹框让他是否绑定微信，如果绑定了则直接到首页
                        if(res.result){
                           var weixinInfor = {};
                          weixinInfor = JSON.stringify(res.result);
                          sessionStorage.setItem("weixinInfor" ,weixinInfor);
                          sessionStorage.setItem('hasBindWeixin',true)
                            self.$router.push({ path: "/", query: { appId: self.appId } });
                        }else{
                          sessionStorage.setItem('hasBindWeixin',false)
                          this.showConfirm = true;
                          isToHome = true;
                        }
                      })
                      if(isToHome){
                     Dialog.confirm({
                        title: '',
                        message: '是否绑定微信'
                      }).then(() => {
                        self.$router.push({ path: "/quoteManagement/transitionPage", query: { appId: self.appId } });
                      }).catch(() => {
                        // on cancel
                        self.$router.push({ path: "/", query: { appId: self.appId } });
                      });   
                      }
                    }else{
                      self.$router.push({ path: "/", query: { appId: self.appId } });
                    }
                // }
              }
              
       await axiosGetAPI('/Users/Me/Permissions').then((res) => {
          if (res.result) {
            var permissions = res.result.permissions;
            localStorage.setItem('permissions',JSON.stringify(permissions));
            if (permissions && permissions.length > 0) {
              for (var i = 0; i < permissions.length; i++) {
                if (permissions[i] == "SiteOwner") {
                  localStorage.setItem('hasManage', true);
                  localStorage.setItem('hasViewCars', true);
                  localStorage.setItem('hasLookAgencyBandCard', true);
                  localStorage.setItem('hasLookEnquiryProducts', true);
                  break;
                } else {
                  if (permissions[i] == "LookCameraCustomers" || permissions[i] == "LookCameraCars") {
                    localStorage.setItem('hasViewCars', true);
                    continue;
                  }
                  if (permissions[i] == "LookVIDataAnalysis") {
                    localStorage.setItem('hasManage', true);
                    continue;
                  }
                  if (permissions[i] == "LookAgencyBandCard") {
                    localStorage.setItem('hasLookAgencyBandCard', true);
                    continue;
                  }
                  if (permissions[i] == "LookMeEnquiryPolicy") {
                    localStorage.setItem('hasLookEnquiryProducts', true);
                    continue;
                  }
                }
              }
            }
             if(!isWeixin  || !self.enableLogin){
               if(permissions.indexOf('LookCarDealerReport') == -1 && permissions.indexOf('SiteOwner') == -1 ){
                    self.$router.push({ path: "/", query: { appId: self.appId } });
               }else{
                    self.$router.push({path:'/myInfo/statisticsShow',query: { appId: self.appId }})
               }
              //  if(self.appId == 'cx4180310190219bh6' || self.appId == 'cxa181211170855pxj'){
              //    self.$router.push({path:'/myInfo/statisticsShow',query: { appId: self.appId }})
              //  }else{
              //      self.$router.push({ path: "/", query: { appId: self.appId } });
              //  }                
              }
          }
        });
    }
  },
  created: function() {
    this.$store.commit(types.TITLE, 'Login');
    localStorage.removeItem("canReg");
    localStorage.removeItem("hasViewCars");
    localStorage.removeItem("hasManage");
    // localStorage.removeItem("token");
    this.appId = this.$route.query.appId;
    
    if (this.appId == '' || this.appId == null || this.appId == 'undefined') {
      // this.appId = this.$route.query.appId;
      this.appId = localStorage.getItem('appId');
    }
    localStorage.setItem("appId", this.appId);

    Indicator.open('加载中...');
    axiosGetAPI('/apis/apps/' + this.appId + "/H5").then((res) => {
      Indicator.close();
      this.title = res.result.name;
      sessionStorage.setItem('title', this.title);
      localStorage.setItem("appId", this.appId);
      localStorage.setItem("serviceHost", res.result.serviceHost);
      localStorage.setItem("servicePort", res.result.servicePort);
      sessionStorage.setItem("appFeatures",JSON.stringify(res.result.appFeatures));
      axiosGetAPI('/Configurations?types=salesman').then((d) => {
          if (d.status == 200 && d.result && d.result.salesman) {
            var plates = d.result.salesman.plates;
            if (plates && plates.length > 0) {
              this.canReg = true;
            } else{
              this.canReg = false;
            }
          } else{
            this.canReg = false;
          }
          localStorage.setItem("canReg", this.canReg);
        });
    });
  }
}

</script>
<style scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 10px;
  /* background: url(../../assets/images/login-banner.png); */
  /* background-size: cover; */
  /* background-repeat: no-repeat; */

}

.login .mint-content {
  /* margin-top: 150px; */
  /* padding-left: 30px;
  padding-right: 30px; */
  padding: 0px 30px;
}

.login .mint-region,
.login .mint-header.def-header,
.login .mint-region input,
.login .mint-region .mint-cell {
  background: none;
}

.login .mint-login-hd {
  font-size: 28px;
  color: #333;
  font-weight: bold;
}

.login .mint-region input {
  color: #fff;
}

.login .mint-region input::-webkit-input-placeholder {
  color: #999;
}

.login .mint-region input:-moz-placeholder {
  color: #999;
}

.login .mint-region input::-moz-placeholder {
  color: #999;
}

.login .mint-region input:-ms-input-placeholder {
  color: #999;
}

.login .mint-region .mint-cell {
  padding-left: 0;
}

.login .ico-login {
  position: relative;
  top: 5px;
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: 24px 24px;
  background-repeat: no-repeat;
}

.login .ico-login.ico-close {
  width: 30px;
  height: 30px;
  background-image: url(../../assets/images/ico-closew.png);
  background-position: center;
}

.login .mint-region .mint-formItm .mint-input {
  width: 85%;
  margin-right: 0;
  color: #333;
  font-size: 14px;
}

.login .btn-login {
  margin-top: 40px;
  background:#4A66FE;
}

.login .fn-clear-j {
  color: #888991;
  padding: 10px;
}

.login .fn-clear-j p {
  float: right;
}

.login .fn-clear-j a {
  color: #fff
}
.login-images img{
  width: 100%;
  height: 160px;
  margin-bottom: 15px;
}

</style>
