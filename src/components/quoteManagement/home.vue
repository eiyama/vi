<template>
  <div style="padding-bottom:55px">
    <mt-header fixed :title="title" v-show="false"></mt-header>
    <div class="hmint-content">
      <img @click="openMsg" :src="msgImg" style="position: absolute;left:92%;width:20px;height:20px;margin-top:6px">
      <img :src="bannerImg" style="width:100%;height:100%;margin-top:-40px">
      <div style="border:1px solid #F5F5F5;background-color:#FFF;border-radius:8px;padding-bottom:15px;margin-left:10px;margin-right:10px;position: relative;top: -15px;">
        <div class="tip" >注：目前仅支持9座以下非营运客车</div>
        <van-row  type="flex" justify="end">
          <van-col style="margin-left:6px" span="2">
            <img :src="locationImg" style="height:18px;margin-top:12px;">
          </van-col>
          <van-col span="7">
            <p style="line-height:45px;color:#333">投保地区：</p>
          </van-col>
          <van-col span="15" style="display:flex;">
            <p @click="choiceCity" style="line-height:45px;color:#333">{{city.insCityShortName ? city.insCityShortName : "请选择"}}</p>
              <img @click="choiceCity" :src="defaultImg" style="width:28px;height:28px;margin-top:8px;">
          </van-col>
          
        </van-row>
        <!-- <hr width="100%" color="#f5f5f5" size="1"> -->
        <van-row style="padding-top: 10px;" type="flex" justify="end">
          <van-col span="8">
            <van-tabs v-model="currentIndex" @click="onClick" color="#4A66FE" class="homeTab">
              <van-tab title="车牌号"></van-tab>
              <van-tab title="车架号"></van-tab>
            </van-tabs>
          </van-col>
          <van-col span="8"></van-col>
          <van-col span="8">
            <span style="float:right;margin-top:8px;font-size:12px;margin-right:10px;color:#3D66ff;padding-left:8px;padding-right:8px;border:1px solid #3D66ff;
            padding-top:5px;padding-bottom:5px;border-radius:5px;line-height:14px" type="primary" size="small" @click="toNewQuota">新车未上牌</span>
          </van-col>
        </van-row>
        <hr width="100%" color="#f5f5f5" size="1">
        <div v-show="currentIndex == 0">
          <div style="position: relative;padding-left:10px;">
            <mt-field label class="upper"  type="text" @focus.native.capture="planteBlur" :placeholder="placeholderPlateNo" :disableClear="true" v-model="city.plateNo" :disabled="inputPlateNo"></mt-field>
            <img v-showAppFeatures="['ORC']" v-show="canUseOcr" @click="showOccre" style="height: 30px;position: absolute;right: 10px;top: 10px;" src="../../assets/images/icon-Photo.png" />
          </div>
          <div style="position: relative;" >
              <mt-field class="mint-inputOwnIdcard" label placeholder="请输入证件号后六位" :maxlenght="6" v-model="city.ownerIdCardNo"></mt-field>
              <div class="tip-pingan" v-show="showTipPingan" style="position:absolute;top: 10px;right: 5px;">
                 平安续保，请输入此信息
              </div>
          </div>
        </div>
        <div v-show="currentIndex == 1">
           <div style="position: relative;padding-left:10px;">
              <mt-field label placeholder="请输入车辆识别代码" :disableClear="true" @focus.native.capture="VINBlur" v-model="city.vin"></mt-field>
              <img v-showAppFeatures="['ORC']"  v-show="canUseOcr"   @click="vinOccre" style="height: 30px;position: absolute;right: 10px;top: 10px;" src="../../assets/images/icon-Photo.png" />
              <!-- v-showAppFeatures="['ORC']" -->
          </div>
          <div style="position: relative;" >
              <mt-field label type="text" class="mint-inputOwnIdcard" placeholder="请输入发动机编号" v-model="city.engineNo" maxlenght="11"></mt-field>
              <div class="tip-pingan" v-show="showTipVin" style="position:absolute;top: 10px;right: 5px;" >国寿续保，请输入此信息</div>
          </div>
        </div>
        <!-- <mt-button class="mt20 btn_quote" type="primary" size="large" @click="toScan">识别</mt-button> -->
        <div style="padding:0 10px;">
          <mt-button class="mt20 btn_quote" style="margin-top: 20px;background: #4a66fe;color:#fff;border:1px solid #4A66FE;" type="primary" size="large" @click="toQuota">立即报价</mt-button>
          <mt-button class="mt20 btn_quote" style="margin-top: 20px;color: #4a66fe;background: #fff;border:1px solid #4A66FE;" type="default" size="large" @click="toPiccOnline" v-show="canViewRB">人保在线投保</mt-button>
          <!-- <mt-button class="mt20 btn_quote" style="margin-top: 20px;color: #4a66fe;background: #fff;border:1px solid #4A66FE;" type="default" size="large" @click="toInquiry" v-showAppFeatures="['ManualEnquiry']"  >人工询价</mt-button> -->
          <mt-button class="mt20 btn_quote" style="margin-top: 20px;color: #4a66fe;background: #fff;border:1px solid #4A66FE;" type="default" size="large" @click="toInquiry" v-showAppFeatures="['ManualEnquiry']"  v-show="hasEnquiryProducts"  >人工询价</mt-button>
          
        </div>  
      </div>
    </div>
    <div style="border:1px solid #F5F5F5;background-color:#FFF;border-radius:8px;padding-bottom:15px;
      padding-left:10px;padding-right:10px;margin-left:10px;margin-right:10px;" v-show="(hasCustomerData || hasMoreCustomerData) && showTabbar">
      <van-row style="margin-left:-10px;margin-right:-11px;" type="flex">
        <van-col span="2">
          <img :src="historyImg" style="width:17px;height:17px;margin-top:8px;margin-left:12px">
        </van-col>
        <van-col span="8">
          <p style="line-height:35px;color:#999;font-size:12px">最近报价</p>
        </van-col>
      </van-row>
      <van-row style="margin-left:-10px;margin-right:-11px;" type="flex" v-show="hasCustomerData">
        <van-col v-for="(item,index) in customerData" :key="item.id" span="8">
          <p style="line-height:35px;color:#999;font-size:12px;text-align:center;color:#666;background-color:#F5F5F5;border-radius:10px;margin-left:5px;margin-right:5px" @click="custDetail(item)">{{item.plateNo}}</p>
        </van-col>
      </van-row>
      <van-row style="margin-left:-10px;margin-right:-11px;margin-top:10px" type="flex" v-show="hasMoreCustomerData">
        <van-col v-for="(item,index) in moreCustomerData" :key="item.id" span="8">
          <p style="line-height:35px;color:#999;font-size:12px;text-align:center;color:#666;background-color:#F5F5F5;border-radius:10px;margin-left:5px;margin-right:5px" @click="custDetail(item)">{{item.plateNo}}</p>
        </van-col>
      </van-row>
    </div>
    <div class="carIncustomer" @click="carInCustomers" v-show="hasViewCars" v-showPermission="['LookCameraCustomers' ,'LookCameraCars']">
      <div class="carInCustomers_title">
        <h3>进店车辆</h3>
      </div>
      <van-swipe indicator-color="#a1a1a1">
        <van-swipe-item style="height:90px" v-for="(item, index) in InCustomer" :key="index">
          <div class="carInCustomers_body">
            <div class="entryCarImage" v-show="item.entryCarImage">
              <img :src="item.entryCarImage">
            </div>
            <div class="item_plateNo">
              <p>{{item.plateNo}}</p>
              <p>进店时间：{{item.entryTime}}</p>
            </div>
            <van-icon name="arrow" color="#ccc" />
          </div>
        </van-swipe-item>
      </van-swipe>
      <p style="text-align:center;color:#999;margin-top:20px;" v-if="InCustomer == ''">今天还没有车辆进店~</p>
    </div>
    <div  v-show="showSZRBshare && showTabbar" class="attentionScanCode">
      <!-- <p>关注公众号，出单更方便</p> -->
      <mt-button class="mt20 btn_quote" style="color: #666;background:rgba(255, 255, 255, 1);border:1px solid #eee;" type="default" size="large" @click=" toSharePage ">分享给客户</mt-button>
    </div>
    <div v-show="isZXapp" class="attentionScanCode">    
      <mt-button class="mt20 btn_quote" style="color: #666;background:rgba(255, 255, 255, 1);border:1px solid #eee;" type="default" size="large" @click="showAttention">关注公众号，出单更方便</mt-button>
    </div>
    <van-popup
      v-model="hasAttention"
      position="center"
      style="width:70%"
      >
      <div class="scanCodeBox">
           <i class="ScanCodeclose"><van-icon name="close" size="20px" @click="hasAttention = false" /></i> 
             <p style="color:#333;font-size:16px">关注公众号</p>
            <img style="height:220px" src="../../assets/images/zxScanCode.jpg" alt="">
            <p style="color:#f44;font-size:14px">长按识别二维码</p>
      </div>
    </van-popup>
    <mt-popup v-model="inputPlateNo" position="bottom" popup-transition="popup-fade">
      <div id="dispense">
        <mt-header fixed class="def-header" title="车牌号">
          <div slot="left">
            <mt-button style="font-size:16px;color:#0070D3" @click="closeone(false)">取消</mt-button>
          </div>
          <div slot="right">
            <mt-button style="font-size:16px;color:#0070D3" @click="closeone(true)">确定</mt-button>
          </div>
        </mt-header>
        <div class="content-car-number">
          <div class="content-section">
            <div class="content-section-flex flex-card">
              <div class="content-section-flex flex-card-border">
                <button id="font" class="flex-btn" @click="btnClickYue" v-bind:class="{isClick: isYue }">{{areaName}}</button>
                <span class="blank-border blank-border-first"></span>
                <button id="letter" class="flex-btn" @click="btnClickA" v-bind:class="{isClick: isA}">{{areaLetter}}</button>
                <div class="flex-mid">
                  <span></span>
                </div>
                <div class="flex-btns">
                  <button id="numOne" @click="btnClickNum('one')" v-bind:class="{isNumClick: isNumOne }">{{numOne}}</button>
                  <span class="blank-border"></span>
                  <button id="numTwo" @click="btnClickNum('two')" v-bind:class="{isNumClick: isNumTwo }">{{numTwo}}</button>
                  <span class="blank-border"></span>
                  <button id="numThree" @click="btnClickNum('three')" v-bind:class="{isNumClick: isNumThree }">{{numThree}}</button>
                  <span class="blank-border"></span>
                  <button id="numFour" @click="btnClickNum('four')" v-bind:class="{isNumClick: isNumFour }">{{numFour}}</button>
                  <span class="blank-border"></span>
                  <button id="numFive" @click="btnClickNum('five')" v-bind:class="{isNumClick: isNumFive }">{{numFive}}</button>
                  <span class="blank-border" v-if="checkbox"></span>
                  <button v-if="checkbox" id="numSix" @click="btnClickNum('six')" v-bind:class="{isNumClick: isNumSix }">{{numSix}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="keyboard" v-if="keyboardShow" :class="{animationDown:isDown,animationUp:isUp}">
          <div v-if="keyboard == 'txt'">
            <div class="keyboard-row" v-for="(item,rows) in carTxt">
              <button class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)">{{i}}</button>
            </div>
            <div class="keyboard-row">
              <!-- <div class="keyboard-row-items"> -->
              <button class="keyboard-row-item bottom" @click="btnBottomClick('新')">新</button>
              <button class="keyboard-row-item bottom" @click="btnBottomClick('临')">临</button>
              <button v-for="j in noneBottomtxt" class="none-botton">{{j}}</button>
              <div class="keyboard-row-item clear" @click="clearClick">
                <img src="../../assets/images/icon_input_delete.png" alt="删除">
              </div>
              <!-- </div> -->
            </div>
          </div>
          <div v-if="keyboard == 'num'">
            <div class="keyboard-row" v-for="(item,rows) in carNum">
              <button :disabled="!isSelectl?isDisable && i<10 :isDisable&& rows!=0 " class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)">{{i}}</button>
            </div>
            <div class="keyboard-row">
              <!-- <div class="keyboard-row-bottom"> -->
              <button :disabled="isSelectl" v-for="item in carNumBottom" class="keyboard-row-item bottom" @click="btnBottomNumClick(item)">{{item}}</button>
              <button v-for="j in noneBottom" class="none-botton">{{j}}</button>
              <div class="keyboard-row-item clear" @click="clearClick">
                <img src="../../assets/images/icon_input_delete.png" alt="删除">
              </div>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
    <van-popup v-model="showCity" position="bottom">
      <selectCity v-on:selectedCity="selectedCity" v-on:closeCity="closeCity"></selectCity>
    </van-popup>
    <van-popup v-model="showMessage" position="top" style="width:90%;margin-top:30px;left:5%;border-radius:5px">
      <div style="color:#333;font-size:15px;font-weight:bold;margin: 10px;background: #ffffff; padding: 5px 10px; border-radius: 5px;">
        <div style="border-bottom: 1px solid #f0f0f0;">
          <h3>{{sysMessages.Title}}</h3>
        </div>
        <div style="margin-top:5px" @click="openMsg">
          <img :src="rightImg" style="position: absolute;left:92%;width: 25px; height: 25px;">
          <p style="color:#666;font-size:12px;margin-right:10px">{{sysMessages.Message}}</p>
        </div>
      </div>
    </van-popup>
    <mt-popup v-model="isOccre" position="bottom">
      <ScanOcrFile :scanType="scantype" :scanTitle="scanTitle" v-on:getOcrresult="getOcrresult" v-on:closeOcr="closeOcr"></ScanOcrFile>
    </mt-popup>
    <!-- <van-popup    
        v-model="isFollow"
        position="bottom"
        :style="{ height: '250px' }"
        @click-overlay="followOverlay">
        <shareCpic v-on:closeFollow="closeFollow" ></shareCpic>
    </van-popup> -->
    <div class="container-bottom">
      <bottomTab ref="bottomTab" :plant.sync="plante" v-show="!iSingleUserMode"></bottomTab>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import store from "./../../store/store";
