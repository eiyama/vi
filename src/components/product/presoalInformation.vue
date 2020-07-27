<template>
    <div class="page-container">
        <div  style="background:#fff ;position: relative;padding-bottom:1rem">
            <div class="title">
                {{insutanceData.productName}}
            </div>
            <dl class="view01 others">
                <dd>
                    <p> <strong> 保障期间：</strong>{{startTime}} 至 {{endTime}}</p>
                </dd>
                <dd>
                    <p> <strong> 投保计划：</strong> {{insutanceData.plantName}}</p>
                </dd>
                <dd>
                    <p> <strong> 受益人：</strong> 法定受益人&nbsp;  <span @click="showBeneficiary = true">&nbsp; </span>
                    </p>
                    <div v-show="showBeneficiary" id="inpoTextMsgBox2" @click="showBeneficiary = false"></div>
                    <div v-show="showBeneficiary" class="inpoTextMsgBox2" style="margin: 0;">
                            <div>
                                身故受益人是指保险合同中由被保险人或者投保人指定的享有身故保险金请求权的人。网上投保由于身故受益人指定无法得到被保险人的书面确认，所以只接受法定继承人作为身故受益人，法定继承人指法律直接规定可以依法继承被继承人遗产的公民。           
                            </div>
                    </div>
                </dd>
                <dd class="baozhang" style="height: .8rem;">
                    <i @click="showPlanInfos = true">
                        <img src="https://img02.az.jd.com/az360/m/images/common/baozhang-new.png" alt="">
                    </i>
                </dd>
                <dd class="tiaokuang ng-scope ">
                    <i @click="insuranceListBtn(1)">
                        <img src="https://img02.az.jd.com/az360/m/images/common/tiaokuang-new.png" alt="">
                    </i>
                </dd>
            </dl>
            <div class="jiange"></div>
            <div  style="padding: 0 .3rem;margin-top: .2rem;">
                <div>
                    <p class="h3_02"> 投保人资料&nbsp; <span class="inforIcon" @click="showInsurexplain = true">&nbsp;&nbsp;</span></p>
                    <div v-show="showInsurexplain" id="inpoTextMsgBox2" @click="showInsurexplain = false"></div>
                    <div v-show="showInsurexplain" class="inpoTextMsgBox2" style="margin: 0;">
                            <div>
                                投保人：应为具有完全民事行为能力的被保险人本人、对被保险人有保险利益的其他人。或应为对报保险人有保险利益的机关、企业、事业单位和社会团体。
                            </div>
                    </div>                                    
                </div>
                   <ul>
                        <li class="ng-scope" >
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">姓名</span>
                                <input type="text" v-model="ApplicantList.Name"  placeholder="请输入投保人姓名" >     
                            </div>
                        </li>  

                        <li class="ng-scope" >
                            <div class="personnelName cardType" style="border:0;width: 95%;" >
                                <span class="labelTitle ng-binding ">证件类型</span>
                                <input type="text" placeholder="请输入选择证件类型" name=""  @click="isCard = true" readonly v-model="cardType">    
                            </div>
                        </li>  

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">证件号码</span>
                                <input type="text"  v-model="ApplicantList.CertificateNo"  @keyup="ownerNoBirth" placeholder="请输入投保人证件号码" >     
                            </div>
                        </li>  

                        <li class="ng-scope" >
                            <div class="dateInput" style="width: 95%;">
                                <span class="labelTitle ng-binding ">出生日期</span>
                                <input type="text" readonly v-model="ApplicantList.BirthDate" placeholder="请输入投保人出生日期" @click="selapplicantBirthday" >
                            </div>
                        </li>  

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding " style="float:left;">性别</span>
                                <div class="personSex ng-scope">
                                    <span class="radio" @click="genderBtn(item,index)" :class="{active: genderIndex== index}" v-for="(item,index) in genderList" :key="index" >
                                        {{item.name}}
                                    </span>
                                </div>
                            </div>
                        </li>  

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">手机号码</span>
                                <input type="number" v-model="ApplicantList.MobileTelephone" placeholder="请输入投保人手机号码" oninput="if(value.length>11)value=value.slice(0,11)"  >     
                            </div>
                        </li>   

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">电子邮箱</span>
                                <input type="email" v-model="ApplicantList.Email" placeholder="请输入投保人手机号码" >     
                            </div>
                        </li>   
                    </ul> 

            </div>
            <div class="jiange"></div>
            <div class="ins_wrap">                        
                <div >
                    <dd style="width:50%;float:left;height: 0.6rem;line-height: 0.6rem;">
                        <p class="h3_02"> 被保人资料 <span class="inforIcon" @click="showappliexplain = true" >&nbsp;&nbsp;</span></p>
                        <div v-show="showappliexplain" id="inpoTextMsgBox2" @click="showappliexplain = false"></div>
                        <div v-show="showappliexplain" class="inpoTextMsgBox2" style="margin: 0;">
                                <div>
                                    投保人：应为具有完全民事行为能力的被保险人本人、对被保险人有保险利益的其他人。或应为对报保险人有保险利益的机关、企业、事业单位和社会团体。
                                </div>
                        </div> 
                        <p style="font-size: .24rem;color: #999999;">*被保险人限1人</p>
                    </dd>
                    <p style="text-align: right;line-height: 1.2rem;height: 1.2rem;" @click="addInsurance">
                        <a >
                            <img src="https://img02.az.jd.com/az360/m/images/common/new/add.png" style="width: .2rem;margin-right: 0.1rem;" alt="">
                            添加被保人
                        </a>
                    </p>                            
                </div>
                <div v-for="(item,index) in InsurantArr" :key="index">
                    <p style="border-bottom: 1px solid #ddd;"></p>
                    <div class="view01" style="margin: .2rem 0 .2rem 0;padding:0;line-height: 1.2rem;height: 1.2rem;">
                        <dd style="width: 60%;float: left;">
                            <p style="font-weight: bold;font-size: .32rem;">{{item.Name}}  </p>
                            <p style="font-size: .24rem;color: #999999;">证件号：{{item.CertificateNo}}</p>
                        </dd>
                        <!-- <div class="clear"></div> -->
                        <p style="text-align: right;">
                            <img  @click="changeInsurance(item,index)" src="https://img02.az.jd.com/az360/m/images/common/new/edit.png" style="padding: 0 .4rem;width: .36rem;border-right: 1px solid #E3E6EB;" alt="">
                            <img  @click="deleteInsurance(item,index)"  src="https://img02.az.jd.com/az360/m/images/common/new/del.png" style="margin: 0 .4rem;width: .36rem;" alt="">
                        </p>                        
                    </div>
                </div>                
            </div>
            <div class="jiange"></div>
            <div class="new_footer">
                <img class="kufu" src="data:image/png;base64,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" alt="">
                <span class="footer_submit" @click="toNext">
                    立即购买
                </span>
                <span class="footer_price ng-binding">￥{{amount}}</span>
                <span class="footer_text">起</span>
            </div>
        </div>

         <van-popup position="bottom" v-model="isCard">			
				<van-picker show-toolbar :columns="typeResult" @confirm="cardChange"  @cancel="isCard = false" />
		</van-popup>
        <mt-popup position="bottom" v-model="isInsuranceCard">			
				<van-picker show-toolbar :columns="typeResult" @confirm="InsuratChange"  @cancel="isInsuranceCard = false" />
		</mt-popup>
        <mt-datetime-picker  @touchmove.native.stop.prevent ref="insuredBirthday" v-model="insuredBirthday" type="date" :startDate="startDate"  year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"  @confirm="insuredBirthConfirm">
		</mt-datetime-picker>
        <mt-datetime-picker  @touchmove.native.stop.prevent ref="applicantBirthday" v-model="applicantBirthday" type="date" :startDate="startDate"  year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="applicantBirthConfirm">
		</mt-datetime-picker>

        <mt-popup v-model="showTrade" position="bottom" popup-transition="popup-fade">
          <van-picker show-toolbar title="" :columns="tradeColumns"    @cancel="showTrade = false" @confirm="tradeChange" />
        </mt-popup>
        <!-- 保障项目 -->
         <mt-popup position="bottom" v-model="showPlanInfos" style="height:100%;">
            <div class="read-content page-container" style="overflow-y: scroll;height: 100%;font-size: 0.28rem">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="showPlanInfos = false">关闭</span>
                    <h3 class="two_line">保障项目</h3>
                </div>
                <div style="margin-top:1.2rem">     
                    <div style="padding: .1rem .3rem;">
                        <h3 style="padding:0;">保障项目</h3>          
                        <div class="bzxmZ" style="background:#fff;padding:0.2rem 0;">
                            赔偿限额最高为保险金额（人民币：元）
                        </div>
                    </div>
                    <div class="fengexian"></div>
                    <div  v-if="planInfos.length > 0 && planInfos ">
                        <div class="dl01 bzxm_dl ng-scope" v-for="(item,index) in planInfos" :key="index">
                            <div class="bzxm_dl_dt">
                                <p class="bzxm_b" v-html="item.planName"></p>                           
                            </div>
                            <div class="cell-container" v-for="(_item,_index) in item.dutyInfos" :key="_index" >
                                <div class="listfl" v-html="_item.dutyName"></div>                            
                                <div class="listfr" v-show="_item.isContain == null && _item.isOptional == null">{{_item.insuredAmount + _item.insuredAmountUnit}}</div>
                                <div class="listfr" v-show="_item.isContain != null && _item.isOptional == null">{{_item.isContain ? '包含' : '不包含'}}</div>
                                <div class="listfr" v-show="_item.isContain == null && _item.isOptional != null">{{_item.isContain ? '可选' : '不可选'}}</div>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>                 
                </div>
            </div>
		</mt-popup>
        <!-- 添加被保人 -->
          <mt-popup position="bottom" v-model="showAddapplicant" style="height:100%;">
            <div class="read-content page-container" style="overflow-y: scroll;height: 100%;">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="showAddapplicant = false">关闭</span>
                    <h3 class="two_line">添加被保险人</h3>
                </div>
                <div class="insurePersonInfo" style="height: 100%;">
                    <div class="recognizeeRelation" style=" font-size: 0.28rem" >
                        <span>为谁投保</span>
                        <span class="radio" @click="relationBtn(item,index)" :class="{active: RelationIndex == index}" v-for="(item,index) in recognizee" :key="index" >
                            {{item}}
                        </span>    
                    </div>
                    <div class="fengexian"></div>
                    <ul>
                        <li class="ng-scope" >
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">姓名</span>
                                <input type="text" v-model="InsurantList.Name" placeholder="请输入投保人姓名" >     
                            </div>
                        </li>  

                        <li class="ng-scope" >
                            <div class="personnelName cardType" style="border:0;width: 95%;" >
                                <span class="labelTitle ng-binding ">证件类型</span>
                                <input type="text" placeholder="请输入选择证件类型" name=""  @click="isInsuranceCard = true" readonly v-model="InsurantCardType">    
                            </div>
                        </li>  

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">证件号码</span>
                                <input type="text" v-model="InsurantList.CertificateNo" placeholder="请输入投保人证件号码" >     
                            </div>
                        </li>  

                        <li class="ng-scope" >
                            <div class="dateInput" style="width: 95%;">
                                <span class="labelTitle ng-binding ">出生日期</span>
                                <input type="text" v-model="InsurantList.BirthDate" readonly  placeholder="请输入投保人出生日期" @click="selInsuredBirthday" >
                            </div>
                        </li>  

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding " style="float:left;">性别</span>
                                <div class="personSex ng-scope">
                                    <span class="radio" @click="genderBtn(item,index)" :class="{active: genderIndex== index}" v-for="(item,index) in genderList" :key="index" >
                                        {{item.name}}
                                    </span>
                                </div>
                            </div>
                        </li>  

                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">手机号码</span>
                                <input type="number" v-model="InsurantList.MobileTelephone" placeholder="请输入投保人手机号码" oninput="if(value.length>11)value=value.slice(0,11)"  >     
                            </div>
                        </li>   
                     
                        <li class="ng-scope">
                            <div class="personnelName">
                                <span class="labelTitle ng-binding ">职业类别</span>
                                <input type="text" v-model="tradeName" @click="showTrade = true" readonly placeholder="请输入选择职业"  >     
                            </div>
                        </li>  

                    </ul> 
                </div>
                  <div class="new_footer">
                    <div class="submitBuy" @click="addInsuranceList" style="line-height: .88rem;font-size: .34rem;">
                        提交
                    </div>
                </div>
            </div>
		</mt-popup>
        <!-- 投保确认 -->
        <div class="divBTM-new" id="divBFJS" style="opacity: 1; top: 0px;max-height: 75%;" v-show="isInsuranceInfo"> 
            <div class="popups_bfjs" style="height: 100%;bottom: 1rem;transition: all 0.3s ease-in 0s;">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="isInsuranceInfo = false">关闭</span>
                    <h3 class="two_line">投保信息预览</h3>
                </div>
                <div class="">
                    <div class="time_box01 view01 " style="margin-top: 1.2rem">
                        <dl>
                            <dd>
                                <p>
                                    <strong> 保障期间：</strong>
                                    {{startTime}} 至 {{endTime}}
                                </p>
                            </dd>
                            <dd>
                                <p>
                                    <strong>投保计划：</strong>{{insutanceData.plantName}}
                                </p>
                            </dd>
                             <dd>
                                <p>
                                    <strong>投保产品：</strong>{{insutanceData.productName}}
                                </p>
                            </dd>
                        </dl>                        
                    </div>
                    <p class="fengexian"></p>
                    <div class="view01 time_box01">
                        <dl>    
                            <dd  style="margin-top:.2rem">
                                <p>投保人信息</p>
                            </dd>                     
                            <dd>
                                <p>
                                    <strong> 姓名： </strong>
                                    {{ApplicantList.Name}}
                                </p>
                            </dd>
                            <dd>
                                <p>
                                    <strong> 电话号码：</strong>
                                    {{ApplicantList.MobileTelephone}}
                                </p>
                            </dd>
                            <dd>
                                <p>
                                    <strong> 电子邮件：</strong>
                                    {{ApplicantList.Email}}
                                </p>
                            </dd>
                        </dl>
                    </div>
                    <div v-for="(item,index) in InsurantArr" :key="index" >
                        <p class="fengexian"></p>
                        <div class="view01 time_box01">
                            <dd style="margin-top:.2rem">
                                    <p>被保人保人信息</p>                                
                            </dd>
                            <dd>
                                <p>
                                    <strong> 姓名： </strong>
                                    {{item.Name}}
                                </p>
                            </dd>
                                <dd>
                                <p>
                                        <strong> 电话号码：</strong>
                                        {{item.MobileTelephone}}
                                    </p> 
                                </dd>
                        </div>
                    </div>
                <div class="bottom-fixed" style="border-top: 1px solid #eee;">
                    <div class="read-area bottom-fixed">
                            <span class="checkbox-icon" :class="{active:isCheckBox}" @click="showCheckBox"></span>
                            <div class="item-wrapper">
                                <label for="">我已阅读</label>
                                <span @click="insuranceListBtn(0)">《投保须知》</span>
                                <span @click="insuranceListBtn(1)">《保险条款》</span>
                                <span @click="insuranceListBtn(2)" >《法律声明》</span>
                                <span @click="insuranceListBtn(3)">《隐私条款》</span>
                            </div>
                        </div>
                </div>
                </div>
            </div>
        </div>
      <van-popup v-model="showInsuranceList" :close-on-click-overlay="false"  style="height:85%" position="bottom">
            <div class="_closedPopupBtn" >    
                    保险条款
                <div class="header-right" @click="showInsuranceList = false">
                    <i  class="close-icon"></i>
                 </div>
            </div>
            <div style="height:100%" class="h-100p">
            <div style="height:100%">
                <iframe v-if="isTBXZ"  src="https://img02.az.jd.com/az360/doc/%E8%87%BB%E7%88%B12020%E6%8A%95%E4%BF%9D%E9%A1%BB%E7%9F%A5.pdf?time=20200320001" class="clause-iframe"></iframe>
                <iframe v-if="isInsurance"  src="https://img02.az.jd.com/az360/doc/%E4%BA%AC%E4%B8%9C%E5%AE%89%E8%81%94%E8%87%BB%E7%88%B1%E6%97%A0%E9%99%90%E5%8C%BB%E7%96%97%E4%BF%9D%E9%99%A92020%E7%89%88%E6%9D%A1%E6%AC%BE--%E4%B8%AA%E4%BA%BA%E7%89%88%E5%9F%BA%E6%9C%AC%E8%AE%A1%E5%88%92%EF%BC%88%E5%90%AB%E5%8F%AF%E9%80%89%E4%BF%9D%E9%9A%9C%E9%80%82%E7%94%A8%EF%BC%89.pdf" class="clause-iframe"></iframe>
                <iframe v-if="isFLSM"  src="https://img02.az.jd.com/az360/doc/%E6%B3%95%E5%BE%8B%E5%A3%B0%E6%98%8E.pdf" class="clause-iframe"></iframe>
                <iframe v-if="isYMTK"  src="https://img02.az.jd.com/az360/doc/%E4%BA%AC%E4%B8%9C%E5%AE%89%E8%81%94%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4%E6%94%BF%E7%AD%96%E4%B8%8E%E5%A3%B0%E6%98%8E.pdf?time=20200101010101" class="clause-iframe"></iframe>
            </div>
            </div>
		</van-popup> 
    </div>
