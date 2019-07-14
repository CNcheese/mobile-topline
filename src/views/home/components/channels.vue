<template>
   <van-popup
   :value="value"
   @input="$emit('input', $event)"
   position="bottom"
   :style="{ height: '93%' }"
   get-container="body"
   :lazy-render="false"
   >
   <!-- <div class="close"></div> -->
   <!-- 我的频道 -->
   <div class="channel">
     <div class="channel-head">
       <div>
         <span class="title">我的频道</span>
         <span class="desc">点击进入频道</span>
       </div>
       <div>
         <van-button
         type="danger"
         plain
         size="mini"
         @click="isEdit = !isEdit"
         >{{ isEdit ? '完成' : '编辑' }}</van-button>
       </div>
     </div>
     <div class="channel-content">
       <van-grid :gutter="10" clickable>
          <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
          @click="handleUserChannelClick(item, index)"
          >
          <span
          class="text"
          :class="{ active: index === activeIndex && !isEdit }"
          >{{ item.name }}</span>
          <van-icon class="close-icon" name="close" v-show="isEdit && !aliveChannels.includes(item.name)" />
          </van-grid-item>
       </van-grid>
     </div>
   </div>
   <!-- 推荐频道 -->
   <div class="channel">
     <div class="channel-head">
       <div>
         <span class="title">频道推荐</span>
         <span class="desc">点击添加频道</span>
       </div>
     </div>
     <van-grid class="channel-content" :gutter="10" clickable>
       <van-grid-item
       v-for="item in recommendChannels"
       :key="item.id"
       @click="handleAddChannel(item)"
       >
         <div class="info">
           <span class="text">{{ item.name }}</span>
         </div>
       </van-grid-item>
     </van-grid>
   </div>
 </van-popup>
</template>

<script>
import { getAllChannels, deleteUserChannel, resetUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [], // 频道列表
      isEdit: false,
      aliveChannels: ['推荐']
    }
  },
  computed: {
    // 过滤列表数据
    recommendChannels () {
      // 映射一个数组，存储所有的用户数据ID
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    },
    ...mapState(['user'])
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const data = await getAllChannels()
      data.channels.forEach(item => {
        item.articles = [] // 用来存储当前文章列表
        item.timestamp = Date.now() // 存储下一页时间戳
        item.downPullLoading = false // 下拉刷新loading
        item.upPullLoading = false // 上拉加载更多loading
        item.upPullFinished = false // 控制当前数据加载完毕
      })
      this.allChannels = data.channels
    },
    async handleAddChannel (item) {
      // 将点击的频道添加到用户频道中
      this.userChannels.push(item)
      // 持久化
      if (this.user) {
        const data = this.userChannels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        await resetUserChannels(data)
        return
      }
      // 未登录则持久化到本地存储
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
    },
    changeChannel (item, index) {
      this.$emit('update:active-index', index)
      this.$emit('input', false)
    },
    async deleteChannel (item, index) {
      this.userChannels.splice(index, 1)
      // 判断是否有数据，没有onload一下
      if (this.user) {
        await deleteUserChannel(item.id)
        return
      }
      // 未登录，删除本地存储
      window.localStorage.setItem('channel', JSON.stringify(this.channels))
    },
    handleUserChannelClick (item, index) {
      if (!this.isEdit) {
        // 非编辑状态切换频道
        this.changeChannel(item, index)
      } else {
        // 编辑状态删除
        !this.aliveChannels.includes(item.name) &&
        this.deleteChannel(item, index)
      }
    }
  }
}
</script>

<style  scoped lang='less'>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
  .text {
    font-size: 24px;
  }
  .active {
    color: red;
  }
  .close-icon {
    font-size: 30px;
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 999;
    background-color: #fff;
  }
  .info {
    display: flex;
    align-items: center;
  }
 }
}
</style>
