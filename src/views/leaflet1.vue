<template>
  <div class="imgBox">
    <div id="imageMap"></div>
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
export default {
  data() {
    return {
      map: null,
      fillColor: '#2d75ff80',
      bounds: [
        [0, 0],
        [0, 0],
      ], // 平面图大小
    }
  },
  methods: {
    // 平面图初始化
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
      // 全局图层样式
      this.map.pm.setPathOptions({
        fillOpacity: 0.5,
        fillColor: this.fillColor,
      })
    },
    // 地图初始化
    initDate() {
      // 获取图片宽高,防止不同尺寸的图片回显在页面上有多余的留白问题
      let img = new Image()
      let url = require('../../public/home/bgc2.jpg')
      img.src = url
      img.onload = () => {
        let w = img.width
        let h = img.height
        this.bounds = [
          [0, 0],
          [h, w],
        ]
        // 创建地图
        L.imageOverlay(url, this.bounds).addTo(this.map)
        // 设置地图图层区域
        this.map.fitBounds(this.bounds)
      }
      // 给地图绑定绘制、删除的事件
      this.map.on('pm:create', this.createClick)
      this.map.on('pm:remove', this.removeClick)
      // 禁止背景图拖拽,默认是可拖拽的
      this.map.dragging.disable()
      // 禁止双击缩放,默认是可双击缩放的
      this.map.doubleClickZoom.disable()
      // 禁止滚动缩放,默认是可滚动缩放的
      this.map.scrollWheelZoom.disable()
    },
    // 图层绘制完成
    createClick(e) {
      // console.log('图层绘制完成', e)
      // 设置图层样式
      e.layer.setStyle({
        fillOpacity: 0.5,
        fillColor: this.fillColor,
        // color：线段颜色
        // weight：线段宽度
        // opacity：线段透明度
        // dashArray：虚线间隔
        // fill：是否填充内部(true/false)
        // fillColor:内部填充颜色，如不设置，默认为color颜色
        // fillOpacity：内部填充透明度
      })
      // 给图层绑定点击、拖拽、编辑事件
      e.layer.on('pm:edit', this.editLayClick).on('click', this.layClick).on('pm:dragend', this.dragendLayClick)
    },
    // 图层删除
    removeClick(e) {
      // console.log('图层删除', e)
    },
    // 区域图层点击
    layClick(e) {
      // console.log('区域图层点击', e)
    },
    // 区域图层拖拽
    dragendLayClick(e) {
      // console.log('区域图层拖拽', e)
    },
    // 区域图层编辑
    editLayClick(e) {
      // console.log('图层编辑', e)
    },
  },
  mounted() {
    this.initMap()
    this.initDate()
    // 窗口缩放,地图自适应缩放
    window.onresize = () => {
      this.map.invalidateSize(true)
      this.map.fitBounds(this.bounds)
    }
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
