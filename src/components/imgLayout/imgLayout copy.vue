<template>
  <div class="about">
    <div class="cont">
      <div class="titles azjgs">
        <div>
          <span>平面图：</span>
          <el-select ref="selectRef" @visible-change="$visibleChange($event, 'selectRef')" v-model="cgxqy" placeholder="全部" clearable filterable @change="initDate">
            <el-option :value="item.id" v-for="(item, index) in cnamesArr" :key="index" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="colorSty">
          <span>颜色选择：</span>
          <el-color-picker v-model="color" show-alpha :predefine="predefineColors"> </el-color-picker>
        </div>
        点位坐标：{{ lag }}
      </div>
      <div id="imageMap"></div>
      <DivIcon ref="dialogLayer" v-if="isDialog" />
    </div>
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
import DivIcon from '@/components/divIcon.vue'
// const DivIconExtend = Vue.extend(DivIcon)
export default {
  components: { DivIcon },
  data() {
    return {
      cgxqy: 1,
      clevels: '',
      clevelArr: '',
      cnamesArr: [
        {
          id: 1,
          name: '图片1',
        },
        {
          id: 2,
          name: '图片2',
        },
        {
          id: 3,
          name: '图片3',
        },
      ],
      lag: '',
      map: null,
      imageOverlay: '',
      marker: '',
      polygon: '',
      circle: '',
      layers: [],
      color: 'rgba(51, 163, 255, 1)',
      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)'],
      bounds: [
        [0, 0],
        [1.5, 2],
      ], // 平面图大小
      editLayerArr: [],
      isDialog: false,
      dialogTarget: '',
      onceClkId: '',
    }
  },
  computed: {
    // 颜色透明度
    layerOpacity() {
      return parseFloat(this.color.match(/(\d(\.\d+)?)+/g).slice(-1))
    },
  },
  methods: {
    initMap() {
      this.map = L.map('imageMap', {
        minZoom: 6,
        zoom: 9,
        maxZoom: 11,
        attributionControl: false, // 右下角图例控件
        crs: L.CRS.Simple,
        center: [0, 0],
      })
      this.map.pm.setLang('zh')
      this.map.pm.addControls({
        position: 'topleft',
        drawPolygon: true, //绘制多边形
        drawMarker: false, //绘制标记点
        drawCircleMarker: false, //绘制圆形标记
        drawPolyline: false, //绘制线条
        drawRectangle: true, //绘制矩形
        drawCircle: false, //绘制圆圈
        editMode: true, //编辑多边形
        dragMode: true, //拖动多边形
        cutPolygon: true, //添加⼀个按钮以删除多边形⾥⾯的部分内容
        removalMode: true, //清除多边形
      })
      // 设置全局图层样式
      // this.map.pm.setPathOptions({
      //   color: 'orange',
      //   fillColor: 'green',
      //   fillOpacity: 0.8,
      // })
      // console.log(this.layerOpacity)
      // let opacity = parseFloat(this.color.match(/(\d(\.\d+)?)+/g).slice(-1))
      this.map.pm.setPathOptions({
        fillOpacity: this.layerOpacity,
        fillColor: this.color,
        color: this.color,
      })
      this.initDate()
    },
    initDate() {
      // 循环遍历图层删除
      this.map.eachLayer((layer) => {
        // console.log(layer)
        if (layer._latlngs != null || layer._latlng != null) {
          layer.remove()
        }
      })
      var url = require(`../../../public/home/bgc${this.cgxqy}.jpg`)
      // 清除所有图层
      // if (this.marker) this.map.removeLayer(this.marker)
      // if (this.polygon) this.map.removeLayer(this.polygon)
      // if (this.circle) this.map.removeLayer(this.circle)
      // 加点
      // if (this.cgxqy == 1) {
      //   this.marker = L.marker([0.580186, 0.904297]).addTo(this.map)
      //   console.log(this.marker)
      // }
      // 加多边形
      // if (this.cgxqy == 2) {
      //   this.polygon = L.polygon(
      //     [
      //       [1.318383, 0.699219],
      //       [1.318383, 1.195313],
      //       [1.017672, 1.197266],
      //       [1.027435, 0.5],
      //       [1.105542, 0.5],
      //       [1.108434, 0.699219],
      //     ],
      //     { color: '#fd0', fillOpacity: 0.6 }
      //   ).addTo(this.map)
      // color：线段颜色
      // weight：线段宽度
      // opacity：线段透明度
      // dashArray：虚线间隔
      // fill：是否填充内部(true/false)
      // fillColor:内部填充颜色，如不设置，默认为color颜色
      // fillOpacity：内部填充透明度
      // }
      // 加圆
      // if (this.cgxqy == 3) {
      //   this.circle = L.circle([0.880985, 0.304688], 0.2, { color: '#f00', fillOpacity: 0.6 }).addTo(this.map)
      // }
      // 切换平面图渲染
      if (this.imageOverlay) {
        // 关闭编辑控件
        if (this.map.pm.globalEditEnabled()) {
          this.map.pm.disableGlobalEditMode()
        }
        // 关闭删除控件
        // if (this.map.pm.globalRemovalEnabled()) {
        //   this.map.pm.disableGlobalRemovalMode()
        // }
        this.imageOverlay.setUrl(url)
        this.imageOverlay.setBounds(this.bounds)
      } else {
        this.imageOverlay = L.imageOverlay(url, this.bounds).addTo(this.map)
      }
      this.map.fitBounds(this.bounds)
      let res = JSON.parse(localStorage.getItem('layers'))
      if (res && res[this.cgxqy - 1]) {
        // 循环绘制图层
        res[this.cgxqy - 1].forEach((e) => {
          let lay = L.polygon(e.latlngs, e.options)
            .addTo(this.map)
            .on('pm:edit', this.editLayClick)
            .on('click', this.layClick)
          // e.latlngs = lay._latlngs
          e._leaflet_id = lay._leaflet_id
          // 图层添加文字
          if (e.options.iconDevId) {
            let myIcon = L.divIcon({
              html: e.options.iconName,
              className: 'my-div-icon',
              iconAnchor: [51, 0],
            })
            //中心点位
            let iconLayer = L.marker(e.options.icon_latlng, { icon: myIcon })
              .addTo(this.map)
              .on('dragend', this.dragendClick)
              .on('click', this.iconLayerClick)
            // console.log(iconLayer)
            // lay.setStyle({
            //   icon_latlng: iconLayer._latlng,
            //   icon_leaflet_id: iconLayer._leaflet_id,
            // })
            e.options.icon_leaflet_id = iconLayer._leaflet_id
          }
        })
        localStorage.setItem('layers', JSON.stringify(res))
      }
      this.map.on('click', this.onMapClick)
      // this.map.on('pm:drawstart', this.drawstartClick)
      // this.map.on('pm:drawend', this.drawendClick)
      this.map.on('pm:create', this.createClick)
      this.map.on('pm:remove', this.removeClick)
      this.map.on('pm:cut', this.cutClick)
      this.map.on('pm:globalremovalmodetoggled', this.globalDeleteClick)
      this.map.on('pm:globaleditmodetoggled', this.globalEditClick)
      this.map.on('pm:globaldrawmodetoggled', this.globalDrawClick)
      // 禁止背景图拖拽
      this.map.dragging.disable()
      // 禁止双击缩放
      this.map.doubleClickZoom.disable()
    },
    // 删除控件
    globalDeleteClick(e) {
      console.log('删除控件', e)
    },
    // 编辑控件
    globalEditClick(e) {
      console.log('编辑控件', e)
      // if (e.enabled) {
      //   // 编辑开始
      //   this.editLayerArr = []
      // } else {
      //   // 编辑结束
      //   let res = JSON.parse(localStorage.getItem('layers'))
      //   this.editLayerArr.forEach((item) => {
      //     let newIndex = res[this.cgxqy - 1].findIndex((v) => v._leaflet_id == item._leaflet_id)
      //     if (newIndex != -1) {
      //       res[this.cgxqy - 1][newIndex].latlngs = item._latlngs
      //       res[this.cgxqy - 1][newIndex]._leaflet_id = item._leaflet_id
      //       res[this.cgxqy - 1][newIndex].options = item.options
      //     }
      //   })
      //   localStorage.setItem('layers', JSON.stringify(res))
      // }
    },
    // 拖拽控件
    globalDrawClick(e) {
      console.log('拖拽控件', e)
    },
    // 背景图的点击事件
    onMapClick(e) {
      // console.log('点击事件', e)
      this.lag = e.latlng
      // L.popup()
      //   .setLatLng(e.latlng)
      //   .setContent('当前点击位置: ' + e.latlng)
      //   .openOn(this.map)
    },
    // drawstartClick(e) {
    //   console.log('开始', e)
    // },
    // drawendClick(e) {
    //   console.log('结束', e)
    // },
    // 图层绘制完成
    createClick(e) {
      console.log('完成', e)
      e.layer.setStyle({
        fillOpacity: this.layerOpacity,
        fillColor: this.color,
        color: this.color,
      })
      let res = JSON.parse(localStorage.getItem('layers')) || []
      if (!res[this.cgxqy - 1]) {
        res[this.cgxqy - 1] = []
      }
      // 矩形 多边形
      if (e.shape == 'Rectangle' || e.shape == 'Polygon') {
        let obj = {
          _leaflet_id: e.layer._leaflet_id,
          latlngs: e.layer._latlngs,
          options: e.layer.options,
        }
        res[this.cgxqy - 1].push(obj)
      }
      localStorage.setItem('layers', JSON.stringify(res))
      e.layer.on('pm:edit', this.editLayClick).on('click', this.layClick)
      // e.layer.on('pm:dragend', this.dragendClick)
      // 绑定模态框
      this.dialog(e.layer)
    },
    // 图层删除
    removeClick(e) {
      console.log('删除', e)
      let res = JSON.parse(localStorage.getItem('layers'))
      // icon_leaflet_id有 删除图层和文本
      if (e.layer.options.icon_leaflet_id) {
        res[this.cgxqy - 1].forEach((d, i) => {
          if (d._leaflet_id == e.layer._leaflet_id) {
            this.map.removeLayer(e.target._layers[d.options.icon_leaflet_id])
            res[this.cgxqy - 1].splice(i, 1)
          }
        })
      } else {
        // 没有 只删文本,或只删图层
        res[this.cgxqy - 1].forEach((d, i) => {
          if (d.options.icon_leaflet_id == e.layer._leaflet_id) {
            delete d.options.iconDevId
            delete d.options.iconName
            delete d.options.icon_latlng
            delete d.options.icon_leaflet_id
          }
          if (d._leaflet_id == e.layer._leaflet_id) {
            res[this.cgxqy - 1].splice(i, 1)
          }
        })
      }
      localStorage.setItem('layers', JSON.stringify(res))
    },
    // 图层编辑
    editLayClick(e) {
      console.log('编辑', e)
      // e.target.setStyle({
      //   fillOpacity: this.layerOpacity,
      //   fillColor: this.color,
      //   color: this.color,
      // })
      // let index = this.editLayerArr.findIndex((v) => v._leaflet_id == e.target._leaflet_id)
      // if (index != -1) {
      //   this.editLayerArr[index] = e.target
      // } else {
      //   this.editLayerArr.push(e.target)
      // }
      let res = JSON.parse(localStorage.getItem('layers'))
      res[this.cgxqy - 1].forEach((d) => {
        if (d._leaflet_id == e.target._leaflet_id) {
          d.latlngs = e.target._latlngs
          d._leaflet_id = e.target._leaflet_id
          d.options = e.target.options
        }
      })
      localStorage.setItem('layers', JSON.stringify(res))

      // 关闭编辑
      // this.map.pm.disableGlobalEditMode()
    },
    // 文字图层拖拽
    dragendClick(e) {
      console.log('拖拽', e)
      let res = JSON.parse(localStorage.getItem('layers'))
      res[this.cgxqy - 1].forEach((d) => {
        if (d.options.icon_leaflet_id == e.target._leaflet_id) {
          d.options.icon_latlng = e.target._latlng
        }
      })
      localStorage.setItem('layers', JSON.stringify(res))
    },
    // 文字图层点击
    iconLayerClick(e) {
      console.log('文字图层点击', e)
    },
    // 图层剪切
    cutClick(e) {
      console.log('剪切', e)
      // e.layer._layers[e.layer._leaflet_id - 1].setStyle({
      //   fillOpacity: this.layerOpacity,
      //   fillColor: this.color,
      //   color: this.color,
      // })
      let res = JSON.parse(localStorage.getItem('layers'))
      res[this.cgxqy - 1].forEach((d) => {
        if (d._leaflet_id == e.originalLayer._leaflet_id) {
          d.latlngs = e.layer._layers[e.layer._leaflet_id - 1]._latlngs
          d._leaflet_id = e.layer._leaflet_id - 1
          d.options = e.layer._layers[e.layer._leaflet_id - 1].options
        }
      })
      localStorage.setItem('layers', JSON.stringify(res))
    },
    // 图层点击
    layClick(e) {
      console.log('图层点击', e)
      // 更新文字图层id
      let res = JSON.parse(localStorage.getItem('layers'))
      res[this.cgxqy - 1].forEach((d) => {
        if (d._leaflet_id == e.target._leaflet_id) {
          e.target.setStyle({
            icon_leaflet_id: d.options.icon_leaflet_id,
          })
        }
      })
      localStorage.setItem('layers', JSON.stringify(res))
      // 图层添加文字
      // var myIcon = L.divIcon({
      //   html: '测试设备1',
      //   className: 'my-div-icon',
      // })
      // //中心点位
      // L.marker(e.target.getBounds().getCenter(), { icon: myIcon })
      //   .addTo(this.map)
      //   .on('dragend', this.dragendClick)
      // 绑定模态框, 删除,编辑控件false,两次点击的onceClkId不相同弹框
      if (!this.map.pm.globalRemovalEnabled() && !this.map.pm.globalEditEnabled() && this.onceClkId != e.target._leaflet_id) {
        this.onceClkId = e.target._leaflet_id
        this.dialog(e.target)
      }
    },
    close(e) {
      console.log(e)
    },
    // 图层模态框
    dialog(target) {
      this.dialogTarget = target
      this.isDialog = true
      this.$nextTick(() => {
        // closeOnClick: false 点击地图外区域不关闭模态框
        L.popup({ closeOnClick: false, closeButton: false })
          .setLatLng(target.getBounds().getCenter())
          .setContent(this.$refs.dialogLayer.$el)
          .openOn(this.map)
        // .on('remove', this.close) // 弹窗右上角×移除事件
        this.$refs.dialogLayer.color = target.options.color
        this.$refs.dialogLayer.devName = target.options.iconDevId
      })
      // // 原生方式创建弹出框引入标签
      // // 大盒子
      // var parentDiv = document.createElement('div')
      // parentDiv.className = 'boxSty'
      // // 创建下拉框
      // var selectDiv = document.createElement('div')
      // var selectSpan = document.createTextNode('采样点: ')
      // var selectInput = document.createElement('select')
      // selectInput.className = 'elSelect'
      // selectInput.disabled = false
      // selectInput.onchange = function() {
      //   console.log(this, this.value, this.label)
      // }
      // selectDiv.appendChild(selectSpan)
      // selectDiv.appendChild(selectInput)
      // // 创建下拉框选项
      // var option1 = document.createElement('option')
      // option1.value = '1'
      // option1.innerHTML = 'option1'
      // option1.className = 'el-select-item'
      // option1.label = 'option1'
      // option1.text = 'option1'
      // var option2 = document.createElement('option')
      // option2.value = '2'
      // option2.innerHTML = 'option2'
      // option2.className = 'el-select-item'
      // option2.label = 'option2'
      // option2.text = 'option2'
      // selectInput.appendChild(option1)
      // selectInput.appendChild(option2)
      // // 创建按钮span
      // var span1 = document.createElement('span')
      // span1.innerHTML = '确 认'
      // span1.className = 'el-button el-button--warning el-button--medium'
      // let _this = this
      // span1.onclick = function() {
      //   _this.addClick(target)
      // }
      // // var span2 = document.createElement('span')
      // // span2.innerHTML = '编 辑'
      // // span2.className = 'el-button el-button--primary el-button--medium'
      // // span2.onclick = function() {
      // //   _this.editClick(target)
      // // }
      // // 追加到大盒子里
      // parentDiv.appendChild(selectDiv)
      // parentDiv.appendChild(span1)
      // // parentDiv.appendChild(span2)
      // // 绑定弹窗
      // target.bindPopup(parentDiv).openPopup()
    },
    // 模态框
    addClick(target) {
      target.closePopup()
      // console.log(e, 111)
    },
    // 模态框
    // editClick(target) {
    //   target.closePopup()
    //   // console.log(222)
    // },
  },
  mounted() {
    this.initMap()
    window.onresize = () => {
      // 窗口缩放,地图更新
      this.map.invalidateSize(true)
      this.map.fitBounds(this.bounds)
    }
  },
}
</script>
<style src="../../../public/css/search.less" lang="less" scoped></style>
<style lang="less" scoped>
.cont {
  width: 100%;
  height: 100%;
  display: flex;
  .titles {
    width: 30%;
    display: flex;
    flex-direction: column;
  }
  #imageMap {
    width: 70%;
    height: 100%;
    font-size: 16px;
    border: 1px solid #ccc;
    user-select: none;
  }
}
.leaflet-div-icon {
  background: transparent;
  text-align: center;
  // border: none;
  color: #fff;
}
.colorSty {
  display: inline-flex !important;
  align-items: center;
  .el-color-picker__trigger {
    width: 100px;
  }
}
// 弹框
.boxSty {
  text-align: center;
  user-select: none;
  > :first-child {
    margin-bottom: 10px;
  }
}
.elSelect {
  border-radius: 4px;
  width: 174px;
  margin-right: 6px;
  height: 32px;
  border: 1px solid #aaa;
  outline: none;
}
.el-select-item {
  color: #606266;
  font-size: 20px;
  &:hover {
    background: #409eff;
    color: #fff;
  }
}
.my-div-icon {
  border: 1px solid #fff;
  border-radius: 4px;
  background: #ccc;
  text-align: center;
  width: 100px !important;
  height: auto !important;
}
</style>
