<template>
  <div style="background-color:#F5F5F5">
    <mt-header fixed class="def-header" title="客户">
      <mt-button slot="right" >
        <!-- <img :src="searchImg" style="width:22px;height:22px;margin-top:8px" /> -->
        <span style="display:flex;align-items: center;">
          <p @click="screenBtn" style="margin-right: 3px;color: #7d7e80;">筛选</p>
          <img @click="screenBtn" style="height: 16px;" src="./../../assets/images/filtration.png" />
        </span>
      </mt-button>
    </mt-header>
    <div style="margin-top:48px">
      <!-- <div style="display: flex;align-items: center;background: #FFFFFF;"> -->
          <van-tabs  v-model="active" @click="overDueDays" color="#4A66FE" >   
            <van-tab title="30天到期"></van-tab>
            <van-tab title="60天到期"></van-tab>
            <van-tab title="90天到期"></van-tab>
            <van-tab title="全部"></van-tab>
          </van-tabs>      
      <!-- </div> -->
      <div :style="cwrppera" ref="wrppera">
        <ul class="mcust-list mmint-region" v-show="hasCustomersData">
          <li class="mmint-cell" v-for="(item,index) in customersData" :key="index" @click="custDetail(item,$event)">
            <div class="itemTitle">
              <span style="display: flex;align-items: center;" >
                <img style="height: 20px;" src="./../../assets/images/user-icon.png"  />
                <p  style=" margin: 0 6px;max-width:150px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: bold;">{{item.carOwnerName ? item.carOwnerName : item.name ? item.name : '--' }}</p>
                <a  v-if="item.phone" @click.stop >
                  <img   @click="clickWrapper(item.phone)" style="height: 20px;" src="./../../assets/images/phone.png" />
                </a>
              </span>
              <span style="display: flex;align-items: center;">
                <p style="color: #f44;">
                  {{ item.bzOverduedays ? "还剩" + (item.bsOverduedays ? (item.bzOverduedays - item.bsOverduedays > 0 ? item.bsOverduedays : item.bzOverduedays) : item.bzOverduedays) + "天到期" : (item.bsOverduedays ? "还剩" + item.bsOverduedays + "天到期" : "")}}</p>
                <van-icon name="arrow" color="#999999"/>
              </span>
            </div>
          <span style="display: flex;justify-content: space-between;align-items: center;margin:10px 0">
              <span v-if="item.vin">
                  <p style="color: #666;">{{item.vin ? item.vin : '--' }}</p>
              </span>
            <p style="color:#666">{{item.insCorpName ? item.insCorpName : '--' }}</p>
          </span>
            <div class="itemBody">
              <span v-if="item.plateNo" class="itemBody_title">
                <p >{{item.plateNo }}</p>
              </span>
              <span class="itemBody_script">
                <p >交强险止期：{{item.bzLastYearEndDate ? item.bzLastYearEndDate : '--' }}</p>
                <p >商业险止期：{{item.bsLastYearEndDate ? item.bsLastYearEndDate : '--' }}</p>
              </span>
            </div>
