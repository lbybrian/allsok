<template>
  <div>
    <el-table v-if="tableData.length>0" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="charType" label="类型" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.charType===1">饼图</div>
          <div v-if="scope.row.charType===2">柱状图</div>
          <div v-if="scope.row.charType===3">折线图</div>
        </template>
      </el-table-column>
      <el-table-column label="图表属性">
        <template slot-scope="scope">
          <div>
            <span>图表名称：{{scope.row.chartName}}, </span>
            <span>图例：{{scope.row.axisX}}, </span>
            <span v-if="scope.row.yAxis">数据值：{{scope.row.yAxis}}</span>
            <span v-if="!scope.row.yAxis">数据值：{{scope.row.axisYArr.join(',')}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <!--<el-button @click="check(scope)" type="text" size="small">预览</el-button>-->
          <el-button @click="del(scope)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else style="color: #F56C6C; font-size: 12px;">* 请配置以下图表信息</div>

    <el-dialog title="图表预览" :modal="false" :visible.sync="chartVisible" width="40%">
      <div>图表</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chartVisible = false" type="primary" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
		name: "ChartList",
    data() {
		  return {
        loading: true,
        // 数据列表
        tableData: [],
        // 饼图
        pie: [],
        // 柱状图
        histogram: [],
        // 折线图
        lineChart: [],
        chartVisible: false,
      }
    },
    created() {
		  this.loading = false
    },
    mounted() {
      // 监听列表数据变化
      this.$Bus.$on('pie', data => {
        this.pie = data
        this.tableData = this.pie.concat(this.histogram).concat(this.lineChart)
        this.$emit('chartList', this.tableData)
      })
      this.$Bus.$on('histogram', data => {
        this.histogram = data
        this.tableData = this.pie.concat(this.histogram).concat(this.lineChart)
        this.$emit('chartList', this.tableData)
      })
      this.$Bus.$on('lineChart', data => {
        this.lineChart = data
        this.tableData = this.pie.concat(this.histogram).concat(this.lineChart)
        this.$emit('chartList', this.tableData)
      })
    },
    methods: {
      // 预览
      check(scope) {
        this.chartVisible = true
      },
      // 删除
      del(scope) {
        this.tableData.splice(scope.$index, 1)
        this.$emit('chartList', this.tableData)
      },
    }
	}
</script>

<style scoped>

</style>
