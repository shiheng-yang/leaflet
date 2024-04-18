<template>
  <div id="exceptionChart"></div>
</template>
<script>
let chartDom = null
export default {
  data() {
    return {
      option: {
        title: {
          text: '异常数',
          left: 'center',
          top: '6%',
          textStyle: { color: '#fff' },
        },
        grid: {
          top: '20%',
          left: '2%',
          right: '3%',
          bottom: '2%',
          containLabel: true,
        },
        toolbox: {
          show: true,
          top: '3%',
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
          },
          iconStyle: { borderColor: '#fff' },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#0e2d57',
              borderColor: '#0e2d57',
            },
          },
        },
        xAxis: {
          type: 'category',
          name: '日期',
          boundaryGap: false,
          data: [],
          nameTextStyle: { color: '#fff' },
          axisLine: { show: false, lineStyle: { color: '#fff' } },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          name: '单位(个)',
          nameTextStyle: { color: '#FFF' },
          axisLine: { show: false, lineStyle: { color: '#fff' } },
          splitLine: {
            show: true,
            lineStyle: { color: 'rgba(255,255,255,0.2)' },
          },
        },
        series: [
          {
            type: 'line',
            data: [],
            name: '异常数',
            color: 'rgba(64, 158, 255, 1)',
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 1)' },
                { offset: 1, color: 'rgba(255, 255, 255, 0)' },
              ]),
            },
            symbolSize: 5,
            smooth: true,
          },
        ],
      },
      loadingOption: {
        text: '加载中...',
        textColor: '#fff',
        color: '#fff',
        maskColor: 'rgba(0 ,0 ,0 ,0.1 )',
        zlevel: 0,
      },
      areaAndOrg: this.$store.state.user,
    }
  },
  watch: {
    '$store.state.isCollapse': {
      handler(newVal, oldVal) {
        setTimeout(() => {
          chartDom.resize()
        }, 500)
      },
    },
  },
  methods: {
    init() {
      let params = {
        areaId: this.areaAndOrg[0],
        organizationId: this.areaAndOrg[1],
      }
      var maxData = []
      radAnalysisGetException(params).then((data) => {
        if (data) {
          data.result.forEach((val) => {
            this.option.xAxis.data.push(val.createDt)
            maxData.push(val.count)
          })
          this.option.series[0].data = maxData
          chartDom.hideLoading()
          chartDom.setOption(this.option)
          window.addEventListener('resize', () => {
            chartDom.resize()
          })
        }
      })
    },
  },
  mounted() {
    chartDom = this.$echarts.init(document.getElementById('exceptionChart'))
    chartDom.showLoading(this.loadingOption)
    this.init()
  },
  destroyed() {
    chartDom.clear()
  },
}
</script>
<style lang="less" scoped>
#exceptionChart {
  width: 100%;
  height: 100%;
}
</style>