<!--      <img :src="carImg" style="position: absolute;right:89%;width: 25px; height: 25px;">
            <h4 class="mmint-title" style="margin-left:25px;line-height:35px">
              {{item.owner.name ? item.plateNo + " - " + item.owner.name : (item.plateNo ? item.plateNo : "未上牌")}}
            </h4>
            <img :src="defaultImg" style="position: absolute;left:90%;width: 25px; height: 25px;">
            <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px;" />
            <p style="color:#666;font-size:12px;margin-top:5px">VIN: {{item.vin}}</p>
            <p style="color:#666;font-size:12px">品牌型号: {{item.model}}</p>
            <p style="color:#666;font-size:12px">注册日期: {{item.registerDate ? item.registerDate.split(' ')[0] : ""}}</p> -->
          </li>
          <li class="mdown">
            <img :src="srcitem" v-show="hasCustomersData&&imgshow">
            <p v-show="textshow" style="color: #999;" >无更多数据了</p>
          </li>
        </ul>
        <div class="non-data" v-show="!hasCustomersData">
          <img src="../../assets/images/icon-nothing.png">
        </div>
      </div>

      <!-- <mt-popup v-model="showQuery" position="bottom" popup-transition="popup-fade" class='clili'>
        <div class="cmessagecc">
          <mt-header fixed class="def-header" title="客户查询">
            <div slot="left">
              <mt-button style="font-size:15px;color:#0070D3" @click="closeone(false)">取消</mt-button>
            </div>
            <div slot="right">
              <mt-button style="font-size:15px;color:#0070D3" @click="closeone(true)">确定</mt-button>
            </div>
          </mt-header>
          <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px;margin-top:48px;" />
          <div class="mint-region" style="color:#FC3738;padding:10px">
            <span style="color:#333;font-weight:bold;line-height:30px">车辆信息:</span>
            <mt-field class="mint-formItm" label="车主名" type="text" :disabled="true" v-show="false">
              <input v-model="ownerName" type="text" placeholder="输入车主名">
            </mt-field>
            <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
            <mt-field label="车牌号" class="upper" type="text" :disabled="isNonPlateNo" placeholder="输入车牌号" v-model="plateNo">
              <mt-switch @change="turn" v-model="isNonPlateNo">未上牌</mt-switch>
            </mt-field>
            <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
            <mt-field class="mint-formItm upper" label="车架号" :disabled="true">
              <input class="mint-input" type="text" v-model="vin" placeholder="输入车架号">
            </mt-field>
            <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
            <div style="display: flex;height:45px;align-items:center;">
              <span style="float:left;color:#333;margin-left:15px;width:80px">到期天数:</span>
              <van-radio-group v-model="searchDay" style="display: inline-flex;">
                <van-radio name="90">90天</van-radio>
                <van-radio name="60" style="margin-left:10px">60天</van-radio>
                <van-radio name="30" style="margin-left:10px">30天</van-radio>
                <van-radio name="10" style="margin-left:10px">10天</van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
      </mt-popup> -->
      <mt-popup style="width: 80%;height: 100%;padding: 0 10px;" v-model="showFilter" position="right" popup-transition="popup-fade">
        <mt-header fixed class="def-header" title="筛选">
          <div slot="left">
            <mt-button icon="back" @click="showFilter = false"></mt-button>
          </div>
        </mt-header>
        <div style="margin-top: 49px;padding-top: 0.5px;">
           <!-- <div class="popop-item">
            <p>到期天数（交强险或商业险）：</p>
            <van-row gutter="20" style="margin: 0;">
              <van-col class="item_col" :class="{isActive:bsselected === bsindex}" :key="bsindex" span="7" v-for="(bsItem,bsindex) in bsEndTime" >
               <p  @click="selectBstime(bsItem,bsindex)"> {{bsItem.name}}</p>
              </van-col>
            </van-row>
          </div> -->
          <!-- <div class="popop-item">
            <p>跟进状态</p>
            <van-row gutter="20" style="margin: 0;">
              <van-col class="item_col" :class="{isActive:trackSelected === trackIndex }" span="11" :key="trackIndex" v-for="(trackItem,trackIndex) in trackStatus" >
               <p  @click="selectTrackStatus(trackItem,trackIndex)"> {{trackItem.description}}</p>
              </van-col>
            </van-row>
          </div> -->
          <div class="popop-item">
            <p>客户来源：</p>
            <van-row gutter="20" style="margin: 0;">
              <van-col class="item_col" :class="{isActive:customerSelected === customerIndex}" span="9" :key="customerIndex" v-for="(customerItem,customerIndex) in customerFrom" >
               <p  @click="selectCustomerFrom(customerItem,customerIndex)"> {{customerItem.display}}</p>
              </van-col>
            </van-row>
          </div>
           <div class="popop-item">
            <p>客户状态：</p>
            <van-row gutter="20" style="margin: 0;">
              <van-col class="item_col" :class="{isActive:customerStatusSelected === customerStatusIndex}" span="7" :key="customerStatusIndex" v-for="(customerStatusItem,customerStatusIndex) in customerStatus" >
               <p  @click="selectCustomerStatus(customerStatusItem,customerStatusIndex)"> {{customerStatusItem.name}}</p>
              </van-col>
            </van-row>
          </div>
            <div class="mint-region" style="color:#FC3738;padding:10px">
            <span style="color:#333;font-weight:bold;line-height:30px">车辆信息:</span>
            <mt-field class="mint-formItm" label="车主名" type="text" :disabled="true" >
              <input v-model="ownerName" type="text" placeholder="输入车主名">
            </mt-field>
            <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
            <mt-switch style="color:#333;margin-left:10px;" @change="turn" v-model="isNonPlateNo">未上牌</mt-switch>
            <mt-field label="车牌号" class="upper" type="text" :disabled="isNonPlateNo" placeholder="输入车牌号" v-model="plateNo">
            </mt-field>
            <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
            <mt-field class="mint-formItm upper" label="车架号" :disabled="true">
              <input class="mint-input" type="text" v-model="vin" placeholder="输入车架号">
            </mt-field>
        
          </div>
        </div>
          <div class="popup_Bottom">
                <p class="reset" @click="ResetFilter">重置</p>
                <p class="commit" @click="CommitFilter">确定</p>
          </div>
      </mt-popup>
    </div>
    <div class="container-bottom">
      <bottomTab ref="bottomTab" :plant.sync="plante"></bottomTab>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { InfiniteScroll } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
