<template>
  <div class="login-wrap">
    <van-nav-bar title="黑马"/>
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
        />

        <van-field
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
      <div class="login-btn">
        <van-button class="btn" type="info" @click.prevent="handleLogin">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { Notify } from 'vant'
import axios from 'axios'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '18822309291',
        code: '123456'
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await axios({
        method: 'POST',
        url: 'http://toutiao.course.itcast.cn/app/v1_0/authorizations',
        data: this.user
      }).then(data => {
        Notify({
          message: '登录成功',
          duration: 2000,
          background: '#409fff'
        })
        console.log(res)
        // this.$notify('登录成功')
        // Toast.success('登录成功')
        this.$router.push({
          name: 'home'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn {
  padding: 10px;
  .btn {
    width: 100%;
  }
}
</style>
