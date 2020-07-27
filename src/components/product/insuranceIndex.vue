<template>
    <div class="page-container">
        <div class="slider">
            <img style="width:100%" :src="headeBanner" alt="">
        </div>
        <div style="background:#fff">
            <h1 class="base_title">{{productModel.productName}}</h1>
            <div class="base_bzqx">
                <span v-for="(item,index) in labelList" :key="index">
                      {{item.title}} ：{{item.content}} <span class="inforIcon" v-show="item.remark != null" @click="isLabel= true">&nbsp;</span>
                      <div v-show="isLabel" id="inpoTextMsgBox2" @click="isLabel = false"></div>
                        <div v-show="isLabel" class="inpoTextMsgBox2">
                                    <span class="s1" style="left: 2.9rem;"></span>
                                    <span class="s2" style="left: 2.9rem;"></span>
                                    <div>
                                        {{item.remark}}           
                                    </div>
                        </div>
                </span>                         
            </div>
            
            <div class="dl_wrap grey" style="padding-bottom:1rem">
                <h3 class="bzxmH3">保障项目</h3>
                <div class="bzxmZimg" @click="showSecurity = true" v-show="safeguardList.length > 0">
                    <img class="bzxmRightIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAh1BMVEVHcExmZmZmZmZ4eHhnZ2dmZmZmZmZmZmZnZ2dmZmZnZ2doaGihoaFnZ2dycnJpaWlsbGxnZ2dmZmZnZ2dpaWlnZ2dmZmZmZmZpaWlmZmZnZ2dnZ2dmZmZmZmZmZmZmZmZnZ2dpaWlsbGxnZ2dnZ2dnZ2dnZ2doaGhnZ2dqampoaGhmZmZmZmZw1yoFAAAALHRSTlMA8foG1aeEk/iWik4DxgowEGzf2Te00KAkwK5E47h9vcwpF1brYlNnPR5/W4qBzlMAAAITSURBVFjD7ZfbdoIwEEWHYAUFFQTxfq311v3/39cHUQMCndpXzxPMSrYyOTNJROQ4dfyX5EyPIiIj/qGZSMy/dJTe/wBT8YHMe0ktwBEAT15SB/DfgDegBBhkGu8Og1pApnO/068DOMr6OdcBPG391Sbxs63Q0X0b6Q1oBITf3avivjUqPHm9oe8k68vgN0Cnwq1uvH+YOPlsBljFtMuHzIfFOuhtmwCbR8Xmfo/NUy3PmxrKxjfGGGOSfNQln9X66HqzxfXZHPSr8Hmd4U2ur+kMAH+gBUx8gMT66vkeYNhXAmYAvajAXACsdIAUYLErBgc+4OxUgDFAUI6uAGININwDvadwf2/5rBFwsn+qtPYmUgC+Cg38oQBgoACsAFORmq2VmkaABywqABHAlwLQBpwKwBngWwGIAfo1yZ0rAEGlDXIjnBWAyADj53gGDFVOXANmUvnHPBXgC2BZNmICsLXytKkFhAlAuxgbAYzuDXNmhml9OR8A8EIrL0sA3/ouV6ShI40B2JzuHeraYVulxa0HuPlVIlsFaXro3hv0uq8ESLSuPuSsXSVAwk5pqr8EYOkqASJp4UY0muQnMZvw2+Y67+Q7QuJtH2e5kasGiMguDYJ0Z/ckm/D37f1KmLkvA3LCbZIDJB9qXaKbxW7t5q8Xz56IhGMgs6vuL4pEJOw62aBoebUqOu1hvGmpNSqflH4AYEHl+g4jIJsAAAAASUVORK5CYII=" alt="">
                    保障释义
                </div>
                <div class="bzxmZ">
                    赔偿限额最高为保险金额（人民币：元）
                </div>
                <div class="lyBox">
                    <div class="htabscroll"> 
                        <div class="ly-tab-list">
                            <div class="ly-tab-item-label" :class="{ detailPlansSelected:plantIndex == index }" @click="plantBtn(item,index)" v-for="(item,index) in plansList" :key="index" >
                            <span class="jt"></span>
                             <span class="wd">{{item.packageName}}</span>
                          </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="planDiv" style="padding: 0 0.15rem 0 0.15rem">
                    <div class="plan-parent">
                        <div class="detailPlans" style="margin-right: 0.15rem;" :class="{ detailPlansSelected:plantIndex == index }" @click="plantBtn(item,index)" v-for="(item,index) in plansList" :key="index" >
                                <div class="">
                                    <span class="jt"></span>
                                    <span class="start">
                                        ￥
                                        <span class="price ng-binding">{{item.amount}}</span>
                                        <span>起</span>
                                    </span>
                                    <span class="planname ng-binding">
                                        {{item.packageName}}
                                    </span>
                                </div>
                        </div>
                    </div>
                </div> -->
                <div  v-if="packageList[plantIndex].planInfos.length > 0 &&  packageList[plantIndex].planInfos && packageList[plantIndex] && packageList">
                    <div class="dl01 bzxm_dl ng-scope" v-for="(item,index) in packageList[plantIndex].planInfos" :key="index">
                        <div class="bzxm_dl_dt">
                            <p class="bzxm_b" v-html="item.planName"></p>
                            <!-- <span v-show="showBasic"><van-icon name="arrow-up" size="0.26rem"  color="#999" @click="showBasic = false"/></span>
                            <span v-show="!showBasic"><van-icon name="arrow-down" size="0.26rem"  color="#999" @click="showBasic = true" /></span> -->
                        </div>
                        <div class="cell-container" v-show="showBasic" v-for="(_item,_index) in item.dutyInfos" :key="_index" >
                            <div class="listfl" v-html="_item.dutyName"></div>                            
                            <div class="listfr" v-show="_item.isContain == null && _item.isOptional == null">{{_item.insuredAmount + _item.insuredAmountUnit}}</div>
                            <div class="listfr" v-show="_item.isContain != null && _item.isOptional == null">{{_item.isContain ? '包含' : '不包含'}}</div>
                            <div class="listfr" v-show="_item.isContain == null && _item.isOptional != null">{{_item.isContain ? '可选' : '不可选'}}</div>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                 <div class="dl01 bzxm_dl ng-scope" v-if="packageList[plantIndex].inFormList && packageList[plantIndex].inFormList.length">
                    <ul class="uicss">
                            <li class="licss" v-for="(item,index) in packageList[plantIndex].inFormList" :key="index">
                                <font class="bzsycircles">●</font>
                                <span v-html="item"></span>
                            </li>
                    </ul>
                </div>
                <div class="tiaokuan" v-show="seePDFList.length>0">
                    <p>**以上信息仅供参考，详细信息以保险单及条款为准 </p>
                    <span>查看</span>
                    <a :href="item.url + ''"  v-for="(item,index) in seePDFList" :key="index">{{item.title}}</a>  
                </div>
                <div class="jiange"></div>
                <div class="tbts" v-show="specialRemarkList.length > 0" @click="showSpecialList = true">
                    <h3>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAuCAMAAABZAGpeAAAAh1BMVEVHcEzCzuPCzuLCzuLCzeLCzuLBzuLN2+/CzuL////F0ePP3erCz+PCzuLCzuLR2OzE0OTF0uPCzuLC0OPBzuHK1+bE0+bCzuLI0+nDz+LCzuHCzuLCzuHU7f/Dz+PCzuLD0OXDzuLDz+PCzuLCzuLCzuHCzuLE0+LCz+PDzeHBz+LBzuLBzeFun4hvAAAALHRSTlMAdsGAhcuhD+UCLQlc2+EMKSKLQ+gUG5MWcPnSvQVW7zWYTLG4xakRbGaE9LSnyH4AAAFfSURBVBgZzcHXYoJAAATAFTzh6N3eW8r+//cFQlCQo/iWGajtTAdv2fCKt2gUeItGgQESdRoF+mWeluJJo0Cd7sZoisl1igeNAjURGaFJ3sj1HRWNVzxFpJfhxfZMijv+LFdLPExJM0SLfSGFgT82Hr5IM4SCvSEjtMRkEkDJ1/iBX9vMWkiUDkwCdJAL5EJdMLfafBgohAb63OcrVvZLiSGBy7qLgX7Wnk1rA30WHl9dJHrM2PaJbhYVEh+d5lRx0BDo04JuAfCockYu0KcF3YLLkgtkVEqQc1nycGRpDhyoZgOYs3QEfKPgA4iptkDONwo+6iyqSXQwqOShk6DKDJ0mVDmhU7pn21qi25JtMXrIM19F6GULNt0k+jlsOmBAygZTYsiVdUcMmrDuhEHhN59cG8OCaFbRU/wLoTArGxsj7PhkYYStM6mcMFK2cxxnZ2CsbcKChtFuzK10qPwAb1llvzP95jwAAAAASUVORK5CYII=" alt="">
                        特别提示
                        <b>(请重点查看)</b>
                        <span></span>
                    </h3>
                </div>
                <div class="jiange"></div>
                <van-sticky>
                    <div class="insuranceNavBox" style="height:1.02rem;">
                        <div class="insuranceNav" id="insuranceNav">
                            <a href="javascript:void(0)" @click="cutoverTag(item,index)" :class="{current : index == tagIndex}"  v-for="(item,index) in cutoverTagList " :key="index">{{item}}</a>
                        </div>	
                    </div>
                </van-sticky>
            
                <div class="iTag_1" v-show="isTage_1" >
                     <img :src="item.url" alt="" v-for="(item,index) in imageList" :key="index" style="width:100%">
                     <!-- <img src="https://img02.az.jd.com/az360/m/wpimage1/zhenai-detail1_b48418ef.jpg" style="width:100%" alt="">
                     <img src="https://img02.az.jd.com/az360/m/wpimage1/zhenai-detail02_2fc5b75a.jpg" style="width:100%" alt=""> -->
                </div>

                <div class="iTag_2" v-show="isTage_2" >
                	<h3 class="insuranceTitle" style=" padding-left:.3rem;">
                        理赔流程
                    </h3>
                      <div class="hotlineRed" style="margin: 0 .3rem .4rem;" v-for="(item,index) in claimProcessList "  :key="index">
                       <div class="hotlineRedContent">
                            <p>{{item.title}}</p>
                            {{item.infoList[0].content}}
                            <a :href="item.infoList[0].fileList[0].title" style="color:blue">
                                {{item.infoList[0].fileList[0].title}}
                            </a>

                       </div>
                    </div>
                    
                </div>
                <div class="iTag_3" v-show="isTage_3" id="Question">
                	<h3 >
                        常见问题
                    </h3>
                    <dl class="qna" v-for="(item,index) in commonProblemList" :key="index">
                        <dt>
                            {{item.ask}}
                        </dt>
                        <dd>
                            {{item.answerList[0]}}
                        </dd>
                    </dl>

                   <!-- <dl class="qna">
                       <dt>
                           是否保证续保？如不是，什么情况下可以连续投保？
                       </dt>
                       <dd>                           
                            本产品非保证续保。请投保人投保前充分理解此产品因盈利偏离预期导致保险人停售或调整产品的可能性。客户首年投保时如实告知健康状况，可根据意愿决定是否连续投保。如连续投保时被保险人的年龄超过保单载明的最高连续投保年龄或本保险合同统一停售，保险人不再接受投保人连续投保。                                        
                       </dd>
                        <dt>
                           连续投保是否需要健康告知？是否有等待期？
                       </dt>
                       <dd>                                                       
                            被保险人首年如实告知，则连续投保被保险人若升级医疗保障计划，须重新填写健康告知；若降级医疗保障计划或维持原计划，无须重新填写健康告知。任何情况的续保均无等待期。                                                                                
                       </dd>
                        <dt>
                           特定既往病症是否都是100%赔付的？
                       </dt>
                       <dd>                                                       
                            不是。投保不同的计划，特定既往病症赔付比例不一致。请以保单约定的特定既往病症赔付比例为准。                                        
                       </dd>
                       <dt>
                            如果投保前患有的是甲状腺结节，投保后确诊甲状腺癌，是否可以获得赔付？
                       </dt>
                       <dd>                                                                                   
                            如完全符合以下条件，是可以获得赔付的：<br>                            
                            1） 请确认投保时完全符合健康告知；<br>
                            2） 甲状腺癌是在等待期过后首次发病且确诊；<br>
                            3） 在符合条款约定的医疗机构就医。
                       </dd>
                       <dt>
                           什么是特定既往病症？
                       </dt>
                       <dd class="disp" style="display: block;">
                                特定既往病症必须完全符合以下内容：<br>
                                1）投保日期（即保单载明的保单生成日期）前2年（含）内，不存在以下任一情形：<br>
                                ——已被诊断且住院治疗的疾病（但因急性胃肠炎/单次发作已痊愈的肺炎/上呼吸道感染住院不在此限）；<br>
                                 ——因任何疾病已持续或间断进行药物治疗30天（含）以上；<br>
                                 2）所患的疾病、病症/体征不属于以下所列的任一情况：<br>
                                ——恶性肿瘤、白血病、淋巴瘤、严重贫血（血红蛋白&lt;60克/升）、慢性阻塞性肺病、糖尿病、溃疡性结肠炎、乙型肝炎或乙肝病毒携带者、肝硬化、肝功能衰竭、肾脏疾病、脑卒中（脑中风、脑出血、脑梗塞）、老年性痴呆、脑瘫、精神性疾病（依据世界卫生组织《疾病和有关健康问题的国际统计-分类》（ICD10）分类为精神和行为障碍的疾病）、系统性红斑狼疮、类风湿性关节炎、HIV病毒感染、艾滋病、系统性红斑狼疮、克隆病、溃疡性结肠炎、心肌梗塞、慢性肾功能不全、器官移植术后;<br>
                                ——伴有边界不清或不规则的甲状腺结节、乳房（乳腺）结节、肺部结节或毛玻璃影;<br>
                                ——其他不明性质的肿块/息肉/肺部结节/囊肿/新生物/癌前病变（重度不典型增生）；<br>
                                ——自主生活能力完全丧失，无法独立完成如下六项基本日常生活活动中的三项（含）以上：洗澡、进食、移动（从一个房间到另一个房间）、行动（上下床或上下轮椅）、穿衣、如厕。
                        </dd>
                   </dl> -->
                    
               	</div>
            </div>
            <div class="new_footer">
                <img class="kufu" src="data:image/png;base64,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" alt="">
                <span class="footer_submit" @click="toNext">
                    立即购买
                </span>
                <span class="tip" v-show="amount == ''"> {{tip}} </span>
                <span class="footer_price ng-binding" v-show="amount != ''">￥{{amount}}</span>
                <span class="footer_text" v-show="amount != ''">起</span>
            </div>
        </div>
        <!-- 保障释义 -->
        <mt-popup position="bottom" v-model="showSecurity" style="height:100%;">
            <div class="read-content">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="closeSecuity">关闭</span>
                    <h3 class="two_line">保障释义</h3>
                </div>
                <div class="bzsy_content_first bzsy_content" v-for="(item,index) in safeguardList" :key="index" >
                    <div class="jiange"></div>
                    <dt class="ng-binding" v-html="item.title">
                        
                    </dt>
                    <dd class="ng-scope" v-for="(_item,_index) in item.subItems" :key="_index">
                        <div class="profitC">
                            <p>
                                <font>●</font>
                                <font>{{_item.title}}</font>
                            </p>
                        </div>
                        <span v-html="_item.content[0]"></span>
                    </dd>
                                     
                </div>
            </div>
		</mt-popup>
        <!-- 健康告知弹层 -->
        <mt-popup position="bottom" v-model="showHealthTold" style="height:100%;">
            <div class="read-content">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="showHealthTold = false">关闭</span>
                    <h3 class="two_line">健康告知</h3>
                </div>
                <div class=""  style="margin-top:1rem;margin-bottom:1rem;" >
                    <div style="margin:.21rem .3rem .3rem .3rem" v-for="(item,index) in healthOptions" :key="index">
                        <span class="healthP">
                            {{healthNoticeInfo.title}}
                        </span>
                        <p class="healthP" style="margin-top: .1rem;" v-html="item.content">                            
                        </p>
                       <div class="ng-scope" >
                            <div class="personnelName" style="border:0;margin-left:2rem">
                                <!-- <span class="labelTitle ng-binding ng-scope" style="float:left;">性别</span> -->
                                <div class="personSex ng-scope">
                                    <span class="radio" @click="genderBtn(_item,_index,item,index)" :class="{active: item.healthIndex === _index}" v-for="(_item,_index) in item.options" :key="_index" >
                                        {{_item.text}}
                                    </span>
                                </div>
                            </div>
                       </div>                     
                    </div>
                </div>
                <div class="new_footer">
                    <div class="submitBuy" style="line-height: .88rem;font-size: .34rem;" @click="submitBuyBtn">
                        提交
                    </div>
                </div>
            </div>
		</mt-popup>
        <!-- 投保日期选择 -->
        <mt-datetime-picker  @touchmove.native.stop.prevent ref="applicantBrithday" v-model="applicantBrithday" type="date" :startDate="startDate" :endDate="endDate" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="applicantBirthConfirm">
		</mt-datetime-picker>
        <!-- 被投保出生日期选择 -->
        <mt-datetime-picker  @touchmove.native.stop.prevent ref="insuredBirthday" v-model="insuredBirthday" type="date" :startDate="applicantStartDate"  year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="insuredBirthConfirm">
		</mt-datetime-picker>
        <!-- 特别注意 -->
        <mt-popup position="bottom" v-model="showSpecialList" style="height:100%;">
            <div class="read-content">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="showSpecialList = false">关闭</span>
                    <h3 class="two_line">特别提示</h3>
                </div>
               <div class="bzsy_content_first bzsy_content" style="padding:.2rem .24rem .3rem .24rem" >
                   <div v-for="(item,index) in specialRemarkList" :key="index" >
                    <p style="margin: 0.2rem 0 0.2rem 0;font-size: 0.3rem; font-weight: 700;padding-left: .38rem;" v-html="item.title"> </p>                   
                    <ol style="padding-left: .38rem;" >
                        <li  v-for="(_item,_index) in item.content" :key="_index" >
                            <div class="profitC">
                                <p>
                                    <font v-html="_item"></font>
                                </p>
                            </div>                          
                        </li>
                    </ol> 
                    <ol style="padding-left: .38rem;"   >
                        <li  v-for="(_item,_index) in item.subItems" :key="_index" >
                            <div class="profitC">
                                <p>
                                    <font v-html="_item.title"></font>
                                </p>
                            </div>
                            <p v-for="(items,indexs) in _item.content" :key="indexs" v-html="items">                                
                            </p>
                           <!-- <span v-html="_item.content[0]"></span> -->
                        </li>
                    </ol>                    
                   </div>
                </div>
            </div>
		</mt-popup>
        <!-- 计算保费 -->
        <div class="divBTM-new" id="divBFJS" style="opacity: 1; top: 0px;" v-show="isAmountPremium"> 
            <div class="popups_bfjs" style="max-height: 100%;bottom: 1rem;transition: all 0.3s ease-in 0s;">
                <div class="bzsy_popups_head">
                    <span class="head_right" @click="closeAmount">关闭</span>
                    <h3 class="two_line">保费计算</h3>
                </div>
                <div class="popups_content_bfjx">
                    <div class="time_box01 " style="margin-top: 0.85rem;">
                        <div v-if="showApplicantAge">
                            <div class="time_list">
                                <p>{{applicantAgeList.content}} </p>
                                <p class="applicantTime" @click="selapplicantBirthday">
                                    <span>{{applicantDate}}</span>
                                    <i class="timeIcon"></i>
                                </p>
                            </div>
                            <span class="ageRange" v-for="(item,index) in applicantAgeList.labelList" :key="index">{{item.title + '：' + item.content}}</span>
                        </div>
                        
                        <div v-if="insuranceDataList.styleType && insuranceDataList.styleType == 'InsurancePeriod' ">
                            <h4>{{insuranceDataList.content}} <span class="inforIcon" v-show="insuranceDataList.remark != null" @click="isShow = true">&nbsp;</span></h4>
                            <div v-show="isShow" id="inpoTextMsgBox2" @click="isShow = false"></div>
                            <div v-show="isShow" class="inpoTextMsgBox2">
                                        <span class="s1" style="left: 2.9rem;"></span>
                                        <span class="s2" style="left: 2.9rem;"></span>
                                        <div v-html="insuranceDataList.remark">                                                       
                                        </div>
                            </div>
                            <div v-if="insuranceDataList.options.length > 1">
                                <span class="timerSelect" :class="{timeerchecked:dataTypeIndex == index}" v-for="(item,index) in dataTypeOptons" @click="timerCheckBtn(item,index)" :key="index">
                                    {{item.name}}
                                </span>
                            </div>
                            <div style="margin-top:0.3rem">
                                <div>
                                    <span class="timeStart">起期</span>
                                    <span class="timeEnd">止期</span>
                                </div>
                                <div class="time ng-binding ng-pristine ng-valid" style="float:left" @click="selInsuredBirthday">
                                    <span>{{startTime}}</span> 
                                </div>
                                <div style="margin: 0 .4rem;float:left">至</div>
                                <div class="time ng-binding ng-pristine ng-valid" style="display: inline-block;background: none;cursor: default;color: rgb(187, 187, 187);">
                                    <span>{{endTime}}</span> 
                                </div>
                            </div>
                        </div>
                        <div class="checkBoxList" v-for="(item,index) in insuranceInforList" :key="index">
                                <p style="float:left;">{{item.content}}</p>
                                <div style="float:right;" class="weui-switch"  >
                                    <p class="checkItem" v-for="(_item,_index) in item.options "  @click="socialBtn(item,_item,_index)" :key="_index" :class="{checkBoxActive:item.active == _index}">{{_item.text}}</p>
                                </div>    
                                <div class="clear"></div>                            
                        </div>
                      
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import "./../../assets/css/product.scss";
import "./../../assets/js/rem.js";

