<template>
  <div class="container">
    <div class="titles">
      <div>
        <img src="../../../public/home/logo2.png" alt="" />
      </div>
      <div>
        <h3>后台管理系统</h3>
        <h5>backend detection system</h5>
      </div>
    </div>
    <div class="login_box">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item prop="usename">
          <i class="el-icon-user-solid"></i>
          <el-input v-model.trim="ruleForm.usename" autocomplete="off" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <i class="el-icon-lock"></i>
          <el-input show-password v-model.trim="ruleForm.password" autocomplete="off" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 粒子背景 -->
    <vue-particles class="login-bg" color="#39AFFD" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle" :particleSize="4" linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" style="height: 100%"> </vue-particles>
    <div class="footers">RADIATION DETECTION ©{{ new Date().getFullYear() }} CREATED BY SUPERSENSE</div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        usename: '',
        password: '',
      },
      rules: {
        usename: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
      },
      loadingText: {
        lock: true,
        text: '拼命加载中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      },
    }
  },
  methods: {
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.logoin()
        } else {
          this.ruleForm = {}
          return false
        }
      })
    },
    // 登录
    logoin() {
      const loading = this.$loading(this.loadingText)
      this.$message.success('登录成功!')
      this.$store.commit('user', this.ruleForm.usename)
      this.$router.push('/Home')
      loading.close()
    },
    // 回车登录
    keyDown(e) {
      if (e.keyCode == 13) {
        if (this.ruleForm.usename != '' && this.ruleForm.password != '') {
          this.logoin()
        } else {
          this.submitForm('ruleForm')
          this.$message({
            type: 'error',
            message: '请输入账号或密码',
          })
        }
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keyDown)
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyDown, false)
  },
}
</script>
<style lang="less" scoped>
// 最大的盒子
.container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-size: 100% 100%;
  background-image: url('../../../public/home/bg4.jpg');
}
// 登录盒子
.login_box {
  width: 20%;
  height: 33%;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 13px 0px #fff;
}
// 表单最大盒子
.el-form {
  padding: 0 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  color: #fff;
}
// 按钮
.el-button {
  z-index: 1;
  width: 100%;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  transition: color 0.4s ease-in-out;
}
.el-button::before {
  content: '';
  z-index: -1;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background-color: #3cefff;
  transform-origin: center;
  transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 0);
  transition: transform 0.45s ease-in-out;
}
.el-button:hover::before {
  transform: translate3d(-50%, -50%, 0) scale3d(15, 15, 15);
}
/deep/.el-form-item {
  margin: 0;
}
// 输入框背景色
/deep/.el-input__inner {
  background: transparent;
  color: #fff;
  height: 0 !important;
  padding: 19px 10px 19px 28px;
  background-clip: content-box;
  &::first-line {
    color: #fff;
  }
}
// 输入框初始颜色
/deep/.el-input__inner:-webkit-autofill {
  -webkit-text-fill-color: #fff;
}
// 图标位置
/deep/.el-icon-user-solid,
/deep/.el-icon-lock {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translate(0%, -50%);
}
// 提示字
/deep/.el-input__inner {
  &::placeholder {
    color: #999;
    font-size: 16px;
  }
}
// 粒子背景
.login-bg {
  width: 100%;
  height: 100%;
}
// 标题
.titles {
  position: absolute;
  top: 4%;
  color: #fff;
  font-size: 30px;
  left: 50%;
  display: flex;
  align-items: center;
  transform: translate(-50%, 0%);
  img {
    width: 100%;
  }
  h3,
  h5 {
    margin: 0;
    font-family: cursive;
  }
  h3 {
    font-size: 0.5rem;
  }
  h5 {
    font-size: 0.3rem;
  }
  > :first-child {
    width: 20%;
    margin-right: 14px;
  }
}
// 底部
.footers {
  position: absolute;
  left: 50%;
  bottom: 3%;
  color: #aaa;
  transform: translate(-50%, -50%);
}
/deep/::placeholder {
  color: #eee !important;
}
// 屏幕分辨率小于1000
@media screen and (max-width: 1000px) {
  .container {
    background-size: 100% auto;
    height: 100%;
  }
  .titles {
    flex-direction: column;
    width: 100%;
    height: 25%;
    > :first-child {
      width: 100%;
      margin: 0;
      height: 70%;
      text-align: center;
      img {
        height: 100%;
        width: auto;
      }
    }
    > :last-child {
      text-align: center;
      height: 30%;
      h3 {
        font-size: 25px;
      }
      h5 {
        font-size: 12px;
      }
    }
  }
  .login_box {
    width: 80%;
  }
  .footers {
    font-size: 14px;
    width: 100%;
    text-align: center;
  }
}
</style>
