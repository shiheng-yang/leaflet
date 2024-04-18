<template>
  <div id="box">
    <dv-scroll-ranking-board ref="scrollBoard" :config="config" style="width: 90%; height: 100%; margin: auto" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      config: {
        data: [],
      },
      nullData: [
        { name: '暂无', value: 0 },
        { name: '暂无', value: 0 },
        { name: '暂无', value: 0 },
      ],
      areaAndOrg: this.$store.state.user,
    }
  },
  props: ['api'],
  methods: {
    // 设置图表数据
    getList() {
      let params = {
        areaId: this.areaAndOrg[0],
        organizationId: this.areaAndOrg[1],
      }
      this.api(params).then((data) => {
        if (data) {
          var result = data.result
          if (result.length != 0) {
            result.map((v) => {
              // 更新对象的key,原key:新key
              let keymap = {
                deviceName: 'name',
                count: 'value',
              }
              Object.keys(v).map((k) => {
                let newKey = keymap[k]
                if (newKey) {
                  v[newKey] = v[k]
                  delete v[k]
                }
              })
            })
            if (result.length == 1) result = [...this.nullData.slice(0, 2), ...result]
            if (result.length == 2) result = [...this.nullData.slice(0, 1), ...result]
            this.config.data = result
          } else {
            this.config.data = this.nullData
          }
          this.config = { ...this.config } // 赋值 {...}展开赋值
        }
      })
    },
  },
  mounted() {
    this.getList()
  },
}
</script>
<style lang="less" scoped>
#box {
  width: 100%;
  height: 88%;
}
// 三个平分100%
/deep/.row-item {
  height: calc(100% / 3) !important;
}
// 初始值(宽度)设置为0
/deep/.inside-column {
  width: 0%;
}
</style>
