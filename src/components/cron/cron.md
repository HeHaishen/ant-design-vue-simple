<!--
 * @Description: 用于cron转译组件
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2021-01-08 17:59:26
 * @LastEditTime: 2021-01-08 18:10:03
-->

# 转译组件
# 使用方法、

<a-form-item
   :labelCol="labelCol"
   :wrapperCol="wrapperCol"
   label="cron表达式">
   <j-cron ref="innerVueCron" v-decorator="['cronExpression', {'initialValue':'0/1 * * * * ?',rules: 
    [{ required: true, message: '请输入cron表达式!' }]}]"  @change="setCorn"></j-cron>
</a-form-item>
 
import JCron from "@/components/jeecg/JCron.vue";
 
export default {
    name: "QuartzJobModal",
    components: {
      JCron
    },
    .....
     setCorn(data){
        console.log('data)',data);
        this.$nextTick(() => {
          this.model.cronExpression = data;
        })
