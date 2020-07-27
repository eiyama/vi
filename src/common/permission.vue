
<script>
import Vue from 'vue';
import { Divider } from 'vant';
// 注册一个全局指令showPermission，权限控制
 Vue.directive('showPermission',{           
            bind:function(el,binding){//每当指令绑定到元素上的时候，会立即执行这个bind函数，只执行一次
                // el.style.color=binding.value
                var permissions = JSON.parse(localStorage.getItem('permissions'));
                if(permissions){
                    if(permissions.indexOf('SiteOwner') > -1){ //管理员无需往下走
                        return ;
                    }                
                    var bindList = binding.value;                
                    bindList.map(item=>{
                        if(permissions.indexOf(item) == -1){
                            el.style.display = "none";
                        }
                    })
                }                                
            },
            //binding为一个对象，包含一些属性
            // inserted:function(el){//当元素插入到dom的时候，会执行insert，只执行一次
            //     el.focus()
            // },
            // updated:function(el){//当vnode更新的时候会执行update，可能触发多次                
            // }
        })    
        // 功能控制
        Vue.directive('showAppFeatures',{            
            bind:function(el,binding){
                var appFeatures = JSON.parse(sessionStorage.getItem('appFeatures'));
                // var permissions = JSON.parse(sessionStorage.getItem('permissions'));
                if(appFeatures){
                    var permissions = JSON.parse(localStorage.getItem('permissions'));
                    if(permissions.indexOf('0') > -1){
                        return
                    }                    
                    if(permissions.indexOf('SiteOwner') > -1){ //管理员无需往下走
                        return ;
                    }                
                    var bindList = binding.value;                
                    bindList.map(item=>{
                        if(appFeatures.indexOf(item) == -1){
                            el.style.display = "none";
                        }
                    })                    
                }
                
            },            
        })  
        
//         vue.directive('name',{
//             bind:function(el,binding){
// <div v-name="show"> </div>
// el --> div ; binding.value --> show;
//             }
//         }) 
export default {
    
}
</script>



