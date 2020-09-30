<template>
  <div>
    <!--列表-->
    <div class="list">
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="softwareSign" label="软件名称">
          <template slot-scope="scope">
            <div class="tableTitle ellipsis">{{softName[scope.row.softwareSign]}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="moduleSign" label="模块名称" width="200">
          <template slot-scope="scope">{{blockName[scope.row.moduleSign]}}</template>
        </el-table-column>
        <el-table-column prop="log" label="操作类型" width="120">
          <template slot-scope="scope">{{operationType[scope.row.operationType]}}</template>
        </el-table-column>
        <el-table-column prop="log" label="日志类型" width="120">
          <template slot-scope="scope">{{logType[scope.row.logType]}}</template>
        </el-table-column>
        <el-table-column prop="user" label="操作用户" width="120">
          <template slot-scope="scope">
            <div>{{scope.row.operationUserId}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="date" sortable label="日期" width="200">
          <template slot-scope="scope">{{scope.row.operationTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="checkLog(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="page center" v-if="total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--详情弹框-->
    <el-dialog v-show="checkVisible" :visible.sync="checkVisible" top="2vh" width="80%">
      <span slot="title">
        <div class="center">
          <i v-show="verifyFlag === 'success'" class="el-icon-circle-check" style="color: #67C23A"></i>
          <i v-show="verifyFlag === 'fail'" class="el-icon-circle-close" style="color: #F56C6C"></i>
          {{verifyTitle}}
          <el-button v-show="verifyFlag === 'fail'" @click="goBack(currentId)" type="text">回退</el-button>
        </div>
      </span>
      <log-detail :detail="logDetail"></log-detail>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import LogDetail from "@/components/LogDetail";
  const API = '/api'
  export default {
    name: "LogList",
    components: {LogDetail},
    props: ['obj'],
    data() {
      return {
        loading: true,
        // 数据列表
        tableData: [],
        // 分页相关
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 当前查看的id
        currentId: '',
        // 查看详情
        checkVisible: false,
        // 传给日志详情子组件的参数
        logDetail: {},
        // 校验标识
        verifyFlag: '',
        // 校验弹框标题
        verifyTitle: '校验成功',
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        // 软件名称模块名下拉框联动选项
        options: JSON.parse(localStorage.getItem('dict'))['004']['dataValue'],
        softName: JSON.parse(localStorage.getItem('softName')),
        blockName: JSON.parse(localStorage.getItem('blockName')),
        logType: JSON.parse(localStorage.getItem('logType')),
        operationType: JSON.parse(localStorage.getItem('operationType')),
      }
    },
    created() {
      this.getList(1, 10, this.obj)
    },
    watch: {
      // obj: {
      //   handler(newValue, oldValue) {
      //     this.getList(this.currentPage, this.pageSize, newValue)
      //   },
      //   deep: true
      // }
    },
    methods: {

      // 自定义表格序号
      indexMethod(index) {
        return this.pageSize*(this.currentPage - 1) + index + 1
      },

      // 根据筛选条件查询列表
      getList(page, pageSize, params) {
        this.loading = true
        this.tableData = []
        params.pageNum = page
        params.pageSize = pageSize
        this.currentPage = page
        this.pageSize = pageSize
        let url = '/logQuery/search/list'
        this.$axios.post(API + url, params).then(r => {
          let res = r.data.data
          if (res.list.length > 0) { // 有数据
            this.tableData = res.list
            this.total = res.total
          } else { // 无数据
            this.tableData = []
            this.total = 0
          }
          this.loading = false
        }).catch(e => { // 请求出错
          this.loading = false
          this.$message({
            message: '请求列表失败：' + e,
            type: 'warning'
          })
        })
      },

      // 每页几条
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.getList(this.currentPage, this.pageSize, this.obj)
      },

      // 当前第几页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList(this.currentPage, this.pageSize, this.obj)
      },

      // 查看日志
      checkLog(row) {
        this.loading = true
        this.currentId = row.id
        this.$axios.post(API + '/logQuery/getLogDataById', {
          id: row.id
          // id: 'drjjVnQBCUEUMczdTsmL'
        }).then(r => {
          let res = r.data.data
          if (res.result === 'ignore') { // 忽略
            this.verifyFlag = 'ignore'
            this.verifyTitle = '日志详情'
          } else if (res.result === 'success') { // 校验成功
            this.verifyFlag = 'success'
            this.verifyTitle = '日志校验成功！'
          } else { // 校验失败
            this.verifyFlag = 'fail'
            this.verifyTitle = '日志校验失败！'
          }
          this.loading = false
          this.logDetail = res
          this.checkVisible = true
        }).catch(e => {
          this.loading = false
          this.$message({
            message: '查看详情失败：' + e,
            type: 'warning'
          })
        })
      },

      // 回退操作
      goBack(id) {
        this.$axios.post(API + '/logOperate/flashBackLog', {
          id: id
        }).then(r => {
          let res = r.data.data
          this.verifyFlag = 'ignore'
          this.verifyTitle = '日志回退成功！'
          this.logDetail = res
        }).catch(e => {
          this.$message({
            message: '回退失败：' + e,
            type: 'warning'
          })
        })
      },
    }
  }
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
