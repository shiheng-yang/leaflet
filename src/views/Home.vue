<template>
  <div class="home">
    <div class="bgc">
      <div class="top-tit">辐射在线监测系统</div>
      <ul class="top">
        <li>
          <div class="ccontianer">
            <div class="title">
              <span>实时统计</span>
            </div>
            <div class="first" v-for="item in leftRight" :key="item.index" @click="goOrg(item.title)" :style="`background: linear-gradient(to left,#003399 ,${item.color});`">
              <span>{{ item.title }}</span>
              <CountTo :start-val="0" :end-val="item.count" :duration="1000" class="count-number" :style="`color: ${item.color}`" />
            </div>
          </div>
          <div class="ccontianer centerBox">
            <div class="title">当日新增异常设备排名(TOP3)</div>
          </div>
        </li>
        <li>
          <div class="total">{{ times }}</div>
          <div class="mapBox">
            <center-map></center-map>
          </div>
        </li>
        <li>
          <div class="ccontianer centerBox">
            <div class="title">
              <span>全部未处理异常设备排名(TOP3)</span>
            </div>
          </div>
          <div class="ccontianer centerBox">
            <div class="title">当日已处理异常设备排名(TOP3)</div>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
import centerMap from '../components/charts/centerMap.vue'
import { timesfun } from '@/util/timeData'
import CountTo from 'vue-count-to'
export default {
  name: 'Home',
  components: {
    centerMap,
    CountTo,
  },
  data() {
    return {
      times: '', // 当前时间年月日时分秒
      createDt: [], //查询五天时间
      uploadCount: [], //查询五天上传数
      inputCount: [], //查询五天入库数
      outCount: [], //查询五天出库数
      leftRight: [
        //左上角四个值
        { title: '总设备数', count: 0, color: '#13ebf5' },
        { title: '在线设备数', count: 0, color: '#47e347' },
        { title: '离线设备数', count: 0, color: '#d03131' },
      ],
    }
  },
  methods: {
    // 时间调用函数
    timesfun() {
      setInterval(() => {
        this.times = timesfun(new Date())
      }, 1000)
    },
    // 个数统计
    counts() {
      var user = JSON.parse(sessionStorage.getItem('user'))
      var areaId = user.areaId
      var organizationId = user.organizationId
      let params = {
        areaId,
        organizationId,
      }
      roleAnalysisDateCount(params).then((data) => {
        if (data) {
          let coun = data.result
          let dataArr = [coun.allCount, coun.onlineCount, coun.notOnlineCount]
          this.leftRight.forEach((v, i) => {
            v.count = dataArr[i]
          })
        }
      })
    },
    // 跳转设备页面
    goOrg(title) {
      if (title == '总设备数') {
        this.$store.commit('deviceId', [null, 10000])
      } else if (title == '在线设备数') {
        this.$store.commit('deviceId', [0, 10000])
      } else if (title == '离线设备数') {
        this.$store.commit('deviceId', [1, 10000])
        // this.$router.push({path:'/MgrDev', query:{id:1}})
      }
      this.$router.push('/MgrDev')
    },
    // 设备类型
    cxsblx() {
      this.ccslx = ''
      this.ccslxArr = ''
      let params = {
        pageNo: 1,
        pageSize: 10000,
        codeType: 'device_type',
      }
      radCommonQuery(params).then((data) => {
        if (data) {
          var csblxArr = data.result.records
          csblxArr.map((val, index) => {
            csblxArr[index].code = Number(val.code)
          })
          sessionStorage.setItem('deviceType', JSON.stringify(csblxArr))
        }
      })
    },
  },
  mounted() {
    this.timesfun() // 时间函数
  },
}
</script>
<style lang="less" scoped>
@font-face {
  font-family: ysh;
  src: url('../../public/icon/DS-DIGIT.TTF');
}
// 背景颜色
.home {
  background: #000469;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
// 背景图片
.bgc {
  padding: 0 1% 0;
  height: 100%;
  background: url('../../public/home/wrapper-bg.png') no-repeat;
  background-size: 100% 100%;
}
// 中间标题
.top-tit {
  text-align: center;
  color: #fff;
}
// 第一排
.top {
  display: flex;
  margin: 0;
  padding: 0;
  color: #fff;
  list-style-type: none;
  height: 64%;
  justify-content: center;
  li {
    width: 25%;
    background: url('../../public/home/panel-l-t.png') no-repeat;
    background-size: 100% 100%;
  }
  > :nth-child(2) {
    width: 50%;
    background: none;
  }
}
.ccontianer {
  width: 100% !important;
  height: 50%;
  font-size: 0.2rem;
  .title {
    width: 100%;
    height: 12%;
    background: url('../../public/home/title-bg.png') no-repeat;
    background-size: 100% 100%;
    padding-left: 0.3rem;
    display: flex;
    align-items: center;
  }
  .first {
    width: 90%;
    height: 15%;
    border: 1px solid #0d4790;
    border-radius: 22px;
    margin: 3% auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
    transition: 0.3s linear all;
    :first-child {
      width: 120px;
      text-align: center;
    }
    &:hover {
      border: 1px solid #fff;
      cursor: pointer;
      box-shadow: 0px 0px 6px 0px #fff;
      transform: scale(1.1);
    }
  }
}
.total {
  width: 100% !important;
  text-align: center;
  height: 5%;
  font-family: ysh;
  font-size: 0.4rem;
}
.mapBox {
  height: 93.3%;
}
// 第二排
.bottom {
  display: flex;
  margin: 0;
  padding: 0;
  color: #fff;
  list-style-type: none;
  height: 31%;
  justify-content: center;
  margin-top: 4px;
  li {
    width: 100%;
    background: url('../../public/home/panel-l-t.png') no-repeat;
    background-size: 100% 100%;
  }
}
.count-number {
  font-size: 0.5rem;
  font-family: 'ysh';
  width: 44px;
  text-align: center;
}
</style>
