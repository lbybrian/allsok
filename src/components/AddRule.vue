<template>
  <div class="addRule">
    <el-steps :active="active" align-center style="margin-bottom: 20px;" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
    </el-steps>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
      <el-row v-if="active===1">
        <el-col :span="8">
          <el-form-item label="规则名称" prop="name" required>
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规则描述" prop="ruleDesc">
            <el-input v-model="ruleForm.ruleDesc"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规则类型" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="1">审计分析规则</el-radio>
              <el-radio label="2">告警规则</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="active===1">
        <el-col :span="24">
          <el-form-item label="设置周期统计标识" prop="cycleSign" label-width="150px" class="el-form-item-f">
            <el-radio-group v-model="ruleForm.cycleSign" @change="changeCycle" style="width: 180px;" class="el-form-item-l">
              <el-radio label="2" v-show="ruleForm.type==='1'">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            <span v-if="ruleForm.cycleSign==='1'" style="margin-left: 10px;" class="el-form-item-r">
              <el-form-item label="时间范围： " prop="showTime">
                <el-date-picker v-model="ruleForm.showTime" type="datetimerange" :picker-options="pickerOptions"
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
                <span>频率： </span>
                <el-input-number v-model="ruleForm.cycleStatTast.cycleNum" controls-position="right" @change="handleChange"
                  :min="1"></el-input-number>
                <el-select v-model="ruleForm.cycleStatTast.cycleUnit" placeholder="请选择" style="width:100px;">
                  <el-option v-for="item in dict['016']['dataValue']" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="active===1" label="规则">
        <configuration @config="config"></configuration>
      </el-form-item>

      <div v-if="active===2&&ruleForm.type==='1'">
        <el-form-item label="已配置图表" prop="chartList" v-if="ruleForm.type==='1'&&ruleForm.queryRuleJson.bucketBO.aggregationBOList[0].arr.length>0">
          <chart-list @chartList="chartList"></chart-list>
        </el-form-item>

        <el-form-item label="图文配置" v-if="ruleForm.type==='1'&&ruleForm.queryRuleJson.bucketBO.aggregationBOList[0].arr.length>0">
          <el-tabs v-model="activeTab" type="card" @tab-click="changeTab">
            <el-tab-pane label="饼图" name="pie" v-if="ruleForm.type==='1'">
              <pie v-if="activeTab==='pie'" :obj="ruleForm.queryRuleJson.bucketBO"></pie>
            </el-tab-pane>
            <el-tab-pane label="柱状图" name="histogram" v-if="ruleForm.type==='1'">
              <histogram v-if="activeTab==='histogram'" :obj="ruleForm.queryRuleJson.bucketBO"></histogram>
            </el-tab-pane>
            <el-tab-pane label="折线图" name="line" v-if="ruleForm.type==='1'">
              <line-chart v-if="activeTab==='line'" :obj="ruleForm.queryRuleJson.bucketBO"></line-chart>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item label="表格配置" prop="showTable">
          <span>统计结果是否以列表形式显示</span>
          <el-radio-group v-model="ruleForm.showTable">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1" :disabled="ruleForm.queryRuleJson.bucketBO.aggregationBOList.length===0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div v-if="active===2&&ruleForm.type==='2'">
        <add-alarm-rule :obj="ruleForm.queryRuleJson.bucketBO" :obj2="ruleForm.queryRuleJson.aggOutList" @alarmRule="alarmRule"></add-alarm-rule>
      </div>

      <el-form-item class="center">
        <!--<el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>-->
        <el-button v-if="active>1" size="small" type="default" @click="preStep()">上一步</el-button>
        <el-button v-if="active<2" size="small" type="primary" @click="submitForm()">下一步</el-button>
        <el-button v-if="active===2" size="small" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  const API = '/api'
  import Pie from "@/components/Pie";
  import Histogram from "@/components/Histogram";
  import LineChart from "@/components/LineChart";
  import ChartList from "@/components/ChartList";
  import Configuration from "@/components/Configuration";
  import AddAlarmRule from "@/components/AddAlarmRule";
  export default {
		name: "AddRule",
    components: {AddAlarmRule, Configuration, ChartList, LineChart, Histogram, Pie},
    props: [],
    data() {
      return {
        // 步骤
        active: 1,
        ruleForm: {
          name: '',
          type: '1',
          cycleSign: '2',
          ruleDesc: '',
          showTime: [],
          // 规则
          queryRuleJson: {
            // and逻辑
            queryANDList: [],
            // or逻辑
            queryORList: [],
            // 桶外聚合组
            aggOutList: [],
            // 时间范围
            timeRangeSign: '',
            // 分桶信息
            bucketBO: {
              aggregationBOList: [{
                fieldName: '',
                aggName: '',
                aggSign: '',
                arr: [],
              }]
            },
          },
          cycleStatTast: {
            cycleUnit: 'minute',
            cycleNum: 1,
            startTime: '',
            endTime: ''
          },
          // 是否显示表格
          showTable: 0,
          // 告警规则
          aardList: [{
            ruleName: '',
            bucketName: '',
            resultFiledName: '',
            aggregationSign: '',
            relationSign: '',
            alarmRank: 1,
            targetNumValue: 1,
            targetStrValue: '',
            maxValue: 0,
            minValue: 0
          }],
          arctList: []
        },
        // 保存时传参对象
        params: {},
        rules: {
          name: [{
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }, ],
          showTime: [{
            required: true,
            message: '请选择时间范围',
            trigger: ['blur', 'change']
          }, ],
        },
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
        // 图标配置
        activeTab: 'pie',
        // 字典表
        dict: JSON.parse(localStorage.getItem('dict')),
      }
    },
    created() {

    },
    mounted() {},
    watch: {
      // 监听表单
      ruleForm: {
        handler(newValue, oldValue) {
          if (newValue.type === '2') { // 如果是告警规则
            newValue.cycleSign = '1' // 那么必须是周期性统计
            this.activeTab = '' // 告警规则仅显示表格
          } else {
            this.activeTab = 'pie'
          }
        },
        deep: true
      }
    },
    methods: {
      // 上一步
      preStep() {
        if (this.active-- < 0) this.active = 0
        this.ruleForm.queryRuleJson.bucketBO.aggregationBOList = [{
          fieldName: '',
          aggName: '',
          aggSign: '',
          arr: [],
        }]
      },
      // 下一步
      nextStep() {
        // if (this.active++ > 2) this.active = 0
        // validateField(){

        // }
      },
      // 是否周期性单选
      changeCycle(val) {
        if (val === '2') { // 2否  1是
          this.ruleForm.showTime = []
          this.ruleForm.cycleStatTast = {
            cycleUnit: 'minute',
            cycleNum: 1,
            startTime: '',
            endTime: ''
          }
        }
      },
      // configuration组件接收的值
      config(val) {
        for (let key in val) {
          this.ruleForm.queryRuleJson[key] = val[key]
        }
      },
      // 审计图文组件接收的值
      chartList(val) {
        this.ruleForm.arctList = val
      },
      // 告警规则组件接收的值
      alarmRule(val) {
        this.ruleForm.aardList = val.rows
      },
      // 保存规则
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) { // 验证必填信息通过
            if (this.ruleForm.showTime.length > 0) {
              this.ruleForm.cycleStatTast.startTime = this.moment(this.ruleForm.showTime[0]).format(
                "YYYY-MM-DD HH:mm:ss")
              this.ruleForm.cycleStatTast.endTime = this.moment(this.ruleForm.showTime[1]).format(
                "YYYY-MM-DD HH:mm:ss")
            }
            for (let key in this.ruleForm) {
              this.params[key] = this.ruleForm[key]
            }
            this.$axios.post(API + '/analyzeRule/addAnalyzeRule', this.params).then(r => {
              console.log(r)
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$emit('closeAddRule', false)
              this.$emit('closeAuditRule', false)
            }).catch(e => {
              this.$message({
                message: '保存失败：' + e,
                type: 'warning'
              })
            })
          } else {
            this.$message({
              message: '请填写必填信息',
              type: 'warning'
            })
            return false
          }
        });
      },
      // 取消规则
      resetForm(formName) {
        this.$refs[formName].resetFields()
        // 关闭父组件弹框
        this.$emit('closeAddRule', false)
        // 恢复成第一步
        this.active = 1
        this.ruleForm = {
          name: '',
          type: '1',
          cycleSign: '2',
          ruleDesc: '',
          showTime: [],
          // 规则
          queryRuleJson: {
            // and逻辑
            queryANDList: [],
            // or逻辑
            queryORList: [],
            // 桶外聚合组
            aggOutList: [],
            // 时间范围
            timeRangeSign: '',
            // 分桶信息
            bucketBO: {
              aggregationBOList: []
            },
          },
          cycleStatTast: {
            cycleUnit: 'minute',
            cycleNum: 1,
            startTime: '',
            endTime: ''
          },
          // 是否显示表格
          showTable: 0,
          // 告警规则
          aardList: [{
            ruleName: '',
            bucketName: '',
            resultFiledName: '',
            aggregationSign: '',
            relationSign: '',
            alarmRank: 1,
            targetNumValue: 1,
            targetStrValue: '',
            maxValue: 0,
            minValue: 0
          }],
        }
      },
      // 周期变化
      handleChange(val) {
        console.log(val)
      },
      // 切换图表tab
      changeTab() {
        console.log(this.activeTab)
      },
    }
  }
</script>

<style scoped>
  .center {
    text-align: center;
  }
  .el-form-item-f{
    position: relative;
    height: 30px;
    line-height: 30px;
  }
  .el-form-item-l{
    position: absolute;
    left: 0;
    top: 10px;
  }
  .el-form-item-r{
    float: right;
  }
</style>
