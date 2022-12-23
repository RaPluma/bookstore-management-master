<template>
  <div>
    <div class="container col-xl-10 col-xxl-8 px-5 py-5">
      <div class="row align-items-center g-lg-5 py-5">
        <div class="col-lg-7 text-center text-lg-start">
          <img alt="logo" src="../assets/img/tree.svg" width="60%">
          <br>
          <small style="margin-left: 22%">美好正在路上！</small>
        </div>
        <div class="col-md-10 mx-auto col-lg-5">
          <form class="p-4 p-md-5 border rounded-3 bg-light">
            <div class="form-floating mb-3">
              <input id="floatingInput" v-model="username" class="form-control" placeholder="name@example.com"
                     type="email">
              <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating mb-3">
              <input id="floatingPassword" v-model="password" class="form-control" placeholder="Password"
                     type="password">
              <label for="floatingPassword">Password</label>
            </div>
            <div class="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me"> Remember me
              </label>
            </div>
            <button class="w-100 btn btn-lg btn-primary" @click="login">登录</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    loginSuccess(p) {
      this.$notify({
        title: '成功',
        message: '您已成功登录成功，尊敬的' + p + '!',
        type: 'success'
      })
    },
    login() {
      if (this.username === 'admin' && this.password === '666666') {
        // 登录成功
        // 1. 存储 token
        localStorage.setItem('token', 'token-sdr646sg8r9s8g9srg896tr546w7th9wrt7h89')
        this.$store.commit('adminLogin')
        // 2. 跳转到后台主页
        this.$router.push('/admin')
        this.loginSuccess('管理员')
      } else {
        alert('账户或密码错误！')
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 120px;
}
</style>
