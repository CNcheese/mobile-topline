<template>
  <div>
  <div class="home">
    <van-nav-bar title="首页" fixed />
    <van-tabs v-model="activeIndex">
      <van-tab title="标签 1">
        <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh
        ">
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
          <van-cell
          v-for="item in list"
          :key="item"
          :title="item" />
        </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
    </van-tabs>
    <van-tabbar v-model="active">
     <van-tabbar-item icon="home-o">首页</van-tabbar-item>
     <van-tabbar-item icon="search">内容</van-tabbar-item>
    <van-tabbar-item icon="friends-o">话题</van-tabbar-item>
    <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      active: 0
    }
  },
  methods: {
    onLoad () {
      console.log('onload')
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        this.loading = false

        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },

    onRefresh () {
      console.log('onRefresh')
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
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
</style>
