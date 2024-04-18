<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-aside v-if="aside" width="auto">
        <el-menu router :default-active="routePath" class="el-menu-vertical-demo" background-color="#606266" unique-opened text-color="#fff" :collapse="isCollapse" :mode="mode">
          <div class="left-tittle">
            <span v-if="!isCollapse" style="white-space: nowrap">12后台管理系统</span>
            <i :class="collapseClass" style="font-size: 28px; cursor: pointer" @click="collapseClk"></i>
          </div>
          <el-menu-item index="/Home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页总览</span>
          </el-menu-item>
          <el-menu-item index="/leaflet">
            <i class="el-icon-platform-eleme"></i>
            <span slot="title">leafletDemo</span>
          </el-menu-item>
          <el-menu-item index="/leaflet1">
            <i class="el-icon-platform-eleme"></i>
            <span slot="title">leaflet1</span>
          </el-menu-item>
          <el-menu-item index="/leaflet2">
            <i class="el-icon-platform-eleme"></i>
            <span slot="title">leaflet2</span>
          </el-menu-item>
          <el-menu-item index="/leaflet3">
            <i class="el-icon-platform-eleme"></i>
            <span slot="title">leaflet3</span>
          </el-menu-item>
          <!-- <el-submenu :index="subItem.titId" v-for="subItem in $store.state.nav" :key="subItem.titId">
            <template slot="title">
              <i :class="subItem.titIcon"></i>
              <span slot="title">{{ subItem.titName }}</span>
            </template>
            <el-menu-item :index="menuItem.path" v-for="menuItem in subItem.menuArr" :key="menuItem.index">
              <i :class="menuItem.icon"></i>
              <span slot="title">{{ menuItem.name }}</span>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-container style="flex-direction: column">
        <el-header v-if="aside">
          <div class="pathList">
            <i v-for="item in listArr" :key="item.index" :class="item.class">{{ item.name }}</i>
          </div>
          <div class="logins">
            <span class="welcomes">
              <span>{{ admin }}</span>
            </span>
            <i title="退出登录" @click="logOut" class="logOutSty el-icon-switch-button"></i>
          </div>
        </el-header>
        <el-main :class="{ main }">
          <div :class="{ paddings: true, mainApp }" :style="{ height: main ? '' : '100%' }">
            <transition name="fade-transform" mode="out-in">
              <router-view />
            </transition>
          </div>
        </el-main>
        <el-footer v-if="aside">RADIATION DETECTION ©{{ new Date().getFullYear() }} CREATED BY YSH</el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      mainApp: false,
      main: false,
      aside: true,
      isCollapse: this.$store.state.isCollapse,
      collapseClass: 'el-icon-s-fold',
      loadingText: {
        lock: true,
        text: '拼命加载中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      },
      mode: 'vertical',
    }
  },
  computed: {
    routePath: {
      //高亮菜单
      get() {
        const currentRoute = this.$route
        const { path } = currentRoute
        return path
      },
      set(newValue) {
        return newValue
      },
    },
    listArr: {
      //标题
      get() {
        const { path } = this.$route
        if (path == '/Home') return [{ class: 'el-icon-s-home', name: '首页总览' }]
        var nav = this.$store.state.nav
        if (nav.length > 0) {
          var navs = nav
            .map((val) => {
              return val.menuArr.map((vals) => {
                if (path == vals.path) {
                  return [
                    { class: val.titIcon, name: val.titName + '>' },
                    { class: vals.icon, name: vals.name },
                  ]
                }
              })
            })
            .flat()
            .filter(Boolean)[0]
          return navs
        }
      },
      set(newValue) {
        return newValue
      },
    },
    admin: {
      //用户名
      get() {
        return this.$store.state.user
      },
      set(newValue) {
        return newValue
      },
    },
  },
  methods: {
    // 退出登录
    logOut() {
      const loading = this.$loading(this.loadingText)
      this.clearMessage()
      this.$message.success('退出成功!')
      this.$router.push('/SignIn')
      loading.close()
    },
    // 退出清空缓存信息
    clearMessage() {
      this.$store.dispatch('SETNAV', [])
      this.$store.commit('user', '')
      sessionStorage.clear()
    },
    // 折叠/展开侧边栏
    collapseClk() {
      if (this.isCollapse) {
        this.isCollapse = false
        this.collapseClass = 'el-icon-s-fold'
      } else {
        this.isCollapse = true
        this.collapseClass = 'el-icon-s-unfold'
      }
      this.$store.commit('IS_COLLAPSE', this.isCollapse)
    },
  },
  watch: {
    // 监听路由地址变化
    $route: {
      handler(newVal, oldVal) {
        if (newVal.path == '/SignIn') {
          this.main = true
          this.aside = false
          this.mainApp = false
          this.clearMessage()
        } else {
          this.mainApp = true
          this.main = false
          this.aside = true
          // if (this.$hasRouter(newVal.path)) {
          //没有包含的路由都跳首页
          this.$router.push(newVal.path)
          // } else {
          //   this.$router.push('/Home')
          // }
        }
      },
    },
  },
  mounted() {
    if (window.innerWidth < 1000) {
      this.mode = 'horizontal'
      this.isCollapse = true
      this.$store.commit('IS_COLLAPSE', true)
    }
    let defaultMenu = window.location.hash.substr(window.location.hash.indexOf('/'))
    if (defaultMenu == '/') {
      this.$router.push('/Home')
    }
  },
}
</script>
<style lang="less">
// 整体
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: 100%;
  font-size: 0.3rem;
}
// 头部和尾部
.el-header,
.el-footer {
  background-color: #fff;
  color: #606266;
  text-align: left;
  padding: 0 0.25rem !important;
  line-height: 50px;
  height: 50px !important;
}
// 头部
.el-header {
  background: #fff;
  z-index: 0;
  font-weight: bold;
  font-size: 16px;
}
// 尾部
.el-footer {
  text-align: center;
  border-top: 1px solid #ddd;
}
// 侧边栏
.el-aside {
  background-color: #606266;
  color: #333;
  text-align: left;
}
// 中间
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
  overflow: hidden !important;
  padding: 10px !important;
}
body > .el-container {
  margin-bottom: 2.5rem;
  height: 100%;
}
// 标题
.left-tittle {
  color: #fff;
  padding: 6px 20px;
  height: 0.6rem;
  font-size: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
// 中间间距
.paddings {
  background: #fff;
  overflow: auto;
  border-radius: 6px;
}
.el-submenu__title i,
.el-menu-item i {
  color: #fff !important;
}
.el-menu-item.is-active,
.el-menu-item:hover,
.el-submenu__title:hover {
  background-color: #409eff !important;
  color: #fff !important;
  i {
    color: orange !important;
  }
}
// 右上角登录模块
.logins {
  float: right;
  display: flex;
  align-items: center;
  .welcomes {
    margin-right: 10px;
    font-size: 0.3rem;
    span {
      color: #409eff;
    }
  }
  > :last-child {
    cursor: pointer;
  }
}
.logOutSty {
  font-size: 0.4rem;
  -webkit-line-clamp: 2;
  background-image: -webkit-linear-gradient(top, #9359f2, #f63456);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold !important;
}
/*定义滚动条样式（高宽及背景）*/
::-webkit-scrollbar {
  width: 1px;
  height: 10px;
  background-color: transparent;
}
/*定义滚动条轨道（凹槽）样式*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px transparent;
  border-radius: 1px;
}
/*定义滑块 样式*/
::-webkit-scrollbar-thumb {
  border-radius: 1px;
  height: 100px; /* 滚动条滑块长度 */
  background-color: transparent !important;
}
.main {
  padding: 0 !important;
  .paddings {
    padding: 0 !important;
  }
}
.mainApp {
  height: 100%;
}
// 删除字体大小
.el-message-box__content {
  font-size: 24px !important;
}
.el-message-box__btns {
  button {
    font-size: 18px;
  }
}
// 页面切换过渡效果
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateY(-100px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
// 侧边栏折叠
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
// 去除type=number右边上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
// 分页样式
.el-table::before {
  height: 0 !important;
}
.el-pagination {
  padding: 6px 5px !important;
}
// 分辨率小于1000 手机端
@media screen and (max-width: 1000px) {
  .paddings {
    height: 100%;
  }
  .left-tittle {
    display: none;
  }
  .el-aside {
    height: 61px;
    ul {
      width: 100% !important;
      li {
        width: calc(100% / 6);
      }
    }
  }
  .el-menu-vertical-demo {
    display: flex;
    overflow: auto;
  }
  .el-container {
    flex-direction: column !important;
    height: calc(100% - 60px);
  }
  .el-header,
  .el-footer {
    height: 30px !important;
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    align-items: center;
  }
  .el-footer {
    justify-content: center;
  }
  .logOutSty {
    font-size: 20px;
  }
  .titles {
    text-align: right;
    height: 156px;
    padding-bottom: 40px;
    > span,
    .btns {
      display: flex;
      justify-content: center;
      float: none !important;
      position: absolute;
      top: 256px;
      width: calc(100% - 22px);
      padding: 6px 0;
      background: #fff;
    }
  }
  .cont {
    height: calc(100% - 240px);
    overflow: auto;
    .echartsnone {
      font-size: 16px;
    }
  }
  .azjgs .el-input--suffix {
    margin-right: 40px !important;
  }
  .title {
    > :first-child {
      margin-bottom: 8px !important;
    }
  }
  .el-range-editor.el-input__inner {
    margin-right: 40px !important;
  }
  .el-picker-panel {
    top: 200px !important;
    left: -135px !important;
    transform: scale(0.5);
  }
}
.pathList {
  display: inline-block;
  > i {
    font-weight: bold;
  }
}
</style>