import * as types from "./../../store/types";
import { axiosGetAPI, axiosPostAPI  , axiosPutAPI} from "./../../common/Axios";
import { Indicator } from "mint-ui";
import bottomTab from "./../bottomtab/bottom-tab";
import axios from "axios";
import cityPlateNoPrefix from "../../assets/json/cityPlateNoPrefix.json";
import { Tab, Tabs, Row, Col ,Notify  } from "vant";
import pinyin from '../../../static/lib/web-pinyin/bundle.js';
import signalR from 'signalr';
import selectCity from "./../quoteManagement/city";
import ScanOcrFile from './../quoteManagement/ScanOcrFile';
import shareCpic from './../shareCpic'
import { Overlay } from 'vant';

export default {
  name: "home",
  data() {
    return {
      scantype: '',
      scanTitle: '',
      isOccre: false,
      Ocrresult: [],
      showCity: false,
      plante: "home",
      title: "",
      isNonPlateNo: false,
      iSingleUserMode: false,
      placeholderPlateNo: "请输入车牌号",
      inputPlateNo: false,
      city: {
        insCityCode: "", //投保地区编码
        insCityShortName: "",
        plateNo: "", //车牌号
        ownerIdCardNo: "",
        vin: "", //车辆VIN码
        engineNo: "" //发动机号
      },
      entryBeginTime: "",
      entryEndTime: "",
      InCustomer: [],
      hasViewCars: false,
      noCity: false,
      showSZRBshare:false,
      defaultImg: (this.src = require("../../assets/images/right.png")),
      bannerImg: (this.src = require("../../assets/images/bg-banner.png")),
      msgImg: (this.src = require("../../assets/images/icon-notices.png")),
      locationImg: (this.src = require("../../assets/images/ic-location.png")),
      historyImg: (this.src = require("../../assets/images/icon-history.png")),
      keyImg: (this.src = require("../../assets/images/ic-keyboard.png")),
      rightImg: (this.src = require("../../assets/images/right.png")),
      checkbox: true,
      isDown: false,
      isUp: false,
      selected: null,
      isSelectx: false,
      isSelectl: false,
      key: 1,
      areaName: "",
      areaLetter: "",
      numOne: "",
      numTwo: "",
      numThree: "",
      numFour: "",
      numFive: "",
      numSix: "",
      isYue: false,
      keyboardShow: false,
      keyboard: false,
      isA: false,
      isNumOne: false,
      isNumTwo: false,
      isNumThree: false,
      isNumFour: false,
      isNumFive: false,
      isNumSix: false,
      isDisable: false,
      isOne: false,
      isTwo: false,
      isThree: false,
      isFour: false,
      isFive: false,
      isSix: false,
      isSeven: false,
      isEight: false,
      isOther: false,
      carTxt: [
        { name: ["粤", "京", "冀", "沪", "津", "晋", "蒙", "辽", "吉", "黑"] },
        { name: ["苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "桂"] },
        { name: ["琼", "渝", "川", "贵", "云", "藏", "陕", "甘", "青", "宁"] }
      ],
      carNumBottom: ["W", "X", "Y", "Z"],
      noneBottom: ["", "", "", ""],
      noneBottomtxt: ["", "", "", "", "", ""],
      carNum: [
        { name: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] },
        { name: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"] },
        { name: ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"] }
      ],
      addedCarNum: "",
      hwrppera: {
        width: "100%",
        height: "640px",
        overflow: "hidden",
        "background-color": "#AFBEFF"
      },
      currentIndex: 0,
      customerData: [],
      moreCustomerData: [],
      hasCustomerData: false,
      hasMoreCustomerData: false,
      proxy: {},
      hasConn: false,
      sysMessages: '',
      showMessage: false,
      canUseOcr: false,
      canViewRB: false,
      showTabbar:true,
      hasLookEnquiryProducts: false,
      hasEnquiryProducts:false,
      showTipPingan:false,
      showTipVin:false,
      openId:'',
      isZXapp:false,
      isFollow:false,
      hasAttention:false,
    };
  },
  components: {
    bottomTab,
    selectCity,
    ScanOcrFile,
    shareCpic
  },
  watch: {
    checkbox: function(val) {
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.yue;
      const vm = this;
      if (!val) {
        // 切换到普通车牌
        if (vm.numFour) {
          vm.isNumFive = true;
          vm.key = 7;
        }
      } else {
        // 切换到新能源车牌
        if (vm.numFive) {
          vm.isNumSix = true;
          vm.key = 8;
        }
      }
    },
  
  },

  methods: {
     followOverlay(){
        this.$refs.qrCode.innerHTML = '';
    },
      showAttention(){
          this.hasAttention = true;
      },
      planteBlur(){
      var timer = null;
      var count ,TIME_COUNT = 10;
       if (!timer) {
          this.showTipPingan = true;
         count = 10;
        timer = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count--;
          } else {
            this.showTipPingan = false;
            clearInterval(timer);
            timer = null;
          }
        }, 1000)
      }
    },
    VINBlur(){
       var timer = null;
      var count ,TIME_COUNT = 10;
       if (!timer) {
          this.showTipVin = true;
         count = 10;
        timer = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count--;
          } else {
            this.showTipVin = false;
            clearInterval(timer);
            timer = null;
          }
        }, 1000)
      }
    },
    showOccre() {
      this.scantype = 'Plate'
      this.isOccre = true;
      this.scanTitle = '车牌号码识别';
    },
    vinOccre() {
      this.scantype = 'Vin'
      this.isOccre = true;
      this.scanTitle = '车架号(VIN)识别';
    },
    getOcrresult(Ocrresult) {
      this.isOccre = false;
      if (Ocrresult.plateNo) {
        this.city.plateNo = Ocrresult.plateNo;
      }
      if (Ocrresult.vin) {
        this.city.vin = Ocrresult.vin;
      }

    },
    closeOcr() {
      this.isOccre = false;
    },

    openMsg: function() {
      this.$router.push({ path: '/quoteManagement/sysMsg/index' })
    },
    connectServer: function() {
      var $this = this;
      var serviceHost = localStorage.getItem('serviceHost');
      var servicePort = localStorage.getItem('servicePort');
      if (serviceHost && servicePort) {
        var HUB_URL;
        if ("443" == servicePort) {
          HUB_URL = "https://" + serviceHost;
        } else {
          HUB_URL = "http://" + serviceHost;
        }
        HUB_URL = HUB_URL + ":" + servicePort + "/signalr/hubs";
        var conn = $.hubConnection(HUB_URL, { useDefaultPath: false })
        $this.proxy = conn.createHubProxy("messageHub");
        $this.getMsg();
        conn.start().done((data) => {
          console.log('已连接');

        }).fail((data) => {
          console.log('连接失败异常:', data)
        });
        $this.hasConn = true;
      };
    },
    getMsg: function() {
      var $this = this;
      $this.proxy.on("sendNotify", (data) => {
        console.log('接收到新的消息:', data)
        if (data && (data.Title.indexOf('留修任务') < 0)) {
          $this.showMessage = false;
          $this.sysMessages = data;
          $this.showMessage = true;
        }
      })
    },
    carInCustomers() {
      this.$router.push({ path: '/quoteManagement/carInCustomers' })
    },
    todayCarBtn() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var day = date.getDate();
      var _m = m - 1;
      this.entryBeginTime = y + "-" + m + "-" + day;
      this.entryEndTime = y + "-" + m + "-" + day;
      this.getCarInCustomerData();
    },
    getCarInCustomerData: function() {
      this.InCustomer = []
      Indicator.open("加载中...");
      var queryUrl = "/vi/customers/CarIn?limit=20&entryBeginTime=" +
      this.entryBeginTime + "&entryEndTime=" + this.entryEndTime;
      var root = process.env.API_ROOT;
      // axios({
      //   method: "GET",
      //   url: queryUrl,
      //   data: null,
      //   params: null,
      //   baseURL: root,
      //   withCredentials: false
      // })
      axiosGetAPI(queryUrl).then(res => {
        // console.log(res.result)
        Indicator.close();
        if (res.result.length > 0) {
          if (res.result.length <= 4) {
            this.InCustomer = res.result;
          } else {
            this.InCustomer = res.result.slice(0, 3);
          }
        }
      }, err => {
        reject(err);
      }).catch(function(error) {
        console.log(error);
      });
    },
    onClick(index, title) {
      this.currentIndex = index;
    },
    closeone: function(update) {
      var self = this;
      self.inputPlateNo = false;
      if (update) {
        self.addCar();
      }
    },
    openone: function() {
      var self = this;
      if (self.currentIndex == 0) {
        self.inputPlateNo = true;
        if (self.city.plateNo) {
          var len = self.city.plateNo.length;
          if (len == 1) {
            self.areaName = self.city.plateNo.substring(0, 1);
          } else if (len == 2) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
          } else if (len == 3) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
            self.numOne = self.city.plateNo.substring(2, 3);
          } else if (len == 4) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
            self.numOne = self.city.plateNo.substring(2, 3);
            self.numTwo = self.city.plateNo.substring(3, 4);
          } else if (len == 5) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
            self.numOne = self.city.plateNo.substring(2, 3);
            self.numTwo = self.city.plateNo.substring(3, 4);
            self.numThree = self.city.plateNo.substring(4, 5);
          } else if (len == 6) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
            self.numOne = self.city.plateNo.substring(2, 3);
            self.numTwo = self.city.plateNo.substring(3, 4);
            self.numThree = self.city.plateNo.substring(4, 5);
            self.numFour = self.city.plateNo.substring(5, 6);
          } else if (len == 7) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
            self.numOne = self.city.plateNo.substring(2, 3);
            self.numTwo = self.city.plateNo.substring(3, 4);
            self.numThree = self.city.plateNo.substring(4, 5);
            self.numFour = self.city.plateNo.substring(5, 6);
            self.numFive = self.city.plateNo.substring(6, 7);
          } else if (len == 8) {
            self.areaName = self.city.plateNo.substring(0, 1);
            self.areaLetter = self.city.plateNo.substring(1, 2);
            self.numOne = self.city.plateNo.substring(2, 3);
            self.numTwo = self.city.plateNo.substring(3, 4);
            self.numThree = self.city.plateNo.substring(4, 5);
            self.numFour = self.city.plateNo.substring(5, 6);
            self.numFive = self.city.plateNo.substring(6, 7);
            self.numSix = self.city.plateNo.substring(7, 8);
            self.checkbox = true;
          }
        }
        self.btnClickYue();
      }
    },
    turn: function() {
      // 是否未上牌
      var self = this;
      self.changeCard();
    },
    choiceCity: function() {
      // 点击切换城市
      var self = this;
      localStorage.setItem("homeApp", JSON.stringify(self.city));
      self.showCity = true;
    },
    toScan: function() {
      this.$router.push({ path: "/quoteManagement/scan" });
    },
    changeCard: function() {
      // 有无车牌处理函数
      var self = this;
      self.inputPlateNo = !(self.currentIndex == 0);
      if (self.currentIndex == 1) {
        self.city.vin = "";
        self.city.engineNo = "";
        self.placeholderPlateNo = "请输入车牌号";
      } else {
        self.city.plateNo = "";
        self.city.ownerIdCardNo = "";
        self.placeholderPlateNo = "";
      }
    },
    toNewQuota: function() {
      var curDate = new Date();
      var hh = curDate.getHours();
      var mm = curDate.getMinutes();
      if (hh >= 8 && hh <= 22) {
        if (hh == 22 && mm > 0) {
          Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
          return false;
        }
        var self = this;
        if (self.noCity) {
          Toast("暂无报价权限，请联系管理员。");
          return false;
        }
        if (!self.city.insCityCode) {
          Toast("请选择投保地区");
          return false;
        }
        localStorage.setItem("homeApp", JSON.stringify(self.city));
        localStorage.removeItem("insureInfoApp");
        localStorage.removeItem("quoteInfoStatus");
        var urlParam =
          "?insCityCode=" +
          self.city.insCityCode +
          "&insCityShortName=" +
          self.city.insCityShortName +
          "&plateNo=&ownerIdCardNo=&vin=&engineNo=";
        Indicator.open("加载中...");
        setTimeout(function() {
          Indicator.close();
          self.$router.push({ path: "/quoteManagement/index" + urlParam });
        }, 100);
      } else {
        Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
        return false;
      }
    },
    toQuota: function() {
      var self = this;
      //非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。
      var curDate = new Date();
      var hh = curDate.getHours();
      var mm = curDate.getMinutes();
      if (hh >= 8 && hh <= 22) {
        if (hh == 22 && mm > 0) {
          Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
          return false;
        }
        if (self.noCity) {
          Toast("暂无报价权限，请联系管理员。");
          return false;
        }
        if (!self.city.insCityCode) {
          Toast("请选择投保地区");
          return false;
        }
        if (self.currentIndex == 0) {
          if (!self.city.plateNo) {
            Toast("请输入车牌号");
            return false;
          }
          // str.replace(/\s*/g,"")
          self.city.plateNo = self.city.plateNo.toUpperCase();
          self.city.plateNo = self.city.plateNo.replace(/\s*/g,"");
          self.city.vin = "";
        } else if (self.currentIndex == 1) {
          if (!self.city.vin) {
            Toast("请输入车架号");
            return false;
          }
          self.city.vin = self.city.vin.toUpperCase();
          self.city.vin = self.city.vin.replace(/\s*/g,"");
          self.city.plateNo = "";
        }
        localStorage.setItem("homeApp", JSON.stringify(self.city));
        localStorage.removeItem("insureInfoApp");
        localStorage.removeItem("quoteInfoStatus");
        Indicator.open("加载中...");
        setTimeout(function() {
          Indicator.close();
          self.$router.push({ path: "/quoteManagement/index", query: self.city });
        }, 100);
      } else {
        Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
        return false;
      }
    },
    closeFollow(){
        this.isFollow = false;
    },
    toSharePage(){
      this.$router.push({path:"./../shareCpic"});
    },
    toPiccOnline: function() {
      /*var self = this;
      if (!self.city.insCityCode) {
        Toast("请选择投保地区");
        return false;
      }*/
      this.$router.push({ path: "/piccOnlineQuote/picclink" });
    },
    toInquiry() {
      this.$router.push({ path: '/manualInquiry/index' });
    },
    custDetail: function(item) {
      var curDate = new Date();
      var hh = curDate.getHours();
      var mm = curDate.getMinutes();
      if (hh >= 8 && hh <= 22) {
        if (hh == 22 && mm > 0) {
          Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
          return false;
        }
        var self = this;
        var url = "/quoteManagement/index";
        var carNo = item.plateNo ? item.plateNo : "";
        var vin = item.vin ? item.vin : "";
        url = url + "?from=recent&plateNo=" + carNo + "&vin=" + vin +
          "&insCityCode=" + self.city.insCityCode + "&insCityShortName=" + self.city.insCityShortName;
        Indicator.open("加载中...");
        localStorage.removeItem("insureInfoApp");
        localStorage.removeItem("quoteInfoStatus");
        setTimeout(function() {
          Indicator.close();
          self.$router.push({ path: url });
        }, 100);
      } else {
        Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
        return false;
      }
    },
    getCitys: function() {
      Indicator.open("加载中...");
      var self = this;
      var root = process.env.API_ROOT;
      axios({
          method: "GET",
          url: "/vi/insuranceCompanies",
          data: null,
          params: null,
          baseURL: root,
          withCredentials: false
        })
        .then(
          function(res) {
            Indicator.close();
            if (res.data.status == 200) {
              if (res.data.result) {
                sessionStorage.setItem('insuranceNameCode', JSON.stringify(res.data.result));
                self.noCity = false;
                /* 城市和城市代码去重*/
                var CityCode = [],
                  CityShortName = [];
                for (var i = 0; i < res.data.result.length; i++) {
                  var cityCode = res.data.result[i].insCityCode;
                  if (cityCode != "110000") {
                    CityCode.push(cityCode);
                    CityShortName.push(res.data.result[i].insCityShortName);
                  }
                }
                var qCityCode = CityCode.unique(),
                  qCityShortName = CityShortName.unique(),
                  arr = [];
                for (var j = 0; j < qCityShortName.length; j++) {
                  var obj = {};
                  obj.insCityCode = qCityCode[j];
                  obj.insCityShortName = qCityShortName[j];
                  obj.appId = self.appId;
                  arr.push(obj);
                }
                if (arr.length == 1) {
                  for (var i = 0; i < cityPlateNoPrefix.result.length; i++) {
                    if (
                      arr[0].insCityCode == cityPlateNoPrefix.result[i].CityCode
                    ) {
                      if (self.city.plateNo.length <= 2) {
                        self.city.plateNo =
                          cityPlateNoPrefix.result[i].PlateNoPrefix;
                      }
                      break;
                    }
                  }
                  self.city.insCityCode = arr[0].insCityCode;
                  sessionStorage.setItem('insCtiyCode', self.city.insCityCode);
                  self.city.insCityShortName = arr[0].insCityShortName;
                } else {
                  self.city.insCityCode = "";
                  self.city.insCityShortName = "";
                }
              } else {
                self.noCity = true;
              }
            } else {
              self.noCity = true;
            }
          },
          err => {
            Toast('请求超时，请刷新页面重试！');
            reject(err);
          }
        )
        .catch(function(error) {
          console.log(error);
        });
    },
    carTypeChange(val) {
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      if (!val) {
        // 切换到普通车牌
        if (this.numFour) {
          this.isNumFive = true;
          this.key = 7;
        }
      } else {
        // 切换到新能源车牌
        if (this.numFive) {
          this.isNumSix = true;
          this.key = 8;
        }
      }
    },
    btnClickYue() {
      this.isYue = true;
      this.isA = false;
      this.isUp = true;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.keyboardShow = true;
      this.keyboard = "txt";
      this.key = 1;
    },
    btnWordClick(rows, index, i) {
      this.selected = i;
      if (this.key === 1) {
        if (this.areaName === "临") {
          this.areaLetter = "";
          this.numOne = "";
          this.numTwo = "";
          this.numThree = "";
          this.numFour = "";
          this.numFive = "";
          this.numSix = "";
        }
        this.areaName = i;
        this.isSelectl = false;
        document.getElementById("letter").click();
      } else if (this.key === 2) {
        this.areaLetter = i;
        document.getElementById("numOne").click();
      } else if (this.key === 3) {
        this.numOne = i;
        document.getElementById("numTwo").click();
      } else if (this.key === 4) {
        this.numTwo = i;
        document.getElementById("numThree").click();
      } else if (this.key === 5) {
        this.numThree = i;
        document.getElementById("numFour").click();
      } else if (this.key === 6) {
        this.numFour = i;
        document.getElementById("numFive").click();
      } else if (this.key === 7) {
        this.numFive = i;
        if (this.checkbox) {
          document.getElementById("numSix").click();
        }
      } else if (this.key === 8) {
        this.numSix = i;
      }
      if (this.key === 7 || this.key === 8) {
        this.carNumBottom = ["W", "X", "Y", "Z", "港", "澳", "学"];
        this.noneBottom = [""];
      } else if (
        this.key === 3 ||
        this.key === 4 ||
        this.key === 5 ||
        this.key === 6
      ) {
        this.carNumBottom = ["W", "X", "Y", "Z"];
        this.noneBottom = ["", "", "", ""];
      }
    },
    btnBottomClick(val) {
      if (val === "新") {
        if (this.areaName === "临") {
          this.areaLetter = "";
          this.numOne = "";
          this.numTwo = "";
          this.numThree = "";
          this.numFour = "";
          this.numFive = "";
          this.numSix = "";
        }
        this.areaName = "新";
        this.isSelectx = true;
        this.isSelectl = false;
        document.getElementById("letter").click();
      } else if (val === "临") {
        this.areaName = "临";
        this.isSelectl = true;
        this.isSelectx = false;
        this.isDisable = true;
        this.areaLetter = "";
        this.numOne = "";
        this.numTwo = "";
        this.numThree = "";
        this.numFour = "";
        this.numFive = "";
        this.numSix = "";
        document.getElementById("letter").click("isLin");
      }
    },
    btnBottomNumClick(i) {
      this.selected = i;
      if (this.key === 2) {
        this.areaLetter = i;
        document.getElementById("numOne").click();
      } else if (this.key === 3) {
        this.numOne = i;
        document.getElementById("numTwo").click();
      } else if (this.key === 4) {
        this.numTwo = i;
        document.getElementById("numThree").click();
      } else if (this.key === 5) {
        this.numThree = i;
        document.getElementById("numFour").click();
      } else if (this.key === 6) {
        this.numFour = i;
        document.getElementById("numFive").click();
      } else if (this.key === 7) {
        this.numFive = i;
        if (this.checkbox) {
          document.getElementById("numSix").click();
        }
      } else if (this.key === 8) {
        this.numSix = i;
      }
    },
    btnClickA() {
      this.isDisable = true;
      this.isA = true;
      this.isYue = false;
      this.isUp = true;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.keyboardShow = true;
      this.keyboard = "num";
      this.key = 2;
    },
    btnClickNum(name) {
      if (this.isSelectl) {
        this.isDisable = true;
      } else {
        this.isDisable = false;
      }
      this.keyboard = "num";
      this.keyboardShow = true;
      this.isYue = false;
      this.isA = false;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.isUp = true;
      if (name === "one") {
        this.isNumOne = true;
        this.key = 3;
      } else if (name === "two") {
        this.isNumTwo = true;
        this.key = 4;
      } else if (name === "three") {
        this.isNumThree = true;
        this.key = 5;
      } else if (name === "four") {
        this.isNumFour = true;
        this.key = 6;
      } else if (name === "five") {
        this.isNumFive = true;
        this.key = 7;
      } else if (name === "six") {
        this.isNumSix = true;
        this.key = 8;
      }
      if (name === "five" || name === "six") {
        this.carNumBottom = ["W", "X", "Y", "Z", "港", "澳", "学"];
        this.noneBottom = [""];
      } else {
        this.carNumBottom = ["W", "X", "Y", "Z"];
        this.noneBottom = ["", "", "", ""];
      }
    },
    completeClick() {
      this.isYue = false;
      this.isA = false;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.isUp = false;
      this.isDown = true;
      this.keyboardShow = false;
    },
    clearClick() {
      if (this.key === 1) {
        this.areaName = "";
      } else if (this.key === 2) {
        document.getElementById("font").click();
        this.areaLetter = "";
      } else if (this.key === 3) {
        document.getElementById("letter").click();
        this.numOne = "";
      } else if (this.key === 4) {
        document.getElementById("numOne").click();
        this.numTwo = "";
      } else if (this.key === 5) {
        document.getElementById("numTwo").click();
        this.numThree = "";
      } else if (this.key === 6) {
        document.getElementById("numThree").click();
        this.numFour = "";
      } else if (this.key === 7) {
        document.getElementById("numFour").click();
        this.numFive = "";
      } else if (this.key === 8) {
        document.getElementById("numFive").click();
        this.numSix = "";
      }
    },
    addCar() {
      var num;
      if (!this.checkbox) {
        num =
          this.areaName +
          this.areaLetter +
          this.numOne +
          this.numTwo +
          this.numThree +
          this.numFour +
          this.numFive;
      } else if (this.checkbox) {
        num =
          this.areaName +
          this.areaLetter +
          this.numOne +
          this.numTwo +
          this.numThree +
          this.numFour +
          this.numFive +
          this.numSix;
      }
      if (num === "") {
        Toast("请输入车牌");
      } else if (
        this.areaName === "" ||
        this.areaLetter === "" ||
        this.numOne === "" ||
        this.numTwo === "" ||
        this.numThree === "" ||
        this.numFour === "" ||
        this.numFive === ""
      ) {
        Toast("请输入完整车牌");
      }
      this.city.plateNo = num;
    },
    initHeight: function() {
      this.hwrppera.height = window.innerHeight + 150 + "px";
    },
    getCustomers: function(date) {
      var self = this;
      self.hasViewCars = localStorage.getItem("hasViewCars");
      if (self.hasViewCars == 'true') {
        self.todayCarBtn();
      }

      var param = {
        offset: 0,
        limit: 8,
        overduedays: "366",
        quotedTimeDesc: true,
        viExpiredTimeDesc: false
      };
      axiosGetAPI("/vi/customers", param).then(res => {
        Indicator.close();
        if (res.result && res.result != "") {
          // self.customerData = [];
          // self.moreCustomerData = [];
          var customers = res.result;
          var lengths = customers.length;
          if (lengths > 4) {
            self.hasCustomerData = true;
            self.hasMoreCustomerData = true;
            var temp = [];
            for (var i = 0; i < 4; i++) {
              self.customerData.push(customers[i]);
            }
            for (var j = 4; j < lengths; j++) {
              self.moreCustomerData.push(customers[j]);
            }
          } else {
            self.hasCustomerData = true;
            self.hasMoreCustomerData = false;
            for (var i = 0; i < lengths; i++) {
              self.customerData.push(customers[i]);
            }
          }
        } else {
          self.hasCustomerData = false;
          self.hasMoreCustomerData = false;
        }
      });
      axiosGetAPI("/Users/Me").then(res => {
        self.userId = res.result.userId;
        sessionStorage.setItem("userIds", self.userId);
        sessionStorage.setItem("accountName", res.result.accountName);
        sessionStorage.setItem("nickName", "");
        sessionStorage.setItem("referralCode", "");
        sessionStorage.setItem("salesmanId", "");
        var orgCode = res.result.sellerOrgCode;
        sessionStorage.setItem("sellerOrgCode", orgCode);
        sessionStorage.setItem("sellerDeptCode", res.result.sellerDeptCode);
        sessionStorage.setItem('accountName', res.result.accountName);
        sessionStorage.setItem('sellerOrgName', res.result.sellerOrgName);
        sessionStorage.setItem('sellerDeptName', res.result.sellerDeptName);
        sessionStorage.setItem('sellerName', res.result.sellerName);
        if (self.userId) {
          var root = process.env.API_ROOT;
          axios({
              method: "GET",
              url: "/Users/" + self.userId + "/Salesman",
              data: null,
              params: null,
              baseURL: root,
              withCredentials: false
            })
            .then(
              function(res) {
                Indicator.close();
                if (res.data.status == 200) {
                  if (res.data.result) {
                    sessionStorage.setItem("nickName", res.data.result.name);
                    sessionStorage.setItem("salesmanId", res.data.result.id);
                    sessionStorage.setItem('referrerMobile', res.data.result.mobile);
                    sessionStorage.setItem("headImageUrl", res.data.result.headImageUrl);
                  }
                }
              },
              err => {
                reject(err);
              }
            )
            .catch(function(error) {
              console.log(error);
            });
          axiosGetAPI('/Users/Me/Permissions').then((res) => {
            if (res.result) {
              var permissions = res.result.permissions;
              if(!localStorage.setItem('permissions',JSON.stringify(permissions))){
                  localStorage.setItem('permissions',JSON.stringify(permissions));
              }
               
              if (permissions && permissions.length > 0) {
                for (var i = 0; i < permissions.length; i++) {
                  if (permissions[i] == "SiteOwner") {
                    localStorage.setItem('hasLookEnquiryProducts', true);
                    self.hasLookEnquiryProducts = 'true';
                    break;
                  } else {
                    if (permissions[i] == "LookAgencyBandCard") {
                      localStorage.setItem('hasLookAgencyBandCard', true);
                      continue;
                    }
                    if (permissions[i] == "LookMeEnquiryPolicy") {
                      localStorage.setItem('hasLookEnquiryProducts', true);
                      self.hasLookEnquiryProducts = 'true';
                      continue;
                    }
                  }
                }
              }
            }
          });
          axios({
              method: "GET",
              url: "/Organizations/Settings?orgCode=" + orgCode + "&categories=续保配置",
              data: null,
              params: null,
              baseURL: root,
              withCredentials: false
            })
            .then(
              function(res) {
                Indicator.close();
                if (res.data.status == 200) {
                  if (res.data.result && res.data.result.daysOfEarlyRenewal) {
                    sessionStorage.setItem("daysOfEarlyRenewal", res.data.result.daysOfEarlyRenewal);
                  }
                }
              },
              err => {
                reject(err);
              }
            )
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },
    closeCity: function() {
      this.showCity = false;
    },
    selectedCity: function(cityCode, cityShortName) {
      this.showCity = false;
      this.city.insCityCode = cityCode;
      sessionStorage.setItem('insCtiyCode', cityCode);
      this.city.insCityShortName = cityShortName;
    },
   getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
     plusReady(){  
         document.addEventListener('plusready', function(){  
              // 页面加载时触发              
              var pinf = plus.push.getClientInfo();  
              var cid = pinf.clientid;//客户端标识  
              if(cid){
                sessionStorage.setItem('cid',cid);                        
              }             
              console.log(cid); 
              // alert(cid);
          }, false );    
          var self = this;
          //监听系统通知栏消息点击事件  
          plus.push.addEventListener('click', function(msg){
            if(msg.payload){
                // console.log('通知栏消息',msg.payload);
                var item = JSON.parse(msg.payload);
                var str = item.ActionUrl;
                str = str.split('id=',2)[1];
                str = str.split('&',1);
                // console.log(str)
                var id = str;
                axiosPutAPI('/Messages/' + item.Parameters.MessageId).then((res) => {                  
                });
                var category = item.Title;
                if (category) {
                  if (category == '车辆进店通知') {
                    self.$router.push({ path: '/quoteManagement/carInCustomers' })
                  } else if (category == '客户跟进提醒') {
                    self.$router.push({ path: '/customerManagement/custDetail?customerId=' + id })
                  } else if (category.indexOf('询价') >= 0) {
                    self.$router.push({path:'/manualInquiry/inquiryRecord'});
                  }
                }
            }
            //处理点击消息的业务逻辑代码  
          }, false);  
          //监听接收透传消息事件  
          plus.push.addEventListener('receive', function(msg){  
            // console.log(msg);
              //处理透传消息的业务逻辑代码  
              if(msg){
                  var payload = JSON.parse(msg.payload);
                  self.sysMessages = {};
                  self.sysMessages.Title = payload.Title;
                  self.sysMessages.Message = payload.Message;
                  self.showMessage = true;
              }
          }, false);
          // alert(plus.push.getClientInfo().clientid);
            // 在这里调用plus api  
        },                 
  },
   created () {
    var self = this;
    self.initHeight();
    var appId = self.$route.query.appid || self.$route.query.appId;
    localStorage.setItem("appId", appId);
    var showTabbar = true;
    if(this.$route.query.showTabbar != '' && this.$route.query.showTabbar != undefined ){
      this.showTabbar = this.$route.query.showTabbar == 'false' ? false : true;
      showTabbar = this.showTabbar ;
      sessionStorage.setItem('showTabbar',showTabbar);
    }
    // console.log(showTabbar);
    var shareToken = ''
    if(this.$route.query.shareToken){
      shareToken = this.$route.query.shareToken;
      sessionStorage.setItem('shareToken',shareToken);
    }
    if(sessionStorage.getItem('showTabbar') != '' && sessionStorage.getItem('showTabbar') != undefined ){
        this.showTabbar = sessionStorage.getItem('showTabbar')  == 'false' ? false : true;
    } 
    if(sessionStorage.getItem('shareToken')){
        shareToken = sessionStorage.getItem('shareToken')
    }    
    if (appId) {
      var appIdList = [
        'cxs190103104249iwe',
        'cxa181211170855pxj',
        'cx8190110143618pyi',
        'cx4180310190219bh6',
        'cx91909x2101234uqc',
        'cx118051y511426x5r',
        'cx5190108195859o31',  
        'cx220052u7048201hx'      
      ]
      self.canUseOcr = appIdList.indexOf(appId) > -1;
      self.canViewRB = (appId == 'cxv190614111634a4f' || appId == 'cxa181211170855pxj');
      self.hasEnquiryProducts = (appId == 'cx7190761141531rzi' || appId == 'cxa181211170855pxj' ||  appId == 'cx8190110143618pyi' || appId == 'cxs190103104249iwe' || appId == 'cx7190408201251bh0' || appId =='cx220t020161609ck9');
      self.isZXapp = (appId == 'cx7190761141531rzi');
      self.showSZRBshare = (appId == 'cx11909252219253mo' || appId == 'cxa181211170855pxj');//人保分享
    // localStorage.removeItem("appId");
      localStorage.removeItem("insureInfoApp");
      localStorage.removeItem("quoteInfoStatus");
      var homeApp = localStorage.getItem("homeApp");
      if (homeApp) {
        var resultData = JSON.parse(homeApp);
        self.city = resultData;
      }
      Indicator.open("加载中...");
      document.title = "";
        axiosGetAPI("/apis/apps/" + appId + "/H5").then(res => {
        Indicator.close();
        var authMode = res.result.authMode.text;
        appId = res.result.appId
        localStorage.setItem("appId", res.result.appId);
        localStorage.setItem("serviceHost", res.result.serviceHost);
        localStorage.setItem("servicePort", res.result.servicePort);
        if(!sessionStorage.getItem("appFeatures")){
            sessionStorage.setItem("appFeatures",JSON.stringify(res.result.appFeatures));
        }
        self.$store.commit(types.APPID, res.result.appId);
        self.$store.commit(types.AUTHMODE, authMode);
        self.connectServer();
         if (authMode == "SingleUserMode" || shareToken) {
          self.$store.commit(types.LOGIN, "1");
          localStorage.setItem("token", "");
          self.iSingleUserMode = true;
          if (Object.keys(self.$route.query).length <= 1) {
            self.getCitys();
          }
          self.hasViewCars = localStorage.getItem("hasViewCars");
          // if (self.hasViewCars == 'true') {
          //   self.todayCarBtn();
          // }
          self.getCustomers();
        } else {
          var token = store.state.token || localStorage.getItem('token') || '' ;
          if(showTabbar){ //是否显示tabbar，多用户且showTabbar为true
            self.iSingleUserMode = false ; 
          }else{
            self.iSingleUserMode = true ; 
          }
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
                      self.$store.commit(types.LOGOUT);
                      self.$router.push({ path: "/login?appId=" + localStorage.getItem('appId')});
                    } 
                 }else{
                  // Toast('登录失效，请重新登录');
                       self.$store.commit(types.LOGOUT);
                      self.$router.push({ path: "/login?appId=" + localStorage.getItem('appId')});
                    } 
                })
                } else{  
                  var openId = sessionStorage.getItem("openId") || '';
                    // if(!openId){
                        axiosPostAPI('/Weixin/' + code + '/Token').then(dataRes=>{//微信免登陆，如果api返回了token则实现免登陆，否则去登陆。
                            if( dataRes.status == '200' && dataRes.result.bindUser != undefined && dataRes.result.bindUser.token != undefined){ //判断是否有token即是否绑定了账号，如果绑定了则免登陆，如果未绑定则重新登录
                              self.$store.commit(types.LOGIN, dataRes.result.bindUser.token);
                              localStorage.setItem('token',localStorage.getItem('appId') + '_' + dataRes.result.bindUser.token); 
                                if (Object.keys(self.$route.query).length <= 1) {
                                  self.getCitys();
                                }
                                self.getCustomers();  
                          } else{
                            if(self.isZXapp){ //如果是中兴智能车则去zxregister.vue(中兴注册页面)；
                              self.$store.commit(types.LOGOUT);
                              self.$router.push({ path: "/myInfo/zxlogin?appId=" + localStorage.getItem('appId') + '&showOrg=true'});
                           }else{
                              // Toast('登录失效，请重新登录');
                              self.$store.commit(types.LOGOUT);
                              self.$router.push({ path: "/login?appId=" + localStorage.getItem('appId')});
                            }  
                          } 
                        })
                    // }
                  }
              }
               else{
                    if (store.state.token == "null" || store.state.token == "1"  ) {
                      // Toast('登录失效，请重新登录');
                      self.$store.commit(types.LOGOUT);
                      self.$router.push({ path: "/login?appId=" + localStorage.getItem('appId')});
                    } else {
                      // Toast('appid:' + store.state.appId +'\n'+ 'token:' + store.state.token);
                      var localToken = localStorage.getItem("token");
                      if ( localToken && localToken.indexOf(appId) == 0 ) {
                        if (Object.keys(self.$route.query).length <= 1) {
                          self.getCitys();
                        }
                        self.getCustomers();
                      } else {
                        // Toast('登录失效，请重新登录');
                        self.$store.commit(types.LOGOUT);
                        self.$router.push({ path: "/login?appId=" + localStorage.getItem('appId') });
                      }
                }
          }
        }
         axiosGetAPI('/Configurations?types=salesman').then((d) => {
                      if (d.status == 200 && d.result && d.result.salesman) {
                        var plates = d.result.salesman.plates;
                        if (plates && plates.length > 0) {
                          localStorage.setItem("canReg", true);
                        } else {
                          localStorage.setItem("canReg", false);
                        }
                      } else {
                        localStorage.setItem("canReg", false);
                      }
                    });
        self.title = res.result.name;
        document.title = res.result.name;
        sessionStorage.setItem("title", self.title);
      });   
    } else {
      this.$store.commit(types.LOGOUT);
      this.$router.push({ path: "/login?appId=" + localStorage.getItem('appId') });
    }
  },
  mounted: function() {
    if (Object.keys(this.$route.query).length > 1) {
      /* 获取city页面传过来的值，并赋值给city对象*/
      this.city.insCityCode = this.$route.query.insCityCode;
      sessionStorage.setItem('insCtiyCode', this.city.insCityCode);
      this.city.insCityShortName = this.$route.query.insCityShortName;
      for (var i = 0; i < cityPlateNoPrefix.result.length; i++) {
        if (this.city.insCityCode == cityPlateNoPrefix.result[i].CityCode) {
          if (this.city.plateNo.length <= 2) {
            this.city.plateNo = cityPlateNoPrefix.result[i].PlateNoPrefix;
          }
          break;
        }
      }
    };
     if(window.plus){        
        this.plusReady();
      }else{
        document.addEventListener('plusready', this.plusReady, false)
      }  
     if(~navigator.userAgent.indexOf('Html5Plus')){                   
         this.plusReady();
    }
  }
};

