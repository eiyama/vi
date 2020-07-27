<template>
    <div>
        <span style="color:rgb(74, 102, 254);font-size:14px;" @click="appshare">分享</span>
    </div>
</template>
<script>

export default {
    data(){
        return{
            shareData:[],
            sharewx:[]
        }
    },
    props: [ 'shareMsg'],
    mounted(){
        if (~navigator.userAgent.indexOf('Html5Plus')){
            let t = this  //因为用的vue框架，这里需要用到this ，如果没有用可注释
        　　plus.share.getServices(function(e) {
             t.shareData = e　　//这个回调函数的参数 e 就包含了 所有对象的数组                   
        　　　　//在这个数组里 找到属于微信的对象 循环匹配查找
            　　for(var i in e){　　　　　　　　
                　　if('weixin' == e[i].id){
                    　　t.sharewx = e[i]　　//保存到变量里 （之后即可使用该对象发起分享）                    
                　　}
            　　}            
        　　})    
      }        　     　　    
    },
methods:{
    appshare(ex) {            
        var  s = this.sharewx;
        if (!s) {  
            alert("无效的分享服务！");  
            return;  
        }  
        if (s.authenticated) {              
            this.shareMessage(this.sharewx, ex);  
        } else {             
            s.authorize(function() {  
                this.shareMessage(this.sharewx, ex);  
            }, function(e) {  
                alert("认证授权失败：" + e.code + " - " + e.message);  
            });  
        }           
    },
     shareMessage(s,ex){               
        if(this.shareMsg.type == "" ){
            alert( "分享失败" );
            return;
        }else{
            switch (this.shareMsg.type){
                case 'web':
                    if(this.shareMsg.title == '' || this.shareMsg.content == '' || this.shareMsg.href == '' || this.shareMsg.shareImg == "" ){
                            alert( "分享失败" );
                            return;
                        }
                    var msg = {
                　　　　type: this.shareMsg.type,　　//分享的内容的类型 
                　　　　title: this.shareMsg.title,
                　　　　content: this.shareMsg.content,
                　　　　thumbs: this.shareMsg.shareImg,
                　　　　href:  this.shareMsg.href,
                　　　　extra:{scene:"WXSceneSession"} // 'WXSceneSession'分享给好友，'WXSceneTimeline'分享到朋友圈
                　　};
                break;
                case 'image':
                if(this.shareMsg.title == '' || this.shareMsg.pictures == '' ){
                        alert( "分享失败" );
                        return;
                    }
                  var msg = {
                　　　　type: this.shareMsg.type,　　//分享的内容的类型 
                　　　　title: this.shareMsg.title,
                　　    pictures:this.shareMsg.pictures,
                　　　　extra:{scene:"WXSceneSession"} // 'WXSceneSession'分享给好友，'WXSceneTimeline'分享到朋友圈
                　　};  
                break;
            }            
            //  console.log(msg);
           this.sharewx.send( msg, function(){  
            //   alert( "分享到\""+s.description+"\"成功！ " );  
          }, function(e){  
              alert( "分享到\""+s.description+"\"失败: "+e.code+" - "+e.message );  
          } ); 
        }                
        
    },
}

}
</script>
<style scoped>

</style>
   