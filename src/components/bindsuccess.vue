<template>
  <div  style="background-color:#FFF;height:100vh;">
    <div style="margin-top: 20vh;text-align: center;">
         <img :src="phoneImg" style="width:50px;" />
        <h4 style="margin-top:0.2rem">绑定成功</h4>
    </div>      
  </div>
</template>
<script>

export default {
  // name: 'login',
  data() {
    return {
         phoneImg: (this.src = require("../assets/images/bindSuccess.png")),
    };
  },
  methods: { 
  },
  created(){
     document.title = '工单消息订阅'
  }
};
</script>
<style scoped>

</style>
