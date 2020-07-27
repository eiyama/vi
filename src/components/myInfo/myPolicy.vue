<template>
  <div class="home" style="background-color:#FFF">
    <mt-header fixed class="def-header cust-head" title="我的保单">
      <div slot="left">
        <mt-button icon="back" @click="openBack"></mt-button>
      </div>
      <mt-button slot="right" @click="openone"><img :src="searchImg" style="width:24px;margin-top:8px" /></mt-button>
    </mt-header>
    <hr width="100%" color="#f5f5f5" size="1" style="padding-top:48px" />
    <div ref="wrppera" :style="mywrppera">
      <div class="quota-content">
        <div class="my-policy" v-for="item in policiesData" @click="policyDetail(item,$event)" v-show="!noData">
          <div class="my-policyTitle">
            <div style="width: 65%;">
              <h3>{{item.plateNo ? item.plateNo : item.vin}}-{{item.carOwnerName}}</h3>
              <p>{{item.insuredTime}}</p>
            </div>
            <div style="display: flex;align-items: center;">
              <img slot="icon" :src="item.src ? item.src : defaultImg" width="24" height="24" />
              {{item.insCorpShortName}}
            </div>
            <van-icon name="arrow"></van-icon>
          </div>
          <div class="bzBox" v-show='item.subPolicyNo'>
            <h3 >{{item.policyTypeName}}保单号：</h3>
            <p class="overHidden">{{item.subPolicyNo}}</p>
          </div>
          <div class="bzBox" v-show='item.billSourceName'>
            <h3>保单来源：</h3>
            <p class="overHidden">{{item.billSourceName}}</p>
          </div>
        </div>
        <div class="non-data" v-show="noData">
          <img src="../../assets/images/icon-nothing.png">
        </div>
        <div class="down">
          <img :src="srcitem" v-show="imgshow">
          <p v-show="textshow" class="textshow">无更多数据</p>
        </div>
      </div>
    </div>
    <van-popup v-model="showQuery" position="bottom">
      <div style="height: 100%;width: 100%;">
        <mt-header class="def-header" title="查询保单">
          <div slot="left">
            <mt-button style="font-size:15px;color:#0070D3" @click="closeone(false)">取消</mt-button>
          </div>
          <div slot="right">
            <mt-button style="font-size:15px;color:#0070D3" @click="closeone(true)">确定</mt-button>
          </div>
        </mt-header>
        <hr width="100%" color="#f5f5f5" size="1" />
        <div class="mint-region" style="color:#FC3738;padding:10px">
          <mt-field label="车牌号" class="upper" type="text" :disabled="isNonPlateNo" placeholder="输入车牌号" v-model="plateNo">
            <mt-switch @change="turn" v-model="isNonPlateNo">未上牌</mt-switch>
          </mt-field>
          <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
          <mt-field class="mint-formItm upper" label="车架号" :disabled="true">
            <input class="mint-input" type="text" v-model="vin" placeholder="输入车架号">
          </mt-field>
          <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
          <mt-field class="mint-formItm upper" label="出单日期起" :disabled="true">
            <input class="mint-input" type="text" v-model="pStartDate" readonly="readonly" placeholder="选择出单日期" @click="selStartDate">
            <i class="ico-arrow"></i>
          </mt-field>
          <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
          <mt-field class="mint-formItm upper" label="出单日期止" :disabled="true">
            <input class="mint-input" type="text" v-model="pEndDate" readonly="readonly" placeholder="选择出单日期" @click="selEndDate">
            <i class="ico-arrow"></i>
          </mt-field>
          <hr width="100%" color="#f5f5f5" size="1" style="padding-top:0.1px" />
          <van-popup v-model="showStartDate" position="bottom">
            <van-datetime-picker v-model="currentStartDate" @cancel="startDateCancel()" @confirm="startDateConfirm()" type="date" :min-date="minDate" />
          </van-popup>
          <van-popup v-model="showEndDate" position="bottom">
            <van-datetime-picker v-model="currentEndDate" @cancel="endDateCancel()" @confirm="endDateConfirm()" type="date" :min-date="minDate" />
          </van-popup>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
