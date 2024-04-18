<template>
  <div class="marker">
    <div>
      <span>采样点：</span>
      <div>
        <el-select ref="selectRef" @visible-change="$visibleChange($event, 'selectRef')" v-model="devName" placeholder="全部" clearable filterable>
          <el-option :disabled="item.disabled" :value="item.id" v-for="(item, index) in devArr" :key="index" :label="item.name">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #07dc0c; font-size: 12px">{{ item.disabled ? '已绑定' : '' }}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div>
      <span>颜色选择：</span>
      <el-color-picker ref="colorPicker" v-model="fillColor" :predefine="predefineColors"> </el-color-picker>
    </div>
    <div>
      <el-button @click="closeDialog">关 闭</el-button>
      <el-button type="primary" @click="confirm">绑 定</el-button>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  name: 'markerdetail',
  data() {
    return {
      devName: '',
      devArr: [],
      fillColor: '#999',
      predefineColors: ['#999', '#07dc0c', '#FF1900'],
      beforeId: '',
    }
  },
  computed: {
    // 颜色透明度
    layerOpacity() {
      return parseFloat(this.fillColor.match(/(\d(\.\d+)?)+/g).slice(-1))
    },
  },
  methods: {
    confirm() {
      // console.log('设备绑定框开启', this.$parent.dialogTarget, this.devName, this.beforeId)
      // 颜色不为空
      if (!this.fillColor) {
        this.$message.error('请选择颜色')
        return
      }
      // 设备不为空
      if (!this.devName) {
        this.$message.error('请选择设备')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      })
      let layer = this.$parent.dialogTarget
      if (this.devName) {
        // 删除原始文字图层
        if (layer.options.iconDevId) {
          this.$parent.map.removeLayer(layer._map._layers[layer.options.icon_leaflet_id])
        }
        // 添加新文字图层
        var myIcon = L.divIcon({
          html: this.devArr.find((v) => v.id == this.devName).name,
          className: 'my-div-icon',
          iconAnchor: [51, 0],
        })
        //中心点位
        let iconLayer = L.marker(layer.getBounds().getCenter(), { icon: myIcon })
          .addTo(this.$parent.map)
          .on('dragend', this.$parent.dragendClick)
          .on('click', this.$parent.iconLayerClick)
        layer.setStyle({
          fillOpacity: this.layerOpacity,
          fillColor: this.fillColor,
          iconName: iconLayer.options.icon.options.html,
          iconDevId: this.devName,
          icon_latlng: iconLayer._latlng,
          icon_leaflet_id: iconLayer._leaflet_id,
        })
      }
      let obj = [
        {
          deviceId: layer.options.iconDevId,
          point: {
            options: layer.options,
            latlngs: layer._latlngs,
            _leaflet_id: layer._leaflet_id,
          },
        },
      ]
      // 换绑 有设备存在,且已经更换设备绑定才删除
      if (this.beforeId && this.beforeId !== this.devName) {
        obj.push({
          deviceId: this.beforeId,
          point: '',
        })
      }
      radDeviceUpdatePoint(qs.stringify({ data: JSON.stringify(obj) }))
        .then((res) => {
          if (res) {
            this.$message.success(res.message)
            // 绑定后该项禁用
            this.devArr.find((v) => v.id == this.devName).disabled = true
            // 换绑后,当前项禁用,前一项解除禁用
            if (this.beforeId && this.beforeId !== this.devName) {
              this.devArr.find((v) => v.id == this.beforeId).disabled = false
            }
            this.closeDialog()
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    closeDialog() {
      // console.log('设备绑定框关闭')
      // 控制颜色框选择后不确定点击关闭时,颜色框不消失问题
      this.$refs.colorPicker.hide()
      // 关闭弹窗
      this.$parent.map._popup.close()
      this.fillColor = '#999'
      this.devName = ''
      this.beforeId = ''
      this.$parent.dialogTarget.setStyle({
        color: 'transparent',
      })
      this.$parent.dialogTarget = ''
      this.$parent.onceClkId = ''
    },
  },
  mounted() {
    this.beforeId = this.$parent.dialogTarget.options.iconDevId
    this.devArr = this.$parent.devArrList
  },
  destroyed() {
    // console.log('组件销毁')
  },
}
</script>

<style lang="less" scoped>
.marker {
  width: 300px;
  > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    > span {
      width: 100px;
    }
    > div {
      width: 200px;
    }
  }
  > :last-child {
    justify-content: center;
  }
}

// 下拉框内容背景色
/deep/.el-input__inner {
  height: 34px;
  border-color: #aaa;

  &:hover,
  &:focus {
    border-color: #409eff;
  }
}
.el-select-dropdown__item.selected,
.el-select-dropdown__item:hover {
  color: #fff !important;
  background: #409eff !important;
}
.el-select-dropdown__item.hover {
  background: #fff;
}
/deep/.el-color-picker__trigger {
  width: 100px;
}
.my-div-icon {
  border: 1px solid #fff;
  border-radius: 4px;
  background: #ccc;
  text-align: center;
  width: 100px !important;
  height: auto !important;
}
/deep/.el-input__icon {
  line-height: 1;
}
/deep/.el-color-picker__mask {
  width: 100%;
}
</style>
