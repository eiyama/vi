<template>
  <div  class="quotedetail" style="background-color:#FFF;padding-bottom:70px">
    <mt-header fixed class="def-header" :title="title">
      <div slot="left" v-show='!isShare'  @click="openBack">
        <mt-button icon="back"></mt-button>
      </div>
       <!-- <div slot="right"  @click="isWeixinTrue = true" v-show="shareWeixin" > -->
      <div slot="right" @click="showAction = true" v-show="shareWeixin" >
          <img src="../../assets/images/share-icon.png"  alt="">
      </div>
      <div slot="right" v-if="showShareApp" >
           <shareApp :shareMsg="shareMsg"></shareApp>
      </div>
    </mt-header>
    <div ref="imageWrapper" style="height:100%;">
    <div class="home-carnum bigbox fn-clear homeMargin">
      <ul style="margin-top: 50px;">
        <li class="header-left">
          <img style="float: left;" slot="icon" class="ico-ins" :src="imgages ? imgages : defaultImg">
          <span style="float: left;font-size: 16px;">{{quoteData.insCorp.shortName}}</span>
        </li>
        <li style="display: none;"></li>
        <li  class="header-right" v-show="isNeedManual">投保状态: <span style="color: red;font-weight:400">人工核保中</span></li>
      </ul>
    </div>
    <div class="homeMargin" style="background-color:#F9F9F9;" v-show="isNeedManual">
      <div style="padding:10px;" v-show="isNeedManual">
          <p style="color:#333;font-size:15px;font-weight:400">转人工核保原因:</p>
          <p style="color: red;margin-top:10px" v-html="quoteData.remark"></p>
      </div>
    </div>
    <div class="homeMargin">
      <ul @click="openone">
        <!-- <li class="header-left" id="lala1">投保基本信息 </li>
        <li class="header-right">
          <span style="color:#4192E8">{{quoteData.car.plateNo}}</span>
          <img style="float: right;" slot="icon" :src="require(`@/assets/images/right.png`)">
        </li> -->
        <li style="display:flex;color:#666;align-items: center;">投保信息：<span style="color:#4A66FE">{{quoteData.car.plateNo}}</span><img style="margin:0;height:28px;" slot="icon" :src="require(`@/assets/images/right.png`)"> </li>
      </ul>
    </div>
    <div class="homeMargin"  id="citys">
      <ul>
        <!-- <li class="header-left" id="lala2">投保地区</li>
        <li></li>
        <li class="header-right"><span style="background: #FFFFFF;">{{quoteData.insCity.shortName}}</span></li> -->
        <li style="display:flex;color:#666">投保地区：<span style="background: #FFFFFF;color:#333">{{quoteData.insCity.shortName}}</span></li>
      </ul>
    </div>
    <div class="homeMargin" v-if="showPay||isInsured">
      <div class="middlebox fn-clear" v-show='quoteData.bzRiskKind&&quoteData.bzRiskKind.insureNo'>
        <span class="detail-row-left" v-show="jsRiskNames.jqNoName" style="color:#666">{{jsRiskNames.jqNoName + '：'}}</span>
        <span class="detail-row-right " >{{jsRiskNames.jqNo}}</span>
      </div>
      <div class="middlebox fn-clear" v-show='quoteData.bsRiskKind&&quoteData.bsRiskKind.insureNo'>
        <span class="detail-row-left " v-show="jsRiskNames.syNoName" style="color:#666">{{jsRiskNames.syNoName + '：'}}</span>
        <span class="detail-row-right">{{jsRiskNames.syNo}}</span>
      </div>
      <div style="height:10px;margin-top:5px"></div>
    </div>
    <div class="toubaoBox" style="background:#f7f7f7;">
        <p style="line-height: 40px;">投保方案</p>
        <span @click="showInformation" class="fsInfor" ><img style="height:16px;margin-right:5px;" src="../../assets/images/fsInformation-icon.png" alt="" srcset=""><p>附属信息</p> </span>
    </div>
    <div class="homeMargin" v-if="jiaoq">
      <div class="middlebox fn-clear">
        <span class="detail-row-left header-left" style="font-weight: bold;">交强险</span>
        <span class="detail-row-right header-right" >￥{{quoteData.bzRiskKind.premium}}</span>
      </div>
      <div class="detail-row">
        <span class="smallboxone" style="color:#666">生效时间：{{quoteData.bzRiskKind.beginDate ? quoteData.bzRiskKind.beginDate.substring(0,13)  : '--'}}时 </span>
      </div>
      <div class="middlebox buttomone" style="margin-bottom: 0;">
        <span class="detail-row-left header-left">车船税</span>
        <span class="smallboxone">(代缴)</span>
        <span class="detail-row-right header-right">￥{{quoteData.bzRiskKind.vehicleTax?quoteData.bzRiskKind.vehicleTax.totalTax:0}}</span>
      </div>
      <div class="detail-row">
        <span class="smallboxone">当年应缴: ¥{{quoteData.bzRiskKind.vehicleTax?quoteData.bzRiskKind.vehicleTax.tax:0}}</span>
      </div>
      <div class="detail-row" v-show="qianjiao">
        <span class="smallboxone">往年欠缴：¥ {{quoteData.bzRiskKind.vehicleTax?quoteData.bzRiskKind.vehicleTax.preTax:0}}+滞纳金¥{{quoteData.bzRiskKind.vehicleTax?quoteData.bzRiskKind.vehicleTax.lateFeesOfTax:0}}</span>
      </div>
    </div>
    <hr color="#eee" size="1" style="margin:10px 0px 10px 15px " v-if="shangye">
    <div v-if="shangye" class="fn-clear homeMargin" >
      <div class="middlebox fn-clear">
        <span class="header-left" style="font-weight: bold;">商业险</span>
        <span class="header-right">￥{{quoteData.bsRiskKind.premium}}</span>
      </div>
      <div style="margin-bottom: 20px;">
        <span class="smalltwo" style="color:#666;font-size:12px;">生效时间：{{quoteData.bsRiskKind.beginDate ? quoteData.bsRiskKind.beginDate.substring(0,13)  : '--'}}时</span>
      </div>
      <!-- <div style="border-radius: 5px;" v-show="quoteData.extend.extrasJson && quoteData.extend.extrasJson.pageFields && quoteData.extend.extrasJson.pageFields.length > 0">
        <p style="font-size: 12px; color: rgb(0, 112, 211);line-height:30px" @click="showPageFields">附属信息：
         <span><van-icon :name="isDown ? 'arrow-up' : 'arrow-down'"></van-icon></span>
        </p>
        <table style="width:100%;text-align:center;" v-show="isDown">
          <tr class="extendTable" style="font-size:12px;background:#f0f0f0;padding:2px 0;">
            <td>名称</td>
            <td>值</td>
          </tr>
          <tr class="extendTable" v-for="extendItem in quoteData.extend.extrasJson.pageFields" style="font-size:12px;color:#666">
            <td>{{extendItem.describe}}</td>
            <td>{{extendItem.value}}</td>
          </tr>
        </table>
      </div> -->
      <div class="detail-row-three detail-row-title">
        <ul style="font-size: 14px;color: #999;">
          <li class="detail-row-three-left" >险种</li>
          <li class="detail-row-three-center" >保费(￥)</li>
          <li class="detail-row-three-right" style="text-align:right">不计免赔(￥)</li>
        </ul>
      </div>
      <div class="detail-row-three" v-for="item in quoteData.bsRiskKind.items">
        <ul>
          <li class="detail-row-three-left" >
            <span>{{item.riskKindItemName}}</span>
            <span v-if="item.coverage=='国产'">(国产)</span>
            <span v-else-if="item.coverage=='进口'">(进口)</span>
            <span v-else-if="item.riskKindItemName=='乘客责任险' ">({{item.coverage}}元*{{quoteData.car.passengerCapacity-1}})</span>
            <span v-else-if="item.coverage>0">({{item.coverage}}元)</span>
          </li>
          <li class="detail-row-three-center"><span>{{item.premium}}</span></li>
          <li class="detail-row-three-right" v-if='item.deductiblePremium>0'>{{item.deductiblePremium}}</li>
        </ul>
      </div>
    </div>
    <hr  color="#eee" size="1" style="margin:10px 0px 10px 15px "  v-show="hasNewDevice">
    <div class="equipmentInsurance homeMargin" v-show="hasNewDevice">
      <h3>新增设备险</h3>
      <table>
        <tr class="extendTable" style="background-color:#F3F3F3;color:#999">
          <th>设备名称</th>
          <th>产地</th>
          <th>金额</th>
          <th>日期</th>
          <th>数量</th>
        </tr>
        <tr class="extendTable" v-for="item in quoteData.insuredRiskKindsXZSBSSX" style="color:#333;">
          <td>{{item.name}}</td>
          <td>{{item.origin =="Home" ? "国产" : "进口"}}</td>
          <td>{{item.price}}</td>
          <td>{{item.purchaseDate}}</td>
          <td>{{item.count}}</td>
        </tr>
      </table>
    </div>
    <hr  color="#eee" size="1" style="margin:20px 0px 20px 15px"  v-show="hasNonCar">
    <div class="accidentInsurance" v-show="hasNonCar">
      <h3>非车险</h3>
      <table>
        <tr style="background-color:#F3F3F3;color:#999">
          <th>险种</th>
          <th>档次</th>
          <th>份数</th>
          <th>保费</th>
        </tr>
        <tr v-for="item in quoteData.personInsurances" style="color:#333;">
          <td>{{item.categoryName}}</td>
          <td>{{item.insuranceName}}</td>
          <td>{{item.buyNumber}}</td>
          <td>{{item.amount}}</td>
        </tr>
      </table>
    </div>
     <van-popup  v-model="isInfomation" position="bottom" style="height:100%">
       <div>
       <mt-header fixed class="def-header" title="附属信息">
          <div slot="left"  @click="closeInfor" >
            <van-icon name="cross" size="20px" />
          </div>
        </mt-header>
        <div style="padding:10px 0; margin-top: 49px; " v-if="quoteData.extend">
          <div class="detail-row buss addMargin" v-if="quoteData.bzRiskKind"  >
            <p class="smalltwo" >交强险折扣系数：<span style="color:#333">{{quoteData.bzRiskKind.insDiscount ? quoteData.bzRiskKind.insDiscount : '--'}}</span></p> 
            <p class="smalltwo" >交强险出险次数：<span style="color:#333">{{quoteData.extend.indangerBzQuantity ? quoteData.extend.indangerBzQuantity  : '--' }}</span></p>
            <p class="smalltwo" v-show="quoteData.insCorp.code == 'pingan'">评分：<span style="color:#333">{{quoteData.extend.score ? quoteData.extend.score  : '--' }}</span></p>
          </div>
          <div class="addMargin" style="border-radius: 5px;" v-show="quoteData.extend.indangerBzQuantity">
            <p style="font-size: 14px; color:#999;">交强险出险详情：</p>
            <table style="width:100%;border: 1px solid #eee;">
              <tr class="extendTable" style="font-size:12px;background:#f0f0f0;padding:2px 0;">
                <td>出险时间</td>
                <td>结案时间</td>
                <td>赔付金额（￥）</td>
                <td>保险公司</td>
              </tr>
              <tr class="extendTable" v-for="extendItem in quoteData.extend.bziClaims" style="font-size:12px;color:#333">
                <td>{{extendItem.accidentTime}}</td>
                <td>{{extendItem.endCaseDate}}</td>
                <td>{{extendItem.claimAmount}}</td>
                <td>{{extendItem.insuranceCompanyName}}</td>
              </tr>
            </table>
          </div>
          <hr  color="#eee" size="1" style="margin:20px 0px 20px 15px"  v-if="quoteData.bzRiskKind" >
          <div class="detail-row buss addMargin" v-if="quoteData.bsRiskKind " >
            <p class="smalltwo" >商业险总折扣系数：<span style="color: #333;">{{quoteData.bsRiskKind.insDiscount ? quoteData.bsRiskKind.insDiscount : '--'}}</span> </p>
            <p class="smalltwo" >商业险出险次数：<span style="color: #333;">{{quoteData.extend.indangerBsQuantity ? quoteData.extend.indangerBsQuantity  : '--' }}</span></p>
          </div>
        <div class="addMargin" style="margin-bottom:15px; border-radius: 5px;" v-show="quoteData.extend.indangerBsQuantity ">
        <p style="font-size:14px; color:#999;">商业险出险详情：</p>
        <table style="width:100%;border: 1px solid #eee;">
          <tr class="extendTable" style="font-size:12px;background:#f0f0f0;padding:2px 0;">
            <td>出险时间</td>
            <td>结案时间</td>
            <td>赔付金额（￥）</td>
            <td>保险公司</td>
          </tr>
          <tr class="extendTable" v-for="extendItem in quoteData.extend.bsiClaims" style="font-size:12px;color:#333">
            <td>{{extendItem.accidentTime}}</td>
            <td>{{extendItem.endCaseDate}}</td>
            <td>{{extendItem.claimAmount}}</td>
            <td>{{extendItem.insuranceCompanyName}}</td>
          </tr>
        </table>
      </div>
       <hr   color="#eee" size="1" style="margin:20px 0px 20px 15px" v-show="quoteData.extend.extrasJson && quoteData.extend.extrasJson.pageFields && quoteData.extend.extrasJson.pageFields.length > 0">
          <div class="addMargin" style="border-radius: 5px;" v-show="quoteData.extend.extrasJson && quoteData.extend.extrasJson.pageFields && quoteData.extend.extrasJson.pageFields.length > 0">
          <!-- <p style="font-size: 12px; color: rgb(0, 112, 211);line-height:30px" @click="showPageFields">附属信息：
          <span><van-icon :name="isDown ? 'arrow-up' : 'arrow-down'"></van-icon></span>
          </p> -->
          <table style="width:100%;">
            <tr class="extendTable" style="font-size:12px;background:#f0f0f0;padding:2px 0;">
              <td>名称</td>
              <td>值</td>
            </tr>
            <tr class="extendTable" v-for="extendItem in quoteData.extend.extrasJson.pageFields" style="font-size:12px;color:#333">
              <td>{{extendItem.describe}}</td>
              <td>{{extendItem.value}}</td>
            </tr>
          </table>
        </div>
        </div>
       </div>
     </van-popup>

    <!--低级投保车辆   弹出浮层-->
    <!--<div class="detail-row">
            <span class="reds">* 以上红色部分代表保险公司依据承保政策调整结果！</span>
        </div>-->
    <mt-popup v-model="messageone" position="bottom" popup-transition="popup-fade" class='lili'>
      <div class="messagecc">
        <mt-header fixed class="def-header" title="投保基本信息">
          <div slot="left"  @click="closeone">
            <!-- <mt-button icon="cross" @click="closeone"></mt-button> -->
            <van-icon name="cross"  />
          </div>
        </mt-header>
        <ul>
          <li style="margin-top: 44px;">
            <p> <span class="mesleft">车主名</span> <span class="mesright">{{quoteData.car.owner.name}}</span> </p>
            <p> <span class="mesleft">车主证件号</span> <span class="mesright">{{quoteData.car.owner.idNo.replace(/(\d{5})\d{6}(\d{6})/, "$1******$2")}}</span> </p>
          </li>
          <li>
            <p> <span class="mesleft">车牌号</span> <span class="mesright">{{quoteData.car.plateNo}}</span> </p>
             <p> <span class="mesleft">座位数</span> <span class="mesright">{{quoteData.car.passengerCapacity}}</span> </p>
            <p> <span class="mesleft">车架号</span> <span class="mesright">{{quoteData.car.vin}}</span> </p>
            <p> <span class="mesleft">发动机号</span> <span class="mesright">{{quoteData.car.engineNo}}</span> </p>
            <p> <span class="mesleft">厂牌型号</span> <span class="mesright">{{quoteData.car.model}}</span> </p>
          </li>
          <!-- <li>
             <p> <span class="mesleft">车型价格</span> <span class="mesright">{{quoteData.car.purchasePrice}}</span> </p> 
          </li> -->
          <li>
            <p> <span class="mesleft">注册日期</span> <span class="mesright">{{quoteData.car.registerDate.substring(0,10)}}</span> </p>
            <p> <span class="mesleft">过户车</span> <span class="mesright">{{changedOwner}}</span></p>
          </li>
          <li class="lastone">
            <p> <span class="mesleft">投保人</span> <span class="mesright">{{quoteData.applicant.name}}</span> </p>
            <p> <span class="mesleft">投保人证件号</span> <span class="mesright">{{quoteData.applicant.idNo.replace(/(\d{5})\d{6}(\d{6})/, "$1******$2")}}</span> </p>
            <div style="height: 10px;"></div>
            <p> <span class="mesleft">被保人</span> <span class="mesright">{{quoteData.insured.name}}</span> </p>
            <p> <span class="mesleft">被保人证件号</span> <span class="mesright">{{quoteData.insured.idNo.replace(/(\d{5})\d{6}(\d{6})/, "$1******$2")}}</span> </p>
          </li>
        </ul>
      </div>
    </mt-popup>
   
    <van-popup class="qutotePopup" v-model="isWeixinTrue" position="top" >
        <div style="float: right; text-align: center;margin: 10px;">
          <img src="../../assets/images/img-arrow.png" >
          <div style="margin-top: 10px;font-size: 14px;color: #fff;"><span>点右上角 <van-icon name="weapp-nav"></van-icon>，发送给朋友</span></div>
        </div>
    </van-popup>

    <van-popup v-model="shareinsuranImg" style="width:72%;">
        <div>
              <van-icon @click="shareinsuranImg = false" style="float:right;margin:10px 10px 0 0 ;" size="18" name="close" />
              <img style="width:100%" :src="shareImgUrl" alt="">
              <p style="text-align:center;color:#f44">长按保存或分享给好友</p>
        </div>
    </van-popup>

    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      cancel-text="取消"
       @select="onSelect"
      @cancel="onCancel"
    />
    

    <!-- <van-popup v-model="isPreview" style="width:100%;height:100%" >
      <preview  :fromFather = "true"></preview>
    </van-popup> -->
     <div style="justify-content: flex-end; display:flex;  margin-right:4%;    align-items: center;  margin-top: 20px;">
            <p class="smallboxone">总保费￥：</p>
            <p class="bigreds">{{quoteData.premium}}</p>
          </div>
    </div>

   <!-- <div style="margin-top: 10px;font-size: 14px;color: #0070D3;" v-show="shareWeixin" ><span>点右上角 <van-icon name="weapp-nav"></van-icon>，发送给朋友</span></div> -->
    <footer>
      <div class="mint-footer fn-clear">
        <span class="mint-footer-left">
          <div class="footone">
            <p class="smallboxone">总保费￥：</p>
            <p class="bigreds">{{quoteData.premium}}</p>
          </div>
        </span>
        <div class="btnItem">
          <!-- <van-button type="default" style="background-color:#fff;color:#4A66FE;font-size:14px;border:1px solid #eee; border-width:0 0 0 1px;" v-show="!isInsured" @click="changedInsurance">修改方案</van-button> -->
          <van-button type="info" style="background-color:#4A66FE;color:#FFF;font-size:14px" v-show="isNeedShuanglu" @click="goDualRecord">去双录</van-button>
          <van-button type="default" style="background-color:#fff;color:#4A66FE;font-size:14px;border:1px solid #eee; border-width:0 0 0 1px;" v-show="!loading&&!showPay&&!isInsured&&!isShare&&!isNeedManual&&!isNeedShuanglu" @click="openContributing">添加特约</van-button>
          <van-button type="info" style="background-color:#4A66FE;color:#FFF;font-size:14px;border-width:0 0 0 1px;border-radius:0;" v-show="!loading&&!showPay&&!isInsured&&!isShare&&!isNeedManual&&!isNeedShuanglu" @click="openUnderwriting">立即投保</van-button>
          <van-button type="info" style="background-color:#4A66FE;color:#FFF;font-size:14px" v-show="!loading&&!showPay&&!isInsured&&!isShare&&isNeedManual&&!isNeedShuanglu" @click="refreshOrder">刷新状态</van-button>        
          <van-button type="info" style="background-color:rgb(74, 102, 254);color:#FFF;font-size:14px; border-width:0 0 0 1px;" v-show="!loading&&showPay&&!isInsured&&!isShare" @click="payPage">立即付款</van-button>        
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
import { Toast, Indicator } from 'mint-ui';
import html2canvas from 'html2canvas';
import { ActionSheet } from 'vant';
import axios from 'axios';
import preview from './previewQuoteInfo.vue'
import { Button } from 'vant';
import wx from 'weixin-js-sdk';
import shareApp from './../common/shareApp'
// import {wxshare} from '../../assets/js/wxshare';
export default {
  name: 'quotedetail',
  data() {
    return {
      showAction:false,
      isInfomation:false,
      shareWeixin:false,
      isWeixinTrue:false,
      isPreview:false,
      appId: '',
      token: '',
      title: '报价单',
      defaultImg: this.src = require('../../assets/images/companys/defaultImg.png'),
      jiaoq: true,
      shangye: true,
      show: true,
      qianjiao: true,
      messageone: false,
      whether: '',
      showPay: false,
      isInsured: false,
      isShare: false,
      loading: true,
      unwritData: { //核保提交的数据
        express: {
          receiverAddress: "",
          receiverName: "",
          receiverMobile: "",
          zipCode: "",
          email: "",
          expressType: "SelfTake" //['Send'快递, 'SelfTake'自取]
        },
        "invoice": {
          "ticketAddress": "",
          "depositBankName": "",
          "depositBankAccount": "",
          "certificateNo": "",
          "depositBankPhone": ""
        },
        "photographer": {
          "name": "",
          "phone": "",
          "idNo": ""
        },
        "agent": {
          "name": "",
          "phone": "",
          "idNo": ""
        },

      },
      imgages: '',
      quoteData: {
        payAmount: '',
        orderNo: '',
        insCity: { shortName: "" },
        insBatchNo: "",
        quotationNo: "",
        premium: "",
        insCorpCode: '',
        insureStatus: "",
        insCorp: { shortName: "", code: "" },
        car: { owner: { name: "", phone: "", idNo: "", idType: "", relationType: "", birthday: "", gender: "" }, plateNo: "", vin: "", engineNo: "", model: "", makerModel: "", purchasePrice: "", analogyCarPrice: "", year: "", passengerCapacity: "", registerDate: "", remark: "", exhaustMeasure: "", isChangedOwner: "", aliasName: "" },
        applicant: { name: "", idNo: "", idType: "", relationType: "", birthday: "", gender: "" },
        insured: { name: "", idNo: "", idType: "", relationType: "", birthday: "", gender: "" },
        bzRiskKind: { vehicleTax: { totalTax: "", tax: "", preTax: "", lateFeesOfTax: "" }, beginDate: "", endDate: "", premium: "", insDiscount: "" },
        bsRiskKind: { items: [{ coverage: "", riskKindItemCode: "", riskKindItemName: "", premium: "", isDeductible: "", deductiblePremium: "" }], beginDate: "", endDate: "", premium: "", insDiscount: "" },
        insuredRiskKindsXZSBSSX: [{
          name: "",
          origin: "",
          price: "",
          purchaseDate: "",
          count: ""
        }],
        personInsurances: [{
          categoryName: "",
          insuranceName: "",
          amount: "",
          buyNumber: ""
        }],

      },
      payParams: {
        orderNo: '',
        premium: '',
        idTyp: '',
        name: '',
        idNo: '',
        insBatchNo: '',
        insCorpCode: '',
        relationType: '',
        insCorpName: '',
        riskName: '',
        applicantPhone: '',
      },
      jsRiskNames: {
        jqNoName: '',
        syNoName: '',
        jqNo: '',
        syNo: ''
      },
      changedOwner: '否',
      hasNonCar: false,
      hasNewDevice: false,
      isNeedManual: false,
      isNeedShuanglu: false,
      shareLink:'',
      isDown:false,
      shareinsuranImg:false,
      shareImgUrl:'',
      sTitle:'',
      description:'',
      shareImg:'',
      key:'',
      weixin:{},
      specialCode:[],
      showShareApp:false,
      RiskValue:'',
      shareMsg:{},
      actions: [
        { name: '分享报价单图片' },
        { name: '分享报价单链接' },  
      ]
    }
  },
  components:{
    preview,
    shareApp
  },
  created() {
    var len = window.history.length;
    if (len <= 2) {
      this.isShare = true;
    };
    this.getPolicyDetail();
  },
  mounted:function(){
    var self = this;
    self.appId = self.$route.query.appId;
    localStorage.setItem("appId", self.appId);
    var insBatchNo = self.$route.query.insBatchNo;
    var insCorpName = self.$route.query.insCorpName;
    var insCorpCode = self.$route.query.insCorpCode;
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect 若提示“该链接无法访问”，请检查参数是否填写错误，是否拥有scope参数对应的授权作用域权限。
    var domain = '';
    var currentUrl = document.location.toString();
    if (currentUrl) {
      var arrUrl = currentUrl.split("#");
      domain = arrUrl[0];
    };
    self.shareLink = domain + '#/quoteManagement/preview?appId=' + self.appId +
      '&insBatchNo=' + insBatchNo + '&insCorpCode=' + insCorpCode;
    self.redirectUri = window.location.href;
    var ua = navigator.userAgent.toLowerCase();
    self.isWeixin = ua.indexOf('micromessenger') != -1;
    if (~navigator.userAgent.indexOf('Html5Plus')){  
        if(self.appId == 'cx4180310190219bh6'){
          this.showShareApp = true;        
        }          
     // this.shareMsg
    }
    if (self.isWeixin) {
      self.shareWeixin = true;      
      var wxUrl = window.location.href.split('#')[0];
      var url = '/Configurations?types=weixin&weixin_url=' + encodeURIComponent(wxUrl);
       Indicator.open('加载中...');
      axiosGetAPI(url).then((res) => {
         Indicator.close();
        if (res.status == 200 && res.result && res.result.weixin) {
          self.weixin = res.result.weixin;
          wx.config({
            debug: false, // 开启调试模式,
            appId: self.weixin.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: self.weixin.timestamp, // 必填，生成签名的时间戳
            nonceStr: self.weixin.nonceStr, // 必填，生成签名的随机串
            signature: self.weixin.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'updateAppMessageShareData', 'updateTimelineShareData','closeWindow'] 
          });
        }
      });
    }
  },
  methods: {
    onSelect(item,index){
       this.onCancel()
      if(index == 0){
        this.toImage();
      }
      if(index == 1){
        this.isWeixinTrue = true;
      }     
      // console.log(item,index)
    },
     onCancel() {
      this.showAction = false;
    },
    toImage() {
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

    // printOut(name) {
    //     let shareContent = document.body,//需要截图的包裹的（原生的）DOM 对象
    //       width = shareContent.clientWidth, //获取dom 宽度
    //       height = shareContent.clientHeight, //获取dom 高度
    //       canvas = document.createElement("canvas"), //创建一个canvas节点
    //       scale = 2; //定义任意放大倍数 支持小数
    //     canvas.width = width * scale; //定义canvas 宽度 * 缩放
    //     canvas.height = height * scale; //定义canvas高度 *缩放
    //     canvas.style.width = shareContent.clientWidth * scale + "px";
    //     canvas.style.height = shareContent.clientHeight * scale + "px";
    //     canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
    //     let opts = {
    //       scale: scale, // 添加的scale 参数
    //       canvas: canvas, //自定义 canvas
    //       logging: false, //日志开关，便于查看html2canvas的内部执行流程
    //       width: width, //dom 原始宽度
    //       height: height,
    //       useCORS: true, // 【重要】开启跨域配置
    //     };

    //     html2canvas(shareContent, opts).then(() => {
    //       var contentWidth = canvas.width;
    //       var contentHeight = canvas.height;
    //       //一页pdf显示html页面生成的canvas高度;
    //       var pageHeight = (contentWidth / 592.28) * 841.89;
    //       //未生成pdf的html页面高度
    //       var leftHeight = contentHeight;
    //       //页面偏移
    //       var position = 0;
    //       //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    //       var imgWidth = 595.28;
    //       var imgHeight = (592.28 / contentWidth) * contentHeight;
    //       var pageData = canvas.toDataURL("image/jpeg", 1.0);
    //       var PDF = new JsPDF("", "pt", "a4");
    //       if (leftHeight < pageHeight) {
    //         PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
    //       } else {
    //         while (leftHeight > 0) {
    //           PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
    //           leftHeight -= pageHeight;
    //           position -= 841.89;
    //           if (leftHeight > 0) {
    //             PDF.addPage();
    //           }
    //         }
    //       }
    //       PDF.save(name + ".pdf"); // 这里是导出的文件名
    //     });
    //   },
      // dataURLToBlob(dataurl) {//ie 图片转格式
      //   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      //   bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      //   while (n--) {
      //   u8arr[n] = bstr.charCodeAt(n);
      //   }
      //   return new Blob([u8arr], {type: mime})
      // },
      // downloadResult(name) {
      //   let canvasID = document.body
      //   let a = document.createElement('a');
      //   html2canvas(canvasID).then(canvas => {
      //   let dom = document.body.appendChild(canvas);
      //   dom.style.display = "none";
      //   a.style.display = "none";
      //   document.body.removeChild(dom);
      //   let blob = this.dataURLToBlob(dom.toDataURL("image/png"));
      //   a.setAttribute("href", URL.createObjectURL(blob));
      //   a.setAttribute("download", name + ".png")
      //   document.body.appendChild(a);
      //   a.click();
      //   URL.revokeObjectURL(blob);
      //   document.body.removeChild(a);
      //   });
      // },
      // printOut(name) {
      //   // 个人观察只是截取可见范围以及以下的区域，所以先将滚动条置顶
      //   $(window).scrollTop(0); // jQuery 的方法
      //   document.body.scrollTop = 0; // IE的
      //   document.documentElement.scrollTop = 0; // 其他
      //   this.downloadResult(name)
      // },


    closeInfor(){
       this.isInfomation = false;
    },
    showInformation(){
        this.isInfomation = true;
    },
    showPageFields() {
      this.isDown = !this.isDown;
    },
    initWx: function(title, description, shareImg, shareLink) {      
      wx.ready(function() { //通过ready接口处理成功验证        
        wx.updateAppMessageShareData({ // 分享给朋友  ,在config里面填写需要使用的JS接口列表，然后这个方法才可以用 
          title: title, // 分享标题
          desc: description, // 分享描述
          link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImg, // 分享图标
          success: function() {
            // 设置成功           
          }
        });
        wx.updateTimelineShareData({ //分享朋友圈
          title: title, // 分享标题
          desc: description, // 分享描述
          link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImg, // 分享图标
          success: function() {
            // 设置成功
          }
        });
      });
      wx.error(function(res) { //通过error接口处理失败验证
        // config信息验证失败会执行error函数
        // alert(JSON.stringify(res));
        console.log(res);
      });
    },
   
    changedInsurance: function() {
      var item = this.quoteData;
      var curDate = new Date();
      var hh = curDate.getHours();
      var mm = curDate.getMinutes();
      if (hh >= 8 && hh <=22) {
        if (hh == 22 && mm > 0) {
          Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
          return false;
        }
        var self = this;
        var insBatchNo = this.$route.query.insBatchNo;
        var insCorpCode = this.$route.query.insCorpCode;
        var insCorpName = this.$route.query.insCorpName;
        var cityCode = item.insCity ? item.insCity.code : '';
        var shortName = item.insCity ? item.insCity.shortName : '';
        var carNo = item.car ? item.car.plateNo : '';
        var vin = item.car ? item.car.vin : '';
        var url = "/quoteManagement/index?&selected=2&from=quotedetail&insCityCode=" + cityCode + "&insCityShortName=" +
          shortName + "&plateNo=" + carNo + "&vin=" + vin + '&insBatchNo' + insBatchNo + '&insCorpCode=' + insCorpCode + '&insCorpName=' + insCorpName;
        localStorage.removeItem("insureInfoApp");
        localStorage.removeItem("quoteInfoStatus");
        Indicator.open('加载中...');
        setTimeout(function() {
          Indicator.close();
          self.$router.push({ path: url });
        }, 100);
      } else{
        Toast("非工作时间，报价服务暂未启动。报价服务工作时间：8:00-22:00。");
        return false;
      }
    },
    goDualRecord: function() {
      var insBatchNo = this.$route.query.insBatchNo;
      var insCorpName = this.$route.query.insCorpName;
      var insCorpCode = this.$route.query.insCorpCode;
      var bzInsureNo = this.quoteData.bzRiskKind ? this.quoteData.bzRiskKind.insureNo : '';
      var bsInsureNo = this.quoteData.bsRiskKind ? this.quoteData.bsRiskKind.insureNo : '';
      var userName = this.quoteData.shuanglu ? this.quoteData.shuanglu.name : '';
      var idNo = this.quoteData.shuanglu ? this.quoteData.shuanglu.idNo : '';
      var applicatName = this.quoteData.applicant ? this.quoteData.applicant.name : '';
      var applicantPhone = this.quoteData.applicant ? this.quoteData.applicant.phone : '';
      var url = "/quoteManagement/dualrecord?from=policyList&insBatchNo=" + insBatchNo + "&insCorpCode=" + insCorpCode +
        "&insCorpName=" + insCorpName + "&bzInsureNo=" + bzInsureNo + "&bsInsureNo=" + bsInsureNo +
        "&userName=" + userName + "&applicatName=" + applicatName + "&idNo=" + idNo + "&applicantPhone=" + applicantPhone;
      this.$router.push({ path: url });
    },
    getPolicyDetail() {
      Indicator.open('加载中...');
      var urlone = '/vi/insurePolicies/' + this.$route.query.insBatchNo + '/' + this.$route.query.insCorpCode;
      var appId = this.$route.query.appId;
      //var token = decodeURIComponent(this.$route.query.token);
      if (appId) {
        localStorage.setItem("appId", appId);
      };

      // if (token) {
      //   token = token.replace(' ', '+');
      //   localStorage.setItem('token', appId + '_' + token);
      // };
       var self = this;
       axiosGetAPI(urlone).then((res) => {
        Indicator.close();
        this.loading = false;
        //判断状态
        if (res.result.insureStatus == 'VerifiedSuccess') {
          this.showPay = !this.showPay;
        } else {
          this.isNeedManual = (res.result.insureStatus == 'NeedManualAudit');
          this.isNeedShuanglu = (res.result.insureStatus == 'VerifiedSuccessToShuanglu');
        }
         if(res.result.suggestedInfo){
              self.specialCode = [],
              self.key = res.result.suggestedInfo.key;
              res.result.suggestedInfo.value.map(item=>{
                  if(item.fieldCode == 'RiskKind'){
                      self.RiskValue = item.fieldValue;
                  }
                  if(item.fieldCode == 'SpecialCode'){
                      self.specialCode.push(item.fieldValue);
                  }
                  

              })
          }
        if (res.result && res.result.bsRiskKind && res.result.bsRiskKind.items) {
          res.result.bsRiskKind.items.map(item => {
            item.premium = Math.round(parseFloat(item.premium) * 100) / 100
          })
        }
        this.quoteData = res.result;
        // console.log(this.quoteData)
        if (res.result.bzRiskKind) { this.jiaoq = true; } else { this.jiaoq = false; }
        if (res.result.bsRiskKind) { this.shangye = true } else(this.shangye = false)
        if (this.quoteData.bzRiskKind) {
          if (this.quoteData.bzRiskKind.vehicleTax && this.quoteData.bzRiskKind.vehicleTax.preTax == 0) {
            this.qianjiao = false;
          }
        }
        this.imgages = require(`@/assets/images/companys/${res.result.insCorp.code}.png`);  
        var sTitle = '';
        var description = "";
        if (this.quoteData.car) {
          if (this.quoteData.car.isChangedOwner == true) {
            //this.quoteData.car.isChangedOwner='是'
            this.quoteData.car.isChangedOwner = "false"
          } else {
            //this.quoteData.car.isChangedOwner='否'
            this.quoteData.car.isChangedOwner = 'false'
          }
          if (this.quoteData.car.owner) {
            description = this.quoteData.insCorp.shortName + '-' + this.quoteData.car.owner.name;
            var plateNo = this.quoteData.car.plateNo;
            var vin = this.quoteData.car.vin;
            if (plateNo != null && plateNo != '' && plateNo != '未上牌') {
              sTitle = plateNo + '车险报价单';
              description += '-' + plateNo;
            } else {
              description += '-' + vin;
              sTitle = vin + '车险报价单';
            }
            if (this.quoteData.premium > 0) {
              description += ', 保费总额' + this.quoteData.premium + '元';
            };
            document.title = sTitle;
          };
        };
        var wxUrl = window.location.href.split('#')[0];
        var shareImg = wxUrl +  `static/imgs/companys/${res.result.insCorp.code}.png`;  
        // console.log(wxUrl);
        self.initWx(sTitle, description, shareImg, self.shareLink);
        
        this.shareMsg.type = "web"; 
        this.shareMsg.title = sTitle ; 
        this.shareMsg.content =description;
        this.shareMsg.href = self.shareLink; 
        this.shareMsg.shareImg = [shareImg];
        // wxshare({title:sTitle, desc:description, imgUrl:shareImg, link:self.shareLink});
        this.sTitle = sTitle;
        this.description = description;
        this.shareImg = shareImg;
        this.hasNonCar = (this.quoteData.personInsurances && this.quoteData.personInsurances.length > 0);
        this.hasNewDevice = (this.quoteData.insuredRiskKindsXZSBSSX && this.quoteData.insuredRiskKindsXZSBSSX.length > 0);

        if (res.result) {
          this.payParams.riskName = '';
          this.isInsured = (res.result.insureStatus == 'Insured');
          this.title = this.isInsured ? '投保单详情' : (this.isNeedManual ? '核保详情' : '报价详情');

          if (res.result.bzRiskKind) {
            this.payParams.riskName = '交强险';
            this.jsRiskNames.jqNoName = this.isInsured ? '交强险保单号' : '交强险投保单号';
            this.jsRiskNames.jqNo = this.isInsured ? res.result.bzRiskKind.policyNo : res.result.bzRiskKind.insureNo;
            if (res.result.bzRiskKind.vehicleTax) {
              this.payParams.riskName = '交强险+车船税';
            };
            if (res.result.bsRiskKind) {
              this.payParams.riskName += '+商业险';
              this.jsRiskNames.syNoName = this.isInsured ? '商业险保单号' : '商业险投保单号';
              this.jsRiskNames.syNo = this.isInsured ? res.result.bsRiskKind.policyNo : res.result.bsRiskKind.insureNo;
            };
          } else if (res.result.bsRiskKind) {
            this.payParams.riskName = '商业险';
            this.jsRiskNames.syNoName = this.isInsured ? '商业险保单号' : '商业险投保单号';
            this.jsRiskNames.syNo = this.isInsured ? res.result.bsRiskKind.policyNo : res.result.bsRiskKind.insureNo;
          };
          this.changedOwner = res.result.car.isChangedOwner == true ? '是' : '否';
        };

      });
    },
    refreshOrder() {
      this.getPolicyDetail();
    },
    //跳转到特约
    openContributing: function() {
      var self = this;
      if(this.key == "UnderwritingSpecials"){
        var specialCode = JSON.stringify(this.specialCode);
        var RiskValue =  this.RiskValue;
        sessionStorage.setItem('specialCode',specialCode);
        sessionStorage.setItem('RiskValue',RiskValue);
      }
      self.$router.push({ path: "/contributing", query: { insBatchNo: self.$route.query.insBatchNo, insCorpCode: self.$route.query.insCorpCode, insCorpName: self.$route.query.insCorpName, from: "detail" } });
    },
    //跳付款
    payPage() {
      var self = this;
      /* var payer = {
          "idType": this.quoteData.insured.idType,
          "relationType": this.quoteData.car.owner.relationType,
          "birthday": this.quoteData.insured.birthday,
          "gender": this.quoteData.insured.birthday,
          "name": this.quoteData.insured.name,
          "phone": this.quoteData.insured.phone,
          "idNo": this.quoteData.insured.idNo
      } */
      Indicator.open('加载中...');
      axiosPostAPI('/vi/insurePolicies/' + this.quoteData.insBatchNo + '/' + this.$route.query.insCorpCode + '/orders', {
        model: this.quoteData.insured
      }).then((data) => {
        Indicator.close();
        if (data.status == 200) {
          self.payParams.orderNo = data.result.orderNo
          self.payParams.premium = data.result.payAmount
          self.payParams.idType = this.quoteData.applicant.idType;
          self.payParams.name = this.quoteData.applicant.name;
          self.payParams.idNo = this.quoteData.applicant.idNo ;
          self.payParams.insBatchNo = this.quoteData.insBatchNo;
          self.payParams.insCorpCode = this.quoteData.insCorp.code;
          self.payParams.relationType = this.quoteData.applicant.relationType
          self.payParams.insCorpName = this.$route.query.insCorpName;
          self.payParams.applicantPhone = this.quoteData.applicant.phone;
          self.payParams.plateNo = self.quoteData.car.plateNo;

          self.$router.push({ path: "/payPage", query: self.payParams });
        }
      });

    },
    //弹层
    closeone: function() {
      this.messageone = false
    },
    openone: function() {
      this.messageone = true
    },
    openBack: function() {
      var quoteInfoStatus = localStorage.getItem('quoteInfoStatus');
      if (quoteInfoStatus) {
        var quoteJson = JSON.parse(quoteInfoStatus);
        if (quoteJson) {
          quoteJson.status = { num: '3', size: 1, isScheme: true, isResult: true }
          localStorage.setItem("quoteInfoStatus", JSON.stringify(quoteJson));
        }
      }
      window.history.back();
    },
    openUnderwriting: function() {
      if (this.quoteData.insCity.code != 440300 && this.quoteData.insCorp.code != 'picc') {
        var that = this;
        var obj = {};
        obj.relationType = that.quoteData.applicant.relationType; //拥有者类型
        obj.insBatchNo = that.quoteData.insBatchNo; //投保编号
        obj.insCorpCode = that.quoteData.insCorp.code; //投保保险公司编号
        obj.invoiceName = that.quoteData.applicant.name; //拥有者姓名
        obj.insCorpName = that.quoteData.insCorp.shortName; //投保保险公司编号
        this.$event.$emit('handle-insure', obj);
        var url = '/vi/insurePolicies/' + this.quoteData.insBatchNo + '/' + that.quoteData.insCorp.code
        that.unwritData.agent = null;
        that.unwritData.photographer = null;
        that.unwritData.invoice = null;
        axiosPostAPI(url, that.unwritData).then((res) => {
          var quoteJson = {
            insCorpCode: obj.insCorpCode,
            insBatchNo: obj.insBatchNo,
            insCorpName: obj.insCorpName
          }
          Indicator.close();
          this.$router.push({ path: "/quoteManagement/uwResult", query: quoteJson });
        })
      } else {
        var that = this;
        var obj = {};
        obj.relationType = that.quoteData.applicant.relationType; //拥有者类型
        obj.insBatchNo = that.quoteData.insBatchNo; //投保编号
        obj.insCorpCode = that.quoteData.insCorp.code; //投保保险公司编号
        obj.invoiceName = that.quoteData.applicant.name; //拥有者姓名
        obj.invoiceIdNo = that.quoteData.applicant.idNo 
      //  obj.invoiceIdNo =  that.Common.Public.idCardEncryption(that.quoteData.applicant.idNo ); //拥有者证件号idCardEncryption
        obj.insCorpName = that.quoteData.insCorp.shortName; //投保保险公司编号
        obj.insCity = that.quoteData.insCity;
        obj.car = that.quoteData.car;
        obj.insCorp = that.quoteData.insCorp;
        obj.insBatchNo = that.quoteData.insBatchNo;
        obj.shuangluName = that.quoteData.shuanglu ? that.quoteData.shuanglu.name : "";
        obj.shuangluIdNo = that.quoteData.shuanglu ? that.quoteData.shuanglu.idNo : "";
        this.$event.$emit('handle-insure', obj);
        var quoteJson = {
          insCityCode: obj.insCity.code,
          insCorpCode: obj.insCorpCode,
          insBatchNo: obj.insBatchNo,
          insCorpName: obj.insCorpName,
          relationType: obj.relationType,
          shuangluName: obj.shuangluName,
          shuangluIdNo: obj.shuangluIdNo,
          invoiceName: obj.invoiceName,
          invoiceIdNo: obj.invoiceIdNo
        }
        this.$router.push({ path: "/quoteManagement/underwriting", query: quoteJson });
      }
    }
    //  Modifyinsured:function(){
    //     var quoteInfoStatus = localStorage.getItem('quoteInfoStatus');
    //     var quoteJson = JSON.parse(quoteInfoStatus);
    //     quoteJson.status = {num: '2', size: 33.3, isScheme: true, isResult: false }
    //     localStorage.setItem("quoteInfoStatus", JSON.stringify(quoteJson));
    //    //this.$router.push({path:"/quoteManagement/insureScheme"})
    //      window.history.back();
    // }

  }
}

