<template>
    <div class="main" ref="imageWrapper" style="height:100%;">
        <div class="main_header">
            <div >
                <h3>统计看板</h3>
                <!-- <span  v-show="showExport && isWeixin" style="position: absolute;right: 10px;top: 10px;color: #fff;" @click="toImage">分享</span> -->
            </div>
            <div class="organizationChange" >
                <p class="organizationInput" @click="organizationListBtn">
                    {{organTitle}}
                    <van-icon class="downIcon" name="arrow-down" />
                </p> 
                <span :class="{organActive:isOrganizeNext}" @click="organizeNextBtn" > <i v-show="isOrganizeNext"></i>  含下级</span>                
            </div>            
        </div>  
        <div class="black_box_bg" v-show="showOrganization">

        </div>
        <van-popup  position="bottom" :lock-scroll="true"  :overlay='true' v-model="showOrganization" :style="{'height':popopHeight,'touch-action': 'none'}">
            <div class="organizationListBox"  :style="{height:organizeHeight}"  >            
                <el-tree
                        :data="organizationList"
                        show-checkbox                
                        node-key="id"
                        ref="tree"
                        highlight-current
                        check-strictly
                        :props="defaultProps"
                        @check-change="organizeChange"
                        >
                </el-tree>         
                <div class="organizationSubmit"  @click="organizeConfirm">                
                        确定                               
                </div>
            </div>
        </van-popup>   
        <div class="todayDynamic" v-show="!showOrganization">
            <div class="titleBox">
                <h3 class="title">今日动态</h3>
                <p>
                    <span style="font-size: 12px;color: #B0B0B0;">{{endTime}}</span>
                    <!-- <span>《数据说明》</span>  -->
                </p>
            </div>
            <div class="dataStatus">
                <div class="dataList" v-for="(item,index) in todayData" :key="index" >
                    <h3 >{{item.value}}</h3>
                    <p>{{item.key}}</p>
                </div>            
            </div>         
        </div>
        <div class="concent">
             <ul class="timeList">
                <li v-for="(item,index) in timeTitleList" :key="index" @click="timeChange(item,index)" :class="{active:timeIndex == index}">{{item}}</li>
            </ul>
            <div class="outList">               
                <h3 class="title">业务汇总</h3>
                <div class="totalOutList">                    
                    <div class="total">
                        <div style="width:50%">
                            <p style="font-size: .28rem;">累计出单</p>
                            <p style="font-size: .36rem;font-weight: bold;">{{policy.totalCount}}</p>
                        </div>
                        <div style="width:50%" v-if="policy.totalPremiums">
                            <p class="carIssue" >新车出单量：<span style="color:#EC534F">{{policy.summary[1].count}}</span></p>
                            <p class="carIssue">旧车出单量：<span style="color:#EC9F31">{{policy.summary[0].count}}</span></p>
                        </div>
                    </div>
                    <div class="total" style="border:0">
                        <div style="width:50%">
                            <p style="font-size: .28rem;">累计保费(元)</p>
                            <p style="font-size: .36rem;font-weight: bold;">{{policy.totalPremiums}}</p>
                        </div>
                        <div style="width:50%" v-if="policy.totalPremiums">
                            <p class="carIssue" >新车保费：<span style="color:#EC534F">{{policy.summary[1].premiums}}</span></p>
                            <p class="carIssue">旧车保费：<span style="color:#EC9F31">{{policy.summary[0].premiums}}</span></p>
                        </div>
                    </div>                    
                </div>
            </div>
            <div class="trend">
                 <h3 class="title">业务趋势</h3>
                 <div class="trendChange" style="width:3rem;">
                     <van-tabs v-model="trendIndex" line-height='3' line-width="25" color="rgba(37, 88, 255, 1)" @click="trendChangeBtn"> 
                        <van-tab title="全部"></van-tab>                        
                        <van-tab title="新保"></van-tab>                        
                        <van-tab title="续保"></van-tab>                    
                    </van-tabs>
                 </div>  
                <div id="trendBox" style="height:4rem;padding-bottom:0.2rem"></div>              
            </div>
            <div class="trend">
                 <h3 class="title">销售业绩分析</h3>
                 <div class="trendChange" style="width:2.5rem;" >
                     <van-tabs v-model="analyzeIndex"  line-height='3' @click="anlyzeChangeBtn"  line-width="25" color="rgba(37, 88, 255, 1)">
                        <van-tab title="出单量"></van-tab>
                        <van-tab title="保费"></van-tab>                                
                    </van-tabs>
                 </div>  
                <div id="marketBox" style="height:5.34rem;;padding-bottom:0.2rem"></div>              
            </div>         
            <div class="trend" v-show="carInAnalysis">
                <h3 class="title">进场自有品牌车辆成交漏斗模型</h3>
                <div id="funnelBox" style="height:4rem;" >                    
                </div>
            </div>
            <div class="trend">
                <h3 class="title">各保险公司出单规模占比</h3>
                  <div class="trendChange" style="width:3rem;">
                     <van-tabs v-model="insuranceIndex" line-height='3' @click="insuranceBtn" line-width="25" color="rgba(37, 88, 255, 1)">
                        <van-tab title="全部"></van-tab>
                        <van-tab title="新保"></van-tab>                                
                        <van-tab title="续保"></van-tab>                                                       
                    </van-tabs>
                 </div> 
                <div style="height:4.34rem" id="insuranceBox">
                </div>
                
            </div>
            <div class="trend" >
                <h3 class="title">续保销售精英排名</h3>
                <div >
                    <div class="trendChange" style="width:3.4rem;">
                     <van-tabs v-model="active" line-height='3' line-width="25" color="rgba(37, 88, 255, 1)" @click="tabChange"> 
                        <van-tab title="全部"></van-tab>
                        <van-tab title="次新车"></van-tab>
                        <van-tab title="旧车"></van-tab>                    
                    </van-tabs>
                   </div>  
                   <div class="salesRanking">
                       <table class="salesTable">
                           <tr>
                               <th>名次</th>
                               <th>出单量</th>
                               <th>姓名</th>
                           </tr>
                           <tr v-for="(item,index) in salesRankingsData" :key="index">
                             <td> <span>{{index + 1}}</span></td>
                             <td>{{item.count}}</td>                             
                             <td >{{item.name}} </td>                             
                           </tr>                                                   
                       </table>                                              
                   </div>
                </div>
            </div>
        </div>
        <van-popup v-model="shareinsuranImg" :close-on-click-overlay="false" style="width:80%;">
            <div>
                <!-- <shareApp :shareMsg="shareMsg" v-if="!isWeixin" style="margin: 8px 10px 8px 8px;float:left;" ></shareApp> -->
                <span style="margin: 8px 10px 8px 8px;float:left;color:rgba(37, 88, 255, 1);" @click="downLoade" v-show="!isWeixin" >保存图片</span>
                <van-icon @click="closeImgshare" style="float:right;margin:8px 10px 8px 0 ;" size="18" name="close" />
                <img style="width:100%" :src="shareImgUrl" alt="">
                <p style="text-align:center;color:#f44" v-show="isWeixin">长按保存或分享给好友</p>                
            </div>
        </van-popup>
        <div class="container-bottom" v-show="showExport && showStatement">
            <bottomTab ref="bottomTab" :plant.sync="plante" ></bottomTab>
        </div>
    </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui';