import { Indicator } from 'mint-ui';
import store from './../../store/store';
import * as types from './../../store/types';
import BScroll from 'better-scroll';
export default {
  name: 'home',
  data() {
    return {
      title: '报价单',
      imgages: '',
      lengths: '',
      limit: 10,
      imgshow: false,
      textshow: false,
      srcitem: this.src = require('../../assets/images/ajax-loader.gif'),
      policiesData: [{
          "policyId": "",
          "insCityShortName": "",
          "insCorpCode": "",
          "insCorpShortName": "",
          "plateNo": "",
          "insuredName": "",
          "applicantName": "",
          "policyNo": "",
          "subPolicyNo": "",
          "premium": "",
          "hasAccidentInsurance": "",
          "isInsuredCSX": "",
          "szxCoverage": "",
          "totalTax": "",
          "insuredTime": "",
          "sellerName": "",
          "billSource": "",
          "billSourceName": "",
          "licenseVehicleType": "",
          "useCharacter": "",
          "policyType": "",
          "policyTypeName": "",
          "vin": "",
          "carOwnerName": "",
          "carRegisterDate": "",
          "beginDate": "",
          "organizationName": "",
          "creatorName": "",
          "carModel": "",
          "modifiedTime": "",
          "auditStatus": "",
          "auditStatusName": "",
          "auditorName": "",
          "auditedTime": ""
        }],
      defaultImg: this.src = require('../../assets/images/companys/defaultImg.png'),
      noData: true,
      mywrppera: {
        "width": "100%",
        "height": "640px",
        "overflow": "hidden",
        "background": "#f7f7f7"
      },
      searchImg: this.src = require('../../assets/images/ico-search.png'),
      showQuery: false,
      isNonPlateNo: false,
      plateNo: '',
      vin: '',
      pStartDate: '',
      pEndDate: '',
      showStartDate: false,
      showEndDate: false,
      currentStartDate: new Date(),
      currentEndDate: new Date(),
      minDate: new Date(1990, 0, 1),
    }
  },
  created: function() {
    this.initHeight();
    this.getPolicies();
    /*this.policiesData.map(item => {
      var insType = '';
      var isBzRiskKind = false;
      var isBsRiskKind = false;
      if (item.bzRiskKind && item.bzRiskKind != '') {
        if (item.bzRiskKind.premium != '' && item.bzRiskKind.premium != 0) {
          insType += '交强险';
          isBzRiskKind = true;
        }
        if (item.bzRiskKind.vehicleTax) {
          if (item.bzRiskKind.vehicleTax.totalTax != '' && item.bzRiskKind.vehicleTax.totalTax != 0) {
            insType += '+车船税'
          }
        }
      }
      if (item.bsRiskKind && item.bsRiskKind != '') {
        if (item.bsRiskKind.premium != '' && item.bsRiskKind.premium != 0) {
          insType += '+商业险';
          isBsRiskKind = true;
        }
      }
      item.insType = insType;
      item.isBzRiskKind = isBzRiskKind;
      item.isBsRiskKind = isBsRiskKind;
    });*/
  },
  methods: {
    selStartDate: function() {
      this.showStartDate = true;
    },
    selEndDate: function() {
      this.showEndDate = true;
    },
    startDateConfirm: function() {
      this.showStartDate = false;
      this.pStartDate = this.Common.Public.dateString(this.currentStartDate);
      console.log(this.currentStartDate);
    },
    startDateCancel: function() {
      this.showStartDate = false;
    },
    endDateConfirm: function() {
      this.showEndDate = false;
      console.log(this.currentEndDate);
      this.pEndDate = this.Common.Public.dateString(this.currentEndDate);
    },
    endDateCancel: function() {
      this.showEndDate = false;
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
        self.plateNo = "暂未上牌";
      }
    },
    closeone: function(flag) {
      var self = this;
      self.showQuery = false;
      if (flag) {
        var url = '/myInfo/searchPolicy';
        if (self.plateNo || self.vin || self.pStartDate || self.pEndDate) {
          if (self.plateNo) {
            url = url + "?plateNo=" + self.plateNo;
            if (self.vin) {
              url = url + "&vin=" + self.vin;
            }
            if (self.pStartDate) {
              url = url + "&startDate=" + self.pStartDate;
            }
            if (self.pEndDate) {
              url = url + "&endDate=" + self.pEndDate;
            }
          } else if (self.vin) {
            url = url + "?vin=" + self.vin;
            if (self.pStartDate) {
              url = url + "&startDate=" + self.pStartDate;
            }
            if (self.pEndDate) {
              url = url + "&endDate=" + self.pEndDate;
            }
          } else if (self.pStartDate) {
            url = url + "?startDate=" + self.pStartDate;
            if (self.pEndDate) {
              url = url + "&endDate=" + self.pEndDate;
            }
          } else if (self.pEndDate) {
            url = url + "?endDate=" + self.pEndDate;
          }
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
      this.isNonPlateNo = false;
      this.plateNo = '';
      this.pStartDate = '';
      this.pEndDate = '';
    },
    initHeight: function() {
      this.mywrppera.height = window.innerHeight - 44 + 'px';
    },
    refresh() {
      this.contentScroll.refresh();
    },
    openBack: function() {
      window.history.back();
    },
    getPolicies: function() {
      Indicator.open('加载中...');
      axiosGetAPI('/vi/policies/my').then((res) => {
        Indicator.close();
        if (res.result && res.result != '') {
          this.noData = false;
          this.policiesData = res.result;

          this.lengths = this.policiesData.length
          if (res.page.totalRows == 0) {
            this.textshow = false;
            this.imgshow = false;
          } else if (this.lengths == res.page.totalRows) {
            this.textshow = true;
            this.imgshow = false;
          } else {
            this.imgshow = true;
          };

          for (var i = 0; i < this.policiesData.length; i++) {
            this.policiesData.map(item => {
              if (item.insCorpCode) {
                  item.src = require(`@/assets/images/companys/${item.insCorpCode}.png`);
                } else{
                  item.src = require(`@/assets/images/companys/defaultImg.png`);
                }
              /*var insType = '';
              if (item.bzRiskKind && item.bzRiskKind != '') {
                insType += '交强险';
                if (item.bzRiskKind.vehicleTax) {
                  if (item.bzRiskKind.vehicleTax.totalTax != '' && item.bzRiskKind.vehicleTax.totalTax != 0) {
                    insType += '+车船税'
                  }
                }
                if (item.bsRiskKind && item.bsRiskKind != '') {
                  insType += '+商业险';
                }
              } else if (item.bsRiskKind && item.bsRiskKind != '') {
                if (item.bsRiskKind.premium != '' && item.bsRiskKind.premium != 0) {
                  insType += '+商业险';
                }
              }
              item.insType = insType;*/
            })
          }
        } else {
          this.textshow = false;
          this.imgshow = false;
        }
      });
    },
    policyDetail: function(item) {
      this.$store.commit(types.POLICYDETAIL, item);
      this.$router.push({ path: "/myInfo/policyDetail?policyId=" + item.policyId });
    }
  },
  mounted() {
    const contentScroll = new BScroll(this.$refs.wrppera, {
      probeType: 3,
      click: true
    });
    this.contentScroll = this.contentScroll
    //开始滚动前，更新视图大小
    contentScroll.on("beforeScrollStart", () => {
      this.refresh();
    })
    this.contentScroll = contentScroll
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
        var param = { offset: lengths, limit: limit };
        axiosGetAPI('/vi/policies/my', param).then((res) => {
          Indicator.close();
          if (res.result && res.result != '') {
            this.policiesData = [...this.policiesData, ...res.result];
            this.lengths = this.policiesData.length
            if (res.page.totalRows == 0) {
              this.textshow = false;
              this.imgshow = false;
            } else {
              if (this.lengths < res.page.totalRows) {
                this.imgshow = true;
                this.policiesData = [...this.policiesData, ...res.result];
              } else {
                this.policiesData = [...this.policiesData];
                this.textshow = true;
                this.imgshow = false;
              };
            }
            for (var i = 0; i < this.policiesData.length; i++) {
              this.policiesData.map(item => {
                if (item.insCorpCode) {
                  item.src = require(`@/assets/images/companys/${item.insCorpCode}.png`);
                } else{
                  item.src = require(`@/assets/images/companys/defaultImg.png`);
                }
                
                /*var insType = '';
                if (item.bzRiskKind && item.bzRiskKind != '') {
                  insType += '交强险';
                  if (item.bzRiskKind.vehicleTax) {
                    if (item.bzRiskKind.vehicleTax.totalTax != '' && item.bzRiskKind.vehicleTax.totalTax != 0) {
                      insType += '+车船税'
                    }
                  }
                  if (item.bsRiskKind && item.bsRiskKind != '') {
                    insType += '+商业险';
                  }
                } else if (item.bsRiskKind && item.bsRiskKind != '') {
                  if (item.bsRiskKind.premium != '' && item.bsRiskKind.premium != 0) {
                    insType += '+商业险';
                  }
                }
                item.insType = insType;*/
              })
            }
          } else {
            this.textshow = true;
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
.my-policy .mt-policy-cell {
  min-height: 30px;

}

.my-policy {
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
}

.my-policy .mint-cell {
  height: 24px;
  min-height: 25px;
}

.my-policy .my-cell-gray {
  color: #666666;
  font-size: 12px;
  padding-right: 15px;
  text-align: center;
  display: block;
}


.down {
  height: 40px;
  text-align: center;
  /* background: #FFFFFF */
}

.down img {
  width: 35px;
  height: 35px;
  margin-top: 5px
}

.textshow {
  margin-top: 5px;
  color: #878484
}

.my-policyTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.my-policyTitle h3 {
  font-size: 14px;
  color: #333333;

}

.my-policyTitle p {
  font-size: 14px;
  color: #333333;
}

.bzBox {
  margin: 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bzBox h3 {
  font-size: 13px;
  color: #666666;
  font-weight: normal;
  width: 40%;
}

.bzBox p {
  font-size: 12px;
  color: #999;
  font-weight: normal;
  text-align: right;
  flex: 1;
}

</style>
