<template>
  <div class="login-wrap">
    <van-nav-bar title="黑马"/>
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          v-validate="'required'"
          name='mobile'
          :error-message="errors.first('mobile')"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
        />

        <van-field
          v-model="user.code"
          v-validate="'required'"
          name='code'
          :error-message="errors.first('code')"
          type="code"
          label="验证码"
          placeholder="请输入验证码"
          required
        />
      </van-cell-group>
      <div class="login-btn">
        <van-button
        class="btn"
        type="info"
        @click.prevent="handleLogin"
        :loading="loginLoading"
        >登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
// import { Notify } from 'vant'
import { login } from '@/api/user'
import { Notify } from 'vant'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '18822309291',
        code: '123456'
      },
      loginLoading: false
    }
  },
  created () {
    this.configMessages()
  },
  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        const valid = await this.$validator.validate()
        if (!valid) {
          this.loginLoading = false
          return
        }
        const data = await login(this.user)
        this.$store.commit('setUser', data)
        Notify({
          message: '登录成功',
          duration: 1000,
          background: '#1989fa'
        })
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        this.$notify('登录失败！')
      }
      this.loginLoading = false
    },
    configMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CH', dict)
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