import { Indicator } from 'mint-ui';
import bottomTab from './../bottomtab/bottom-tab';
import store from './../../store/store';
import * as types from './../../store/types';
import BScroll from 'better-scroll';
import { RadioGroup, Radio } from 'vant';
export default {
  name: 'home',
  data() {
    return {
      bzEndTime:[{name:'0-30天',code:'30'},{name:'30-60天',code:'60'},{name:'60-90天',code:'90'},{name:'90天+',code:'90'}],
      active:0,
      bsEndTime:[{name:'30天内',code:'30'},{name:'60天内',code:'60'},{name:'90天内',code:'90'},{name:'120天内',code:'120'}],
      bsselected:'',
      bzselected:'',
      customerStatusSelected:'',
      trackSelected:'',
      customerSelected:'',
      customerValue:'',
      customerStatusValue:'',
      trackValue:'',
      customerTitle: '',
      selected: '1',
      plante: 'customer',
      shouldShowLayer: false,
      hasCustomersData: false,
      loadmoreActive: true,
      limit: 20,
      lengths: '',
      overduedays: '366',
      imgshow: false,
      textshow: false,
      srcitem: this.src = require('../../assets/images/ajax-loader.gif'),
      customersData: [{ "customerId": 0, "level": "H", "name": "", "phone": "15013514981", "email": "", "owner": { "name": "", "phone": "", "idNo": "", "idType": "IdCard", "relationType": "Person", "birthday": "", "gender": "Male" }, "plateNo": "", "vin": "", "engineNo": "", "brandName": "", "model": "", "makerModel": "", "vehicleModelCode": "", "purchasePrice": "", "analogyCarPrice": "", "year": "", "passengerCapacity": "", "registerDate": "", "remark": "", "exhaustMeasure": "", "isChangedOwner": "", "changedOwnerDate": "", "aliasName": "", "seriesName": "", "fullPriceModel": "" }],
      cwrppera: {
        "width": "100%",
        "overflow": "hidden",
        "background-color": "#F5F5F5",
      },
      showQuery: false,
      ownerName: "",
      plateNo: "",
      vin: "",
      isNonPlateNo: false,
      searchImg: this.src = require('../../assets/images/ico-search.png'),
      defaultImg: this.src = require('../../assets/images/right.png'),
      carImg: this.src = require('../../assets/images/ic-car.png'),
      searchDay: "",
      showFilter:false,
      endDueDay:'',
      trackStatus:[],
      customerStatus:[
        {
          name:'待续保',
          value:'None'
        },
         {
          name:'已出单',
          value:'PolicyConfirmation'
        },
        {
          name:'战败',
          value:'OrderFailure'
        }
      ],
      customerFrom: [
        {
            "text": "QuotedIn", 
            "value": 0, 
            "display": "报价录入"
        }, 
        {
            "text": "CameraIn", 
            "value": 1, 
            "display": "摄像头进店"
        }, 
        {
            "text": "ManualIn", 
            "value": 2, 
            "display": "人工录入"
        }, 
        {
            "text": "PushSMS", 
            "value": 3, 
            "display": "推修短信"
        }, 
        {
            "text": "ImportCustomer", 
            "value": 4, 
            "display": "导入客户"
        }, 
        {
            "text": "PhoneIn", 
            "value": 5, 
            "display": "电话呼入"
        }
    ],
    url:'',
    startDate:'',
    endDate:''
    }
  },
  components: {
    bottomTab
  },
  created() {
    this.initHeight();
    // this.getCustomers();  
    axiosGetAPI('/vi/repairOrder/getWordBooks?moduleName=' + '客户管理' + '&type=' + '跟进状态').then(res=>{
      if(res.result){
          this.trackStatus = res.result;
      }
    })
  },
  methods: {
    clickWrapper(phone){
      console.log(phone)
      window.location.href = "tel:" + phone;
    },
    ResetFilter(){
        this.bsselected = ''
      this.bzselected = ''
      this.customerStatusSelected = ''
      this.trackSelected = ''
      this.customerSelected = ''
    },
    CommitFilter(){
      var url = 'vi/customers?offset=0';
      if(this.customerValue){
        url = url + "&originType=" + this.customerValue;
      }
      if(this.customerStatusValue ){
        url = url + '&status=' + this.customerStatusValue;
      }
      if(this.bsValue){
        url = url + '&overduedays=' + this.bsValue;
      }
      if(this.ownerName) {
         url = url + '&ownerName=' + this.ownerName;
      }
      if(this.plateNo) {
         url = url + '&plateNo=' + this.plateNo;
      }
      if(this.vin) {
         url = url + '&vin=' + this.vin;
      }
      this.url = url;
        Indicator.open('加载中...');
        axiosGetAPI(url).then(res=>{
        if (res.result && res.result != '') {
          this.customersData = res.result;
          this.hasCustomersData = true;
          this.lengths = this.customersData.length
          if (res.page.totalRows == 0) {
            this.textshow = false;
            this.imgshow = false;
          } else if (this.lengths == res.page.totalRows) {
            this.textshow = true;
            this.imgshow = false;
          } else {
            this.imgshow = false;
          };
        } else {
          this.textshow = false;
          this.imgshow = false;
          this.hasCustomersData = false;
        }
        Indicator.close();
        this.showFilter = false
        })
    },
    selectCustomerFrom(item,index){
         if (this.customerSelected === index) {
        this.customerSelected = "";
        this.customerValue = '';
      } else {
        this.customerSelected = index;
        this.customerValue = item.text;
      }
    },
    selectCustomerStatus(item,index){
        if (this.customerStatusSelected === index) {
        this.customerStatusSelected = "";
        this.customerStatusValue = '';
      } else {
        this.customerStatusSelected = index;
        this.customerStatusValue = item.value;
      }
    },
    selectTrackStatus(item,index){
      if (this.trackselected === index) {
        this.trackSelected = "";
        this.trackValue = '';
      } else {
        this.trackSelected = index;
        this.trackValue = item.code;
      }
    },
    selectBztime(item,index){
       if (this.bzselected === index) {
        this.bzselected = "";
        this.bzValue = '';
      } else {
        this.bzselected = index;
        this.bzValue = item.code;
      }
    },
    selectBstime(item,index){
       if (this.bsselected === index) {
        this.bsselected = "";
        this.bsValue = '';
      } else {
        this.bsselected = index;
        this.bsValue = item.code;
      }
    },

    screenBtn(){
      this.showFilter = true;
    },

    turn: function() { // 是否未上牌
      var self = this;
      self.changeCard();
    },
    changeCard: function() { // 有无车牌处理函数
      var self = this;
      self.inputPlateNo = !self.isNonPlateNo;
      if (!self.isNonPlateNo) {
        self.plateNo = "";
      } else {
        self.plateNo = "未上牌";
      }
    },
    //弹层
    closeone: function(flag) {
      var self = this;
      self.showQuery = false;
      if (flag) {
        var url = '/customerManagement/search';
        if (self.plateNo || self.vin) {
          if (self.ownerName) {
            url = url + "?name=" + self.ownerName;
            if (self.plateNo) {
              url = url + "&plateNo=" + self.plateNo;
            }
            if (self.vin) {
              url = url + "&vin=" + self.vin;
            }
          } else if (self.plateNo) {
            url = url + "?plateNo=" + self.plateNo;
            if (self.vin) {
              url = url + "&vin=" + self.vin;
            }
          } else if (self.vin) {
            url = url + "?vin=" + self.vin;
          };
          url = url + "&overduedays=" + self.searchDay;
        } else if (self.searchDay) {
          url = url + "?overduedays=" + self.searchDay;
        } else {
          Toast('请至少选择一个查询条件');
          return;
        }
        self.$router.push({ path: url });
      };
    },
    openone: function() {
      this.showQuery = true;
      this.ownerName = '';
      this.vin = '';
      this.isNonPlateNo = false;
      this.plateNo = '';
    },
    initHeight: function() {
      this.cwrppera.height = window.innerHeight - 100 + 'px';
    },
    refresh() {
      this.contentScroll.refresh();
    },
    GetDateStr: function(AddDayCount) { //定义时间点
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      if (m < 10) m = '0' + m;
      if (d < 10) d = '0' + d;
      return y + "-" + m + "-" + d;
    },
    overDueDays(name,title){
     if(name == 0){
      var startDate = this.GetDateStr(0);
      var endDate = this.GetDateStr(30);
       this.getCustomers(startDate,endDate)
     }
     if(name == 1){
      var startDate = this.GetDateStr(31);
      var endDate = this.GetDateStr(60);
      this.getCustomers(startDate,endDate)
     }
     if(name == 2){
      var startDate = this.GetDateStr(61);
      var endDate = this.GetDateStr(90);
      this.getCustomers(startDate,endDate)
     }
      if(name == 3){
      var startDate = this.GetDateStr(0);
      var endDate = this.GetDateStr(900);
      this.getCustomers(startDate,endDate)
       // this.overduedays = '90';
      //  this.getCustomers('','','900')
     }
    },
    getCustomers: function( startDate,endDate) {
      this.startDate = startDate;
      this.endDate = endDate;
      var param = { offset: 0, limit: this.limit,startOverdueDate:startDate , endOverdueDate:endDate , quotedTimeDesc: true, viExpiredTimeDesc: false };
      // this.overduedays = date
      // if (date && date != '') {
      //   param.overduedays = date
      // }
      Indicator.open('加载中...');
      axiosGetAPI('/vi/customers', param).then((res) => {
        if (res.result && res.result != '') {
          this.customersData = res.result;
          this.hasCustomersData = true;
          this.lengths = this.customersData.length
          if (res.page.totalRows == 0) {
            this.textshow = false;
            this.imgshow = false;
          } else if (this.lengths == res.page.totalRows) {
            this.textshow = true;
            this.imgshow = false;
          } else {
            this.imgshow = false;
          };
        } else {
          this.textshow = false;
          this.imgshow = false;
          this.hasCustomersData = false;
        }
        Indicator.close();
      });
    },
    custDetail: function(item, e) {
      // e.preventDefault();
      // this.$store.commit(types.CUSTDETAILS, item);
      this.$router.push({ path: "/customerManagement/custDetail?customerId=" + item.id });
    },
    filterItem: function(e) {
      var $this = $(e.currentTarget)
      $this.toggleClass('cur');
      $this.siblings().removeClass('cur');
      if ($this.hasClass('cur')) {
        this.shouldShowLayer = true
      } else {
        this.shouldShowLayer = false
      }
    },
    filterList: function(e) {
      var $this = $(e.currentTarget)
      $this.addClass('cur');
      $this.siblings().removeClass('cur');
    },
    addCust: function() {
      this.$router.push({ path: "/customerManagement/addCust" });
    }
  },
  mounted() {
    // this.getCustomers('30');
    this.overDueDays(0,'');
    const contentScroll = new BScroll(this.$refs.wrppera, {
      probeType: 2,
      click: true
    });
    this.contentScroll = contentScroll
    //开始滚动前，更新视图大小
    contentScroll.on("beforeScrollStart", () => {
      this.refresh();
    });
    this.contentScroll = contentScroll;
    contentScroll.on("scrollEnd", () => {
      var maxY = contentScroll.maxScrollY;
      var y = contentScroll.y
      if (y >= maxY + 40) {} else if (y < maxY + 40 && y > maxY) {
        contentScroll.scrollTo(0, maxY + 70, 200);
      } else if (y <= maxY) {
        if (this.lengths == null || this.lengths == '') {
          return;
        };
        var lengths = this.lengths
        var limit = this.limit
        this.imgshow = true;
      //    if(this.customerValue){
      //   url = url + "&originType=" + this.customerValue;
      // }
      // if(this.customerStatusValue ){
      //   url = url + '&status=' + this.customerStatusValue;
      // }
      // if(this.bsValue){
      //   url = url + '&overduedays=' + this.bsValue;
      // }
      // var overDudays = this.bsValue ? this.bsValue : this.overduedays;
        var param = { offset: this.lengths, limit: this.limit, startOverdueDate:this.startDate , endOverdueDate:this.endDate ,originType: this.customerValue,status: this.customerStatusValue,plateNo: this.plateNo, quotedTimeDesc: true, viExpiredTimeDesc: false };
        axiosGetAPI('/vi/customers', param).then((res) => {
          Indicator.close();
          if (res.result && res.result != '') {
            this.lengths = this.customersData.length
            if (res.page.totalRows == 0) {
              this.textshow = false;
              this.imgshow = false;
            } else {
              if (this.lengths < res.page.totalRows) {
                this.imgshow = false;
                this.customersData = [...this.customersData, ...res.result];
              } else {
                this.customersData = [...this.customersData];
                this.textshow = true;
                this.imgshow = false;
              };
            }
            this.hasCustomersData = true;
          } else {
            this.textshow = false;
            this.imgshow = false;
          }
        });
        this.$nextTick(() => {
          this.contentScroll //更新滚动视图
        })
      }
    })
  },

}

