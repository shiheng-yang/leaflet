<template>
  <div class="imgBox">
    <div id="imageMap"></div>
    <DivIcon ref="dialogLayer" v-if="isDialog" />
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
import DivIcon from './divIcon.vue'
const safeColor = '#07dc0c'
const dangerColor = '#FF1900'
const borderColor = '#2d75ff'
export default {
  components: { DivIcon },
  data() {
    return {
      map: null,
      fillColor: '#2d75ff',
      bounds: [
        [0, 0],
        [0, 0],
      ], // 平面图大小
      isDialog: false, // 是否显示弹窗
      dialogTarget: '', // 弹窗dom
      onceClkId: '', // 单次点击的id
      url: '', // 平面图地址
      devArrList: [], // 设备列表
      delId: [], //删除的id
      permission: false,
      imageOverlay: '',
    }
  },
  computed: {
    // 颜色透明度
    layerOpacity() {
      return parseFloat(this.fillColor.match(/(\d(\.\d+)?)+/g).slice(-1))
    },
  },
  methods: {
    initMap() {
      this.map = L.map('imageMap', {
        minZoom: -3,
        zoom: 5,
        maxZoom: 4,
        zoomSnap: 0.1, // 缩放步长
        attributionControl: false, // 右下角图例控件
        zoomControl: true, // 缩放控件
        crs: L.CRS.Simple,
        center: [0, 0],
      })
      this.map.pm.setLang('zh')
      this.map.pm.addControls({
        position: 'topleft',
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
      this.map.pm.setPathOptions({
        fillOpacity: this.layerOpacity,
        fillColor: this.fillColor,
      })
    },
    initDate() {
      // 循环遍历图层删除
      this.map.eachLayer((layer) => {
        if (layer._latlngs != null || layer._latlng != null) {
          layer.remove()
        }
      })
      // 获取图片宽高
      let img = new Image()
      this.url = require('../../../public/home/bgc2.jpg')
      img.src = this.url
      img.onload = () => {
        let w = img.width
        let h = img.height
        this.bounds = [
          [0, 0],
          [h, w],
        ]
        // 添加图片,更换图片
        if (this.imageOverlay) {
          this.imageOverlay.setUrl(this.url)
          this.imageOverlay.setBounds(this.bounds)
        } else {
          this.imageOverlay = L.imageOverlay(this.url, this.bounds).addTo(this.map)
        }
        this.map.fitBounds(this.bounds)
      }
      // 循环绘制图层
      this.devArrList.forEach((rs) => {
        if (rs.point) {
          let re = JSON.parse(rs.point)
          re.options.color = rs.id == this.$parent.csbmc && !this.permission ? borderColor : 'transparent'
          let lay = L.polygon(re.latlngs, re.options).addTo(this.map).on('pm:edit', this.editLayClick).on('click', this.layClick).on('pm:dragend', this.dragendLayClick)
          // 图层添加文字
          if (re.options.iconDevId) {
            let myIcon = L.divIcon({
              html: re.options.iconName,
              className: 'my-div-icon',
              iconAnchor: [51, 0],
            })
            //中心点位
            let iconLayer = L.marker(re.options.icon_latlng, { icon: myIcon }).addTo(this.map).on('click', this.iconLayerClick).on('dragend', this.dragendClick)
            // 更新文本图层id
            lay.setStyle({
              icon_leaflet_id: iconLayer._leaflet_id,
            })
          }
        }
      })
      this.map.on('pm:create', this.createClick)
      this.map.on('pm:remove', this.removeClick)
      // 禁止背景图拖拽
      this.map.dragging.disable()
      // 禁止双击缩放
      this.map.doubleClickZoom.disable()
      // 禁止滚动缩放
      this.map.scrollWheelZoom.disable()
    },
    // 图层绘制完成
    createClick(e) {
      // console.log('图层绘制完成', e)
      e.layer.setStyle({
        fillOpacity: 0.8,
        fillColor: this.fillColor,
      })
      e.layer.on('pm:edit', this.editLayClick).on('click', this.layClick).on('pm:dragend', this.dragendLayClick)

      // 绑定模态框
      this.dialog(e.layer, e.layer.getBounds().getCenter())
    },
    // 图层删除
    removeClick(e) {
      // console.log('图层删除', e)
      // 删除区域图层,且已绑定设备,文字图层同步删除
      if (e.layer.options.icon_leaflet_id) {
        this.delId.push(e.layer.options.iconDevId)
        this.map.removeLayer(e.target._layers[e.layer.options.icon_leaflet_id])
      } else {
        // 删除文本图层,区域图层同步删除
        if (e.layer._leaflet_id) {
          this.map.eachLayer((layer) => {
            if (layer._latlngs && layer.options.icon_leaflet_id == e.layer._leaflet_id) {
              this.delId.push(layer.options.iconDevId)
              this.map.removeLayer(layer)
            }
          })
        }
      }
    },
    // 区域图层拖拽
    dragendLayClick(e) {
      // console.log('区域图层拖拽', e)
      // 有设备绑定
      if (e.target.options.iconDevId) {
        // 删除原始文字图层
        this.map.removeLayer(e.target._map._layers[e.target.options.icon_leaflet_id])
        // 添加新文字图层
        var myIcon = L.divIcon({
          html: e.target.options.iconName,
          className: 'my-div-icon',
          iconAnchor: [51, 0],
        })
        //中心点位
        let iconLayer = L.marker(e.target.getBounds().getCenter(), { icon: myIcon }).addTo(this.map).on('dragend', this.dragendClick).on('click', this.iconLayerClick)
        e.target.setStyle({
          icon_latlng: iconLayer._latlng,
          icon_leaflet_id: iconLayer._leaflet_id,
        })
      }
    },
    // 区域图层编辑
    editLayClick(e) {
      // console.log('图层编辑', e)
    },
    // 文字图层拖拽
    dragendClick(e) {
      // console.log('文字拖拽', e)
      this.map.eachLayer((layer) => {
        // 更新文字所在图层的文字的位经纬度
        if (layer._latlngs && layer.options.icon_leaflet_id == e.target._leaflet_id) {
          layer.setStyle({
            icon_latlng: e.target._latlng,
          })
        }
      })
    },
    // 文字图层点击
    iconLayerClick(e) {
      // console.log('文字图层点击', e)
      this.map.eachLayer((layer) => {
        // 循环找到文字图层所在的多边形区域图层
        if (layer._latlngs && layer.options.icon_leaflet_id == e.target._leaflet_id) {
          // 绑定设备模态框, 删除,编辑,拖拽控件false,两次点击的onceClkId不相同则弹框显示
          if (!this.map.pm.globalDragModeEnabled() && !this.map.pm.globalRemovalEnabled() && !this.map.pm.globalEditEnabled() && this.onceClkId != layer._leaflet_id) {
            this.onceClkId = layer._leaflet_id
            this.dialog(layer, e.latlng)
          }
        }
      })
    },
    // 区域图层点击
    layClick(e) {
      // console.log('区域图层点击', e)
      // 绑定设备模态框, 删除,编辑,拖拽控件false,两次点击的onceClkId不相同则弹框显示
      if (!this.map.pm.globalDragModeEnabled() && !this.map.pm.globalRemovalEnabled() && !this.map.pm.globalEditEnabled() && this.onceClkId != e.target._leaflet_id) {
        this.onceClkId = e.target._leaflet_id
        this.dialog(e.target, e.latlng)
      }
    },
    // 绑定设备模态框
    dialog(target, latlng) {
      this.dialogTarget = target
      if (!this.permission) {
        this.$parent.csbmc = target.options.iconDevId
        return
      }
      this.isDialog = true
      this.$nextTick(() => {
        L.popup({ closeOnClick: false, closeButton: false }).setLatLng(latlng).setContent(this.$refs.dialogLayer.$el).openOn(this.map)
        this.$refs.dialogLayer.fillColor = target.options.fillColor
        this.$refs.dialogLayer.devName = target.options.iconDevId
        // 修复点击设备模态框时，弹框不消失问题
        let dom = document.getElementsByClassName('leaflet-popup-content-wrapper')[0]
        let _this = this
        dom.onclick = function () {
          _this.$refs.dialogLayer.$refs.selectRef.visible = false
        }
      })
    },
  },
  watch: {
    // 监听父组件设备id变化
    '$parent.csbmc': {
      handler(newVal, oldVal) {
        // 实时监控
        if (!this.permission) {
          this.map.eachLayer((layer) => {
            // 区域图层
            if (layer._latlngs) {
              // 清空已点过的id
              this.onceClkId = ''
            }
          })
        }
      },
    },
    // 监听父组件在线设备id变化
    '$parent.lastTime': {
      handler(newVal, oldVal) {
        this.map.eachLayer((layer) => {
          // 区域图层
          if (layer._latlngs) {
            // 找到当前区域图层绑定的设备id对应的数据项
            let nowItem = this.$parent.dataList.find((v) => v.id == layer.options.iconDevId)
            // 监听首次连接不改变颜色
            if (!nowItem.data.length) return
            console.log(nowItem.name, new Date().getTime() - nowItem.timeTemp)
            // 时间间隔大于20秒,图层变灰色
            if (new Date().getTime() - nowItem.timeTemp > 20 * 1000) {
              layer.setStyle({
                fillColor: '#999',
              })
            } else {
              if (nowItem.data[nowItem.data.length - 1] > this.$parent.thresholdMax) {
                layer.setStyle({
                  fillColor: dangerColor,
                })
              } else {
                layer.setStyle({
                  fillColor: safeColor,
                })
              }
            }
          }
        })
      },
    },
    '$store.state.isCollapse': {
      handler(newVal, oldVal) {
        setTimeout(() => {
          this.map.invalidateSize(true)
          this.map.fitBounds(this.bounds)
        }, 500)
      },
    },
  },
  mounted() {
    this.permission = this.$route.path == '/MgrOrg'
    this.initMap()
    this.initDate()
    this.$bus.$on('imgLayUrl', (e) => {
      // console.log(e)
      this.url = e[0]
      this.devArrList = e[1]
      // 释放内存
      if (this.permission) {
        this.$bus.$off('imgLayUrl')
      }
    })
    // 窗口缩放,地图更新
    window.onresize = () => {
      this.map.invalidateSize(true)
      this.map.fitBounds(this.bounds)
    }
  },
  destroyed() {
    this.$bus.$off('imgLayUrl')
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
  #imageMap {
    height: 100%;
    box-sizing: border-box;
  }
}
.leaflet-container {
  font-size: 0.2rem;
  background: #fff;
}
.leaflet-div-icon {
  background: transparent;
  text-align: center;
  color: #fff;
}
/deep/.my-div-icon {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  width: 120px !important;
  height: auto !important;
}
</style>