</script>
<style scoped>
.quotedetail{
  padding: 0;
}

.homeMargin{
  margin:0 4%;
}

.quotedetail #promptly {
  height: 50px;
}

.quotedetail #promptly .footone {
  color: #B1C4DB;
  height: 60px;
  text-align: left;
  padding-left: 4%;
  float: left;
  width: 63%;
  background: #FFFFFF;
  border: none;
}

.quotedetail #promptly .foottwo {
  line-height: 50px;
}

.quotedetail .home-carnum img {
  width: 24px;
  height: 26px;
  margin-top: 8px;
}

.quotedetail #btnss {
  color: #0070D3;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  width: 90px;
  height: 22px;
  line-height: 22px;
  background: #FFFFFF;
}

.quotedetail #citys {
  /* border-bottom: 10px solid #F9F9F9; */
  margin-bottom: 25px;
}

.quotedetail .buttomone {
  margin-bottom: 10px;
}

/* .quotedetail .buss {
  margin-bottom: 5px;
} */

.quotedetail .bigreds {
  color: #FC3738;
  font-size: 18px;
}

.quotedetail .messagecc {
  height: 100%;
  width: 100%;
}

.quotedetail .lili {
  bottom: 0;
  top: 0;
}

.quotedetail .quoteDatau {
  border: 0;
  padding: 0 4%;
}

