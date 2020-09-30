<template>
  <div class="alarm">
    <el-form :model="ruleForm" size="small" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="告警名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入告警名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="告警级别"  prop="alarmRank">
              <el-select v-model="ruleForm.alarmRank" placeholder="请选择告警级别">
                <el-option v-for="item in dict['006']['dataValue']" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="告警状态"  prop="status">
              <el-select v-model="ruleForm.status" placeholder="请选择告警状态">
                <el-option v-for="item in dict['007']['dataValue']" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <el-form-item label="时间范围" prop="date">
              <el-date-picker v-model="ruleForm.showTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
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

    <alarm-list ref="list" :obj="params"></alarm-list>
  </div>
</template>

<script>
	import AlarmList from "./AlarmList";
  export default {
		name: "Alarm",
    components: {AlarmList},
    data() {
      return {
        ruleForm: {
          name: '',
          alarmRank: null,
          status: '',
          // 日期
          showTime: [],
          startTime: '',
          endTime: '',
        },
        params: {},
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
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        // 告警级别
        alarmRank: JSON.parse(localStorage.getItem('alarmRank')),
        // 告警状态
        alarmStatus: JSON.parse(localStorage.getItem('alarmStatus')),
      }
    },
    created() {},
    methods: {
      // 查询
      submitForm(formName) {
        if (this.ruleForm.showTime.length > 0) {
          this.ruleForm.startTime = this.moment(this.ruleForm.showTime[0]).format("YYYY-MM-DD HH:mm:ss")
          this.ruleForm.endTime = this.moment(this.ruleForm.showTime[1]).format("YYYY-MM-DD HH:mm:ss")
        }
        for(let key in this.ruleForm) {
          this.params[key] = this.ruleForm[key]
        }
        this.$refs.list.getList(1, 10, this.params)
      },
      // 重置搜索框
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.ruleForm =  {
          name: '',
          alarmRank: null,
          status: '',
          // 日期
          showTime: [],
          startTime: '',
          endTime: '',
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
  .alarm{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
  .alarm::-webkit-scrollbar {display: none;}
  .alarm { -ms-overflow-style: none; }
  .alarm { overflow: -moz-scrollbars-none; }
  .center{
    text-align: center;
  }
</style>
