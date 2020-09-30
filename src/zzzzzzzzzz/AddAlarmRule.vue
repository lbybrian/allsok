<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" label-width="100px" class="demo-ruleForm" size="small">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>告警规则</span>
        </div>
        <div v-for="(row, index) in ruleForm.rows">
          <el-form-item>
            <el-input v-model="row.ruleName" placeholder="规则名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-cascader style="min-width: 300px" v-model="row.arr" @change="selectInner(row, index)" :options="countArr" collapse-tags clearable placeholder="选择字段与关系"></el-cascader>
          </el-form-item>

          <el-form-item v-if="row.aggregationSign!=='1'">
            <el-input v-model="row.targetStrValue" placeholder="请输入值"></el-input>
          </el-form-item>
          <el-form-item v-if="(row.aggregationSign==='1')&&(row.arr[1]!=='bt')">
            <el-input-number v-model="row.targetNumValue" controls-position="right" :step="1" placeholder="请输入值"></el-input-number>
          </el-form-item>

          <span v-if="(row.aggregationSign==='1')&&(row.arr[1]==='bt')">
            <el-form-item>
              <el-input-number v-model="row.minValue" controls-position="right" :step="1" placeholder="最小值"></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-input-number v-model="row.maxValue" controls-position="right" :step="1" placeholder="最大值"></el-input-number>
            </el-form-item>
          </span>

          <el-form-item style="width: 120px">
            <el-select v-model="row.alarmRank" placeholder="告警等级">
              <el-option v-for="item in dict['006']['dataValue']" clearable :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index===0" @click="addRow(row)" class="el-icon-circle-plus-outline"></i>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index>0" @click="delRow(row)" class="el-icon-remove-outline"></i>
          </el-form-item>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
	export default {
		name: "AddAlarmRule",
    props: ['obj', 'obj2'], // 桶内行 桶外行
    data() {
		  return {
        // 字典表
        dict: JSON.parse(localStorage.getItem('dict')),
        staticLen: JSON.parse(localStorage.getItem('dict'))['017']['dataValue'].length,
        objArr: [],
        obj2Arr: [],
        countArr: [],
        ruleForm: {
          rows: [{
            ruleName: '',
            bucketName: '',
            resultFiledName: '',
            aggregationSign: '',
            relationSign: '',
            alarmRank: null,
            targetNumValue: 1,
            targetStrValue: '',
            maxValue: 1,
            minValue: 1,
            arr: [],
          }],
        },
        rules: {
          name: [
            { ruleName: true, message: '请输入告警名称', trigger: 'blur' },
          ],
        },
      }
    },
    watch: {
      obj: {
        handler(newValue, oldValue) {
        },
        deep: true
      },
      ruleForm: {
        handler(newValue, oldValue) {
          this.$emit('alarmRule', newValue)
        },
        deep: true
      },
    },
    created() {
		  if (this.obj.aggregationBOList.length > 0) { // 分桶有行信息数据
        this.objArr = this.obj.aggregationBOList.map(d => {
          d.label = d.aggName
          d.value = d.aggName
          d.children = this.dict['018']['dataValue']
          return d
        })
      }
      if (this.obj2.length > 0) { // 桶外聚合行信息
        this.obj2Arr = this.obj2.map(d => {
          d.label = d.aggName
          d.value = d.aggName
          d.children = this.dict['018']['dataValue']
          return d
        })
      }
      this.countArr = this.dict['014']['dataValue'].concat(this.objArr).concat(this.obj2Arr)
    },
    methods: {
      addRow(row) {
        this.ruleForm.rows.push({
          ruleName: '',
          bucketName: '',
          resultFiledName: '',
          aggregationSign: '',
          relationSign: '',
          alarmRank: null,
          targetNumValue: 1,
          targetStrValue: '',
          maxValue: 1,
          minValue: 1,
          arr: [],
        })
      },
      delRow(row) {
        let index = this.ruleForm.rows.indexOf(row)
        if (index !== -1) {
          this.ruleForm.rows.splice(index, 1)
        }
      },
      // 规则下拉
      selectInner(row, index) {
        if (row.arr.length > 0) {
          this.ruleForm.rows[index].resultFiledName = row.arr[0]
          this.ruleForm.rows[index].relationSign = row.arr[1]
          this.ruleForm.rows[index].aggregationSign = '1'
          // 判断动态添加的 或dict字典中固定值
          this.dict['014']['dataValue'].forEach(d => {
            if (d.value === row.arr[0]) { // dict中有
              this.ruleForm.rows[index].aggregationSign = '0'
              return false
            }
          })
        } else {
          this.ruleForm.rows[index].resultFiledName = ''
          this.ruleForm.rows[index].relationSign = ''
          this.ruleForm.rows[index].aggregationSign = ''
        }
      },
    }
	}
</script>

<style scoped>
  .demo-ruleForm{
    margin-bottom: 20px;
  }
</style>