// import anlian from './../../assets/json/alin.json';
import { axiosGetAPI, axiosPostAPI } from "./../../common/Axios";
import { Indicator,Toast } from 'mint-ui';
export default {
    data(){
        return{
            isLabel:false,
            detailSelect:0,
            plansList:[{amount:'110',packageName:'基本计划'},{amount:'110',packageName:'基本计划'},{amount:'317',packageName:'卓越计划'},{amount:'317',packageName:'超级计划'},{amount:'317',packageName:'豪华计划'}],
            plantIndex:0,
            showBasic:true,
            showAddition:true,
            showSecurity:false,
            cutoverTagList:["产品详情","理赔流程","常见问题"],
            tagIndex:0,
            isTage_1:true,
            isTage_2:false,
            isTage_3:false,
            isAmountPremium:false,
            applicantBrithday:new Date(this.Common.Public.GetDateStr(1)),
            startTime: '',
            endTime:'',
            insuredBirthday: new Date(this.Common.Public.GetDateStr(1)),
            startDate: new Date('1949-01-01'),
            endDate: new Date(this.Common.Public.GetDateStr(0)),
            applicantDate:'',
            applicantStartDate:new Date(this.Common.Public.GetDateStr(1)),
            checked:true,
            socialSecurity:['有','无'],
            socialIndex:0,
            insuranceData:{
                InsuranceBirthday:'',
                startTime:'',
                endTime:'',
            },
            showHealthTold:false,
            genderList:[{
						"text": "是",
						"value": "true"
					}, {
						"text": "否",
						"value": "false"
					}],
            genderIndex:-1,
            productModel:{},
            bannerList:[],//头部banner
            labelList:{},//保障范围
            safeguardList:[],//保障释义
            seePDFList:[],//保险条款
            specialRemarkList:[],//特别提醒
            packageList:[],//保障计划及保障详情
            healthNoticeList:[],//健康告知
            healthOptions:[],//健康告知选项
            healthNoticeInfo:{},
            headeBanner:'',
            showSpecialList:false,
            amount:'',
            imageList:[],
            targetObjectList:[],
            SKUList:[],
            showApplicantAge:true,
            applicantAgeList:{},
            insuranceDataList:{},
            insuranceInforList:[],
            isShow:false,
            dataTypeOptons:[], //自选日期
            dataTypeIndex:0, 
            maxapplianceDate:'', //被保人出生日期最大时间
            minapplianceDate:'', //被保人出生日期最小时间
            insuranceList:{}, //保险计划用于skucode   
            SKUCode:'',
            tip:'',
            tradeInfos:'',
            productCode:'',
            code:'',
            UnderwritingUrl:'',
            claimProcessList:[],
            commonProblemList:[],
        }
    },
    created(){
        this.startTime =  this.Common.Public.dateString(this.applicantStartDate);
        this.endTime = this.getNowFormatDate(this.startTime);
        this.applicantDate = this.Common.Public.dateString(this.endDate);
        // console.log(anlian);    
        var self = this;         
        Indicator.open('加载中...');
        axiosGetAPI('/PropertyProducts/' + 'Allianz-ZAAMIP' ).then(res=>{
            Indicator.close();
            if(res.status == 200){                
                // console.log(res.result)
                var productModel = res.result.schema.productList[0];
                sessionStorage.setItem('title',productModel.productName);
                self.code = res.result.code;
                self.productModel = productModel;
                if(productModel.bannerList > 1){
                    self.bannerList = productModel.bannerList;
                }else{
                    self.headeBanner = productModel.bannerList[0].url;
                }
                self.labelList = productModel.labelList;
                self.safeguardList = productModel.safeguardList;
                self.seePDFList = productModel.seePDFList;
                self.specialRemarkList = productModel.specialRemarkList;
                self.healthNoticeInfo  = productModel.healthNoticeInfo;
                self.claimProcessList = productModel.claimProcessList;
                self.commonProblemList = productModel.commonProblemList;
                self.healthNoticeList = productModel.healthNoticeInfo.healthNoticeList;
                self.tradeInfos = productModel.tradeInfos;
                self.imageList = productModel.imageList;
                // console.log(self.imageList);
                self.productCode = productModel.productCode;
                var url = window.location.protocol + '//' + window.location.host + '/#' ;                
                    var model = {
                            "DistributorCode": "CSQD",
                            "ProductCode":self.code,
                            "orderDetail":{
                                "schemaProductCode":self.productCode
                            },
                            "Properties":{
                                "underwritingPassedUrl":url + '/product/presoalInformation?appId=' + localStorage.getItem('appId') + '&ProductCode=' +  this.code,
                                "underwritingBackUrl":url + '/product/insuranceIndex?appId=' + localStorage.getItem('appId')
                            }
                        };
                       axiosPostAPI('/PropertyProducts/' + self.code + '/Underwriting',model).then(data=>{
                          if(data.status == 200){
                              self.UnderwritingUrl = data.result
                          }
                        })                    
                self.healthOptions = [];                
                for(var i = 0; i < self.healthNoticeList.length ; i ++){
                    var model = {};
                    if(self.healthNoticeList[i].optionsList.length > 0){
                        model.content = self.healthNoticeList[i].content
                        model.options = self.healthNoticeList[i].optionsList;
                        model.healthIndex = '';//判断是否选中
                        model.location = i;//判断是哪一个
                    }
                    self.healthOptions.push(model);
                }
                self.packageList = productModel.packageList;
                self.plansList = [];
                productModel.packageList.map(item=>{
                    var obj = {};
                    obj.packageName = item.packageName;
                    obj.packageCode = item.packageCode;
                    self.plansList.push(obj);
                });
                self.amount = productModel.packageList[self.plantIndex].minPrice;
                self.targetObjectList = productModel.targetObjectList;
                self.SKUList = productModel.skuList;
                self.insuranceInforList = [];
                for(var i = 0 ; i < productModel.targetObjectList.length ; i ++){
                    if(productModel.targetObjectList[i].styleType == 'Age'){
                        self.showApplicantAge = true;
                        self.applicantAgeList = productModel.targetObjectList[i];
                        if(productModel.targetObjectList[i].options[0].minType == 'Day'){
                            self.minapplianceDate = productModel.targetObjectList[i].options[0].min
                        }
                        if(productModel.targetObjectList[i].options[0].minType == 'Year'){
                            self.minapplianceDate = productModel.targetObjectList[i].options[0].min * 365;
                        }
                        if(productModel.targetObjectList[i].options[0].maxType =='Day'){
                            self.maxapplianceDate = productModel.targetObjectList[i].options[0].max
                        }
                        if(productModel.targetObjectList[i].options[0].maxType =="Year"){
                            self.maxapplianceDate = productModel.targetObjectList[i].options[0].max * 365
                        }
                    }
                    if(productModel.targetObjectList[i].styleType == 'InsurancePeriod'){
                        self.insuranceDataList = productModel.targetObjectList[i];
                        if(self.insuranceDataList.options.length > 1){
                            self.dataTypeOptons = [];
                            self.insuranceDataList.options.map(item=>{
                                var model = {};
                                model.name = item.text;
                                model.value = item.value; 
                                self.dataTypeOptons.push(model)
                            })                            
                        } 
                    }
                    if(productModel.targetObjectList[i].styleType == 'Radio'){
                        var model = productModel.targetObjectList[i];
                        self.$set(model, "active", 0);
                        self.insuranceInforList.push(model);           
                    }
                    if(productModel.targetObjectList[i].styleType == 'Standard'){
                        self.insuranceList = productModel.targetObjectList[i];
                    }
                }                  
            }
        })           
    },
    methods:{
        timerCheckBtn(item,index){
            this.dataTypeIndex = index;
        },
        closeAmount(){
            var insuranceData = {
                InsuranceBirthday:'',
                startTime:'',
                endTime:'',
            }
            this.insuranceData = insuranceData;
            this.isAmountPremium = false;
        },
        genderBtn(_item,_index,item,index){
            if(item.location == index){
                this.healthOptions[index].healthIndex = _index;
            }
        },
        insuredBirthConfirm: function() { // 选择被保人生日日期
                this.startTime = this.Common.Public.dateString(this.insuredBirthday)
                this.endTime = this.getNowFormatDate(this.startTime)
                this.$refs.insuredBirthday.close();
                 this.getSKUCode();
                this.acountPremium()
            },
         selInsuredBirthday: function() { // 打开被保人生日日期层
				if (this.CommencementDateValuey) {
					this.insuredBirthday = new Date(this.CommencementDateValuey);
				}
				this.$refs.insuredBirthday.open();
            },
        applicantBirthConfirm: function() { // 选择被保人生日日期
                this.applicantDate = this.Common.Public.dateString(this.applicantBrithday)               
                this.$refs.applicantBrithday.close();       
                if(this.verifyApplianceDate(this.applicantDate)){
                        Toast('被保人出生日期不在承保范围')
                }else{
                     this.getSKUCode();
                    this.acountPremium()
                }
            },
         selapplicantBirthday: function() { // 打开被保人生日日期层
				if (this.CommencementDateValuey) {
					this.applicantBrithday = new Date(this.CommencementDateValuey);
				}
				this.$refs.applicantBrithday.open();
            },
         getNowFormatDate(d){ //计算投保终止日期
			var date;
			if(typeof(d) == "undefined"){
				date = new Date();
			}else{
				date = new Date(d); 
            	date.setFullYear(date.getFullYear()+1); 
           		date.setDate(date.getDate()-1);
			}
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			return currentdate;
        },
        verifyApplianceDate(bengin){//校验被保人出生日期
            var day1 = new Date(bengin);
            var day2 = this.endDate;
            if((day2 - day1) / (1000 * 60 * 60 * 24) < this.minapplianceDate || (day2 - day1) / (1000 * 60 * 60 * 24) > this.maxapplianceDate){
                return true;
            }else{
                return false;
            }            
        },
        acountPremium(){
            var model = {
                    "DistributorCode": "CSQD",
                    "ProductCode": this.code,
                    "StartDate": this.startTime + " " + "00:00:00",
                    "EndDate": this.endTime + ' ' + '23:59:59',
                    "Amount": 0,
                    "ApplicantName": "张三",
                    "InsurantName": "张三",
                    "OrderDetail": {
                    "SchemaProductCode":this.productCode,
                    "SKUCode": this.SKUCode,
                    "ApplicantList": [{
                        "Name": "张三",
                        "BirthDate": this.applicantDate
                    }
                    ],
                    "InsurantList": [{
                        "Name": "张三",
                        "BirthDate": this.applicantDate
                    }
                    ]
                    }
                    }
            this.tip = '保费计算中...';
            this.amount = '';
                axiosPostAPI('/PropertyProducts/' + 'Allianz-ZAAMIP' + '/QuotedPrice',model).then(res=>{
                    // console.log(res)
                    if( res.status == 200 ){
                        this.amount = res.result;
                    }
                })    
        },
        getSKUCode(){//获取sku
            var str = '';
            if(this.applicantAgeList.options.length > 0 && this.applicantAgeList.options.length  <= 1){
                str = str + this.applicantAgeList.options[0].value;
            }
            if(this.insuranceDataList.options.length > 0 && this.insuranceDataList.options.length  <= 1 ){
                str = str + '-' + this.insuranceDataList.options[0].value;                 
            }
            for(var i = 0 ; i < this.insuranceInforList.length ; i++ ){
                var item = this.insuranceInforList[i];
                str = str + '-' + item.options[item.active].value;                         
            }
            if(this.insuranceList.options.length > 0 ){
                str = str + '-' + this.insuranceList.options[this.plantIndex].value;
            }
            for(var i =0; i < this.SKUList.length; i ++){                
                if(str == this.SKUList[i].options){
                    this.SKUCode = this.SKUList[i].code;
                    // console.log(this.SKUCode)
                }
            }
            // console.log(str)

        },
        plantBtn(item,index){
            this.plantIndex = index;
            this.amount = this.packageList[this.plantIndex].minPrice;
          
        },
        closeSecuity(){
            this.showSecurity = false
        },
        socialBtn(item,_item,_index){ 
            item.active = _index;
            this.getSKUCode();
            this.acountPremium()
        },
        cutoverTag(item,index){
            if(index == this.tagIndex){return};
			this.tagIndex = index;
			if(index == 0){
				this.isTage_1 = true;
				this.isTage_2 = false;
				this.isTage_3 = false;
			}else if(index == 1){
				this.isTage_1 = false;
				this.isTage_2 = true;
				this.isTage_3 = false;
			}else{
				this.isTage_1 = false;
				this.isTage_2 = false;
				this.isTage_3 = true
			}	
        },
        setInsuranceData(){
            var insuranceData = {};
            insuranceData.startTime = this.startTime;
            insuranceData.endTime = this.endTime;
            insuranceData.SKUCode = this.SKUCode;
            insuranceData.amount = this.amount;
            insuranceData.tradeInfos = this.tradeInfos; 
            insuranceData.schemaProductCode = this.productCode;
            insuranceData.code = this.code;     
            insuranceData.productName = this.productModel.productName;
            insuranceData.plantName = this.plansList[this.plantIndex].packageName;              
            sessionStorage.setItem("insuranceData",JSON.stringify(insuranceData));
            sessionStorage.setItem('planInfos',JSON.stringify(this.packageList[this.plantIndex].planInfos) )
        },
        submitBuyBtn(){
            var isTounderwriting = true;
           for(var i = 0 ; i < this.healthOptions.length ; i ++){
                    // console.log(this.healthOptions[i]);
                    if(this.healthOptions[i].healthIndex == 1){
                        isTounderwriting = false
                    }
                }
            this.setInsuranceData();
           if(isTounderwriting){                     
                this.$router.push({ path: '/product/presoalInformation' });                 
           }else{
             window.location.href = this.UnderwritingUrl;
           }                      
        },
        toNext(){    
            this.getSKUCode();
            this.acountPremium(); 
            if(this.insuranceData.startTime != ''){//京东安联告知页面
                // this.$router.push({path:'/product/presoalInformation'});
                if(this.healthNoticeList.length > 0){                     
                     if(this.verifyApplianceDate(this.applicantDate)){
                              Toast('被保人出生日期不在承保范围')
                              return
                    }
                    this.closeAmount();
                    this.showHealthTold = true;
                }else{
                   this.setInsuranceData()
                    this.$router.push({ path: '/product/presoalInformation' }); 
                }                               
            }else{
                this.isAmountPremium = true;                        
                sessionStorage.removeItem('insuranceData');
                this.insuranceData.startTime = this.startTime;
            } 
           
        }
    }

}
</script>

