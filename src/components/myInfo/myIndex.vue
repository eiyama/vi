<template>
  <div class="home">
    <!-- <mt-header fixed class="def-header cust-head" title="我的" v-show="false"></mt-header> -->
    <div class="mt-my-list">
      <div class="head-area fn-clear" >
        <div>
           <!-- 条件1？值1:条件2？值:值3 -->
          <img class="ico-head" :src="avatar" alt=""  @click="uploadHeadImg">
          <input type="file" accept="image/*" @change="handleFile" class="hiddenInput" />
        </div>
        <div class="head-info" @click="modify" >
          <div style="display:flex;">
            <h2>{{nickName ? nickName : weixinInfor.nickname   ? weixinInfor.nickname : accountName  }}</h2> 
             <div style="position: absolute; right: 0px;">
               <div class="weixinIconBox"  v-if="hasBindWeixin" v-show="enableLogin" >
                 <img :src="weixinImg" style="" alt="">
               </div>
                <div class="weixinIconBox" style="opacity: 0.3;" v-show="enableLogin"  v-else>
                  <img  :src="weixinImg"  alt="">
                </div>
                <div @click.stop="toZxcertification" v-show="authStatus == 'UnAuth' && isEnabledAuth && isZxbtn && hasCertification" class="head-RightBtn">
                     <p style="margin-right:5px;">未实名认证</p> 
                     <van-icon name="arrow" />
                </div>
                <div  @click.stop="toZxcertification" v-show="(authStatus == 'Pending' || authStatus == 'PassAuth') && isEnabledAuth && isZxbtn && hasCertification" class="head-RightBtn">
                  <p style="margin-right:5px;"> {{authStatusDisplay}}</p>
                  <van-icon name="arrow" />
                </div>
             </div>
          </div>
          <img :src="rightImg" style="position: absolute;left:90%;width:15px;height:15px;opacity: 0.4;">
          <p style="color:#E5E5E5" v-show="userName">{{userName}}</p>
          <p style="color:#E5E5E5" v-show="sellerName">{{sellerName}} - {{sellerDeptName}}</p>
        </div>
      </div>
      <div style="position: relative;top:-20px;width:100%">
        <!-- <div> -->
        <div class="parentWrap">
          <div class="parent" style="background-color: white;border-radius:8px 8px 0px 0px;margin-left:10px;margin-right:10px;margin-top:10px">
            <div class="myChild" @click="goPay">
              <img :src="payImg" style="width:30px">
            </div>
            <div class="myChild" @click="goQoate">
              <img :src="xubaoImg" style="width:30px">
            </div>
            <div class="myChild" @click="goTrack">
              <img :src="genjinImg" style="width:30px">
            </div>
          </div>
          <div class="parent" style="background-color: white;text-align:center;color:#505050;border-radius:0px 0px 8px 8px;margin-left:10px;margin-right:10px">
            <div class="myChild1">
              <P>待支付订单</P>
            </div>
            <div class="myChild1">
              <P>待续保客户</P>
            </div>
            <div class="myChild1">
              <P>待跟进客户</P>
            </div>
          </div>
        </div>
        <div class="parentWrap" v-show="false">
          <div class="parent" style="background-color: white;border-radius:8px 8px 0px 0px;margin-left:10px;margin-right:10px;margin-top:10px;padding-left:10px">
            <P style="color:#333;font-weight:bold;font-size:18px;padding-top:15px">今日业绩</P>
            <div class="myChild3">
              <P style="color:#999;">报价量</P>
            </div>
            <div class="myChild3">
              <P style="color:#999;">出单量</P>
            </div>
            <div class="myChild3">
              <P style="color:#999;">出单保费</P>
            </div>
          </div>
          <div class="parent" style="background-color: white;text-align:center;color:#505050;border-radius:0px 0px 8px 8px;margin-left:10px;margin-right:10px;padding-left:15px">
            <div class="myChild3">
              <P style="color:#333;font-weight:bold;font-size:18px">0</P>
            </div>
            <div class="myChild3">
              <P style="color:#333;font-weight:bold;font-size:18px">0</P>
            </div>
            <div class="myChild3">
              <P style="color:#333;font-weight:bold;font-size:18px">¥0.00</P>
            </div>
          </div>
        </div>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end" v-show="canReg == 'true'" >
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="qrImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="myQr">我的邀请二维码</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="myQr">
          </van-col>
        </van-row>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end" v-show="canReg == 'true'">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="teamImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="viewFriends">我的团队</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="viewFriends">
          </van-col>
        </van-row>

        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end" v-show="viewMyIncomes">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="incomeImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="toincome">我的收入</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="toincome">
          </van-col>
        </van-row>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end" v-show="viewMyPerformance">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="performanceImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="toPerformance">我的业绩</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="toPerformance">
          </van-col>
        </van-row>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end" v-show="hasLookAgencyBandCard == 'true'">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="cardImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="toMycard">我的银行卡</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="toMycard">
          </van-col>
        </van-row>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end"  v-show="hasEnquiryProducts">
          <!-- v-showAppFeatures="['ManualEnquiry']" -->
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img src="../../assets/images/inquiryRecord.png" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="toInquiryDetail">询价记录</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="toInquiryDetail">
          </van-col>
        </van-row>

        <van-row v-show="hasManage=='true'" style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img src="../../assets/images/data_icon.png" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="dataAnalyze">车险数据看板</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="dataAnalyze">
          </van-col>
        </van-row>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="policyImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="myPolicy">我的保单</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="myPolicy">
          </van-col>
        </van-row>
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img src="../../assets/images/kown_icon.png" style="width:20px;">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="viewInsurance">车险小知识</p>
            <!-- <p style="color:#999;font-size:10px;margin-bottom;5px" >机动车综合商业保险示范条款共包括4主险和11条附加险。
                主险包括四个独立险：车损险、三者责任险、车上人员责任险、盗抢险</p> -->
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="viewInsurance">
          </van-col>
        </van-row>
        <!-- <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img src="../../assets/images/phone_icon.png" style="width:18px;height:18px;">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="reportCase">保险公司报案电话</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="reportCase">
          </van-col>
        </van-row> -->
        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="fqaImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="viewFQA">常见问题</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="viewFQA">
          </van-col>
        </van-row>
        <!-- 车商数据看板 -->
        <!-- <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px;" type="flex"  justify="end">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="statisticsImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="toStatistics">统计看板</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="toStatistics">
          </van-col>
        </van-row> -->

        <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end"
        v-show="canViewRB">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="piccRecordImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="torecordItem">人保投保记录</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="torecordItem">
          </van-col>
        </van-row> 

        <!-- <van-row style="margin:10px;background-color:#FFF;border-radius:8px;padding-left:5px" type="flex" justify="end"
        v-show="canViewRB">
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="piccRecordImg" style="width:20px">
          </van-col>
          <van-col span="24">
            <p style="line-height:50px;color:#333;font-weight:bold" @click="toOperationControlFrom">续保运营管控表</p>
          </van-col>
          <van-col span="2" style="display:flex;justify-content: center;align-items: center">
            <img :src="defaultImg" style="width:24px;height:24px;" @click="toOperationControlFrom">
          </van-col>
        </van-row> -->
      </div>
    </div>
    <div class="container-bottom">
      <bottomTab ref="bottomTab" :plant.sync="plante" ></bottomTab>
    </div>
  </div>
