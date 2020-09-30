<template>
  <div class="audit">
    <el-button type="default" @click="addRule">新建规则</el-button>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="即时审计" name="1">
        <el-row class="center ruleList" v-show="activeName==='1'">
          <el-col :span="2">
            <i class="el-icon-arrow-left" @click="handleCurrentChange(currentPage, 'pre')"></i>
          </el-col>
          <el-col :span="4" v-for="item in tableData" :key="item.id">
            <div @click="checkRule(item)">{{item.name}}</div>
          </el-col>
          <el-col :span="2">
            <i class="el-icon-arrow-right" @click="handleCurrentChange(currentPage, 'next')"></i>
          </el-col>
        </el-row>
        <instant-audit v-show="activeName==='1'" :instantId="instantId"></instant-audit>
      </el-tab-pane>

      <el-tab-pane label="周期审计" name="2">
        <el-row class="center ruleList" v-show="activeName==='2'">
          <el-col :span="2">
            <i class="el-icon-arrow-left" @click="handleCurrentChange2(currentPage3, 'pre')"></i>
          </el-col>
          <el-col :span="4" v-for="item in tableData2" :key="item.id">
            <div @click="checkRule2(item)">{{item.name}}</div>
          </el-col>
          <el-col :span="2">
            <i class="el-icon-arrow-right" @click="handleCurrentChange2(currentPage3, 'next')"></i>
          </el-col>
        </el-row>
        <cycle-audit-list v-show="activeName==='2'" :cycleId="cycleId"></cycle-audit-list>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="新增规则" :visible.sync="addRuleVisible" top="2vh" width="80%" @close="handleClose">
      <add-rule ref="addRule" @closeAuditRule="closeAuditRule"></add-rule>
    </el-dialog>
  </div>
</template>

<script>
  import AddRule from "./AddRule";
  import InstantAudit from "@/components/InstantAudit";
  import CycleAuditList from "@/components/CycleAuditList";
  const API = '/api'
  export default {
    name: "Audit",
    components: {CycleAuditList, InstantAudit, AddRule},
    data() {
      return {
        activeName: '1',
        // 数据列表
        tableData: [],
        tableData2: [],
        // 分页相关,头部分页
        currentPage: 1,
        pageSize: 5,
        totalPage: 0,
        currentPage3: 1,
        pageSize3: 5,
        totalPage3: 0,
        // 新增规则弹框
        addRuleVisible: false,
        // 即时id
        instantId: '',
        // 周期id
        cycleId: '',
      }
    },
    watch: {
      tableData: {
        handler(newValue, oldValue) {
          if (newValue.length > 0) {
            this.checkRule(newValue[0])
          }
        },
        deep: true
      },
      tableData2: {
        handler(newValue, oldValue) {
          if (newValue.length > 0) {
            this.checkRule2(newValue[0])
          }
        },
        deep: true
      },
      activeName: {
        handler(newValue, oldValue) {
          if (newValue === '1') {
            if (this.tableData.length > 0) {
              this.checkRule(this.tableData[0])
            }
          }
        },
        deep: true
      }
    },
    created() {
      this.getList(1, 5, {})
    },
    mounted() {},
    methods: {
      // 获取即时规则列表
      getList(page, pageSize, params) {
        this.tableData = []
        params.pageNum = page
        params.pageSize = pageSize
        this.currentPage = page
        this.pageSize = pageSize
        params.type = '1'
        params.cycleSign = '2'
        params.status = '1'
        let url = '/analyzeRule/getAnalyzePageList'
        this.$axios.post(API + url, params).then(r => {
          let res = r.data.data
          if (res.list.length > 0) { // 有数据
            this.tableData = res.list
            this.totalPage = res.totalPage
          } else { // 无数据
            this.tableData = []
          }
        }).catch(e => { // 请求出错
          this.$message({
            message: '请求列表失败：' + e,
            type: 'warning'
          })
        })
      },
      // 获取周期规则列表
      getList2(page, pageSize, params) {
        this.tableData = []
        params.pageNum = page
        params.pageSize = pageSize
        this.currentPage3 = page
        this.pageSize3 = pageSize
        params.type = '1'
        params.cycleSign = '1'
        params.status = '1'
        let url = '/analyzeRule/getAnalyzePageList'
        this.$axios.post(API + url, params).then(r => {
          let res = r.data.data
          if (res.list.length > 0) { // 有数据
            this.tableData2 = res.list
            this.totalPage3 = res.totalPage
          } else { // 无数据
            this.tableData2 = []
          }
        }).catch(e => { // 请求出错
          this.$message({
            message: '请求列表失败：' + e,
            type: 'warning'
          })
        })
      },
      // 翻页
      handleCurrentChange(page, flag) {
        if (flag === 'pre') { // 前一页
          if (page <= 1) {
            page = 1
            this.$message({
              message: '当前已经是最新数据！',
              type: 'warning'
            })
            return false
          } else {
            page--
          }
        } else { // 后一页
          if (page >= this.totalPage) {
            page = this.totalPage
            this.$message({
              message: '当前已经是最早数据！',
              type: 'warning'
            })
            return false
          } else {
            page++
          }
        }
        this.getList(page, this.pageSize, {})
      },
      // 翻页
      handleCurrentChange2(page, flag) {
        if (flag === 'pre') { // 前一页
          if (page <= 1) {
            page = 1
            this.$message({
              message: '当前已经是最新数据！',
              type: 'warning'
            })
            return false
          } else {
            page--
          }
        } else { // 后一页
          if (page >= this.totalPage3) {
            page = this.totalPage3
            this.$message({
              message: '当前已经是最早数据！',
              type: 'warning'
            })
            return false
          } else {
            page++
          }
        }
        this.getList2(page, this.pageSize3, {})
      },
      // 点击某一个即时性规则
      checkRule(row) {
        this.instantId = row.id
      },
      // 点击某一个周期性规则
      checkRule2(row) {
        this.cycleId = row.id
      },
      handleClick(tab, event) {
        let params = {
          pageNum: 1,
          pageSize: 5,
          type: '1',
          cycleSign: '',
          status: '1'
        }
        if (tab.name === '1') { // 即时
          params.cycleSign = '2'
          this.getList(1, 5, params)
        } else { // 周期
          params.cycleSign = '1'
          this.getList2(1, 5, params)
        }
      },
      // 新增规则
      addRule() {
        this.addRuleVisible = true
      },
      // 右上角关闭弹框
      handleClose() {
        // 调用子组件的方法：清空输入域 + 关闭弹框
        this.$refs.addRule.resetForm('ruleForm')
      },
      // 子组件传值控制关闭弹框
      closeAuditRule(val) {
        this.addRuleVisible = val
        let params = {
          pageNum: 1,
          pageSize: 5,
          type: '1',
          cycleSign: '',
          status: '1'
        }
        if (this.activeName === '1') {
          params.cycleSign = '2'
          this.getList(1, 5, params)
        } else {
          params.cycleSign = '1'
          this.getList2(1, 5, params)
        }
      },
    }
  }
</script>

<style scoped>
  .audit{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
  .audit::-webkit-scrollbar {display: none;}
  .audit { -ms-overflow-style: none; }
  .audit { overflow: -moz-scrollbars-none; }
  .center{
    text-align: center;
  }
  .ruleList{
    height: 40px;
    line-height: 40px;
    margin-bottom: 5px;
    border: 1px solid #244a81;
    border-radius: 4px;
    background: linear-gradient(#082031, rgba(8,58,74,0.7));
    box-shadow: 0 0 20px rgba(9,169,191,0.5);
    overflow: hidden;
    cursor: pointer;
  }
</style>