</template>
<script>
import "./../../assets/css/product.scss";
import "./../../assets/js/rem.js";
import anliandata from "./../../assets/json/alianoccupation.json";
import { axiosGetAPI, axiosPostAPI } from "./../../common/Axios";
import { Indicator,Toast } from 'mint-ui';
let tradeListName = {};
export default {
    data(){
        return{
            startTime:'',
            endTime:'',
            cardType:'',
            amount:'',
            InsurantCardType:'',
            InsurantCardIndex:0,
            isInsuranceCard:false,
            showInsuranceList:false,//投保须知
            isTBXZ:false,
            isInsurance:false,
            isFLSM:false,
            planInfos:[],
            showPlanInfos:false,
            isYMTK:false,
            typeResult : ['居民身份证','统一社会信用代码', '港澳居民来往内地通行证', '台胞证','士兵证/军官证/警官证','中国护照','港澳身份证','外国人永久居留身份证','机构代码','其他'],
			typeCode:[{name:'居民身份证',code:'IdCard'},{name:'统一社会信用代码',code:'CreditCode'},{name:'港澳居民来往内地通行证',code:'MacHKerPassport'},{name:'台胞证',code:'TaiwanesePassport'},{name:'士兵证/军官证/警官证',code:'Soldier'},{name:'中国护照',code:'ChinaPassPort'},
            {name:'港澳身份证',code:'GAIdCard'},{name:'外国人永久居留身份证',code:'ForeignForeverIdCard'},{name:'机构代码',code:'Organization'},{name:'其他',code:'Other'}],
            isCard:false,
            insuranceBirthday:'',
            insuredBirthday: new Date(this.Common.Public.GetDateStr(0)),
            applicantBirthday:new Date(this.Common.Public.GetDateStr(0)),
            startDate: new Date('1949-01-01'),
            genderIndex:0,
            genderList:[{name:'男',code:'man'},{name:'女',code:'moman'}],
            recognizee:['本人','父母','配偶','子女'],
            RelationIndex:0,
            showBeneficiary:false,
            showAddapplicant:false,
            showInsurexplain:false,
            showappliexplain:false,
            insuranceArrIndex:0,
            isChange:false,
            insutanceData:{},
            showTrade:false,
            SKUCode:'',   
            tradeColumns:[],  
            Uwid:'',                  
            ApplicantList:{
                    "Name": "",
                    "CertificateType": '',
                    "CertificateNo": "",
                    "BirthDate": "",
                    "Address": "",
                    "Email": "",
                    "MobileTelephone": ""                                  
            },
            InsurantList:{
                    "Name": "",
                    "CertificateType": '',
                    "CertificateNo": "",
                    "BirthDate": "",
                    "Address": "",
                    "Email": "",
                    "MobileTelephone": "",  
                    "RelationshipWithPolicyholder": 1,
                    "OccupationCode": "B02" 
            },
            InsurantArr:[],
            tradeList:[],
            tradeNameList:[],
            tradeName:'',
            isCheckBox:false,
            isInsuranceInfo:false,
            updataModel:{
            "distributorCode": "CSQD",
            "productCode": "Allianz-ZAAMIP",
            "StartDate": "",
            "EndDate": "",
            "amount": 0,
            "applicantName": "",
            "insurantName": "",
            "orderDetail": {
                "SchemaProductCode": "Allianz-ZAAMIP-GEB",
                "SKUCode": "ZAAMIPB(SI)(GE)",
                "ApplicantList": [
                                    {
                                        "Name": "张三",
                                        "CertificateType": 0,
                                        "CertificateNo": "",
                                        "BirthDate": "",
                                        "Address": "",
                                        "Email": "",
                                        "MobileTelephone": ""
                                    }
                                ],
                "InsurantList": [
                                {
                                "BeneficaryList": [ //受益人
                                        {
                                            "RelationShip": 4,
                                            "Percentage": 100,
                                            "Name": "李四",
                                            "CertificateType": 0,
                                            "CertificateNo": "110101199003101199",
                                            "BirthDate": "1990-03-11 ",
                                            "Address": "北京市 市辖区 东城区",
                                            "Email": "456789@1.com",
                                            "MobileTelephone": "15000000001"
                                        }
                                        ],
                                        "Name": "张三",
                                        "Uwid":'',
                                        "CertificateType": 0,
                                        "CertificateNo": "110101199003075496",
                                        "BirthDate": "1990-03-07",
                                        "Address": "北京市 市辖区 东城区",
                                        "Email": "123456@1.com",
                                        "MobileTelephone": "15000000000",
                                        "RelationshipWithPolicyholder": 1,
                                        "OccupationCode": "B02"
                                    }
                                ],
                "ContactList": []
                },
                "DistributorAttach": "第三方附加信息，仅存储、回调时传给第三方",
                "OrderSource": "WeiXin",
                "Properties": {
                 PayResultUrl:'',
                }
            },
        }
    },
    methods:{

        insuranceListBtn(index){      
            this.showInsuranceList = true;
            if(index == 0){
                this.isTBXZ = true;
                this.isInsurance = false;
                this.isFLSM = false;
                this.isYMTK = false;
            }
            if(index == 1){
                this.isTBXZ = false;
                this.isInsurance = true;
                this.isFLSM = false;
                this.isYMTK = false;
            }
            if(index == 2){
                this.isTBXZ = false;
                this.isInsurance = false;
                this.isFLSM = true;
                this.isYMTK = false;
            }
            if(index == 3){
                this.isTBXZ = false;
                this.isInsurance = false;
                this.isFLSM = false;
                this.isYMTK = true;
            }
        },

        showCheckBox(){
            this.isCheckBox = !this.isCheckBox;
        },
        toNext(){
            if(!this.isInsuranceInfo){
                this.isInsuranceInfo = true;
            }else{       
                if(!this.isCheckBox){
                    Toast('请阅读协议');
                    return;
                }
             if(this.ApplicantList.Name == ''){
                Toast('请输入投保人姓名');                
                return ;
            }
            if(this.cardType == ''){
                Toast('请选择选择投保人证件类型');                
                return ;
            }
            if(this.ApplicantList.BirthDate == ''){
                Toast('请选择投保人出生日期');                
                return ;
            }
            if(this.ApplicantList.MobileTelephone == ''){
                Toast('请输入投保人联系电话');                
                return ;
            }
            if(this.ApplicantList.CertificateNo == ''){
                Toast('请输入投保人证件号码');                
                return ;
            }
            if(this.ApplicantList.Email == ''){
                Toast('请输入投保人邮箱');                
                return ;
            }
            this.updataModel.StartDate = this.startTime + ' ' + '00:00:00';
            this.updataModel.EndDate = this.endTime + ' ' + '23:59:59';
            this.updataModel.applicantName = this.ApplicantList.Name;
            this.updataModel.insurantName = this.InsurantList.Name;
            this.updataModel.amount = this.amount;
            this.updataModel.orderDetail.SKUCode = this.insutanceData.SKUCode;
            this.updataModel.orderDetail.ApplicantList[0] = this.ApplicantList;
            this.updataModel.orderDetail.InsurantList = [];
            this.updataModel.productCode = this.insutanceData.code;
            this.updataModel.orderDetail.SchemaProductCode = this.insutanceData.schemaProductCode;
            for(var i = 0 ; i <this.InsurantArr.length ; i++ ){
                var InsurantList = this.InsurantArr[i];
                InsurantList.BeneficaryList = [];
                this.updataModel.orderDetail.InsurantList.push(InsurantList);                    
            }    
            var url = window.location.protocol + '//' + window.location.host + '/#' ;
            // this.updataModel.Properties.PayReturnUrl = url + '/product/insuranceIndex?appId=' + localStorage.getItem('appId') + '&ProductCode=' +  this.updataModel.productCode;
            this.updataModel.Properties.PayResultUrl = url + '/product/payResult?appId=' + localStorage.getItem('appId') +'&productCode=' + this.insutanceData.code;        
            this.updataModel.OrderSource = this.isMobile();
                Indicator.open('下单中')
                axiosPostAPI('/PropertyProducts/Allianz-ZAAMIP/Order',this.updataModel).then(res=>{
                    Indicator.close();
                    if(res.result){
                        var orderNo = res.result.orderNo
                        this.$router.push({ path: '/product/payPage?orderNo=' + orderNo });
                    }
                }) 
            }
        },
        cardChange(value,index){
            this.cardType = value;//投保人身份类型
            this.cardIndex = index;
            this.ApplicantList.CertificateType = this.typeCode[this.cardIndex].code
            this.isCard = false;
        },
        InsuratChange(value,index){
            this.InsurantCardType = value;//投保人身份类型
            this.InsurantCardIndex = index;
            this.InsurantList.CertificateType = this.typeCode[index].code
            this.isInsuranceCard = false;
        },
        tradeChange(value,index){
            this.tradeIndex = index;
            this.tradeName = value[0] + '-' + value[1];
            this.showTrade = false;  
            this.InsurantList.OccupationCode = this.tradeColumns[index[0]].children[index[1]].code;       
        },
        insuredBirthConfirm: function() { // 选择被保人生日日期
                this.InsurantList.BirthDate = this.Common.Public.dateString(this.insuredBirthday)
                this.$refs.insuredBirthday.close();
            },
        selInsuredBirthday: function() { // 打开被保人生日日期层
				this.$refs.insuredBirthday.open();
            },
        applicantBirthConfirm: function() { // 选择投保人生日日期
                this.ApplicantList.BirthDate = this.Common.Public.dateString(this.applicantBirthday)
                this.$refs.applicantBirthday.close();
                // console.log(this.Common.Public.checkBirthday())
            },
        selapplicantBirthday: function() { // 打开投保人生日日期层
				this.$refs.applicantBirthday.open();
            },
        genderBtn(item,index){
                this.genderIndex = index;
            },
         acountPremium(){
             var InsurantArr = [];
             this.InsurantArr.map(item=>{
                 var obj = {};
                 obj.Name = item.Name;
                 obj.BirthDate = item.BirthDate;
                 InsurantArr.push(obj);
             })
            var model = {
                    "DistributorCode": "CSQD",
                    "ProductCode": this.insutanceData.code,
                    "StartDate": this.startTime + " " + "00:00:00",
                    "EndDate": this.endTime + ' ' + '23:59:59',
                    "Amount": 0,
                    "ApplicantName": this.ApplicantList.Name,
                    "InsurantName": this.InsurantList.Name,
                    "OrderDetail": {
                    "SchemaProductCode":this.insutanceData.schemaProductCode,
                    "SKUCode": this.SKUCode,
                    "ApplicantList": [{
                        "Name": this.ApplicantList.Name,
                        "BirthDate": this.ApplicantList.BirthDate
                    }
                    ],
                    "InsurantList": InsurantArr,
                    }
                    }
            // this.tip = '保费计算中...';
            this.amount = '';
            axiosPostAPI('/PropertyProducts/' + 'Allianz-ZAAMIP' + '/QuotedPrice',model).then(res=>{
                    // console.log(res)
                    if( res.status == 200 ){
                        this.amount = res.result;
                    }
                })    
        },
        relationBtn(item,index){
                this.RelationIndex = index;
                if(this.RelationIndex == 0){
                    this.InsurantList = this.ApplicantList;
                    this.InsurantList.RelationshipWithPolicyholder = this.RelationIndex + 1;
                    this.InsurantList.OccupationCode = ''; 
                }else{
                    this.InsurantList = {
                        "Name": "",
                        "CertificateType": '',
                        "CertificateNo": "",
                        "BirthDate": "",
                        "Address": "",
                        "Email": "",
                        "MobileTelephone": "",  
                        "RelationshipWithPolicyholder": 1,
                        "OccupationCode": "" 
                    }
                }
            },
        ownerNoBirth: function(e) { // 车主证件号校验+通过证件号来判断性别 出生日期
                if(this.cardType == '') { Toast('请选择证件类型'); return false; }
                const idNo = this.ApplicantList.CertificateNo;
                if(this.typeCode[this.cardIndex].code =='IdCard'){
                        // console.log(this.Common.Public.checkBirthday(idNo)[0]);
                        this.genderIndex = this.Common.Public.checkBirthday(idNo)[0] == "Male" ? 0  : 1;
                        this.ApplicantList.BirthDate = this.Common.Public.checkBirthday(idNo)[1];
                }
          
            },
        changeInsurance(item,index){
            this.InsurantList = item;
            this.showAddapplicant = true;
            this.insuranceArrIndex = index;
            this.isChange = true;
        },
        addInsurance(){
            this.showAddapplicant = true;
            if(this.RelationIndex == 0){
                this.InsurantCardType = this.cardType;
                this.InsurantList = this.ApplicantList;
                this.InsurantList.RelationshipWithPolicyholder = this.RelationIndex + 1;
                this.InsurantList.OccupationCode = ''; 
            }else{
                this.InsurantList = {
                    "Name": "",
                    "CertificateType": '',
                    "CertificateNo": "",
                    "BirthDate": "",
                    "Address": "",
                    "Email": "",
                    "MobileTelephone": "",  
                    "RelationshipWithPolicyholder": 1,
                    "OccupationCode": "" 
                }
            }
        },
        deleteInsurance(item,index){
            this.InsurantArr.splice(index,1);
        },
        addInsuranceList(){
            if(this.InsurantList.Name == ''){
                Toast('请输入被保人姓名');                
                return ;
            }
            if(this.InsurantCardType == ''){
                Toast('请选择选择被保人证件类型');                
                return ;
            }
            if(this.InsurantList.BirthDate == ''){
                Toast('请选择被保人出生日期');                
                return ;
            }
            if(this.InsurantList.MobileTelephone == ''){
                Toast('请输入被保人联系电话');                
                return ;
            }
            if(this.InsurantList.CertificateNo == ''){
                Toast('请输入被保人证件号码');                
                return ;
            }
            if(this.tradeName == ''){
                Toast('请选择职业类型');                
                return ;
            }
            if(this.isChange){
                this.InsurantArr.splice(this.insuranceArrIndex,1,this.InsurantList);
                this.isChange = false;
            }else{
                this.InsurantArr.push(this.InsurantList);
                
            }
            // if(this.InsurantArr.length > 1){
            //     this.acountPremium();
            // }
            this.acountPremium();
            this.showAddapplicant = false;            
        },
      isMobile(){
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        if(isWeixin){
            return "WeiXin"
        }else{
            if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                return 'H5';  // 移动端
            }else{
                return 'PC';  // PC端
            }
        }
    }        

    },
    mounted(){
        if(sessionStorage.getItem('insuranceData')){
            var insutanceData = JSON.parse(sessionStorage.getItem('insuranceData'));
            this.insutanceData = insutanceData;
            this.startTime = insutanceData.startTime;
            this.endTime = insutanceData.endTime;
            this.amount = insutanceData.amount;
            this.SKUCode = insutanceData.SKUCode;
        }
        if(sessionStorage.getItem('planInfos')){
            this.planInfos = JSON.parse(sessionStorage.getItem('planInfos'));
        }
        if(this.$route.query.uw_id){
            this.Uwid = this.$route.query.uw_id;
        }
        this.tradeColumns = [];
        var tradeName = '';
        for(var i = 0 ; i < anliandata.result.length ; i++){ 
            var item = anliandata.result[i]; 
            tradeName = item.tradeName;                    
            var _obj = {};
            _obj.text = item.tradeName;
            var children = [];            
            for(var j = 0 ; j < item.subTrades.length ; j ++){              
                var childrenObj = {};
                childrenObj.text = item.subTrades[j].tradeName;
                childrenObj.code = item.subTrades[j].tradeCode;
                children.push(childrenObj);
                _obj.children = children;               
            }
            this.tradeColumns.push(_obj);
        }
        // axiosGetAPI('/PropertyProducts/' + this.insutanceData.code + '/Trades?tradeCategories=' + this.insutanceData.tradeInfos).then(res=>{
        // })
    }
}
</script>
<style scoped>
.title{
    border-bottom: 0.01rem solid #DDDDDD;
    padding-left: .3rem;
    text-align: left;
    font-weight: bold;
    font-size: .32rem;
    line-height: 1.06rem;
}
.view01{
    padding-left: .3rem;
    margin: .2rem 0 .2rem 0;
}
.view01 dd {
    font-size: .28rem;
    display: block;
    border-bottom: 0;
    height: .56rem;
    line-height: .56rem;
    text-align: left;
}
.baozhang {
    position: absolute;
    right: 20%;
    top: 2rem;
    border-left: 0.01rem solid #d4d4d4;
    padding-left: .35rem;
}
.view01 dd>i img {
    width: 1rem;
}
.tiaokuang {
    position: absolute;
    right: 3%;
    top: 2.03rem;
}
 .view01 dd>p strong {
    color: #999999;
    display: inline-block;
    width: 1.52rem;
    font-weight: normal;
}

