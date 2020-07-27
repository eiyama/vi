<template>
  <div class="login" style="background-color:#FFF;">
    <div class="mint-content mint-region" style="margin-top:3rem">
      <span class="mint-login-hd">工单消息订阅</span>
      <div>
        <mt-field class="mint-formItm" :disabled="true">
          <img :src="phoneImg" style="width:20px;" />
          <input class="mint-input" v-model="login.userName" type="text" placeholder="请输入用户名" />
        </mt-field>
        <mt-field class="mint-formItm" :disabled="true">
          <img :src="pswImg" style="width:20px;" />
          <input class="mint-input" v-model="login.password" type="password" placeholder="请输入密码" />
        </mt-field>
        <mt-button class="btn-login" type="primary" @click="subLogin" size="large">绑定</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import store from "./../store/store";
import * as types from "./../store/types";
import { axiosGetAPI, axiosPostAPI } from "./../common/Axios";
import { Dialog } from "vant";
export default {
  // name: 'login',
  data() {
    return {
      title: "",
      appId: "",
      login: {
        userName: "",
        password: ""
      },
      phoneImg: (this.src = require("../assets/images/username.png")),
      pswImg: (this.src = require("../assets/images/password.png")),
      canReg: false,
      urlFrom: "",
      code: "",
      enableLogin: false
    };
  },
  methods: {
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
   async chechBindwx(){
      var self = this;
      var token = store.state.token || localStorage.getItem('token') || '' ;
          self.iSingleUserMode = false; 
          var ua = navigator.userAgent.toLowerCase();
          var isWeixin = ua.indexOf('micromessenger') != -1;
            if(isWeixin  && (token == '' || token == "null") ){ //在微信环境下未登录需要判断是否绑定账号
              // var url = window.location.href;
              var code = this.getUrlParam("code");
              const local = encodeURIComponent(window.location.href);
              if(code === '' || code === null ){
                var wxUrl = window.location.href.split('#')[0];
              var url = '/Configurations?types=weixin&weixin_url=' + encodeURIComponent(wxUrl);
              axiosGetAPI(url).then((res) => {
                if (res.status == 200 && res.result && res.result.weixin) {
                    var wxappId = res.result.weixin.appId;
                    var enableLogin =  res.result.weixin.enableLogin ||  false;
                    sessionStorage.setItem('enableLogin',enableLogin);
                    if(wxappId && enableLogin){
                         window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + wxappId + "&redirect_uri=" + local + "&response_type=code&scope=snsapi_base&state=yIwrleQfyqxdPHj#wechat_redirect"
                    }else{
                      // Toast('登录失效，请重新登录');
                      return
                    } 
                 }
                })
                } else{  
                  var openId = sessionStorage.getItem("openId") || '';
                    // if(!openId){
                        axiosPostAPI('/Weixin/' + code + '/Token').then(dataRes=>{//微信免登陆，如果api返回了token则实现免登陆，否则去登陆。
                            if( dataRes.status == '200' && dataRes.result.bindUser != undefined && dataRes.result.bindUser.token != undefined){ //判断是否有token即是否绑定了账号，如果绑定了则免登陆，如果未绑定则重新登录
                              Toast('您已绑定留修账号')
                              self.$router.push({path:"bindsuccess"})
                          } else{
                            return 
                          } 
                        })
                    // }
                  }
              }else{                
                   await axiosGetAPI("Weixin").then(res => {
                      //判断是否绑定微信，如果没有弹框让他是否绑定微信，如果绑定了则直接到首页
                      if (res.result) {
                          Toast('您已绑定留修账号')
                          this.$router.push({path:"bindsuccess"})           
                      } else {              
                       this.bindwx();
                      }
                    }); 
          }
    },
    async bindwx() {                
      var self = this;
      this.appId = localStorage.getItem("appId");
      this.urlFrom = this.$route.query.urlFrom;
      var token = store.state.token || localStorage.getItem(token) || "";
      var wxappId = "";
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf("micromessenger") != -1;
      if (isWeixin && token) {
        //在微信环境下登录成功
        // var url = window.location.href;
        self.code = self.getUrlParam("code");
        if (self.code == "" || self.code == null) {
          var wxUrl = window.location.href.split("#")[0];
          var url =
            "/Configurations?types=weixin&weixin_url=" +
            encodeURIComponent(wxUrl);
          var local = encodeURIComponent(window.location.href);
          await axiosGetAPI(url).then(res => {
            if (res.status == 200 && res.result && res.result.weixin) {
              wxappId = res.result.weixin.appId;
              self.enableLogin = res.result.weixin.enableLogin || false;
              if (wxappId && self.enableLogin) {
                //能获取微信配置（appid）且站点打开了免登陆；
                window.location.href =
                  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                  wxappId +
                  "&redirect_uri=" +
                  local +
                  "&response_type=code&scope=snsapi_userinfo&state=yIwrleQfyqxdPHj#wechat_redirect";
              }
            }
          });
        } else {
          var openId = sessionStorage.getItem("openId") || ""; //code只能用一次，openId能重复使用；
          if (!openId) {
            await axiosGetAPI("/Weixin/" + self.code).then(dataRes => {
              //获取openId
              if (dataRes.result.openId) {
                openId = dataRes.result.openId;
                sessionStorage.setItem("openId", openId);
              }
            });
          }
          await axiosPostAPI("/Weixin?openId=" + openId).then(res => {
            //根据openId绑定当前业务员，即微信与业务员绑定。
            if (res.status == "200") {
                this.$router.push({path:"bindsuccess"})
            }
          });
        }
      }
    },
    async subLogin() {
      var self = this;
      if (!self.login.userName) {
        Toast("请输入用户名");
        return;
      }
      if (!self.login.password) {
        Toast("请输入密码");
        return;
      }
      Indicator.open("加载中...");
      var token = "";
      var wxappId = "";
      var isWeixin = "";
      await axiosPostAPI("/token", self.login).then(res => {
        if (res.status == 200) {
          self.$store.commit(types.LOGININFO, self.login);
          self.$store.commit(types.LOGIN, res.result.token);
          self.appId = localStorage.getItem("appId");
          localStorage.setItem("token", self.appId + "_" + res.result.token);
          token = res.result.token;
        } else {
          return;
        }
        Indicator.close();
        // self.$router.push({ path: "/", query: { appId: self.appId } });
      });
      var ua = navigator.userAgent.toLowerCase();
      isWeixin = ua.indexOf("micromessenger") != -1;
      if (isWeixin && token) {
        //在微信环境下登录成功
        // var url = window.location.href;
        // var code = this.getUrlParam("code");
        // if(code === '' || code === null ){
        var wxUrl = window.location.href.split("#")[0];
        var url = "/Configurations?types=weixin&weixin_url=" +  encodeURIComponent(wxUrl);
        await axiosGetAPI(url).then(res => {
          if (res.status == 200 && res.result && res.result.weixin) {
            wxappId = res.result.weixin.appId;
            self.enableLogin = res.result.weixin.enableLogin || false;            
          }
        });
        if (wxappId && self.enableLogin) {
          //enableLogin是否有微信登录功能（站点配置）         
          await axiosGetAPI("Weixin").then(res => {
            //判断是否绑定微信，如果没有弹框让他是否绑定微信，如果绑定了则直接到首页
            if (res.result) {
                Toast('您已绑定留修账号')
                this.$router.push({path:"bindsuccess"})           
            } else {              
              Dialog.confirm({
              title: "",
              message: "是否绑定微信"
            })
              .then(() => {
                     var wxUrl =  window.location.protocol + '//' + window.location.host;
                      var url = "/Configurations?types=weixin&weixin_url=" + encodeURIComponent(wxUrl);                     
                      var local = encodeURIComponent(window.location.href);
                       axiosGetAPI(url).then(res => {
                        if (res.status == 200 && res.result && res.result.weixin) {
                          wxappId = res.result.weixin.appId;
                          self.enableLogin = res.result.weixin.enableLogin || false;
                          if (wxappId && self.enableLogin) {
                            //能获取微信配置（appid）且站点打开了免登陆；
                            window.location.href =
                              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                              wxappId +
                              "&redirect_uri=" +
                              local +
                              "&response_type=code&scope=snsapi_userinfo&state=yIwrleQfyqxdPHj#wechat_redirect";
                          }
                        }
                      });
              })
              .catch(() => {
                // on cancel
              });
            }
          });          
        } 
      }

    }
  },
  created: function() {

    this.$store.commit(types.TITLE, "Login");
    // localStorage.removeItem("token");
    localStorage.removeItem("hasViewCars");
    localStorage.removeItem("hasManage");
    // localStorage.removeItem("token");
    this.appId = this.$route.query.appId;
    if (this.appId == "" || this.appId == null || this.appId == "undefined") {
      // this.appId = this.$route.query.appId;
      this.appId = localStorage.getItem("appId");
    }
    localStorage.setItem("appId", this.appId);
    Indicator.open("加载中...");
    axiosGetAPI("/apis/apps/" + this.appId + "/H5").then(res => {
      Indicator.close();
      this.title = res.result.name;
      sessionStorage.setItem("title", this.title);
      localStorage.setItem("appId", this.appId);
      localStorage.setItem("serviceHost", res.result.serviceHost);
      localStorage.setItem("servicePort", res.result.servicePort);
      sessionStorage.setItem(
        "appFeatures",
        JSON.stringify(res.result.appFeatures)
      );
      axiosGetAPI("/Configurations?types=salesman").then(d => {
        if (d.status == 200 && d.result && d.result.salesman) {
          var plates = d.result.salesman.plates;
          if (plates && plates.length > 0) {
            this.canReg = true;
          } else {
            this.canReg = false;
          }
        } else {
          this.canReg = false;
        }
        localStorage.setItem("canReg", this.canReg);
      });
    });
    this.chechBindwx();
     document.title = '工单消息订阅'
  }
};
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
  background-image: url(../assets/images/ico-closew.png);
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
  background: #4a66fe;
}

.login .fn-clear-j {
  color: #888991;
  padding: 10px;
}

.login .fn-clear-j p {
  float: right;
}

.login .fn-clear-j a {
  color: #fff;
}
.login-images img {
  width: 100%;
  height: 160px;
  margin-bottom: 15px;
}
</style>
