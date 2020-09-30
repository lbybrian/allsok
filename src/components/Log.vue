<template>
  <div class="log">
    <el-form :model="ruleForm" ref="ruleForm" size="small" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-form-item label="操作用户" prop="operationUserId">
              <el-input v-model="ruleForm.operationUserId" placeholder="请输入操作用户"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="关联选择" prop="softBlockName">
              <el-cascader v-model="ruleForm.softBlockName" style="min-width: 400px" :props="{ checkStrictly: true }" :options="options" collapse-tags clearable placeholder="请选择软件名称与模块名称"></el-cascader>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="日志类型"  prop="logType">
              <el-select v-model="ruleForm.logType" placeholder="请选择日志类型">
                <el-option v-for="item in dict['001']['dataValue']" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-form-item label="日志内容" prop="logCont">
              <el-input v-model="ruleForm.logCont" placeholder="请输入日志内容"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="时间范围" prop="time">
              <el-date-picker v-model="ruleForm.showTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="操作类型"  prop="operationType">
              <el-select v-model="ruleForm.operationType" placeholder="请选择操作类型">
                <el-option v-for="item in dict['002']['dataValue']" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" class="center">
          <div class="grid-content bg-purple">
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
              <el-button type="default" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <log-list ref="list" :obj="params"></log-list>
  </div>
</template>

<script>
	import LogList from "@/components/LogList";
  export default {
		name: "Log",
    components: {LogList},
    data() {
		  return {
        ruleForm: {
          // 日志内容
          logCont: '',
          // 软件和模块名称
          softBlockName: [],
          softwareSign: null,
          moduleSign: null,
          // 操作用户
          operationUserId: '',
          // 日期
          showTime: [],
          startTime: '',
          endTime: '',
          // 日志类型
          logType: null,
          // 操作类型
          operationType: null,
        },
        params: {},
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        // 软件名称模块名下拉框联动选项
        options: JSON.parse(localStorage.getItem('dict'))['004']['dataValue'],
        softName: JSON.parse(localStorage.getItem('softName')),
        blockName: JSON.parse(localStorage.getItem('blockName')),
        // 日期快捷键
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
    },
    methods: {
		  // 查询
      submitForm(formName) {
        this.params = {}
        if (this.ruleForm.showTime.length > 0) {
          this.ruleForm.startTime = this.moment(this.ruleForm.showTime[0]).format("YYYY-MM-DD HH:mm:ss")
          this.ruleForm.endTime = this.moment(this.ruleForm.showTime[1]).format("YYYY-MM-DD HH:mm:ss")
        }
        this.ruleForm.softwareSign = this.ruleForm.softBlockName[0] ? this.ruleForm.softBlockName[0] : null
        this.ruleForm.moduleSign = this.ruleForm.softBlockName[1] ? this.ruleForm.softBlockName[1] : null
        for(let key in this.ruleForm) {
          this.params[key] = this.ruleForm[key]
        }
        this.$refs.list.getList(1, 10, this.params)
      },
      // 重置搜索框
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.ruleForm = {
          logCont: '',
          softBlockName: [],
          softwareSign: null,
          moduleSign: null,
          operationUserId: '',
          showTime: [],
          startTime: '',
          endTime: '',
          logType: null,
          operationType: null
        }
        for(let key in this.ruleForm) {
          this.params[key] = this.ruleForm[key]
        }
        this.$refs.list.getList(1, 10, this.params)
      },
    }
  }
</script>

<style scoped>
.log{
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
.log::-webkit-scrollbar {display: none;}
.log { -ms-overflow-style: none; }
.log { overflow: -moz-scrollbars-none; }
.center{
  text-align: center;
}
</style>