.bottom-fixed{
    margin-bottom: env(safe-area-inset-bottom);
}
.read-area {
    font-size: .24rem;
    font-family: PingFangSC-Light;
    color: #666;
    padding: .2rem .3rem;
    position: relative;
    white-space: normal;
}
.read-area .checkbox-icon {
    position: absolute;
    width: .3rem;
    height: .3rem;
    background: #f60;
    margin-top: .05rem;
    color: #a5a5a5;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAKlBMVEUAAADDw8PBwcHCwsLBwcHU1NTQ0NDBwcHCwsLCwsLCwsLr6+vk5OTd3d1i4ZWfAAAAC3RSTlMA9hpt8vn14r2eUIq7iTgAAAB3SURBVBjTYwACJotC8WYFIAPEnph7es81SQhvSfRuINjqBWIzy+wGg4MGQM7C0xDOHimgDp/dUHBEgYEzGsbZOoFBcTccCDGYITjJDL0Izg2GGgTnOIM0grMRmbMFRRmKAShGo1iK4hwUhyJ7Ac1zCG9jBggiqAAfZJqcRUCbwAAAAABJRU5ErkJggg==) 0 0 no-repeat;
    background-size: contain;
}

.item-wrapper {
    padding-left: .5rem;
}

.item-wrapper span{
    color: #546AAF;
    font-size: .24rem;
    line-height: .4rem;
    font-family: PingFangSC-Light;
}