.quotedetail .quoteDatau img {}

.quotedetail .lastone {
  border: none;
}

.quotedetail .lineh {
  line-height: 45px;
}

.quotedetail .Reduction {
  background: #F6F6F6;
  border: 1px solid #E0E0E0;
  width: 60px;
  height: 18px;
  font-size: 12px;
  color: #888888;
  display: inline-block;
  text-align: center;
  border-radius: 4px;
}

.btnItem {
  display: flex;
  height: 100%;
  float: right;
  vertical-align: middle;
  text-align: center;
 
}

.btnItem button {
  /* flex: 1; */
  /* width: 75%; */
  height: 100%;
}

.accidentInsurance {
  margin: 20px 4%;
}

.accidentInsurance h3 {
  font-size: 14px;
  color: #333333;
  font-weight: normal;
  text-align: left;
  font-weight: bold;
}

.accidentInsurance table {
  width: 100%;
 text-align: left;
}

.accidentInsurance table tr:nth-child(1) th {
  height:30px;
  font-size: 14px;
  font-weight: normal;
  color: #999;
  padding-left: 5px;
}


.accidentInsurance table td {
  font-size: 12px;
  font-weight: normal;
  color: #333;
  padding-left: 5px;
}

.accidentInsurance table td:nth-child(1) {
  width: 20%;
}

