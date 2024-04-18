<template>
  <div class="title azjg">
    <div v-if="!user.areaId">
      区域名称：
      <el-select ref="selectArea" @visible-change="$visibleChange($event, 'selectArea')" v-model="cgxqy" placeholder="全部" @change="cxjgmc" clearable filterable>
        <el-option v-for="(i, n) in cgxqyArr" :key="n" :value="i.id" :label="i.name"></el-option>
      </el-select>
    </div>
    <div v-if="!user.organizationId">
      采样场所：
      <el-select ref="selectOrg" @visible-change="$visibleChange($event, 'selectOrg')" class="devSty" v-model="cjgmc" placeholder="全部" @change="getDatas" clearable filterable>
        <el-option v-for="(i, n) in cjgmcArr" :key="n" :value="i.id" :label="i.name"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cgxqy: '', //查询区域名称
      cgxqyArr: JSON.parse(sessionStorage.getItem('gxqylist')), //查询区域名称数组
      cjgmc: '', //查询采样场所
      cjgmcArr: [], //查询采样场所数组
      user: this.$store.state.user,
      ids: this.$store.state.deviceIds,
    }
  },
  methods: {
    // 查询采样场所
    async cxjgmc(type) {
      this.cjgmc = ''
      this.cjgmcArr = []
      if (!this.cgxqy) {
        this.$emit('setData', [this.cgxqy])
        return
      }
      let params = {
        useFlag: 0,
        areaId: this.cgxqy,
        page: 1,
        pageSize: 10000,
      }
      // // await organizationQueryWithPage(params).then((data) => {
      //   if (data) {
      //     this.cjgmcArr = data.result.records
      //     if (this.user.organizationId && type != 1) {
      //       this.cjgmc = this.user.organizationId
      //       this.getDatas()
      //       return
      //     }
      //     if (!this.ids.length) {
      //       this.$emit('setData', [this.cgxqy])
      //     }
      //   }
      // })
    },
    // 传两个值
    getDatas() {
      // 实时监控
      if (this.$route.path == '/GdsMonitor') {
        let planViewPath = this.cjgmcArr.find((v) => v.id == this.cjgmc).planViewPath
        planViewPath = this.$VUE_APP_BASE_URL + 'rad/' + planViewPath
        this.$emit('setData', [this.cgxqy, this.cjgmc, planViewPath])
      } else {
        this.$emit('setData', [this.cgxqy, this.cjgmc])
      }
    },
    // 初始化
    async init() {
      this.cgxqy = this.user.areaId
      this.cjgmc = this.user.organizationId
      if (this.$route.path == '/GdsMonitor') {
        this.cgxqy = this.cgxqyArr[0].id
        await this.cxjgmc()
        this.cjgmc = this.cjgmcArr[0].id
        this.getDatas()
      } else {
        // admin
        if (!this.cgxqy && !this.cjgmc) {
          this.$emit('setData', ['', ''])
        } else {
          // 区域,机构用户
          this.cxjgmc()
        }
      }
    },
  },
  mounted() {
    // if (this.ids.length) {
    //   this.cgxqy = this.ids[0]
    //   this.cxjgmc(1)
    //   this.cjgmc = this.ids[1]
    //   this.getDatas()
    // } else {
    //   this.init()
    // }
    // 清除下拉框
    this.$bus.$on('clickResert', (data) => {
      if (data == 1) {
        this.cjgmcArr = []
        this.init()
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off('clickResert')
  },
}
</script>
<style lang="less" scoped>
.title {
  font-size: 16px;
  display: inline-block;
  input {
    margin-right: 10px;
    outline: none;
    height: 26px !important;
  }
  div {
    display: inline-block;
  }
}
// 下拉框内容背景色
.el-select-dropdown__item.selected,
.el-select-dropdown__item:hover {
  color: #fff;
  background: #409eff !important;
}
.el-select-dropdown__item.hover {
  background: #fff;
}
</style>