</script>
<style rel="stylesheet/scss" lang="scss">
.hmint-content {
  padding: 0px 0% 0;
}

.hmint-content .tip {
  font-size: 12px;
  color: #fc3738;
  letter-spacing: 0;
  height: 30px;
  line-height: 40px;
  padding: 0 10px;

}

.hmint-content .tip-pingan {
  font-size: 12px;
  color: #ffffff;
  padding: 0px 10px;
  letter-spacing: 0;
  height: 30px;
  line-height: 30px;
  background: url('../../assets/images/bg_poptips_red.png')no-repeat;
  background-size: contain;

}

.hmint-content .ins-img {
  width: 28px;
  height: 28px;
  display: inline-block;
  margin: 0 5px 0 0px;
  position: relative;
  margin-right: -10px;
}

.hmint-content .messagecc {
  height: 100%;
  width: 100%;
}

.hmint-content .lili {
  bottom: 0;
  top: 0;
}

.hmint-content .mint-region .mint-formItm .mint-input {
  width: 88%;
  margin-right: 0;
  color: #333;
}

#dispense {
  .ze-checkbox>input[type="checkbox"] {
    position: absolute;
    left: -9999em;
  }

  .ze-checkbox>input[type="checkbox"]:checked+.ze-checkbox-icon {
    background-color: currentColor;
    border-color: #ffc400;
  }

  .ze-checkbox-icon {
    border: 1px solid #ccc;
    /*no*/
    border-radius: 2px;
    display: inline-block;
    position: relative;
    z-index: 10;
    vertical-align: bottom;
    pointer-events: none;

    >i {
      content: "";
      position: absolute;
      top: 45%;
      left: 50%;
      border: 3px solid #ffc400;
      /*no*/
      border-top: 0;
      border-left: 0;
      -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(0);
      transform: translate(-50%, -50%) rotate(45deg) scale(0);
    }
  }

  .ze-checkbox>input[type="checkbox"]:checked+.ze-checkbox-icon>i {
    -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(1);
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  background-color: #fff;
  height: 385px;

  .content-car-number {
    padding: 56px 0 0;

    .car-content-title {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      margin-bottom: 15px;

      span {
        font-size: 15px;
      }

      .ze-checkbox {
        display: flex;
        align-items: center;
      }

      .ze-radio-text {
        font-size: 15px;
      }

      .ze-checkbox-icon {
        color: #ffedb1 !important;
        margin-right: 8px;
      }
    }

    .content-section {
      .content-section-flex {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        margin-bottom: 10px;

        .blank-border {
          height: 44px;
          width: 1px;
          /*no*/
          border-right: 1px solid #ddd;
          /*no*/
          margin-top: 2px;
          float: left;
          margin-left: 0px;
          z-index: 1;

          &.blank-border-first {
            margin-top: 0px;
          }
        }

        &.flex-card {
          color: #000;

          .flex-btn {
            width: 40px;
            height: 48px;
            border: none;
            text-align: center;
            background: #fff;
            font-size: 18px;
            color: #000;
          }

          .flex-btns {
            text-align: center;
            background: #fff;
            width: fit-content;
            position: relative;
            height: 48px;

            button {
              width: 40px;
              height: 48px;
              border: none;
              font-size: 18px;
              color: #000;
              border-radius: 50%;
              background: transparent;
              float: left;
              margin-left: 0px;
              z-index: 2;
              position: relative;

              &:first-child {
                margin-left: 0;
              }
            }
          }

          .flex-mid {
            margin: 0 0.1rem;

            span {
              display: block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #ddd;
            }
          }

          .isClick {
            border: 1px solid #0070d3;
            /*no*/
            z-index: 50;
            border-radius: 3px;
          }

          .isNumClick {
            border-radius: 8px !important;
            border: 1px solid #0070d3 !important;
            /*no*/
            z-index: 10;
            background-color: #fff !important;
          }
        }

        .flex-card-border {
          border: 1px solid #ddd;
          /*no*/
          border-radius: 3px;
        }
      }
    }
  }

  .keyboard {
    width: 100%;
    height: 265px;
    position: fixed;
    bottom: -265px;
    background: #f9f9f9;
    z-index: 10;

    &.animationDown {
      animation: slide_dowms 0.3s ease-out;
      animation-fill-mode: forwards;
    }

    &.animationUp {
      animation: slide_ups 0.3s ease-out;
      animation-fill-mode: forwards;
    }

    .btn-complete {
      height: 42px;
      text-align: right;
      color: #ffc200;
      font-size: 18px;
      width: 100%;
      background: #fff;
      border: none;
      border-top: 1px solid #eee;
      margin-bottom: 15px;

      span {
        margin-right: 30px;
      }
    }

    .keyboard-row {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      padding: 0 8px;
      color: #333;

      &:first-child {
        margin-top: 0;
      }

      .keyboard-row-items {
        display: flex;
        justify-content: left;
      }

      .keyboard-row-bottom {
        display: flex;
        justify-content: space-between;
      }

      .keyboard-row-item {
        width: 45px;
        height: 45px;
        background: #fff;
        font-size: 20px;
        text-align: center;
        border: 1px solid #ccc;
        /*no*/
        border-radius: 8px;
        color: #333;

        &.bottom {
          height: 45px;
          width: 45px;
          line-height: 45px;
          background: #fff;
          color: #333;
          /*margin-right: 0.08rem;*/
        }

        &.clear {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 25px;
          }
        }
      }

      .none-botton {
        border: none;
        height: 80px;
        width: 66px;
        visibility: hidden;
      }
    }

    button {
      &:active {
        background: #f4f4f4 !important;
        color: #999 !important;
      }
    }
  }

  @keyframes slide_ups {
    from {
      bottom: -220px;
    }

    to {
      bottom: 0px;
    }
  }

  @keyframes slide_dowms {
    from {
      bottom: 0px;
    }

    to {
      bottom: -220px;
    }
  }

  button:disabled {
    background: #f4f4f4 !important;
    color: #8f8f8f !important;
  }

  .active {
    &:active {
      background: #f4f4f4 !important;
      color: #999 !important;
    }
  }
}

.mint-cell-value {
  font-size: 14px;
}

.btn_quote {
  color: #4A66FE;
  border: 1px solid #4A66FE;
}

.carIncustomer {
  margin: 10px;
  // margin-bottom: 50px;
  background: #ffffff;
  padding: 15px;
  border-radius: 5px;
  // height: 90px;

}


.carInCustomers_title h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.carInCustomers_body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: 90%;
}

.entryCarImage img {
  height: 45px;
  border-radius: 5px;
}

.carInCustomers_body .item_plateNo {
  margin-left: 10px;
  width: 70%;
}

.carInCustomers_body .item_plateNo p {
  font-size: 12px;
}

.item_plateNo p:nth-child(1) {
  color: #333;
  margin-bottom: 10px;
}

.item_plateNo p:nth-child(2) {
  color: #999;

}

.carIncustomer .van-swipe__indicator {
  opacity: 1;
}

.attentionScanCode{
  padding: 20px;
}
.scanCodeBox{
  //  width: 220px;
    margin: auto;
    text-align: center;
    padding: 15px;
}
.ScanCodeclose{
  // float: right;
  position: absolute;
    right: 22px;
}

</style>
