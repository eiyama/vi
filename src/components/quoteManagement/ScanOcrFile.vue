<template>
  <div>
    <mt-header class="def-header" :title="scanTitle">
      <div slot="left">
        <mt-button style="font-size:15px;color:#0070D3" @click="closeOcr()">取消</mt-button>
      </div>
      <div slot="right">
        <mt-button style="font-size:15px;color:#0070D3" @click="getOcrresult()">确定</mt-button>
      </div>
    </mt-header>
    <div style="padding:15px;background-color:#f9f9f9;">
      <div style="display:flex;justify-content: space-between;margin-bottom: 0.2rem;align-items: center;">
          <p style="color:red;height:35px;display:flex;align-items:center;font-size:12px;">点击下方区域，选择或者拍照上传，智能识别信息</p>
          <span v-if="isAndroid" class="cameraBtn"  @click="selectCamera">拍照</span>          
      </div>      
      <div class="show">
        <div class="picture" :style="'backgroundImage:url('+headerImage+');'" @click="selectPic">
          <div v-show="!hasImg">
            <img style="margin-top:80px;height:40px;" slot="icon" :src="addImg">
            <p style="margin-top:10px;font-size:12px;color:#a0a0a0">点击"+"选择图片识别</p>
          </div>
          <div v-show="hasImg && loading" style="background:#000;filter:alpha(Opacity=60);-moz-opacity:0.6;opacity: 0.6; width:100%;height:100%">
            <img style="margin-top:80px" slot="icon" :src="srcitem" width="35px" height="35px">
            <p style="margin-top:10px;font-size:12px;color:#FFF">识别中，请稍后...</p>
          </div>
        </div>
      </div>
      <div style="margin-top:20px;display:none">        
        <input ref="fileInput" type="file" @change="upload" accept="image/*" >
        <input ref="filecamera" type="file" @change="upload" accept="image/*" capture="camera">        
        <label for="upload"></label>
      </div>
      <div class="scanRes">
        <p>识别结果:</p>
        <!-- <textarea rows="24" cols="52"> -->
        <p v-show="!hasData">{{errorMsg}}</p>
        <p v-if="Ocrresult.cardNo">卡号: {{Ocrresult.cardNo}}</p>
        <p v-if="Ocrresult.carOwnerName">车主名: {{Ocrresult.carOwnerName}}</p>
        <p v-if="Ocrresult.plateNo">车牌号: {{Ocrresult.plateNo}}</p>
        <p v-if="Ocrresult.vin">车架号: {{Ocrresult.vin}}</p>
        <p v-if="Ocrresult.engineNo">发动机号: {{Ocrresult.engineNo}}</p>
        <p v-if="Ocrresult.model">品牌型号: {{Ocrresult.model}}</p>
        <p v-if="Ocrresult.licenseVehicleType">车辆类型: {{Ocrresult.licenseVehicleType}}</p>
        <p v-if="Ocrresult.useCharacter">使用性质: {{Ocrresult.useCharacter}}</p>
        <p v-if="Ocrresult.registerDate">注册日期: {{Ocrresult.registerDate}}</p>
        <!-- </textarea> -->
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, MessageBox } from 'mint-ui';
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
import { EXIF } from './../../common/exif';

