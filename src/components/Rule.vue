<template>
  <div class="rule">
    <el-form :model="ruleForm" size="small" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="ruleForm.name" size="small" placeholder="请输入规则名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="规则类型"  prop="type">
              <el-select v-model="ruleForm.type" size="small" placeholder="请选择规则类型">
                <el-option label="审计分析规则" value="1"></el-option>
                <el-option label="告警规则" value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="统计类型"  prop="cycle">
              <el-select v-model="ruleForm.cycleSign" size="small" placeholder="请选择统计类型">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-form-item label="规则状态"  prop="cycle">
              <el-select v-model="ruleForm.status" size="small" placeholder="请选择状态">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-button type="primary" size="small" @click="addRule">新增规则</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" class="center">
          <div class="grid-content bg-purple">
            <el-form-item>
              <el-button type="primary" size="small" @click="submitForm('ruleForm')">查询</el-button>
              <el-button type="default" size="small" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <rule-list ref="list" :obj="params"></rule-list>

    <el-dialog title="新增规则" :visible.sync="addRuleVisible" top="2vh" width="80%" @close="handleClose">
      <add-rule ref="addRule" @closeAddRule="closeAddRule"></add-rule>
    </el-dialog>
  </div>
</template>

<script>
	import RuleList from "./RuleList";
  import AddRule from "./AddRule";
  export default {
		name: "Rule",
    components: {AddRule, RuleList},
    data() {
		  return {
        ruleForm: {
          name: '',
          type: '',
          cycleSign: '',
          status: '',
        },
        params: {},
        // 新增规则弹框
        addRuleVisible: false,
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        ruleType: JSON.parse(localStorage.getItem('ruleType')),
        cycleSign: JSON.parse(localStorage.getItem('cycleSign')),
        ruleStatus: JSON.parse(localStorage.getItem('ruleStatus')),
      }
    },
    created() {},
    methods: {
      // 查询
      submitForm(formName) {
        for(let key in this.ruleForm) {
          this.params[key] = this.ruleForm[key]
        }
        this.$refs.list.getList(1, 10, this.params)
      },
      // 重置搜索框
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.ruleForm = {
          name: '',
          type: '',
          cycleSign: '',
          status: '',
        }
        for(let key in this.ruleForm) {
          this.params[key] = this.ruleForm[key]
        }
        this.$refs.list.getList(1, 10, this.params)
      },
      // 新增规则
      addRule() {
        this.addRuleVisible = true
      },
      // 子组件传值控制关闭弹框
      closeAddRule(val) {
        this.addRuleVisible = val
        this.$refs.list.getList(1, 10, this.params)
      },
      // 右上角关闭弹框
      handleClose() {
        // 调用子组件的方法：清空输入域 + 关闭弹框
        this.$refs.addRule.resetForm('ruleForm')
      }
    }
	}
</script>

<style scoped>
  .rule{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
  .rule::-webkit-scrollbar {display: none;}
  .rule { -ms-overflow-style: none; }
  .rule { overflow: -moz-scrollbars-none; }
  .center{
    text-align: center;
  }
</style>