.accidentInsurance table td:nth-child(2) {
  width: 50%;
}

.accidentInsurance table td:nth-child(3) {
  width: 15%;
}

.accidentInsurance table td:nth-child(4) {
  width: 15%;
}

.equipmentInsurance {
  margin: 20px 4%;
}

.equipmentInsurance h3 {
  font-size: 14px;
  color: #333333;
  font-weight: normal;
  text-align: left;
  font-weight: bold;
}

.equipmentInsurance table {
  width: 100%;
  text-align: center;
}

.equipmentInsurance table tr:nth-child(1) th {
  font-size: 14px;
  font-weight: normal;
  color: #333;
  padding:5px;
  text-align: left;
}

.equipmentInsurance table td {
  font-size: 12px;
  font-weight: normal;
  color: #666;
  padding:5px;
  text-align: left;
}

.extendTable{border: 1px solid #eee;}

.extendTable td{
  padding: 5px;
  
}


.toubaoBox{
    background: rgb(247, 247, 247);
    height: 50px;
    display: flex;
    padding: 0 15px;
    justify-content: space-between;
    /* line-height: 85px; */
    /* padding-top: 10px; */
    border-bottom: 1px solid #f0f0f0;
    border-top: 1px solid #f0f0f0;
    align-items: center;
}

.quotedetail .smalltwo{
  font-size: 14px;
  color:#999999;
}

.addMargin{
  margin: 0 15px;
}

.fsInfor{
    color: rgb(74, 102, 254);
    text-align: center;
    border: 1px solid #eee;
    height: 28px;
    font-size: 12px;
    line-height: 24px;
    width: 90px;
    border-radius: 6px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
}

.header-right img{
  height:25px;
}

</style>