</template>
<script>
// import { Toast } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI, axiosPutAPI } from './../../common/Axios';
import { Indicator,Toast } from 'mint-ui';
import bottomTab from './../bottomtab/bottom-tab'
import store from './../../store/store'
import * as types from './../../store/types';
import { dialog } from 'vant';
import axios from 'axios';
import shareApp from './../common/shareApp'
export default {
  // name: 'home',
  data() {
    return {
      plante: 'myInfo',
      title: '我的',
      accountName: '',
      sellerName: '',
      userName: '',
      sellerDeptName: '',
      userId: '',
      isSalesMan: false,
      avatar: this.src = require('../../assets/images/img-avatar.png'),
      payImg: this.src = require('../../assets/images/icon-4pay.png'),
      xubaoImg: this.src = require('../../assets/images/icon-customer-xubao.png'),
      genjinImg: this.src = require('../../assets/images/icon-customer-genjin.png'),
      defaultImg: this.src = require('../../assets/images/right.png'),
      fqaImg: this.src = require('../../assets/images/icon-questions.png'),      
      statisticsImg:this.src = require('../../assets/images/statistics.png'),
      rightImg: this.src = require('../../assets/images/w-right.png'),
      policyImg: this.src = require('../../assets/images/ic-policy.png'),
      piccRecordImg: this.src = require('../../assets/images/ic-picc-record.png'),
      incomeImg: this.src = require('../../assets/images/performance.png'),
      performanceImg: this.src = require('../../assets/images/yeji.png'),
      cardImg: this.src = require('../../assets/images/card.png'),
      qrImg: this.src = require('../../assets/images/ico-code.png'),
      teamImg: this.src = require('../../assets/images/ic-team.png'),
      hasweixinImg:this.src = require('../../assets/images/icon-hasweixin.png'),
      weixinImg:this.src = require('../../assets/images/icon-weixin.png'),
      headImageUrl: '',
      hasManage: '',
      referrerMobile: '',
      viewMyIncomes: false,
      viewMyPerformance: false,
      canReg: false,
      hasLookAgencyBandCard:false,
      hasLookEnquiryProducts:false,
      hasEnquiryProducts:false,
      canViewRB:false,
      hasBindWeixin:false,
      enableLogin:false,
      weixinInfor:{},
      isEnabledAuth:false,
      authStatus:'',
      authStatusDisplay:'',
      authRemark:'',
      isZxbtn:false,
      salesmanId:'',
      nickName:'',
      nickname:'',
      hasCertification:true,
    }
  },
  components: {
    bottomTab,
    
  },
  async created() {
    // this.initHeight();
    if(sessionStorage.getItem('hasCertification')){
        this.hasCertification = sessionStorage.getItem('hasCertification');
    }
    var appId = store.state.appId;
    this.canViewRB = (appId == 'cxv190614111634a4f' || appId == 'cxa181211170855pxj');
    this.hasEnquiryProducts = (appId == 'cx7190761141531rzi' || appId == 'cxa181211170855pxj' ||  appId == 'cx8190110143618pyi' || appId == 'cxs190103104249iwe' || appId == 'cx7190408201251bh0' || appId =='cx220t020161609ck9' || appId =='cxx200304225758hjm' );
    this.isZxbtn = (appId == 'cx7190761141531rzi' || appId == 'cxa181211170855pxj');
    var loginInfo = store.state.loginInfo;
    var localToken = localStorage.getItem('token');
    this.hasManage = localStorage.getItem('hasManage')
    this.canReg = localStorage.getItem("canReg");
    this.hasLookEnquiryProducts = localStorage.getItem('hasLookEnquiryProducts')
    this.hasLookAgencyBandCard = localStorage.getItem("hasLookAgencyBandCard");
    // console.log(this.hasManage)
    if (localToken) {
      localToken = localToken.replace(localStorage.getItem('appId') + '_', '');
    }
    var param = {
      token: localToken
    }
    var me = this;

    var headImg = sessionStorage.getItem('headImageUrl');
    if (headImg != '' && headImg != null && headImg != 'undefined') {
      me.headImageUrl = headImg;
    }
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf('micromessenger') != -1;
    if(isWeixin){
       var wxUrl = window.location.href.split('#')[0];
       var url = '/Configurations?types=weixin&weixin_url=' + encodeURIComponent(wxUrl);
       await axiosGetAPI(url).then((res) => {
        if (res.status == 200 && res.result && res.result.weixin) {
            me.enableLogin = res.result.weixin.enableLogin ||  false; 
            if(me.enableLogin){
                axiosGetAPI('/Weixin').then(res=>{ //判断是否绑定微信，如果没有弹框让他是否绑定微信，如果绑定了则直接到首页
                    if(res.result){
                      var weixinInfor = {};
                      me.weixinInfor =  res.result
                      weixinInfor = JSON.stringify(res.result);
                      sessionStorage.setItem("weixinInfor" ,weixinInfor);
                      me.hasBindWeixin = true;
                      }else{
                      me.hasBindWeixin = false;
                      }
                  })
                }
            } 
          })
       }
    Indicator.open('加载中...');
  await axiosGetAPI('/Users/Me').then((res) => {
      me.userName = res.result.accountName;
      me.accountName = res.result.sellerName || res.result.accountName;
      me.sellerName = res.result.sellerOrgName;
      me.sellerDeptName = res.result.sellerDeptName;
      me.userId = res.result.userId;
      sessionStorage.setItem('userIds', res.result.userId);
      sessionStorage.setItem('accountName', res.result.accountName);
      sessionStorage.setItem('sellerOrgCode', res.result.sellerOrgCode);
      sessionStorage.setItem('sellerDeptCode', res.result.sellerDeptCode);
      sessionStorage.setItem('sellerOrgName', res.result.sellerOrgName);
      sessionStorage.setItem('sellerDeptName', res.result.sellerDeptName);
      sessionStorage.setItem('sellerName', res.result.sellerName);
      if (me.userId) {
        var root = process.env.API_ROOT
        axios({
            method: 'GET',
            url: '/Users/' + me.userId + '/Salesman',
            data: null,
            params: null,
            baseURL: root,
            withCredentials: false
          })
          .then(function(res) {
            Indicator.close();
            if (res.data.status == 200) {
              if (res.data.result) {
                me.isEnabledAuth = res.data.result.isEnabledAuth;
                me.authStatus = res.data.result.authStatus;
                me.authStatusDisplay = res.data.result.authStatusDisplay;
                me.authRemark = res.data.result.authRemark;
                me.nickName = res.data.result.name;
              
                me.sellerName = res.data.result.organName;
                me.sellerDeptName = res.data.result.deptName;
                me.referrerMobile = res.data.result.mobile;
             
                sessionStorage.setItem("authStatus", res.data.result.authStatus);
                sessionStorage.setItem("isEnabledAuth", res.data.result.isEnabledAuth);
                sessionStorage.setItem("nickName", res.data.result.name);
                sessionStorage.setItem('userCode', res.data.result.userCode );
                sessionStorage.setItem('referrerMobile', res.data.result.mobile);
                sessionStorage.setItem("headImageUrl", res.data.result.headImageUrl);
                // me.certification ='在职';
                me.headImageUrl = res.data.result.headImageUrl;

                var salesmanId = res.data.result.id;
                if (salesmanId > 0) {
                  sessionStorage.setItem('salesmanId', salesmanId);
                  //GET /Salesmans/{salesmanId}/Modules
                  axiosGetAPI('/Salesmans/' + salesmanId + '/Modules').then((res) => {
                    if (res.result) {
                      if (res.result.isCarCommission || res.result.isLifeCommission || res.result.isRemmendBonu) {
                        me.viewMyIncomes = true;
                        me.viewMyPerformance = true;
                      }
                      sessionStorage.setItem("canViewCarCommission", res.result.isCarCommission);
                      sessionStorage.setItem('canViewLifeCommission', res.result.isLifeCommission);
                      sessionStorage.setItem('canViewRemmendBonu', res.result.isRemmendBonu);
                    }
                  });
                };
              }
            }
          }, err => {
            Toast('请求超时，请刷新页面重试！');
            reject(err)
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    });
   this.avatar = this.weixinInfor.headimgUrl ? this.weixinInfor.headimgUrl : this.headImageUrl ? this.headImageUrl : this.avatar;
  },
  methods: {
     toZxcertification(){
      this.$router.push({ path: '/myInfo/zxCertification'});
      //     var _url = '';
      //     // Indicator.open('请稍后...') 
      //     this.salesmanId = sessionStorage.getItem('salesmanId');
      //    var url = window.location.protocol + '//' + window.location.host + '/#' + '/myInfo/myIndex?appId=' + localStorage.getItem('appId');
      //    var callback = encodeURIComponent(url);
      //    await axiosGetAPI('/Salesmans/'+ this.salesmanId + '/Authentication?callback=' + callback).then(res=>{
      //       // Indicator.close()
      //       if(res.status){
      //           _url = res.result;
      //       }
      //     })
      // if(this.isEnabledAuth && this.authRemark){
      //    this.$dialog.confirm({
      //             title: '',
      //              message: '失败原因：' + this.authRemark + '\n是否重新认证？',
      //              confirmButtonText:'是',
      //              cancelButtonText:'否',
      //             }).then(() => {
      //               if(_url){
      //                 window.location.href = _url;
      //               }           
      //           // this.$router.push({ path: '/myInfo/zxCertification'});
      //     }).catch(() => {}); 
      // }else{
      //   if(_url){
      //         window.location.href = _url;
      //   }
      //     // this.$router.push({ path: '/myInfo/zxCertification'});
      // }
    
    },
    toStatistics(){
       this.$router.push({path:'/myInfo/statisticsShow'});
    },
    toInquiryDetail(){
      this.$router.push({path:'../manualInquiry/inquiryRecord'});
    },
    torecordItem() {
      this.$router.push({ path: '/piccOnlineQuote/recordItem' })
    },
    toOperationControlFrom(){
      this.$router.push({ path: '/myInfo/operationControlFrom'});
    },
    toincome() {
      this.$router.push({ path: '/salesman/index' });
    },
    toPerformance() {
      this.$router.push({ path: '/salesman/performance' });
    },
    toMycard() {
      this.$router.push({ path: '/salesman/mycard' });
    },
    myPolicy: function() {
      this.$router.push({ path: '/myInfo/myPolicy' })
    },
    modify: function() {
      // this.$router.push({ path: '/myInfo/mylnfo?accountName=' + this.accountName + '&sellerName=' + this.sellerName + '&sellerDeptName=' + this.sellerDeptName })
      this.$router.push({ path: '/salesman/info' });
    },
    goPay: function() {
      this.$router.push({ path: '/quotationList/quotationIndex?selected=3' })
    },
    goQoate: function() {
      this.$router.push({ path: '/customerManagement/custIndex' })
    },
    goTrack: function() {
      this.$router.push({ path: '/customerManagement/custIndex' })
    },
    viewFQA: function() {
      this.$router.push({ path: '/myInfo/fqa' })
    },
    dataAnalyze: function() {
      this.$router.push({ path: '/myInfo/dataAnalyze' })
    },
    carInCustomers() {
      this.$router.push({ path: '/quoteManagement/carInCustomers' })
    },
    viewInsurance: function() {
      this.$router.push({ path: '/myInfo/insuranceKnowledge' })
    },
    reportCase: function() {
      this.$router.push({ path: '/myInfo/report' })
    },
    myQr: function() {
      var nickName = this.nickName || this.weixinInfor.nickname  ||  this.accountName  || this.userName;
      var appTitle = sessionStorage.getItem('title');
      var userCode = sessionStorage.getItem('userCode');
      var appId = localStorage.getItem('appId');
      if(this.isZxbtn){
        this.$router.push({
        path: '/myInfo/zxinviteQr?title=' + appTitle + '&appId=' + appId + '&nickName=' + nickName +
          '&referrerMobile=' + this.referrerMobile + '&userCode=' + userCode
         });
      }else{
        this.$router.push({
        path: '/myInfo/myInviteQr?title=' + appTitle + '&appId=' + appId + '&nickName=' + nickName +
          '&referrerMobile=' + this.referrerMobile + '&userCode=' + userCode
      });
      }
      
    },
    viewFriends: function() {
      // this.$router.push({ path: '/myInfo/myFriends'});
      //  this.$router.push({ path: "/myInfo/teamItem" });
      this.$router.push({ path: "/myInfo/myTeam" });

    },
    // 打开图片上传
    uploadHeadImg: function() {
      this.$el.querySelector('.hiddenInput').click()
    },
    // 将头像显示
    handleFile: function(e) {
      var self = this;
      var $target = e.target || e.srcElement;
      var file = $target.files[0];
      var reader = new FileReader();
      if (file) {
        reader.onload = (data) => {
          var res = data.target || data.srcElement;
          self.avatar = res.result;
          var img = new Image,
            width = 132, //image resize   压缩后的宽
            quality = 0.8, //image quality  压缩质量
            canvas = document.createElement("canvas"),
            drawer = canvas.getContext("2d");
          img.src = self.avatar;
          img.onload = function() {
            canvas.width = width;
            canvas.height = width * (img.height / img.width);
            drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
            //上传
            var base64 = canvas.toDataURL("image/jpeg", quality); // 压缩后的base64图片
            console.log(base64)
            var fileModel = { "extension": "", "image": "" };
            fileModel.extension = "jpg";
            fileModel.image = base64;
            Indicator.open('正在上传...');
            var salesmanId = sessionStorage.getItem('salesmanId');
            axiosPutAPI('/Salesmans/' + salesmanId + '/HeadImage', fileModel)
              .then((res) => {
                Indicator.close();
                if (res.status == 200) {
                  Toast('头像上传成功！');
                  self.headImageUrl = res.result.headImageUrl;
                  sessionStorage.setItem('headImageUrl', self.headImageUrl);
                } else {
                  Toast(res.errMsg);
                }
              });
          }
        }
        reader.readAsDataURL(file);
      };
    },
  }
}

</script>
<style scoped>
.mt-my-list {
  /* overflow: hidden; */
  padding-bottom: 44px;
}

.mt-my-list .head-area {
  padding-left: 30px;
  padding-top: 60px;
  padding-bottom: 40px;
  background-color: #2D54FF;
  position: relative;
  display: flex;
}

.mt-my-list .head-area .ico-head {
  float: left;
  width: 72px;
  height: 72px;
  background-color: #f0f0f0;
  border-radius: 50%;
}

.mt-my-list .head-info {
  float: left;
  margin-left: 14px;
  color: #FFF;
  flex: 1;
}

.mt-my-list .head-info h3 {
  font-weight: bold;
  font-size: 16px;
  color: #FFF;
}

.mt-my-list .ico-list {
  display: inline-block;
  position: relative;
  top: 6px;
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.mt-my-list ..mint-cell-wrapper {
  padding-bottom: 10px;
}

.mt-my-list .ico-list.icon-baodan {
  background: url(../../assets/images/icon-baodan.svg) no-repeat;
}

.mt-my-list .ico-list.icon-tongji {
  background: url(../../assets/images/icon-tongji.svg) no-repeat;
}

.hiddenInput {
  display: none;
}

.parentWrap {
  overflow: hidden;
}

.parent {
  overflow: hidden;
  margin-right: -10px;
}

.myChild {
  float: left;
  /* //: 100px; */
  width: 33.33%;
  padding-bottom: 15px;
  display: -ms-flexbox;
  display: flex;
  text-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding-top: 20px;
  font-size: 12px;
  color: #505050
}

.myChild1 {
  float: left;
  width: calc(33.33%);
  padding-top: 0px;
  padding-bottom: 15px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #999;
}

.myChild3 {
  float: left;
  width: calc(33.33%);
  padding-top: 10px;
  padding-bottom: 5px;
  display: flex;
  /* text-align:center; */
  /* align-items: center;
  justify-content: center; */
  font-size: 13px;
  color: #505050;
}

.head-RightBtn{
     float: left;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 2px 0px 2px 8px;
    border-radius: 20px 0% 0 20px;
    color: #4A66FE;
    font-size: 12px;
    border: 1px solid #fff;

}

.head-RightBtn .btn-item{
    display: flex;
    align-items: center;
    justify-content: space-between
}

.weixinIconBox{
    float: left;
    border: 1px solid #fff;
    border-radius: 50%;
    height: 22px;
    margin-right: 5px;
    width: 22px;
}

.weixinIconBox img{
  height: 20px;
  width: 20px;
}

.authenticated{
     float: left;
    border: 1px solid #fff;
    background-color: rgba(255, 255, 255, 0);
    color: #fff;
    border-right: 0px;
    padding: 2px 0px 2px 8px;
    border-radius: 20px 0% 0 20px;
    padding-right:5px;
    font-size: 12px;
    width: 50px;
}

</style>
