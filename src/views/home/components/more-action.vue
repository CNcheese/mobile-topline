<template>
 <van-dialog
 :value='value'
 @input="$emit('input', $event)"
 :showConfirmButton="false"
 close-on-click-overlay
 >
   <van-cell-group v-if="!isReportShow">
     <van-cell icon="like-o" title="不感兴趣" />
     <van-cell icon="bell" title="举报垃圾内容"
     is-link @click="isReportShow = true" />
     <van-cell icon="manager" title="拉黑作者" />
   </van-cell-group>
   <van-cell-group v-else>
     <van-cell icon="arrow-left" @click='isReportShow= false' />
     <van-cell icon="manager" title="拉黑作者" />
     <van-cell icon="manager" title="拉黑作者" />
     <van-cell icon="manager" title="拉黑作者" />
     <van-cell icon="manager" title="拉黑作者" />
     <van-cell icon="manager" title="拉黑作者" />
     <van-cell icon="manager" title="拉黑作者" />
     <van-cell icon="alipay" title="逼我充值" />
   </van-cell-group>
 </van-dialog>
</template>

<script>
export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isReportShow: false
    }
  }
}
</script>

<style  scoped lang='less'>

</style>
