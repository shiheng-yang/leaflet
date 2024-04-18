<template>
  <div class="about">
    <div id="myMap"></div>
  </div>
</template>
<script>
import '@/util/myMap.js'
let myChartMap = null //地图
export default {
  name: 'about',
  data() {
    return {
      optionMap: {
        tooltip: {
          formatter(data) {
            return `${data.marker} ${data.name}`
          },
        },
        geo: {
          map: '厦门',
          roam: true,
          zoom: 1.2,
          scaleLimit: {
            //缩放级别限制
            min: 1,
            // max: 12
          },
          aspectScale: 1.1, //地图的长宽比
          itemStyle: {
            borderWidth: 1,
            borderColor: '#0090fe', //边框颜色
            areaColor: '#003399', //地图区域颜色
            shadowColor: '#182f68',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
          },
          label: {
            color: '#fff',
            fontWeight: 'bold',
            show: true,
          },
          emphasis: {
            itemStyle: {
              show: 'true',
              borderWidth: 2,
              borderColor: '#b2163c', //边框颜色
              areaColor: '#531f67', //鼠标移上去的颜色
            },
            label: {
              color: '#fff',
              fontWeight: 'bold',
              show: true,
            },
          },
        },
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              color: 'orange',
            },
            effectType: 'ripple',
            showEffectOn: 'render', //emphasis移入显示动画，render一开始显示动画
            rippleEffect: {
              period: 5,
              scale: 3,
              brushType: 'stroke',
            },
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
    }
  },
  methods: {
    // 查询地图上的机构点
    secaorange() {
      myChartMap = this.$echarts.init(document.getElementById('myMap'))
      myChartMap.showLoading(this.loadingOption)
      let params = {
        areaId: this.$store.state.user.areaId,
        id: this.$store.state.user.organizationId,
        pageSize: 1000,
      }
      // organizationQueryWithPage(params).then((data) => {
        // console.log(data);
        var dataObj = {}
        // data.result.records.map((v) => {
        //   dataObj = {
        //     name: v.name,
        //     value: [Number(v.longitude), Number(v.latitude), v],
        //   }
        //   this.optionMap.series[0].data.push(dataObj)
        // })
        // this.optionMap.series[0].data = JSON.parse(JSON.stringify(this.optionMap.series[0].data))
        window.addEventListener('resize', () => {
          myChartMap.resize()
        })
        myChartMap.setOption(this.optionMap)
        myChartMap.hideLoading()
      // })
    },
  },
  watch: {
    '$store.state.isCollapse': {
      handler(newVal, oldVal) {
        setTimeout(() => {
          myChartMap.resize()
        }, 500)
      },
    },
  },
  mounted() {
    this.secaorange()
  },
  destroyed() {
    if (myChartMap) myChartMap.clear()
  },
}
</script>
<style lang="less">
.about {
  height: 100%;
}
#myMap {
  width: 100%;
  height: 100%;
}
</style>