.close-icon{
    display: inline-block;
    width: .42rem;
    height: .42rem;
    margin-top: .28rem;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAArCAMAAAA5QerMAAAAM1BMVEUAAACcnJycnJyjo6OcnJybm5udnZ2cnJydnZ26urqbm5ucnJycnJycnJycnJycnJybm5uW+F15AAAAEHRSTlMAas4ZEtk85EsF9cS2qHx3XWMJ1QAAAG5JREFUOMvt0DkOgDAQwMDlviH/fy004IJIriPF9VSOWpktc/zqxyw9UvOT7Zq1TXotMg1dqEWaRZpFmkWaRapFukWqnV5pXY8VySWemRxOs/zkr0n+usSaxKrEusSKdLshAzvn6Nh+ErsvUSuxG4pMBXcTNUT/AAAAAElFTkSuQmCC);
    background-size: .42rem;
}

.read-area .active{
    background-image: url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAUVBMVEVHcExVbK9YcK9Ua7BXa7JVarBUa69Uaq9Va7BVbcJUa7FVarBVa7BVa7BWbrNUarBVa7FUaq/////4+fyAkcSZps9gdLTe4u+frNJXbLB8jcHqdHtrAAAAEXRSTlMAYyCFTOSw7dQKed+smzXCclXwAmUAAAFUSURBVEjHpdfbloIwDAXQeIGUO6c6IP7/h84DznBrShrPk7rYa4VQ2kgUSts3XcXTxFXX9C0pc68Zm3B9P1dFuVMfWxZxd8kgJLvEinSIxIkF33CSW/jucpwmD9zp1UERdz04hiq8k4WDMm5bbQ518qR+Cr29IynL83Rp0P2vMyTms/qKLBVmc2dLJKckIiJOh2xo6dLYWnvxtPpcJ1T6Mw6bWlut834tW+rVzj/ey/eeGr17rn5oqDM5dFRtLxl0DtWuqc/HS+XAtH46eD+8f2kcpi0cRn+QQYdpV+pRhh340JydFByqw+PYSsmhOy6AtRQdmsCSW6Ts0IcW+Z+MOLTB12qWMcfCizyM3vuIQy1tHbMU3bwnsyRlx5HtcRhl99kehQ15eJ9tyOYjwH7o2I8588FqP8rtw4N5XLEPSPaRzD4EfjF22gfdL0Zr+zCv/vvwC2gGpCad5uTMAAAAAElFTkSuQmCC)
}
</style>