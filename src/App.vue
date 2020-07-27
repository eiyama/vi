<template>
  <div id="app" :style="Iswidth">
    <div :style="wrppera" id="container" class="container-content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wrppera: {
        "width": "100%",
        "minHeight": "650px",
      },
      Iswidth: {
        "width": "100%",
        "position": "relative",
        "margin": "",
        "maxHeight": "100%"
      }
    }
  },
  created() {

  },
  mounted() {
    var h = window.innerHeight;
    this.wrppera.minHeight = '100vh';
    this.browserRedirect();
    if(~navigator.userAgent.indexOf('Html5Plus')){
        if (window.plus) {
          this.plusReady()
        } else {
          document.addEventListener('plusready', this.plusReady, false) 
      }
    }
  
  },
  methods: {    
      plusReady () {
        // var ws = plus.webview.currentWebview(); //pw回车可输出plus.webview
        console.log("hello plus");
      },
    browserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      // console.log(sUserAgent);
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        this.Iswidth.width = '100%'
      } else {
        // this.Iswidth.width = '420px';
        // this.Iswidth.margin = "auto";
        // this.Iswidth.maxHeight = "830px";
      }
    }

  }
}

</script>
<style>
#container {
  background: #f2f2f2;
}

.mint-header-title {
  font-size: 18px;
  font-weight: 600;
}

.mint-header.def-header {
  border-bottom: 0.5px solid #eeeeee;
  height: 50px;
}

</style>