</script>
<style scoped>
.mcust-list {
  padding-top: 0.5px;
}

.mcust-list .mmint-region {
  margin-bottom: 10px;
}

.mmint-region .mmint-cell {
  padding: 15px;
  background-color: #FFF;
  border-radius: 5px;
  margin: 10px;
}

.mcust-list .mmint-title {
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.mdown {
  height: 40px;
  text-align: center;
}

.mdown img {
  width: 35px;
  height: 35px;
  margin-top: 5px
}

.mtextshow {
  margin-top: 15px;
  color: #999999
}

.cmessagecc {
  height: 100%;
  width: 100%;
}

.clili {
  bottom: 0;
  top: 200;
}

.itemTitle{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.itemBody{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.itemBody_title{
    background: #1641b4;
    padding: 3px;
    border-radius: 5px;
}

.itemBody_title p{
    color: #fff;
    border-radius: 5px;
    padding: 0px 5px;
    border: 1px solid #fff;
    font-size: 12px;
    /* width: 70px; */
    text-align: center;
}

.itemBody_script{
  font-size: 12px;
  color: #666;
}

.popop-item{
  margin: 10px 0;
}

.item_col{
    background: #F9F9F9;
    text-align: center;
    margin: 5px;
    padding: 5px 0;
    border-radius: 5px;
}

.isActive{
  background: #4A66FE;
  color: #FFFFFF;
}

.popup_Bottom{
  position: fixed;
  bottom: 0;
  right: 0;
  height: 50px;
  left: 0;
  background: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup_Bottom .reset{
  text-align: center;
  width: 50%;
  line-height: 50px;
}

.popup_Bottom .commit{
  text-align: center;
  background: #4A66FE;
  width: 50%;
  line-height: 50px;
  color: #FFF;
}

</style>
