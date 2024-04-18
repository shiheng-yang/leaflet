<template>
  <div class="marker">
    <div>
      <span>设备列表：</span>
      <div>
        <el-select ref="selectRef" @visible-change="$visibleChange($event, 'selectRef')" v-model="devName" placeholder="全部" clearable filterable>
          <el-option :value="item.id" v-for="(item, index) in devArr" :key="index" :label="item.name"> </el-option>
        </el-select>
      </div>
    </div>
    <div>
      <span>设备编号：</span>
      <el-input v-model="devId" placeholder="请输入设备编号"></el-input>
    </div>
    <div>
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'markerdetail',
  data() {
    return {
      devId: '',
      devName: '',
      devArr: [
        {
          id: 0,
          name: '设备1',
        },
        {
          id: 1,
          name: '设备2',
        },
      ],
    }
  },
  methods: {
    confirm() {
      // console.log('确定')
      this.$parent.map._popup.close()
      this.devId = ''
      this.devName = ''
    },
    close() {
      // console.log('关闭弹窗')
      this.$parent.map._popup.close()
      this.devId = ''
      this.devName = ''
    },
  },
  mounted() {
    // this.$parent.dialogTarget.setStyle({
    //   ...
    // })
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
</style>
