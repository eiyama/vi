import Vue from 'vue';
import wx from 'weixin-js-sdk';
import { axiosGetAPI } from './../../common/Axios';
//微信分享
const wxShare = (obj, callback) => {
  if (obj) {
    var title = obj.title == undefined || obj.title == null ? '' : obj.title;
    var link = obj.link == undefined || obj.link == null ? window.location.href : obj.link;
    var desc = obj.desc == undefined || obj.desc == null ? '' : obj.desc;
    var imgUrl = obj.imgUrl == undefined || obj.imgUrl == null ? '' : obj.imgUrl;
    var debug = obj.debug == true ? true : false;
  } else {
    // alert('请传分享参数');
  }
  //微信分享
  var wxUrl = window.location.href.split('#')[0];
  var url = '/Configurations?types=weixin&weixin_url=' + encodeURIComponent(wxUrl);
   Indicator.open('加载中...');
  axiosGetAPI(url).then((res) => {
     Indicator.close();
    if (res.status == 200 && res.result && res.result.weixin) {
      var weixin = res.result.weixin;
      wx.config({
        debug: false, // 开启调试模式,
        appId: weixin.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
        timestamp: weixin.timestamp, // 必填，生成签名的时间戳
        nonceStr: weixin.nonceStr, // 必填，生成签名的随机串
        signature: weixin.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'updateAppMessageShareData', 'updateTimelineShareData','closeWindow'] 
      });      
 
      wx.ready(function() {
        //分享到朋友圈
        wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: link, // 分享链接
          desc: desc, // 分享描述
          imgUrl: imgUrl, // 分享图标
          success: function() {
            callback && callback();
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        //分享到朋友
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl: imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 用户确认分享后执行的回调函数
            callback && callback();
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });       
 
      })
    }
  });
 
}

export {
  wxShare
}
 