<template>
  <div class="reg" style="background-color:#FFF">
    <mt-header fixed class="def-header" title="我是代理人">
      <div slot="left">
        <mt-button icon="back" @click="openBack"></mt-button>
      </div>
    </mt-header>
    <div class="mint-content mint-region">
      <div class="h-content">
        <h3>您还不是代理人，完成一下信息赶快申请吧~~</h3>
        <div class="h-form">
          <van-cell-group>
            <van-field van-field__control required clearable v-model='obj.Name' label="姓名：" placeholder="请输入姓名" maxlength='30' />
            <van-field van-field__control required clearable v-model='obj.IdentityNo' label="身份证：" placeholder="请输入身份证" maxlength='18' />
            <van-field van-field__control required clearable v-model='obj.Mobile' label="电话：" placeholder="请输入电话" maxlength='12' type="number" />
          </van-cell-group>
          <!-- <mt-field label="姓名：" placeholder="请输入" v-model="obj.Name"></mt-field>
                    <mt-field label="身份证：" placeholder="请输入" maxlenght="18" v-model="obj.IdentityNo" ></mt-field>
                    <mt-field label="电话：" placeholder="请输入" maxlenght="12" type="number" v-model="obj.Mobile"></mt-field> -->
          <p class="tip">身份证正,反面照片；工作证或者执业证照片等其他资料</p>
          <form enctype="multipart/form-data" id='uploadForm' v-show="false"></form>
          <div class="poto">
            <div class="plist">
              <div class="pItem" v-for="(item,index) in plist" :key='index' @click="del(index)"><img :src="item.srcs" alt=""></div>
            </div>
            <div class="potoAdd">
              <van-uploader :after-read="onRead">
                <van-icon name="photograph" />
              </van-uploader>
            </div>
          </div>
        </div>
        <div class="mt20">
          <mt-button class="" type="primary" size="large" @click="goSuccess">提交申请</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { Dialog } from 'vant';
import * as types from './../../store/types';
import verify from "./../../common/verify";
import { axiosGetAPI, axiosPostAPI } from './../../common/Axios';
var formData = new FormData(document.getElementById('uploadForm'));
export default {
  name: 'reg',
  data() {
    return {
      title: '',
      userName: '',
      uID: '',
      phones: '',
      objs: '',
      obj: {
        Name: '',
        IdentityNo: '',
        Mobile: '',
        UserId: sessionStorage.getItem('userIds')
      },
      plist: [],
      index: 1
    }
  },
  methods: {
    asds() {
      console.log(document.getElementById('asd').files[0])
    },
    openBack() {
      this.$router.push({ path: "/myInfo/myIndex" });
    },
    goSuccess() {
      if (this.obj.Name == '') {
        Toast({
          message: '请输入姓名',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      if (this.obj.IdentityNo == '') {
        Toast({
          message: '请输入身份证',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      if (this.obj.IdentityNo.length < 18) {
        Toast({
          message: '请输入有效的身份证',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      if (this.obj.Mobile == '') {
        Toast({
          message: '请输入手机号码',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      if (this.obj.Mobile < 11) {
        Toast({
          message: '请输入有效的手机号码',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      if (this.objs == '') {
        Toast({
          message: '请上传资料',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      var isMobile = /^((\+?86)|(\(\+86\)))?(17[0123456789][0-9]{8}|13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/; //手机
      //18位数身份证
      if (!verify.validate.IsIDCard(this.obj.IdentityNo)) {
        Toast({
          message: '身份证号码不正确！',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      if (!(isMobile.test(this.obj.Mobile))) {
        Toast({
          message: '手机号码不正确',
          position: 'bottom',
          duration: 2000
        });
        return;
      }
      var model = {
        Name: this.obj.Name,
        Mobile: this.obj.Mobile,
        IdentityNo: this.obj.IdentityNo,
        UserId: sessionStorage.getItem('userIds')
      }
      model = JSON.stringify(model);
      this.objs.delete('model');
      this.objs.append('model', model);
      //console.log(this.obj);
      axiosPostAPI('/vi/salesmans', this.objs).then((d) => {
        if (d.status == 200) {
          this.$router.push({ path: "/certificationStatus?isSalesMan=false" });
        }
      })
    },
    onRead(data) {
      var allowed = "jpg|gif|png|jpeg|";
      var url = data.file.name,
        _hz = url.substring(url.lastIndexOf(".") + 1).toLowerCase();

      if (allowed.indexOf(_hz + '|') == -1) {
        Toast({
          message: '不支持' + _hz + '格式',
          position: 'bottom',
          duration: 2000
        });
        return false;
      }
      // if (data.file.size > 1024 * 1024 * 2) {
      //   Toast({
      //     message: '上传的图片不能超过2MB',
      //     position: 'bottom',
      //     duration: 2000
      //   });
      //   return false;
      // }

      var file = 'file' + this.index
      formData.delete(file);
      formData.append(file, data.file);
      this.index++

      this.plist.push({ srcs: data.content })

      this.objs = formData
      console.log(data);
    },
    del(index) {
      Dialog.confirm({
        title: '提示',
        message: '是否删除图片？'
      }).then(() => {
        document.getElementsByClassName('pItem')[index].style.display = 'none';
        formData.delete('file' + (index + 1))
      }).catch(() => {
        // on cancel
      });

    }
  }
}

</script>
<style scoped>
.h-content h3 {
  font-size: 12px;
  padding: 10px;
  font-weight: 100;
  color: #A4A4A4
}

.h-content .tip {
  font-size: 14px;
  padding: 10px;
  color: #949494
}

.mint-content {
  padding-left: 0;
  padding-right: 0
}

.mint-region .mint-cell {
  padding-top: 0
}

.mt20 {
  margin: 50px 20px;
}

.poto {
  padding: 10px;
  font-size: 1.5em;
  color: #4b4b4b
}

.poto .potoAdd {
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid #A4A4A4;
  display: inline-block
}

.plist {
  overflow: hidden;
}

.plist .pItem {
  float: left;
  width: 31.3333%;
  padding-right: 5px;
}

.plist .pItem img {
  width: 100%;
  height: 75px;
}

</style>
