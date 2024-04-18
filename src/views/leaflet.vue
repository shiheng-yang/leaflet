<template>
  <div class="about">
    <div class="right">
      <ImgLayout ref="layout" />
    </div>
    <div class="left">
      <div class="titles azjgs">
        <div>
          <InputList @setData="getData" />
          <div class="devs">
            <span>采样点：</span>
            <el-select ref="selectDev" @visible-change="$visibleChange($event, 'selectDev')" v-model="csbmc" placeholder="全部" clearable filterable>
              <el-option :label="item.name" v-for="(item, index) in csbmcArr" :key="index" :value="item.id"> </el-option>
            </el-select>
          </div>
        </div>
        <span>
          <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="reserts">重 置</el-button>
        </span>
      </div>
      <div class="circle">
        <div ref="circleChart" id="circleChart"></div>
      </div>
      <div class="line">
        <div ref="lineChart" id="lineChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import ImgLayout from '@/components/imgLayout/imgLayout'
import InputList from '@/components/inputList/inputList.vue'
const safeColor = '#07dc0c'
const dangerColor = '#FF1900'
export default {
  components: { InputList, ImgLayout },
  data() {
    return {
      csbmc: '', // 设备
      csbmcArr: [],
      optionCircle: {
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 25,
                color: [
                  [0.9, safeColor],
                  [1, dangerColor],
                ],
              },
            },
            radius: '100%',
            center: ['50%', '55%'],
            min: 0,
            pointer: {
              width: 10,
              length: '70%', //指针长度，按照半圆半径的百分比
              itemStyle: { color: 'auto' },
            },
            axisTick: {
              distance: -33, // 小刻度节点线与轴线之间的距离。
              length: 20,
              lineStyle: { color: '#fff', width: 3 },
            },
            splitLine: {
              distance: -35, // 大刻度节点线与轴线之间的距离。
              length: 30,
              lineStyle: { color: '#fff', width: 3 },
            },
            axisLabel: {
              color: 'inherit',
              distance: 40, // 刻度标签与轴线之间的距离。
              fontSize: 18,
            },
            detail: {
              valueAnimation: false,
              formatter: (e) => {
                return (e / 0.9).toFixed(2) + 'μSv/h'
              },
              color: 'inherit',
              offsetCenter: ['5%', '60%'],
              fontSize: 24,
            },
            data: [
              {
                value: 0,
                name: '实时数据',
                title: {
                  show: true,
                  offsetCenter: ['5%', '80%'],
                  color: 'inherit',
                  fontSize: 24,
                },
              },
            ],
          },
        ],
      },
      optionLine: {
        title: { text: '', left: 'center' },
        legend: { show: false },
        xAxis: {
          type: 'category',
          name: '时间(s)',
          nameTextStyle: { padding: [0, 0, 15, -10] },
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
          axisLine: { show: false, lineStyle: { color: '#000' } },
          boundaryGap: false,
        },
        tooltip: {
          transitionDuration: 0, //防抖动
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          axisPointer: {
            //鼠标更随
            type: 'cross',
            label: {
              backgroundColor: '#ddd',
              color: '#000',
              borderColor: '#aaa',
              borderWidth: '1',
            },
          },
          formatter: (e) => {
            let str = `<div>
              <span style='margin-right:10px;'>${e[0].marker} ${e[0].seriesName}</span> <span style="font-weight:bold;">${e[0].value} </span>
              </div>`
            return `第 ${e[0].name} 秒<br />${str}`
          },
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        grid: {
          top: '10%',
          left: '4%',
          right: '8%',
          bottom: '8%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          name: '单位(μSv/h)',
          nameGap: 3,
          nameTextStyle: { padding: [0, 0, 5, 20] },
          axisTick: { show: true },
          axisLine: { show: false },
        },
        dataZoom: [
          {
            show: true,
            backgroundColor: 'rgba(255,255,255,0.3)',
            fillerColor: 'rgba(18,150,219,0.3)',
            textStyle: { color: '#000' },
            height: '20px',
            bottom: '2%',
            handleIcon:
              'path://M512,981.3333129882812C251.73333740234375,981.3333129882812,42.66666793823242,772.2666625976562,42.66666793823242,512S251.73333740234375,42.66666793823242,512,42.66666793823242s469.33331298828125,209.06666946411133,469.33331298828125,469.3333320617676s-209.066650390625,469.33331298828125,-469.33331298828125,469.33331298828125Zm128,-639.9999694824219c-25.5999755859375,0,-42.66668701171875,17.066650390625,-42.66668701171875,42.666656494140625l0,256c0,25.5999755859375,17.06671142578125,42.66668701171875,42.66668701171875,42.66668701171875s42.66668701171875,-17.06671142578125,42.66668701171875,-42.66668701171875L682.6666870117188,384c0,-25.600006103515625,-17.06671142578125,-42.666656494140625,-42.66668701171875,-42.666656494140625ZM384,341.3333435058594c-25.600006103515625,0,-42.666656494140625,17.066650390625,-42.666656494140625,42.666656494140625l0,256c0,25.5999755859375,17.066650390625,42.66668701171875,42.666656494140625,42.66668701171875s42.666656494140625,-17.06671142578125,42.666656494140625,-42.66668701171875L426.6666564941406,384c0,-25.600006103515625,-17.066650390625,-42.666656494140625,-42.666656494140625,-42.666656494140625Z',
            handleColor: '#1296db',
            handleSize: '100%',
          },
          {
            type: 'inside',
          },
        ],
        series: [
          {
            type: 'line',
            data: [],
            name: '剂量率',
            areaStyle: {},
            symbolSize: 5,
            smooth: true,
            markLine: {
              silent: false,
              lineStyle: {
                type: 'dashed',
                color: dangerColor,
                width: 1,
              },
              data: [
                {
                  yAxis: '',
                  label: {
                    padding: [0, 0, 0, -5],
                    formatter: (e) => {
                      return `最大阈值\n${e.value}`
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      circleChart: null, //图表仪表盘
      lineChart: null, //图表仪表盘
      ws: null, //websocket对象
      keepAliveTimer: null, // 心跳定时器
      reconnectTimeOutInterval: null, // 重连定时器
      lastTime: new Date(), // 最后一次连接时间
      connectNum: 1, // ws重连次数
      is_open_socket: false, //websocket连接是否打开,避免重复连接
      is_first_online: false, //是否第一次在线
      is_first_offline: false, //是否第一次离线
      is_active_close_socket: false, //是否主动关闭ws
      loading: '',
      dataList: [],
      thresholdMax: '', // 最大阈值
    }
  },
  methods: {
    // 拿值区域和机构
    getData(msg) {
      if (msg[0] && msg[1]) {
        this.csbmc = ''
        this.csbmcArr = []
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)',
          customClass: 'layoutLoading',
        })
        this.clearData()
        this.searchDev(msg, loading)
      }
    },
    // 获取设备列表
    searchDev(msg, loading) {
      let params = {
        pageNo: 1,
        pageSize: 10000,
        areaId: msg[0],
        organizationId: msg[1],
        type: 1,
      }
      deviceQueryWithPage(params)
        .then((res) => {
          if (res) {
            this.csbmcArr = res.result.records.filter((v) => v.point)
            this.csbmc = this.csbmcArr[0].id
            let idString = this.csbmcArr.map((v) => v.id).toString()
            this.csbmcArr.forEach((v) => {
              let obj = {
                name: v.name,
                id: v.id,
                data: [],
                timeTemp: new Date().getTime(),
              }
              this.dataList.push(obj)
            })
            // 连接websocket
            this.createSocket(idString)
            this.$bus.$emit('imgLayUrl', [msg[2], this.csbmcArr])
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    // 重置
    reserts() {
      this.$bus.$emit('clickResert', 1)
      this.csbmc = ''
      this.csbmcArr = []
      this.dataList = []
    },
    // 初始化图表
    initChart() {
      // 仪表盘
      this.circleChart = this.$echarts.getInstanceByDom(this.$refs.circleChart)
      if (!this.circleChart) {
        this.circleChart = this.$echarts.init(this.$refs.circleChart)
      }
      // 折线
      this.lineChart = this.$echarts.getInstanceByDom(this.$refs.lineChart)
      if (!this.lineChart) {
        this.lineChart = this.$echarts.init(this.$refs.lineChart)
      }
      this.resetChart()
      window.addEventListener('resize', () => {
        this.circleChart.resize()
        this.lineChart.resize()
      })
    },
    // 更新图表
    updateChart() {
      // 获取当前高亮项
      let activeItem = this.dataList.find((v) => v.id == this.csbmc)
      if (activeItem && activeItem.data.length) {
        // 最新一条数据,绘制仪表盘
        let newData = activeItem.data[activeItem.data.length - 1]
        this.optionCircle.series[0].data[0].value = newData * 0.9
        this.circleChart.setOption(this.optionCircle)
        // 绘制折线图
        this.optionLine.yAxis.nameTextStyle.padding = [0, 0, 5, 0]
        // 渐变区域颜色
        let areaColor = newData > this.thresholdMax ? dangerColor : safeColor
        this.optionLine.series[0].areaStyle = {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: areaColor },
            { offset: 1, color: '#fff' },
          ]),
        }
        this.optionLine.title.text = activeItem.name
        this.optionLine.series[0].data = activeItem.data
        this.lineChart.setOption(this.optionLine)
      } else {
        this.resetChart()
      }
    },
    // 重置图表
    resetChart() {
      this.optionCircle.series[0].data[0].value = 0
      this.circleChart.setOption(this.optionCircle)
      this.optionLine.yAxis.nameTextStyle.padding = [0, 0, 15, -10]
      this.optionLine.title.text = ''
      this.optionLine.series[0].data = []
      this.lineChart.setOption(this.optionLine)
    },
    // 建立连接
    createSocket(deviceId) {
      if ('WebSocket' in window) {
        let wsUrl = `${this.$VUE_APP_WEBSOCKET_URL}?deviceId=${deviceId}`
        this.ws = new WebSocket(wsUrl)
        this.ws.onopen = this.websocketonopen
        this.ws.onerror = this.websocketonerror
        this.ws.onmessage = this.websocketonmessage
        this.ws.onclose = this.websocketclose
      } else {
        // 浏览器不支持 WebSocket
        this.$message.error('您的浏览器不支持 WebSocket!')
      }
    },
    // 连接成功后调用
    websocketonopen() {
      this.loading = this.$loading({
        lock: true,
        text: '设备连接中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
        target: document.querySelector('.about'),
      })
      if (this.reconnectTimeOutInterval) {
        clearTimeout(this.reconnectTimeOutInterval)
        this.reconnectTimeOutInterval = null
      }
      if (this.keepAliveTimer) {
        clearTimeout(this.keepAliveTimer)
        this.keepAliveTimer = null
      }
      this.connectNum = 1
      this.is_open_socket = true
      this.is_first_online = true
      this.is_first_offline = true
      this.is_active_close_socket = false
      this.lastTime = new Date()
      // 心跳机制
      this.keepAlive()
    },
    // 发生错误时调用
    websocketonerror() {
      console.log('连接已出错...')
      this.is_active_close_socket = false
    },
    // 接收消息
    websocketonmessage(e) {
      if (this.is_first_online) {
        this.$message.success('设备连接成功!')
        this.loading.close()
        this.is_first_online = false
        if (this.reconnectTimeOutInterval) {
          clearTimeout(this.reconnectTimeOutInterval)
          this.reconnectTimeOutInterval = null
        }
        this.connectNum = 1
      }
      this.lastTime = new Date()
      let res = JSON.parse(e.data)
      // 数据缓存
      let filItem = this.dataList.find((v) => v.id == res.result.deviceId)
      filItem.timeTemp = new Date().getTime()
      filItem.data.push(res.result.doserate)
      // 存储最新的30条数据
      if (filItem.data.length > 30) {
        filItem.data.splice(0, 1)
      }
      console.log(res.result)
      // 绘制图表
      this.updateChart()
    },
    // 关闭连接时调用
    websocketclose() {
      console.log(this.csbmc, '关闭连接')
      if (this.reconnectTimeOutInterval) {
        clearTimeout(this.reconnectTimeOutInterval)
        this.reconnectTimeOutInterval = null
      }
      if (this.keepAliveTimer) {
        clearTimeout(this.keepAliveTimer)
        this.keepAliveTimer = null
      }
      this.is_open_socket = false
      if (this.connectNum < 6) {
        this.loading.close()
        if (!this.is_active_close_socket) {
          this.$message.error(`服务器连接失败，正尝试第${this.connectNum}次连接`)
          this.reconnectTimeOutInterval = setTimeout(() => {
            this.createSocket(this.csbmc)
          }, 5000)
          this.connectNum += 1
        }
      } else {
        if (!this.is_active_close_socket) {
          this.$message.error('服务器连接失败，请刷新页面重试')
        }
        this.connectNum = 1
      }
      this.is_active_close_socket = false
    },
    // 心跳机制
    keepAlive() {
      console.log(this.csbmc, '心跳', new Date())
      if (new Date().getTime() - this.lastTime.getTime() > 1000 * 20) {
        if (this.is_first_offline) {
          this.$message.error('设备连接失败!')
          this.loading.close()
        }
        this.is_first_offline = false
        this.is_first_online = true
      } else {
        if (this.is_first_online && this.is_first_offline) {
          console.log('设备连接中...')
        }
      }
      if (this.keepAliveTimer) {
        clearTimeout(this.keepAliveTimer)
        this.keepAliveTimer = null
      }
      this.keepAliveTimer = setTimeout(() => {
        //判断当前webscokt状态
        if (this.ws.readyState) {
          //调用发送方法
          this.ws.send(
            JSON.stringify({
              type: 'Ping',
              t: new Date().getTime(),
            })
          )
          this.keepAlive()
        }
      }, 2000)
    },
    // 清空数据连接
    clearData() {
      if (this.ws && this.ws.readyState) {
        this.ws.close()
      }
      this.ws = null
      this.resetChart()
      this.dataList = []
      if (this.keepAliveTimer) {
        clearTimeout(this.keepAliveTimer)
        this.keepAliveTimer = null
      }
      if (this.reconnectTimeOutInterval) {
        clearTimeout(this.reconnectTimeOutInterval)
        this.reconnectTimeOutInterval = null
      }
      this.connectNum = 1
      this.is_open_socket = false
      this.is_active_close_socket = true
    },
    // 获取阈值
    getThreshold() {
      let params = {
        pageNo: 1,
        pageSize: 1000,
        deviceType: 1,
      }
      queryThreshold(params).then((res) => {
        if (res) {
          this.thresholdMax = Number(res.result.records[1].code)
          // 阈值线
          this.optionLine.series[0].markLine.data[0].yAxis = this.thresholdMax
          // 线的颜色
          this.optionLine.visualMap = {
            show: false,
            pieces: [
              { gt: 0, lte: this.thresholdMax, color: safeColor },
              { gt: this.thresholdMax, color: dangerColor },
            ],
          }
          this.optionCircle.series[0].max = this.thresholdMax
          this.optionCircle.series[0].axisLabel.formatter = (value) => {
            if (value <= this.thresholdMax * 0.9) {
              // 前9个刻度
              return ((value / 10) * (100 / 9)).toFixed(2)
            } else {
              // 后1个刻度
              return '∞'
            }
          }
        }
      })
    },
  },
  watch: {
    csbmc: {
      handler(newVal, oldVal) {
        this.lineChart.clear()
        this.updateChart()
      },
    },
    '$store.state.isCollapse': {
      handler(newVal, oldVal) {
        setTimeout(() => {
          this.circleChart.resize()
          this.lineChart.resize()
        }, 500)
      },
    },
  },
  mounted() {
    // this.getThreshold()
    this.initChart()
  },
  beforeDestroy() {
    this.clearData()
    if (this.lineChart) {
      this.lineChart.dispose()
      this.lineChart = null
    }
    if (this.circleChart) {
      this.circleChart.dispose()
      this.circleChart = null
    }
  },
}
</script>
<style src="../../public/css/search.less" lang="less" scoped></style>
<style lang="less" scoped>
.about {
  padding: 0;
  display: flex;
  height: 100%;
  position: relative;
  > div {
    box-sizing: border-box;
  }
  .left {
    width: 37%;
    padding: 5px 5px 0;
    > :first-child {
      display: flex;
      height: 130px;
      > :first-child {
        display: flex;
        flex-direction: column;
        margin: 0;
      }
    }
    .title {
      margin: 0;
      /deep/.el-select {
        margin-bottom: 10px;
      }
    }
    .devs {
      margin: 0;
      > div {
        margin: 0 0 10px 0;
      }
      > span {
        letter-spacing: 5px;
      }
    }
    button {
      width: min-content;
    }
    /deep/.el-input {
      width: 300px;
    }
    .circle,
    .line {
      border: 1px solid #ddd;
      height: calc(calc(100% - 130px - 10px) / 2);
      box-sizing: border-box;
      border-radius: 6px;
    }
    .circle {
      margin-bottom: 10px;
      #circleChart {
        width: 100%;
        height: 100%;
      }
    }
    .line {
      #lineChart {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    width: 63%;
    background: #fff;
    > .imgBox {
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      padding: 5px;
      width: 100%;
    }
  }
}
</style>