export default {
  data() {
    return {
      headerImage: '',
      picValue: '',
      addImg: this.src = require('../../assets/images/ico-add.png'),
      srcitem: this.src = require('../../assets/images/ajax-loader.gif'),
      hasImg: false,
      loading: false,
      Ocrresult: '',
      hasData: false,
      errorMsg: '',
      title: '',
      isAndroid:false,
      isiOS:false,
      fileList:[]
    }
  },
  props: ['scanType', 'scanTitle'],
  mounted() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    if(isAndroid){
      this.isAndroid = isAndroid;
    }else{
      this.isAndroid = false
    }
     if (~navigator.userAgent.indexOf('Html5Plus')) {               
              var plusReady = function (callback) {  
                if (window.plus) {  
                  callback();  
                } else {  
                  document.addEventListener('plusready', callback);  
                }  
              } 
     }
    // console.log(this.isAndroid);
     this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  },
  methods: {
    closeOcr: function() {
      this.$emit('closeOcr');
    },
    getOcrresult: function() {
      console.log(this.Ocrresult)
      this.$emit('getOcrresult', this.Ocrresult);
      // this.$emit('closeone');
    },
    selectCamera(){
      // this.$refs.filecamera.click()  
       if (~navigator.userAgent.indexOf('Html5Plus')) { 
              // var cmr = plus.camera.getCamera();//获取摄像头管理对象
              // var res = cmr.supportedImageResolutions[0];//字符串数组，摄像头支持的拍照分辨率
              // var fmt = cmr.supportedImageFormats[0];//字符串数组，摄像头支持的拍照文件格式   
              // var self = this;           
              // cmr.captureImage( function( path ){//进行拍照操作
              // // 通过URL参数获取目录对象或文件对象
              //      self.rotateAImg(path);                  
              //     },
              // );
              var self = this;
              var cmr = plus.camera.getCamera();
              cmr.captureImage(function(p) {
                plus.io.resolveLocalFileSystemURL(p, function(entry) {
                  self.rotateAImg(entry.toLocalURL(),entry.name);
                }, function(e) {
                  plus.nativeUI.toast("读取拍照文件错误：" + e.message);
                });
              }, function(e) {
              }, {
                filter: 'image'
              });            
            }else{
                this.$refs.filecamera.click()
            }                    
    }, 
      rotateAImg: function(url,filename) { // 图片处理方法（包括旋转，因在IOS中会有图片读取时会自动旋转，导致读取后的文件不正确）  
        var that = this;  
        var name="_doc/upload/"+filename;
        plus.zip.compressImage({
          src:url,//src: (String 类型 )压缩转换原始图片的路径
          dst:name,//压缩转换目标图片的路径
          quality:60,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100
          overwrite:true//overwrite: (Boolean 类型 )覆盖生成新文件
        },
          function(zip) {
          //页面显示图片
              that.hasImg = true;
              that.showPics(zip.target,name);
          },function(error) {
              plus.nativeUI.toast("压缩图片失败，请稍候再试");
          }); 
          // if(p.indexOf('http') < 0) {  
          //       plus.zip.compressImage({  
          //           src: p,  
          //           dst: p,  
          //           overwrite: true,  
          //           rotate: 0 // 不管有没有被旋转，统一旋转0度  
          //       }, function(e) { 
          //         that.hasImg = true; 
          //           if(that.isiOS){ // 此处IOS需做路径转换处理，在转换时利用文件对象再去转base64，而安卓则直接可以用路径去加载文件  
          //               plus.io.resolveLocalFileSystemURL(e.target, function(entry){  
          //                   entry.file(function(path){  
          //                       // console.log("P__" + JSON.stringify(path));  
          //                       that.getBase64(path, e.name);   
          //                   })  
          //               });   
          //           } else{  
          //             // console.log("P__"+ e.target);
          //               that.getBase64(e.target, e.target);  
          //           }  
          //       }, function(error) {  
          //           that.o.error(error);  
          //           console.log("图片旋转时发生错误!");  
          //       });  
          //   } else {  
          //       that.o.success(p); // 如遇http地址，则直接返回该地址；  
          //   }
        },  
        getBase64: function(path, url){                     // 获取Base64  
            var that = this;  
            var reader = new plus.io.FileReader();          // 构建文件对象  
            reader.readAsDataURL(path);                     // 添加文件（此处安卓可以直接添加文件路径，而IOS则需要文件对象）  
            reader.onloadend = function (event) {           // 文件加载 完成后的事件回调  
                // console.log('event'+event.target.result);  
                  var result = event.target.result;
                  that.postImg(result);
                  that.headerImage = result;                  
            };  
        } ,         
        //图片显示
        showPics(url,name){
        //根据路径读取到文件
          var that = this;
          plus.io.resolveLocalFileSystemURL(url,function(entry){
              entry.file( function(file){
                  var fileReader = new plus.io.FileReader();
                  fileReader.readAsDataURL(file);
                  fileReader.onloadend = function(e) {
                    var picUrl = e.target.result.toString();
                    that.headerImage = picUrl;    
                    picUrl = picUrl.substring(picUrl.indexOf(',') + 1)
                    that.postImg(picUrl);
                    
                  }
              });
          });
        },
    selectPic: function() {
      this.$refs.fileInput.click()
    },
    upload: function(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.hasImg = true;
      // console.log(files);
      this.imgPreview(this.picValue);
      // console.log(this.picValue)
    },
    imgPreview: function(file) {
      var self = this;
      var Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      EXIF.getData(file, function() {
        Orientation = EXIF.getTag(this, 'Orientation');
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        var reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          var result = this.result;
          var img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024)) {
            var str = this.result;
            self.headerImage = str;
            str = str.substring(str.indexOf(',') + 1)
            // self.headerImage = this.result;
            self.postImg(str);
          } else {
            img.onload = function() {
              var data = self.compress(img, Orientation);
              self.headerImage = data;
              var str = data;
              str = str.substring(str.indexOf(',') + 1)
              // self.headerImage = str;
              self.postImg(str);
            }
          }
          // console.log(self.headerImage);
        }
      }
    },
    postImg: function(str) {
      // console.log(str)
      this.loading = true;
      var model = {
        category: this.scanType,
        sourceOption: "Base64",
        source: str
      }
      axiosPostAPI("/Ocr", model).then(res => {
        this.loading = false;
        this.Ocrresult = '';
        if (res.result && JSON.stringify(res.result.result) != "{}" && res.result.success) {
          this.Ocrresult = res.result.result;
          this.hasData = true;
          this.errorMsg = '';
        } else {
          this.hasData = false;
          if(!res.result.success){
            this.errorMsg = res.result.errMsg;
          }else{
              this.errorMsg = '无法识别，请检查一下图片的清晰度，然后重新选择上传识别~~';
          }
        }
        // if(res.success){
        //   this.hasData = true;
        // }else{
        //   this.hasData = false;
        //   this.errorMsg = res.errMsg;
        // }

      })

    },
    rotateImg: function(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      var height = img.height;
      var width = img.width;
      var step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      var degree = step * 90 * Math.PI / 180;
      var ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress: function(img, Orientation) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext('2d');
      //瓦片canvas
      var tCanvas = document.createElement("canvas");
      var tctx = tCanvas.getContext("2d");
      var initSize = img.src.length;
      var width = img.width;
      var height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      var ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      var count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, 'right', canvas); //转两次
            this.rotateImg(img, 'right', canvas);
            break;
        }
      }
      //进行最小压缩
      var ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
  }
}

</script>
<style>
* {
  margin: 0;
  padding: 0;
}

.show {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  border-radius: 0%;
  border: 1px solid #eeeeee;
}

.picture {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  vertical-align: middle;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.scanRes {
  margin-top: 20px;
  /* display: flex; */
}

.cameraBtn{
    font-size: 12px;
    height: 25px;
    padding: 0px 8px;
    border-radius: 5px;
    line-height: 25px;
    color: rgb(74, 102, 254);
    border: 1px solid rgb(74, 102, 254);
}

.scanRes p:nth-child(2) {
  margin-left: 10px;
  color: #0066FF;
  font-size: 16px;
}

</style>