<style scoped>
  .bzsy_content_first{
      margin-top: .85rem;
  }
.jiange {
    height: 0.12rem;
    background-color: #F0F2F6;
}
.bzsy_content dt {
    line-height: 1rem;
    font-size: .32rem;
    color: #000000;
    font-weight: 100;
    border-bottom: 0.01rem solid #DDDDDD;
    border-top: 0.01rem solid #dddddd;
    font-weight: bold;
    padding: 0 .3rem;
}
.bzsy_content dd {
    padding-bottom: .1rem;
    padding: 0 .3rem;
}
.bzsy_content dd div.profitC {
    width: 100%;
    margin-top: .3rem;
}

.dl01 dd div.profitC {
    background: #FFF;
    line-height: .56rem;
    color: #666666;
    font-size: .28rem;
    width: 79%;
    float: left;
    margin-right: 0;
    letter-spacing: -.01rem;
}
.bzsy_content dd span {
    float: left;
    margin-right: 0;
    color: #666666;
    padding-bottom: 0.1rem;
    font-size: .28rem;
    line-height: .56rem;
    padding-bottom: 0.25rem;
    border-bottom: 0.01rem solid #ddd;
}
.bzsy_content dd div.profitC {
    background: #FFF;
    line-height: .56rem;
    color: #666666;
    font-size: .28rem;
    width: 79%;
    float: left;
    margin-right: 0;
    letter-spacing: -.01rem;
}
.read-content {
    width: 100vw;
    max-width: 768px;
    height: 100vh;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    margin: auto;
    /* margin-top: .85rem; */
}

.tip{
    float: left;
    margin-left: 0.1rem;
    color: #999;

}


</style>
