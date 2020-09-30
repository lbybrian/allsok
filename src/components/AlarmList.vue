<template>
  <div>
    <!--列表-->
    <div class="list">
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="告警名称">
          <template slot-scope="scope">
            <div class="tableTitle ellipsis">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称">
          <template slot-scope="scope">{{scope.row.ruleName}}</template>
        </el-table-column>
        <el-table-column prop="alarmRank" label="告警级别" width="120">
          <template slot-scope="scope">{{alarmRank[scope.row.alarmRank]}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">{{alarmStatus[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column prop="alarmTime" label="告警时间" width="200">
          <template slot-scope="scope">{{scope.row.alarmTime}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status!=='1'&&scope.row.status!=='2'" @click="handleAlarm(scope.row)" type="text" size="small">处理</el-button>
            <el-button v-if="scope.row.status!=='1'&&scope.row.status!=='2'" @click="ignoreAlarm(scope.row)" type="text" size="small">忽略</el-button>
            <el-button @click="checkAlarm(scope.row)" type="text" size="small">查看</el-button>
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
    <el-dialog v-show="checkVisible" :visible.sync="checkVisible" width="80%">
      <span slot="title">告警详情</span>
      <alarm-detail :detail="detail" @handleChange="handleChange"></alarm-detail>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="checkVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import AlarmDetail from "@/components/AlarmDetail";
  const API = '/api'
	export default {
		name: "AlarmList",
    components: {AlarmDetail},
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
        // 详情
        checkVisible: false,
        // 详情信息
        detail: {},
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        // 告警级别
        alarmRank: JSON.parse(localStorage.getItem('alarmRank')),
        // 告警状态
        alarmStatus: JSON.parse(localStorage.getItem('alarmStatus')),
      }
    },
    created() {
      this.getList(1, 10, this.obj)
    },
    watch: {
      obj: {
        handler(newValue, oldValue) {
          this.getList(this.currentPage, this.pageSize, newValue)
        },
        deep: true
      }
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
        params.pageSize = this.pageSize
        this.currentPage = page
        this.pageSize = pageSize
        let url = '/abnormalAlarm/getAbnormalList'
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
      // 查看
      checkAlarm(row) {
        this.currentId = row.id
        this.$axios.post(API + '/abnormalAlarm/getAbnormalDetail', {
          id: row.id
        }).then(r => {
          if (r.data.code === 200) {
            this.detail = r.data.data
            console.log(this.detail)
            this.checkVisible = true
          } else {
            this.$message({
              message: '展示详情失败：',
              type: 'warning'
            })
          }
        }).catch(e => {
          this.$message({
            message: '请求详情失败：' + e,
            type: 'warning'
          })
        })
      },
      // 处理
      handleAlarm(row) {
        this.$confirm('此操作将处理该日志, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/abnormalAlarm/updateAbnormalStatusById', {
            id: row.id,
            status: 1
          }).then(r => {
            if (r.data.code === 200) {
              this.$message({
                type: 'success',
                message: '已处理!'
              });
              this.getList(1, 10, this.params)
            } else {
              this.$message({
                type: 'info',
                message: '处理失败!'
              });
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '处理报错：' + e
            });
          })
        }).catch(() => {
        });
      },
      // 忽略
      ignoreAlarm(row) {
        this.$confirm('此操作将忽略该日志, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/abnormalAlarm/updateAbnormalStatusById', {
            id: row.id,
            status: 2
          }).then(r => {
            if (r.data.code === 200) {
              this.$message({
                type: 'success',
                message: '已忽略!'
              });
              this.getList(1, 10, this.params)
            } else {
              this.$message({
                type: 'info',
                message: '忽略失败!'
              });
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '忽略报错：' + e
            });
          })
        }).catch(() => {
        });
      },
      // 告警详情处理or忽略后，子组件传参
      handleChange(val) {
        this.getList(this.currentPage, this.pageSize, this.obj)
        this.checkVisible = false
      }
    }
	}
</script>

<style scoped>
  .center{
    text-align: center;
  }
</style>