import { Tab, Tabs } from 'vant';
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
import echarts from "echarts";
import { type } from 'os';
import bottomTab from './../bottomtab/bottom-tab';
import html2canvas from 'html2canvas';
// import shareApp from './../common/shareApp'
export default {
    // name:'statement',
    data(){
        return{          
            plante:'statement',
            trendIndex:0,
            // timeTitleList:['本月','本季度','今年'],
            timeTitleList:['今日','本月','本季度','今年'],
            timeIndex:0,
            analyzeIndex:0,
            active: 0,
            showOrganization:false,
            checkModel:'',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            salesRankingsData:[],
            isOrganizeNext:true,
            organizationList:[],
            setLeft:{
                "right":''
            },
            todayData:[ ],
            organTitle:'',
            showSalesmanDetail:false,           
            startTime:'',
            endTime:'',
            insuranceIndex:0,
            salesmanIndex:0,
            organCode:'',
            i:0,
            popopHeight:'',
            organizeHeight:'',
            // 车辆进店
            "carInAnalysis": { },
            GetRangeReportResult:{},
            "salesRankings": [ ],
            // 业务分析
             "salesAnalysis": [ ],
            // 保险公司饼图
             "insCorpSalesScale": [],
            // 业务汇总
            "policy": {  },
            // 双折现图业务趋势
            "businessTrends": [],
            shareinsuranImg:false,
            shareImgUrl:'',
            showExport:true,
            isWeixin:false,
            shareMsg:{},
            downLoadeImg:'',
            showStatement:true
        }
    },
    components: {
        bottomTab,
        // shareApp
    },
    created(){
          if(localStorage.getItem('permissions')){
            var permissions = JSON.parse(localStorage.getItem('permissions'));
            this.showStatement = permissions.indexOf('SiteOwner') > -1  || permissions.indexOf('LookCarDealerReport') > -1  ;
        }
          var width = window.innerWidth;
          var height = window.innerHeight;       
          this.popopHeight = height - 110 + 'px' ;  
          this.organizeHeight = height - 180 + 'px'
          this.setLeft.right = width/100 - 1.12 + 'rem';
          var ua = navigator.userAgent.toLowerCase();
          this.isWeixin = ua.indexOf('micromessenger') != -1;
          this.shareMsg.title = '报表';
          this.shareMsg.type = 'image';
    },

  async mounted(){        
       Indicator.open('加载中...')                
       await axiosGetAPI('/Organizations/GetAllOrganWithoutDept').then(res=>{
           Indicator.close()                
            if(res.result.length > 0){
                this.organizationList = res.result;                 
                this.organCode = res.result[0].code;
                this.organTitle = res.result[0].name;
            }
        })   
    await this.getGetTodayReport();                
       Indicator.open('加载中...')                
        await axiosGetAPI('/CarDealerReport/GetRangeReport?orgCode=' + this.organCode + '&includeSubOrg=' + this.isOrganizeNext + '&rangeType=' + 3).then(res=>{
         Indicator.close()
            if(res.result){
                        this.GetRangeReportResult = res.result;
                        this.businessTrends = this.GetRangeReportResult.businessTrends;
                        this.policy = this.GetRangeReportResult.policy;
                        this.insCorpSalesScale = this.GetRangeReportResult.insCorpSalesScale;
                        this.salesAnalysis = this.GetRangeReportResult.salesAnalysis;
                        this.carInAnalysis = this.GetRangeReportResult.carInAnalysis;
                        this.salesRankings = this.GetRangeReportResult.salesRankings;                   
                }
        })      
        this.setOptionFunction();
        //    this.setperformance('','60%','horizontal',legendData,dataY,'insuranceBox');
    },
    methods:{
        downLoade(){
            window.location.href = this.downLoadeImg;
        },
        closeImgshare(){
            this.showExport = true;
            this.shareinsuranImg = false;
        },
            
        toImage() {
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;       
            var self = this;
            this.showExport = false;
            setTimeout(() => {
                html2canvas(this.$refs.imageWrapper,{allowTaint: false,useCORS: true}).then(canvas => {
                    let dataURL = canvas.toDataURL("image/png");
                    self.shareImgUrl = dataURL;                
                    self.shareinsuranImg = true;             
                    // console.log(imgUrl)
                });
            },500)
        },
        setOptionFunction(){                       
              // 折线图
            this.businessTrends.map(item=>{
                if(item.key == '全部'){
                    this.createCharsNOxy(item.value.dates,item.value.series);
                }
            })
            // 出单量
            var radius = ['40%', '60%'];
            var title = '总出单量：' +  this.policy.totalCount;
            var legends = [];
            var value = [];
            this.policy.summary.map(item=>{
                legends.push(item.name);
                var obj = {};
                obj.name = item.name;
                obj.value = item.count;
                value.push(obj);
            })
            this.setperformance(title,radius,'horizontal',legends,value,'marketBox');
            // 保险公司
            this.insCorpSalesScale.map(item=>{
                if(item.key == '全部'){
                    var dataY = []; 
                            var _legend = [];
                            item.value.map(_item=>{
                                var name = _item.Name || _item.name;
                                _legend.push(name)
                                var obj = {};
                                obj.name = _item.Name || _item.name;
                                obj.value = _item.Value || _item.value;
                                dataY.push(obj)
                            })               
                            if(dataY.length > 0){
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox'); 
                            }else{                                
                                dataY =[{name:'暂无数据',value:0}]
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox','#f0f0f0');
                            }  
                }
            })
            // 漏斗模型
            if( this.carInAnalysis && this.carInAnalysis.dataFunnels.length > 0){
                var legends = [];
                var dataFunnels = []; 
                var max = this.carInAnalysis.dataFunnels[0].value * 1.5;
                var min = 0            
                this.carInAnalysis.dataFunnels.map(item=>{            
                    legends.push(item.key);  
                    var obj = {};
                    obj.name = item.key;
                    obj.value = item.value;
                    dataFunnels.push(obj);
                    min = item.value;
                })
                this.setfunnel('funnelBox',legends,dataFunnels,max,min); 
            }
          
            // 业务员排名
            //  salesRankings
            this.salesRankingsData = []
            this.salesRankings.map((item)=>{
                if(item.key == '全部'){      
                   this.salesRankingsData = item.value;
                   // item.value.map((_item,_index)=>{
                    //     if(_index < 5){
                    //         this.salesRankingsData.push(_item);                
                    //     }                    
                    // })          
                    // 
                }
            })      
            this.trendIndex = 0;
            this.analyzeIndex = 0;
            this.insuranceIndex = 0;
            this.active = 0;
        },
        // 机构选择单选，没有会是多选
         organizeChange(data,checked, node){
             this.i++;
            if(this.i%2===0){
                if(checked){
                    this.$refs.tree.setCheckedNodes([]);
                    this.$refs.tree.setCheckedNodes([data]);
                    //交叉点击节点
                }else{
                    this.$refs.tree.setCheckedNodes([]);
                    //点击已经选中的节点，置空
                }
            }    
            if(checked){
                this.organTitle = data.name;
                this.organCode = data.code;                        
            }                                  
        },
        orgChangeBtn(){

        },
        tabChange(index){
             this.salesRankingsData = []
                this.salesRankings.map(item=>{
                   switch (index){
                        case 0 : 
                        if(item.key == '全部'){
                            this.salesRankingsData = item.value;
                            // item.value.map((_item,_index)=>{
                            //     if(_index < 5){
                            //         this.salesRankingsData.push(_item);                
                            //     }                            
                            // })
                        }
                            break;
                        case 1 :  
                        if(item.key == '次新车'){
                               this.salesRankingsData = item.value;
                               // item.value.map((_item,_index)=>{
                                //     if(_index < 5){
                                //         this.salesRankingsData.push(_item);                
                                //     }                    
                                // })
                            };
                            break;
                        case 2 : 
                            if(item.key == '旧车'){
                               this.salesRankingsData = item.value;
                               // item.value.map((_item,_index)=>{
                                //     if(_index < 5){
                                //         this.salesRankingsData.push(_item);                
                                //     }
                                    
                                // })
                            }
                            break;
                        default:
                            break;
                }                                                          
            })     
            
        },
        // 业务趋势图点击切换
        trendChangeBtn(index){
               this.businessTrends.map(item=>{
                   switch (index){
                        case 0 :  
                            if(item.key == '全部'){
                                this.createCharsNOxy(item.value.dates,item.value.series);
                            } ;
                            break;
                        case 1 :  
                        if(item.key == '新车保'){
                                this.createCharsNOxy(item.value.dates,item.value.series);
                            };
                            break;
                        case 2 : 
                            if(item.key == '旧车保'){
                                this.createCharsNOxy(item.value.dates,item.value.series);
                            }
                            break;
                        default:
                            break;
            }                                                          
            })            
        },
        // 点击切换
        anlyzeChangeBtn(index){
             var radius = ['40%', '60%'];
            if(index == 0){
            // 出单量
                var title = '总出单量：' +  this.policy.totalCount;
                var legends = [];
                var value = [];
                this.policy.summary.map(item=>{
                    legends.push(item.name);
                    var obj = {};
                    obj.name = item.name;
                    obj.value = item.count;
                    value.push(obj);
                })
                this.setperformance(title,radius,'horizontal',legends,value,'marketBox');
            }
            if(index == 1){
            // 保费
                var title = '总保费：' +  this.policy.totalPremiums;
                var legends = [];
                var value = [];
                this.policy.summary.map(item=>{
                    legends.push(item.name);
                    var obj = {};
                    obj.name = item.name;
                    obj.value = item.premiums;
                    value.push(obj);
                })
                this.setperformance(title,radius,'horizontal',legends,value,'marketBox');
            }
            // console.log(this.analyzeIndex);
        },
        getGetTodayReport(){
              Indicator.open('加载中...')
            axiosGetAPI('/CarDealerReport/GetTodayReport?orgCode=' + this.organCode + '&includeSubOrg=' + this.isOrganizeNext).then(res=>{
              Indicator.close()
              if(res.result){
                    this.todayData = res.result.items;
                    this.endTime = res.result.endTime;
                }
             })  
        },
        getCarDealerReport(type){
            Indicator.open('加载中...')    
            var timeindex = 0;
            if(this.timeIndex == 0){
                timeindex = 3;
            }else{
                timeindex = this.timeIndex - 1 ;
            }
            axiosGetAPI('/CarDealerReport/GetRangeReport?orgCode=' + this.organCode + '&includeSubOrg=' + this.isOrganizeNext + '&rangeType=' + timeindex).then(res=>{
            Indicator.close()
                if(res.result){
                        this.GetRangeReportResult = res.result;
                        this.businessTrends = this.GetRangeReportResult.businessTrends;
                        this.policy = this.GetRangeReportResult.policy;
                        this.insCorpSalesScale = this.GetRangeReportResult.insCorpSalesScale;
                        this.salesAnalysis = this.GetRangeReportResult.salesAnalysis;
                        this.carInAnalysis = this.GetRangeReportResult.carInAnalysis;
                        this.salesRankings = this.GetRangeReportResult.salesRankings;
                        this.setOptionFunction();                  
                }
             })                  
        },
        insuranceBtn(index){
             // 保险公司
             if(index == 0){
                 this.insCorpSalesScale.map(item=>{
                    if(item.key == '全部'){
                            var dataY = []; 
                            var _legend = [];
                            item.value.map(_item=>{
                                var name = _item.Name || _item.name;
                                _legend.push(name)
                                var obj = {};
                                obj.name = _item.Name || _item.name;
                                obj.value = _item.Value || _item.value;
                                dataY.push(obj)
                            })      
                            if(dataY.length > 0){
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox'); 
                            }else{                                
                                dataY =[{name:'暂无数据',value:0}]
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox','#f0f0f0');
                            }          
                            
                        }
                    })
             }
             if(index == 1){
                 this.insCorpSalesScale.map(item=>{
                if(item.key == '新车保'){
                     var dataY = []; 
                            var _legend = [];
                            item.value.map(_item=>{
                                var name = _item.Name || _item.name;
                                _legend.push(name)
                                var obj = {};
                                obj.name = _item.Name || _item.name;
                                obj.value = _item.Value || _item.value;
                                dataY.push(obj)
                            })   
                             if(dataY.length > 0){
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox'); 
                            }else{                                
                                dataY =[{name:'暂无数据',value:0}]
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox','#f0f0f0');
                            }             
                        // this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox'); 
                    }
                })
             }
             if(index == 2){
                 this.insCorpSalesScale.map(item=>{
                    if(item.key == '旧车保'){
                            var dataY = []; 
                            var _legend = [];
                            item.value.map(_item=>{
                                var name = _item.Name || _item.name;
                                _legend.push(name)
                                var obj = {};
                                obj.name = _item.Name || _item.name;
                                obj.value = _item.Value || _item.value;
                                dataY.push(obj)
                            })                
                           if(dataY.length > 0){
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox'); 
                            }else{                                
                                dataY =[{name:'暂无数据',value:0}]
                                this.setperformance('','70%','vertical',_legend,dataY,'insuranceBox','#f0f0f0');
                            }  
                        }
                    })
             }        
            // this.setperformance('','60%','vertical',legendData,dataY,'insuranceBox');
        },
        // 年月季度选择
        timeChange(item,index){
            this.timeIndex = index;
            switch (index){
                case 0 :  
                   this.getCarDealerReport(3)
                    break;
                case 1 : 
                   this.getCarDealerReport(index - 1)
                    break;
                case 2 :
                   this.getCarDealerReport(index - 1)
                    break;
                case 3 : 
                    this.getCarDealerReport(index - 1)
                    break;
                default:
                    break;
            }
                // this.monthReport()            
        },   
        // 机构选择打开按钮
        organizationListBtn(){     
            this.showOrganization = !this.showOrganization;
            // if(this.showOrganization){
            //     var $_bg = $('.black_box_bg');
            //     $_bg.on("touchmove",this.bodyScroll,false); //禁止页面滚动     
            // } else{
            //     var $_bg = $('.black_box_bg');
            //     $_bg.off("touchmove",this.bodyScroll,false); //禁止页面滚动   
            // }                        
            // console.log(this.checkModel);
        },
        // 是否含下级
        organizeNextBtn(){
            this.isOrganizeNext = !this.isOrganizeNext
            this.getGetTodayReport();
            this.getCarDealerReport();
        },
        // 机构选择确认按钮
        organizeConfirm(){  
            //  var $_bg = $('.black_box_bg');
            // $_bg.off("touchmove",this.bodyScroll,false); //禁止页面滚动           
            if(this.organCode){
                this.getGetTodayReport();
                this.getCarDealerReport();                                          
            }else{

            }
             this.showOrganization = !this.showOrganization;
        },
        // 销售排名漏斗模型
        showDetail(){
            this.showSalesmanDetail = !this.showSalesmanDetail;
            this.setfunnel('salesmanDetail');
        },
        // 漏斗模型
        setfunnel(el,legends,data,max,min){
            let myChart = echarts.init(document.getElementById(el));
            myChart.setOption({ 
                color:['#2558ff','#4de5af','#eecb5f','#e3935d','#e16751'], 
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}"
                },
                legend: {
                    icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
                    itemWidth: 10,  // 设置宽度
                    itemHeight: 10, // 设置高度
                    right:10,
                    top:45,
                    orient: 'vertical',
                    data: legends
                },                
                series: [
                    {                        
                        type:'funnel',
                        left: "1%",
                        top: 40,
                        bottom: 30,
                        width: '80%',                     
                        min: min,
                        max: max,
                        minSize: '10%',
                        maxSize: '90%',
                        gap: 0,
                        label: {
                            show: true,
                            position: 'inside',
                            formatter: " {c}"                            
                        },                                                                     
                        data:data 
                        // [                            
                        //     {value: 1363, name: '丰田总进场量'},
                        //     {value: 307, name: '30-60天到保台数'},
                        //     {value: 146, name: '30天到保台数'},
                        //     {value:50, name: '报价台数'},
                        //     {value: 10, name: '成交台数'}                            
                        // ],                                    
                    }
                ]
            })
        },
        // 饼图模型
        setperformance(title,radius,orient,legendData,dataY,el,bieColor){
            let myChart = echarts.init(document.getElementById(el));
               var font = ''
               var color = ""
            if(orient == 'vertical'){
                var right = 0;
                var bottom;
                if(bieColor){
                    var center = ['50%', '44%'];
                }else{
                    var center = ['25%', '44%'];
                }                
                font = "单";
                color = "#fff"
            }else{
                if(this.analyzeIndex == 0 ){
                    font = "单"
                }else{
                    font = "元"
                }
                var bottom = 0;
                var right = 'auto';
                var center = ['50%', '44%'];
                color = "#666";
            }
         var  _bieColor = ''
         if(bieColor){
             _bieColor = bieColor
         }else{
             _bieColor = [
                        '#2558ff',
                        '#4de5af',
                        '#eecb5f',
                        "#ffd08c",
                        "#35c2d1",
                        "#6aa786",
                        "#35c2d1",
                        "#2a5f07",
                        "#6da5eb",
                        "#6d79eb",
                        "#ae6deb",
                        "#e16deb",
                        "#eb6dba",
                        "#ff6600",
                        "#5551f6",
                        "#51a6f6",
                        "#ebbd6d",
                        ]
         }
           
            myChart.setOption({  
                     color:_bieColor,
                title: {
                    text: title,
                    x: 'center',
                    // y: '40%',
                    textStyle: {
                            color: '#333',
                            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                            fontWeight: 600,
                            fontSize: 16,
                            fontFamily: 'Microsoft YaHei'
                        }
                },      
                legend: {
                    icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
                    itemWidth: 10,  // 设置宽度
                    itemHeight: 10, // 设置高度
                    type:'scroll',
                    orient: orient,
                    right:right,                    
                    bottom:bottom,
                    formatter: function(name) {
                    var data = dataY;
                    var total = 0;
                    var tarValue;
                    if(data.length){
                        for (var i = 0, l = data.length; i < l; i++) {
                        total += data[i].value;
                        if (data[i].name == name) {
                            tarValue = data[i].value;
                        }
                    }
                    }      
                    if(total > 0){
                        var p = (tarValue / total * 100).toFixed(2);
                    }              
                    else{
                        var p = total;
                    }
                    return name + ' ' + ' ' + '(' + tarValue + font + p + '%)';
                },
                    data: legendData
                },                              
                    series: [
                        {                        
                            type: 'pie',
                            radius: radius,
                            avoidLabelOverlap: false,
                            label: {                                
                                normal:{
                                    show: false,
                                    position: 'center',                                     
                                }
                            },
                            center: center,
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                    color:color,
                                    formatter: '{b}:' + '\r\n' + '{d}%',                                    
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: dataY
                        }
                ]          
        })
        },
        // 保费&出单量折线图
    createCharsNOxy(dates,series) {
      // 绘制图表
      var self = this;
      let myChart = echarts.init(document.getElementById('trendBox'));
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          position: 'center',
        },
        legend: {
                icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
                // orient: 'horizontal',
                show: true,
                bottom: 0,
                data: ['出单量', '保费规模']
        }, 
        grid: {
          top: 40,
          right:50
        },
        xAxis: {
          type: 'category',
          show: true,
          axisLine: {
            lineStyle: {
              color: "#666",
            }
          },
          axisTick:{       //
            show:false
           }, 
          data: dates
        },
        yAxis: [
            {
            name:'出单量',
            type: 'value',
            show: true,
            axisLine:{       //y轴
              show:false
            },
            axisTick:{       //
              show:false
            },
            splitLine:{show:false},
            axisLabel: {
                    margin: 2,
                    formatter: function(value, index) {
                    if (value >= 10000 && value < 10000000) {
                        value = value / 10000 + "万";
                    } else if (value >= 10000000) {
                        value = value / 10000000 + "千万";
                    }
                    return value;
                    },
                }, 
            textStyle: {                            
                fontSize: 12 //更改坐标轴文字大小
            },                     
        },
        {
            name:'保费规模（元）',
            type: 'value',
            show: true,
            textStyle: {
                fontSize: 12 ,//更改坐标轴文字大小
                color:"#eee",
            },    
            axisLine:{       //y轴
                show:false
            },
             axisLabel: {
                    margin: 2,
                    formatter: function(value, index) {
                    if (value >= 10000 && value < 10000000) {
                        value = value / 10000 + "万";
                    } else if (value >= 10000000) {
                        value = value / 10000000 + "千万";
                    }
                    return value;
                    },
                }, 
            axisTick:{       //y轴刻度线
                show:false,

            },     
        },        
        ],
        series: [
            {
                symbol: 'circle',
                name:'出单量',
                type: 'line',
                symbolSize: 5,
                smooth: true,               
                // sampling: 'average',
                yAxisIndex: 0,
                itemStyle: {
                    color: '#2558ff'
                },              
                data: series[0]
            },
            {
                
                symbol: 'circle',
                name:'保费规模',
                symbolSize: 5,
                type: 'line',
                smooth: true,
                yAxisIndex: 1,                
                // sampling: 'average',
                itemStyle: {
                    color: '#fcaa49'
                },               
                data: series[1]
            },
        ]
      })
    },
    },
}
</script>
<style scoped>
    .main .main_header{
        height:120px;
        background: inherit;
        background-color: rgba(37, 88, 255, 1);
        
    }
    .main .main_header h3{
        font-size: 0.36rem;
        color: #FFFFFF;
        line-height:1rem;
        height: 1rem;
        text-align: center;
    }
    .organizationChange{
        display: flex;
        justify-content: space-between;
        margin: 0 0.3rem;
        align-items: center;
    }
    .organizationChange span{
        color: #fff;
        border: 1px solid #eee;
        border-radius: 0.3rem;
        width: 1.6rem;
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
    }
    .organizationInput{
        height: 0.64rem;
        font-size: 0.28rem;
        color: #FFFFFF;
        background: rgba(255, 255, 255, 0.0980392156862745);
        border-radius: 0.32rem;
        width: 4.8rem;
        text-align: center;
        line-height: 0.64rem;
        position: relative;
    }
   .organizationChange .organActive{
        background: #fff;
        color:rgba(37, 88, 255, 1) ;
        border: 1px solid #eee;
        border-radius: 0.3rem;           
    }
    .organizationChange .organActive i {
        display: inline-block;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAYAAABQDyyRAAAB8klEQVRIib3VzYtNcRzH8deMMTQjlKaUkZRSUkoporEgj0meFpPYKFlIoVlI2ShZSJQkeUhCwzRCIkIpZaH8B5a2UpIwRr/63jpd55w59457P6tzvg+/9+d8z+/8TsfA/s/aqH5041MN2dlG+Dy8wWssaLeBuXiFRQFPRua3y0BfwBdnYgtjEv2tNtAXoCU5uTSN4VYamIOXWFqQ/4LDrTIwGy+wrCD/FRvwsRUGZgV8eQl8Ez6km3oDqbl3EvCZeIYVBflv2Ir3tUDWQII/x1P0NAHvjd5VBfnvAX+XDdYMzIjmlViLxw2a6In+NSXwbXhbn+jMNK/OxNfhIaZXhD8K43n6gR3xOf6jzgAN5OTSLh2Ns7tI06JmfUH+J3bGpsxVMnAlCvO0GSMFJroDvrEEvjs2ZaFqE9iLsYKi9O7uYWod/D62FPT8wiCelMGTaptwZAITaYx3MAVduIvtBbVjsdboRPCkrsz1cDzZzQDVaw9+R25XCXwfHlSB1xtIuh1PeB0dOfWDJWsl+IF4XZWVdxSnCRzEeAPrjEfPrUbgSUX/gmvpT1XRRKo5hBuNwssMJF3G0QrwI7jaDHwiA0kXcbwkfwyXmoVXMZB0Hidy4kO4MBl4VQNJZ3Eqc38S5yYLT6r/DMt0Os6APzjzP+DwF+mVVmSLQ4IwAAAAAElFTkSuQmCC') no-repeat ;
        height: 0.2rem;
        width: 0.2rem;
        background-size: 100% 100%; 
    }
    .downIcon{
        position: absolute;
        top: 0.2rem;
        right: 0.3rem;
    }
    .todayDynamic{
        border-width: 0px;
        margin-top: -.3rem;        
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0.32rem 0.32rem 0 0;
        padding: 0.3rem;
    }
    .todayDynamic .titleBox{
        height: 0.6rem;
        line-height: .6rem;
        display: flex;
        justify-content: space-between;
        
    }
    .dataStatus{
        height: 1.8rem;
        background-color: rgba(249, 249, 249, 1);
        border: none;
        border-radius: 8px;
        margin-top: 0.2rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .dataList{
        text-align: center;
        font-size: 0.28rem;
    }
    .dataList h3{
        font-size: 0.44rem;       
        text-align: center;
    }
    .dataList:nth-child(1) h3{
        color: #2558FF;        
    }
    .dataList:nth-child(2) h3{
        color: #E68341;        
    }
    .dataList:nth-child(3) h3{
        color: #E6AF0A;        
    }
    .dataList:nth-child(4) h3{
        color: #17D287;        
    }
    .insuranceList{
        display: flex;
        justify-content: space-between;
        align-items: center;           
    }
    .insuranceList p {
        width: 50%;
    }
    
  .main .concent{
        margin-top: 0.2rem;
        padding: 0.3rem;
        background: #FFFFFF;
        padding-bottom: 1.5rem;
    }
    .timeList{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.6rem;
    }
    .timeList li{
        width: 1.2rem;
        height: 0.6rem;
        line-height: .6rem;
        background: inherit;
        background-color: rgba(246, 248, 255, 1);
        box-sizing: border-box;       
        border-radius: .3rem;
         border-width: 1px;
        color: #333333;
        text-align: center;
        font-size: 0.26rem;
        font-weight: bold;

    }
    .timeList .active{
        border-width: 1px;
        border-style: solid;
        border-color: rgba(37, 88, 255, 1);
        color: rgba(37, 88, 255, 1);
    }
    .title{
        font-size: 0.32rem;
        color: #333333;
        font-weight: bold;
    }
    .outList{
        margin-top: 0.6rem;
    }
    .totalOutList{
            margin-top: 0.3rem;
            height: 3.3rem;
            background: inherit;
            background-color: rgba(249, 249, 249, 1);
            border: none;
            border-radius: 0.16rem;
    }
    .totalOutList .total{       
        padding: 0.3rem;
        display: flex;
        justify-content: space-between;
        border-bottom:1px solid #eee;
    }
    .carIssue{
        color:#B0B0B0;
        font-size:0.24rem;
        line-height: 0.42rem;
        height: 0.42rem;
    }
    .carBox p:nth-child(1) span{
        color:#EC534F;
    }
    .carBox p:nth-child(2) span{
        color:#EC9F31;
    }
    .trend{
       margin-top:0.6rem; 
       border-bottom: 0.01rem solid #eee;
    }
    .trendChange{
        width: 55%;
        margin: auto;
        margin-bottom: 0.3rem;
    }
   #trendBox{
       height: 5.34rem;
   }
   .organizationListBox{
        height: 9.8rem;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        /* margin-top: -.3rem; */
        /* padding-left: 0.3rem; */        
        /* position: relative; */
        /* box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.117647058823529); */
        overflow-y: auto;
        padding-top: 0.3rem;
   }
   .organizationListBox ul li {
        display: flex;
        height: 1rem;
        line-height: 1rem;
        align-items: center;
        border-bottom: 1px solid #eee;
        color: #333333;
        font-size: 0.28rem;
   }
   .itemBox{
       flex: 1;
       margin-left:.2rem;
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding-right: 0.3rem;
   }
   .organizationSubmit{       
        position: fixed;
        bottom: 0.3rem; 
        left: 35%;  
        width: 2.24rem;
        height: .64rem;
        background: inherit;
        background-color: rgba(37, 88, 255, 1);
        border: none;
        border-radius: 18px;
        color: #FFFFFF;
        font-size: .32rem;
        line-height: .64rem;
        text-align: center;           
   } 
   .salesTable{
       width: 100%;
       border: 1px solid #e0e0e0;
    }
    .salesTable td:last-child { border-right: none; }
    .salesTable tr:last-child th,
    .salesTable tr:last-child td { border-bottom: none; }
    .salesTable th, .salesTable td {   
        border-bottom: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
    }
    .salesTable tr th{
        height: 0.76rem;
        line-height: 0.76rem;
        background: #FAFBFF;
        color: #333333;
        font-size:0.24rem;        
    }
    .salesTable tr td{
        height: 0.6rem;
        line-height: 0.6rem;        
        color: #333333;
        font-size:0.28rem ;        
        text-align: center;        
    }
    /* .salesTable tr td:nth-child(3){
        display: flex;
        align-items: center;
        justify-content: center
    } */

    .salesTable tr td:nth-child(1){
        font-weight: bold;
    }

    .black_box_bg{
        position: fixed; 
        width:100%;
        height:100%; 
        top:0;
        left:0;
        bottom: 0;
        z-index:99;
    }

    .salesTable tr:nth-child(2) td:nth-child(1) span{        
        height: 16px;
        background: #F24C40;
        color: #FFF;
        text-align: center;
        line-height: 17px;
        width: 20px;
        display: inline-block;
        border-radius: 3px;
    }
    .salesTable tr:nth-child(3) td:nth-child(1) span{
        height: 16px;
        background: #EE9136;
        color: #FFF;
        text-align: center;
        line-height: 17px;
        width: 20px;
        display: inline-block;
        border-radius: 3px;
       

    }
    .salesTable tr:nth-child(4) td:nth-child(1) span{
        height: 16px;
        background: #29E390;
        color: #FFF;
        text-align: center;
        line-height: 17px;
        width: 20px;
        display: inline-block;
        border-radius: 3px;        
    }
    /* .mask{color: #FFFFFF;font-size:22px;font-weight: bold;}
    .mask li{       
        margin: auto;   
        text-align: center;  
        position: relative;  
    }
    .mask li p {
        position: absolute;
        top: -30px;
        left: 30%;
    }
    .mask li:nth-child(1){        
            width: 140px;
                height: 0;
                border-top: 30px solid #2558ff;
                border-right: 30px solid transparent;
                border-left: 30px solid transparent;       
    }
    .mask li:nth-child(2){      
            width: 80px;
            height: 0;
            border-top: 30px solid #4de5af;
            border-right: 30px solid transparent;
            border-left: 30px solid transparent;      
    }
    .mask li:nth-child(3){        
            width: 50px;
            height: 0;
            border-top: 30px solid #eecb5f;
            border-right: 15px solid transparent;
            border-left: 15px solid transparent;      
    }
    .mask li:nth-child(4){        
            width: 40px;
            height: 0;
            border-top: 30px solid #e3935d;
            border-right: 5px solid transparent;
            border-left: 5px solid transparent;      
    }
    .mask li:nth-child(5){        
           width: 34px;
            height: 0;
            border-top: 30px solid #e16751;
            border-right: 3px solid transparent;
            border-left: 3px solid transparent;      
    }     
    .maskRight li{
        height: 30px;
        line-height: 30px;
        position: relative;
        margin-left: 4.5rem;
    }
    .maskRight li p{
        font-size: 0.24rem;
    }
    .cell-title-icon{
        width:0.22rem;
        height: .22rem;
        background:#2558ff;
        border-radius: 50%;
       
        margin-top: -.11rem;
        position: absolute;
        left: -.4rem;
        top: 50%;
    }
    .maskRight li:nth-child(1) i{
        background:#2558ff;
    }
    .maskRight li:nth-child(2) i{
        background:#4de5af;
    }
    .maskRight li:nth-child(3) i{
        background:#eecb5f;
    }
    .maskRight li:nth-child(4) i{
        background:#e3935d;
    }
    .maskRight li:nth-child(5) i{
        background:#e16751;
    } */
</style>