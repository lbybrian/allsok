<template>
  <div>
    <el-row>
      <el-col :span="6" v-for="(item, index) in tableData" :key="item.id">
        <el-card class="center" :body-style="{padding: '5px'}">
          <div style="padding: 14px;">
            <p>编号：{{index+1}}</p>
            <time class="time">{{item.alarmTime}}</time>
            <el-button type="text" class="button" @click="check(item)">查看结果</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--分页-->
    <div class="page center" v-if="total>0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[16]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--详情弹框-->
    <el-dialog :visible.sync="checkVisible" width="80%">
      <span slot="title">统计详情</span>
      <span slot="footer" class="dialog-footer">
		  <instant-audit :obj="obj"></instant-audit>
        <el-button type="primary" @click="checkVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import instantudit from "@/components/InstantAudit.vue"
  const API = '/api'
	export default {
		name: "CycleAuditList",
    components: {instantudit},
    props: ['cycleId'],
    data() {
		  return {
        currentDate: new Date(),
        // 数据列表
        tableData: [],
        // 分页相关
        currentPage: 1,
        pageSize: 16,
        total: 0,
        checkVisible: false,
        params: {},
        obj: {}
      }
    },
    watch: {
      cycleId: {
        handler(newValue, oldValue) {
          // this.cycleId = newValue
          this.params.ruleId = newValue
          this.getList(this.currentPage, this.pageSize, this.params)
        },
        deep: true
      }
    },
    created() {
		  this.params.ruleId = this.cycleId
      this.getList(1, 16, this.params)
    },
    mounted() {},
    methods: {
      getList(page, pageSize, params) {
        this.loading = true
        this.tableData = []
        params.pageNum = page
        params.pageSize = this.pageSize
        this.currentPage = page
        this.pageSize = pageSize
        let url = '/analyzeRule/getAnalyzeResultRecordPageList'
        this.$axios.post(API + url, params).then(r => {
          let res = r.data.data
          if (res === null) { return false }
          if (res.list!==null&&res.list.length > 0) { // 有数据
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
      // 当前第几页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList(this.currentPage, this.pageSize, {ruleId: this.cycleId})
      },
      // 查看详情
      check(item) {
        this.obj.id = item.id
        console.log(item.id)
        this.obj.url = '/analyzeRule/getAnalyzeResultRecordDataDetail'
        this.checkVisible = true
      }
    }
	}
</script>

<style scoped>
  .center{
    text-align: center;
  }
</style>
