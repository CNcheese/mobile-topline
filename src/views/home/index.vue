<template>
  <div class="home">
    <van-nav-bar title="首页" fixed />
    <van-tabs v-model="activeChannelIndex" class="channel-tabs">
      <div class="wap-nav" slot="nav-right" @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
      <van-tab
      v-for="channelItem in channels"
      :key="channelItem.id"
      :title="channelItem.name">
        <van-pull-refresh
        v-model="channelItem.downPullLoading"
        @refresh="onRefresh"
        :success-text="channelItem.downPullSuccessText"
        :success-duration="1000"
        >
          <van-list
          v-model="channelItem.upPullLoading"
          :finished="channelItem.upPullFinished"
          finished-text="没有更多了"
          @load="onLoad">
            <van-cell
            v-for="articleItem in channelItem.articles"
            :key="articleItem.art_id"
            :title="articleItem.title">
             <div slot="label">
              <template v-if="articleItem.cover.type">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item
                  v-for="(img, index) in articleItem.cover.images"
                  :key="index"
                  >
                   <van-image :src="img" lazy-load/>
                  </van-grid-item>
                </van-grid>
              </template>
              <p>
                <span>{{ articleItem.aut_name }}</span>
                &nbsp;
                <span>{{ articleItem.aut_conut }}</span>
                &nbsp;
                <span>{{ articleItem.pubdate | relativeTime }}</span>
                <van-icon class="close" name="close"
                @click="isMoreActionShow = true" />
              </p>
             </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <HomeChannel
    v-model="isChannelShow"
    :userChannels="channels"
    :active-index.sync="activeChannelIndex"
    />
    <!-- <van-tabbar v-model="actives">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">内容</van-tabbar-item>
      <van-tabbar-item icon="friends-o">话题</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar> -->
     <more-action v-model="isMoreActionShow" />
  </div>
</template>

<script>
// import { setTimeout } from 'timers'
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import HomeChannel from './components/channels'
import MoreAction from './components/more-action'

export default {
  name: 'HomeIndex',
  components: {
    HomeChannel,
    MoreAction
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [],
      isChannelShow: false,
      isMoreActionShow: false
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    // 监视容器中的user用户
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannels()
      // 变更频道重新加载当前频道的数据
      this.activeChannel.upPullLoading = true
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      const { user } = this.$store.state
      let channels = []
      // 已登录
      if (user) {
        const data = await getUserChannels()
        channels = data.channels
      } else {
        // 未登录
        // 有本地数据则使用
        const localChannels = JSON.parse(
          window.localStorage.getItem('channels')
        )
        if (localChannels) {
          channels = localChannels
        } else {
          // 没有则请求默认频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      channels.forEach(item => {
        item.articles = [] // 存储当前文章
        item.timestamp = Date.now()// 存储下一页数据的时间戳
        item.downPullLoading = false // 控制下拉刷新loading
        item.upPullLoading = false // 控制上拉loading
        item.upPullFinished = false // 控制当前列表是否加载完毕
      })
      this.channels = channels
    },
    async onLoad () {
      await this.$sleep(1000)
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.list.push(this.list.length + 1)
      //     }
      //     this.loading = false
      //     if (this.list.length >= 40) {
      //       this.finished = true
      //     }
      //   }, 1000)
      // }
      let data = []
      data = await this.loadArticles()
      // 如果没有pre_timestamp 并且数组是空的，则意味着没有数据
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已记载完毕，组件会自动给出提示，并且不再onLoad
        this.activeChannel.upPullFinished = true

        // 取消
        this.activeChannel.upPullLoading = false
        return
      }
      // 解决初始化没有最新推荐的数据 没有就加载上一次的
      if (!data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        // 加载下一页
        data = await this.loadArticles()
      }
      // 数据加载完毕后，将ore_timestamp更新到当前频道中用于下次加载
      this.activeChannel.timestamp = data.pre_timestamp
      // 将文章更新到频道中 用push 追加
      this.activeChannel.articles.push(...data.results)

      // 加载完毕取消上拉loading
      this.activeChannel.upPullLoading = false
    },
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据时间戳
      const timestamp = activeChannel.timestamp
      // 使用最新时间戳去请求最新的推荐数据
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // 如果有最新数据，加载到文章列表中
      if (data.results.length) {
        activeChannel.articles = data.results
        // 重置了文章列表，那么当前数据就是上拉加载更多的下一项时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'
        // 无法满足一屏时加载onLoad来多加载一些数据
        this.onLoad()
      } else {
        // 没有新数据，提示为最新
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      activeChannel.downPullLoading = false
      // 没有新数据，用原来的请求下一页时间戳恢复
      activeChannel.timestamp = timestamp
    },
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 频道ID
        timestamp, // 当前频道下一页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
    }
  }
}
</script>

<style lang="less" scoped>
.channel-tabs {
  margin-bottom: 100px;
}

// 深度作用选择器：https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}

.channel-tabs /deep/ .van-tabs__content {
  margin-top: 100px;
}
.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right:1px;
  top: 100px;
  background-color: #fff;
  font-size: 54px;
}
.channel-tabs .close {
  float: right;
  font-size: 30px;
}
</style>
