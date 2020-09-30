<template>
  <div>
    <!--列表-->
    <div class="list">
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="规则名称">
          <template slot-scope="scope">
            <div class="tableTitle ellipsis">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ruleDesc" label="规则描述">
          <template slot-scope="scope">{{scope.row.ruleDesc}}</template>
        </el-table-column>
        <el-table-column prop="status" label="规则状态" width="120">
          <template slot-scope="scope">
            <div>{{ruleStatus[scope.row.status]}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="规则类型" width="120">
          <template slot-scope="scope">{{ruleType[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column prop="cycleSign" label="统计类型" width="120">
          <template slot-scope="scope">{{cycleSign[scope.row.cycleSign]}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status!=='1'&&scope.row.status==='2'" @click="startRule(scope.row)" type="text" size="small">启用</el-button>
            <el-button v-if="scope.row.status==='1'&&scope.row.status!=='2'"@click="stopRule(scope.row)" type="text" size="small">停用</el-button>
            <el-button @click="checkRule(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="resultRule(scope.row)" type="text" size="small">结果</el-button>
            <el-button v-if="scope.row.status!=='3'"@click="delRule(scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog v-if="checkVisible" :visible.sync="checkVisible" width="80%">
      <span slot="title">规则详情</span>
      <rule-detail :detail="detail":startRule="startRule":stopRule="stopRule" :xq='xq' :alarmRank="alarmRank" :ruleStatus="ruleStatus" :dict="dict" :ruleType="ruleType" :cycleSign="cycleSign"></rule-detail>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import RuleDetail from "@/components/RuleDetail";
  const API = '/api'
	export default {
		name: "RuleList",
    components: {RuleDetail},
    props: ['obj'],
    data() {
		  return {
        xq:'',
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
        ruleType: JSON.parse(localStorage.getItem('ruleType')),
        cycleSign: JSON.parse(localStorage.getItem('cycleSign')),
        ruleStatus: JSON.parse(localStorage.getItem('ruleStatus')),
        alarmRank: JSON.parse(localStorage.getItem('alarmRank')),
        // 详情title
        title: ''
      }
    },
    mounted() {
        this.getList(1, 10, {})
      // if(this.checkVisible===false){
      //     this.getList(1, 10, this.params)
      // }
    },
    created() {
        this.getList(1, 10, {})
    },
    watch: {
      obj: {
        handler(newValue, oldValue) {
          this.getList(this.currentPage, this.pageSize, newValue)
        },
        deep: true,
        immediate: true
      },
      detail: {
        handler(newValue, oldValue) {
          console.log(this.detail)
        },
        status,
      deep: true,
      immediate: true,
      },
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
        let url = '/analyzeRule/getAnalyzePageList'
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
        })
        .catch(e => { // 请求出错
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
      // 启用
      startRule(row) {
        this.$confirm('确定启用规则吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/analyzeRule/updateAnalyzeRuleStatusById', {
            id: row.id,
            status: 1
          }).then(r => {
            if (r.data.code===200) {
              this.$message({
                type: 'success',
                message: '已启用!'
              });
              this.getList(1, 10, {})
              this.checkVisible = false
              status=!status
            } else {
              this.$message({
                type: 'info',
                message: '启用失败!'
              });
            }
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: '启用报错：' + e
            });
          })
        }).catch(() => {
        });
      },
      // 停用
      stopRule(row) {
        this.$confirm('确定停用规则吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/analyzeRule/updateAnalyzeRuleStatusById', {
            id: row.id,
            status: 2
          }).then(r => {
            if (r.data.code===200) {
              this.$message({
                type: 'success',
                message: '已停用!'
              });
              this.getList(1, 10, {})
              this.checkVisible = false
              status=!status
            } else {
              this.$message({
                type: 'info',
                message: '停用失败!'
              });
            }
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: '停用报错：' + e
            });
          })
        }).catch(() => {
        });
      },
      // 详情
      checkRule(row) {
          this.$axios.get(API + '/analyzeRule/getAnalyzeRuleById?id='+row.id, {
            id: row.id
          }).then(r => {
            if (r.data.code === 200) {
              this.detail = r.data.data
              this.checkVisible = true
              // this.getList(1, 10,this.params)
              // this.getList(1, 10,{})
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
      // 删除
      delRule(row) {
        this.$confirm('确定删除规则吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/analyzeRule/updateAnalyzeRuleStatusById', {
            id: row.id,
            status: 3
          }).then(r => {
            if (r.data.code===200) {
              this.$message({
                type: 'success',
                message: '已删除!'
              });
              this.getList(1, 10, {})
            } else {
              this.$message({
                type: 'info',
                message: '删除失败!'
              });
            }
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: '删除报错：' + e
            });
          })
        }).catch(() => {
        });
      },
      // 结果
      resultRule(row) {
        if (row.type === '1') { // 审计
          this.$router.push({
            path: '/auditResult',
            query: {
              id: row.id,
              cycleSign: row.cycleSign
            }
          })
        } else { // 告警
          this.$router.push({
            path: '/alarmResult',
            query: {
              id: row.id
            }
          })
        }
      },
    }
	}
</script>

<style scoped>
  .center {
    text-align: center;
  }
</style>
