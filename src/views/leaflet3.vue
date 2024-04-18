<template>
  <div class="imgBox">
    <div id="imageMap"></div>
    <Popup ref="dialogLayer" v-if="isDialog" />
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet'
import 'leaflet/dist/leaflet-src'
import 'leaflet/dist/leaflet-src.esm'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
})
L.Marker.prototype.options.icon = DefaultIcon
import Popup from '@/components/imgLayout/popup.vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
export default {
  components: { Popup },
  data() {
    return {
      map: null,
      bounds: [
        [0, 0],
        [0, 0],
      ],
      isDialog: false, // 是否显示弹窗
      dialogTarget: '', // 弹窗dom
    }
  },
  methods: {
    // 地图初始化
    initMap() {
      this.map = L.map('imageMap', {
        minZoom: -3,
        zoom: 5,
        maxZoom: 4,
        zoomSnap: 0.1, // 缩放步长
        attributionControl: false, // 右下角图例控件
        zoomControl: true, // 缩放控件
        crs: L.CRS.Simple, // 坐标系
        center: [0, 0], // 中心点
      })
      this.map.pm.setLang('zh') // 控件提示设置中文
      this.map.pm.addControls({
        position: 'topleft', // 控件菜单位置
        drawPolygon: true, //绘制多边形
        drawMarker: true, //绘制标记点
        drawCircleMarker: true, //绘制圆形标记
        drawPolyline: true, //绘制线条
        drawRectangle: true, //绘制矩形
        drawCircle: true, //绘制圆圈
        editMode: true, //编辑多边形
        dragMode: true, //拖动多边形
        cutPolygon: true, //添加⼀个按钮以删除多边形⾥⾯的部分内容
        removalMode: true, //清除多边形
      })
    },
    // 平面图初始化
    initDate() {
      // 获取图片宽高,防止不同尺寸的图片回显在页面上有多余的留白问题
      let img = new Image()
      let url = require(`../../public/home/bgc0.jpg`)
      img.src = url
      img.onload = () => {
        let w = img.width
        let h = img.height
        this.bounds = [
          [0, 0],
          [h, w],
        ]
        L.imageOverlay(url, this.bounds).addTo(this.map)
        // 设置地图图层区域
        this.map.fitBounds(this.bounds)
      }
      // 给地图绑定绘制、删除的事件
      this.map.on('pm:create', this.createClick)
    },
    // 图层绘制完成
    createClick(e) {
      e.layer.on('click', this.layClick)
      this.dialog(e.layer, e.layer.getBounds().getCenter())
    },
    // 区域图层点击
    layClick(e) {
      this.dialog(e.target, e.latlng)
    },
    // 弹窗事件
    dialog(target, latlng) {
      this.dialogTarget = target
      this.isDialog = true
      this.$nextTick(() => {
        L.popup({ closeOnClick: false, closeButton: false }).setLatLng(latlng).setContent(this.$refs.dialogLayer.$el).openOn(this.map)
        // 修复点击popup模态框时，select下拉列表不消失问题
        let dom = document.getElementsByClassName('leaflet-popup-content-wrapper')[0]
        let _this = this
        dom.onclick = function () {
          _this.$refs.dialogLayer.$refs.selectRef.visible = false
        }
      })
    },
  },
  mounted() {
    this.initMap()
    this.initDate()
    const driverObj = driver({
      doneBtnText: '完成', // 结束按钮的文字
      animate: true, // 动画
      stageBackground: '#ffffff', // 突出显示元素的背景颜色
      nextBtnText: '下一步', // 下一步按钮的文字
      prevBtnText: '上一步', // 上一步按钮的文字
      closeBtnText: '关闭',
    })
    driverObj.highlight({
      element: '#imageMap',
      popover: {
        title: '标题',
        description: '这是一个描述',
        position: 'top',
      },
    })
  },
}
</script>
<style lang="less" scoped>
.imgBox {
  width: 50%;
  height: 100%;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  #imageMap {
    height: 100%;
    box-sizing: border-box;
  }
}
.leaflet-container {
  font-size: 0.2rem;
  background: #fff;
}
</style>
