<template>
  <div class="config">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><span style="color: #F56C6C">*&nbsp;</span>&nbsp;配置条件规则</span>
      </div>
      <el-form :inline="true" size="small" :model="ruleForm" :rules="rules" class="demo-form-inline">
        <el-row>
          <el-col :span="24">
            <el-form-item label="时间范围" prop="timeRangeSign">
              <el-select v-model="ruleForm.timeRangeSign" clearable :disabled="cxTime" @change="cxTimeSelect" placeholder="选择时间范围">
                <el-option v-for="item in dict['015']['dataValue']" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="自定义" prop="showTime">
              <el-date-picker v-model="ruleForm.showTime" :disabled="diyTime" @change="cxDiyTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-for="(row, index) in ruleForm.queryANDList" >
          <el-form-item :label="index===0?'与':' '" prop="and">
            <el-cascader v-model="ruleForm.and" style="min-width: 400px" :options="dict['010']['dataValue']" collapse-tags @change="cxAndSelect(row.and, index)" clearable placeholder="选择字段与关系"></el-cascader>
          </el-form-item>
          <el-form-item :required="true" v-if="row.and[0]&&(row.and[0]==='operationUserId'||row.and[0]==='operationDesc'||row.and[0]==='logCont')">
            <el-input v-model="row.targetValue" @change="andInputChange" placeholder="请输入值"></el-input>
          </el-form-item>

          <el-form-item>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index===0" @click="addAnd(row)" class="el-icon-circle-plus-outline"></i>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index>0" @click="delAnd(row)" class="el-icon-remove-outline"></i>
          </el-form-item>
        </div>

        <div v-for="(row, index) in ruleForm.queryORList">
          <el-form-item :label="index===0?'或':' '" prop="or">
            <el-cascader v-model="ruleForm.or" style="min-width: 400px" :options="dict['010']['dataValue']" collapse-tags @change="cxOrSelect(row.or, index)" clearable placeholder="选择字段与关系"></el-cascader>
          </el-form-item>

          <el-form-item :required="true" v-if="row.or[0]&&(row.or[0]==='operationUserId'||row.or[0]==='operationDesc'||row.or[0]==='logCont')">
            <el-input v-model="row.targetValue" @change="orInputChange" placeholder="请输入值"></el-input>
          </el-form-item>
          <el-form-item>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index===0" @click="addOr(row)" class="el-icon-circle-plus-outline"></i>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index>0" @click="delOr(row)" class="el-icon-remove-outline"></i>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>配置分桶</span>
      </div>
      <el-form :inline="true" size="small" :model="ruleForm.bucketBO" class="demo-form-inline">
        <div>
          <el-form-item label="分 桶">
            <el-select v-model="ruleForm.bucketBO.typ" clearable @change="selectBucket" placeholder="选择字段">
              <el-option v-for="item in dict['011']['dataValue']" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="桶别名">
            <el-input v-model="ruleForm.bucketBO.bucketName" placeholder="请输入桶别名"></el-input>
          </el-form-item>

          <el-form-item label="时间类型" v-if="ruleForm.bucketBO.type==='date'">
            <el-select v-model="ruleForm.bucketBO.dateType" clearable placeholder="时间类型">
              <el-option v-for="item in dict['017']['dataValue']" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-for="(row, index) in ruleForm.bucketBO.aggregationBOList">
          <el-form-item :label="index===0?'桶内聚合':' '">
            <el-cascader v-model="row.arr" style="min-width: 400px" @change="selectInner(row, index)" :options="dict['012']['dataValue']" collapse-tags clearable placeholder="选择字段与标识"></el-cascader>
          </el-form-item>

          <el-form-item >
            <el-input v-model="row.aggName" placeholder="聚合名称"></el-input>
          </el-form-item>

          <el-form-item>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index===0" @click="addInner(row)" class="el-icon-circle-plus-outline"></i>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index>0" @click="delInner(row)" class="el-icon-remove-outline"></i>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>配置聚合</span>
      </div>
      <el-form :inline="true" size="small" :model="ruleForm.obj" class="demo-form-inline">
        <div v-for="(row, index) in ruleForm.aggOutList">
          <el-form-item :label="index===0?'桶外聚合':' '">
            <el-cascader v-model="row.arr" style="min-width: 400px" @change="selectOuter(row, index)" :options="dict['012']['dataValue']" collapse-tags clearable placeholder="选择字段与标识"></el-cascader>
          </el-form-item>

          <el-form-item >
            <el-input v-model="row.aggName" placeholder="聚合名称"></el-input>
          </el-form-item>

          <el-form-item>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index===0" @click="addOuter(row)" class="el-icon-circle-plus-outline"></i>
            <i style="font-size: 32px;color:#C0C4CC;" v-if="index>0" @click="delOuter(row)" class="el-icon-remove-outline"></i>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
	export default {
		name: "Configuration",
    data() {
      return {
        // 字典表
        dict: JSON.parse(localStorage.getItem('dict')),
        // 时间下拉和自定义二选一
        cxTime: false,
        diyTime: false,
        // 规则配置表单
        ruleForm: {
          // 时间范围下拉
          timeRangeSign:JSON.parse(localStorage.getItem('timeRangeSign'))?JSON.parse(localStorage.getItem('timeRangeSign')):'',
          // 自定义时间范围
          showTime: [],
          startTime: '',
          endTime: '',
          //逻辑与或空值判断
          andor:[],
          // 逻辑与
          queryANDList: [{
            fieldName: '',
            relationSign: '',
            targetValue: '',
            and: []
          }],
          // 逻辑或
          queryORList: [{
            fieldName: '',
            relationSign: '',
            targetValue: '',
            or: []
          }],
          // 分桶
          bucketBO: {
            fieldName: '',
            bucketName: '',
            typ: '',
            type: '',
            dateType: '',
            aggregationBOList: [{
              fieldName: '',
              aggName: '',
              aggSign: '',
              arr: [],
            }]
          },
          // 桶外聚合
          aggOutList: [{
            fieldName: '',
            aggName: '',
            aggSign: '',
            arr: [],
          }],
          obj: {},
        },
        rules: {
          timeRangeSign:{ required: true, message: '请选择时间范围', trigger:['blur','change'] },
          showTime:{ required: true, message: '请选择时间范围', trigger:['blur','change'] },
          and:{ required: true, message: '与或至少填一项', trigger:'blur' },
          or:{ required: true, message: '与或至少填一项', trigger:'blur' },
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
      }
    },
    watch:{
      ruleForm:{
        handler(newVal){
          if (newVal.showTime !== null && newVal.showTime.length > 0) {
            newVal.startTime = this.moment(newVal.showTime[0]).format("YYYY-MM-DD HH:mm:ss")
            newVal.endTime = this.moment(newVal.showTime[1]).format("YYYY-MM-DD HH:mm:ss")
          } else {
            newVal.startTime = ''
            newVal.endTime = ''
          }
          this.$emit('config', newVal)
        },
        deep: true,
      }
    },
    created() {
    },
    methods: {
		  // 时间下拉
      cxTimeSelect(val) {
        if (val !== '') {
          this.diyTime = true
          this.ruleForm.startTime = ''
          this.ruleForm.endTime = ''
        } else {
          this.diyTime = false
        }
      },
      // 自定义事件
      cxDiyTime(val) {
        if (val !== null) {
          this.cxTime = true
          this.ruleForm.timeRangeSign = ' '
        } else {
          this.cxTime = false
        }
      },
		  // 逻辑与下拉改变
      cxAndSelect(arr, index) {
        this.rules.and===null;
        if (arr.length > 0) {
          if (arr[0]==='operationUserId'||arr[0]==='operationDesc'||arr[0]==='logCont') { // 二级
            this.ruleForm.queryANDList[index].fieldName = arr[0] ? arr[0]: ''
            this.ruleForm.queryANDList[index].relationSign = arr[1] ? arr[1] : ''
            // this.ruleForm.queryANDList[index].targetValue =
          } else { // 三级
            this.ruleForm.queryANDList[index].fieldName = arr[0] ? arr[0]: ''
            this.ruleForm.queryANDList[index].relationSign = arr[1] ? arr[1] : ''
            this.ruleForm.queryANDList[index].targetValue = arr[2] ? arr[2] : ''
          }
        } else {
          this.ruleForm.queryANDList[index].targetValue = ''
        }
        // console.log(this.ruleForm.queryANDList)
        console.log(this.rules)
      },
      // 逻辑或下拉改变
      cxOrSelect(arr, index) {
        this.rules.or===null;
        if (arr.length > 0) {
          if (arr[0]==='operationUserId'||arr[0]==='operationDesc'||arr[0]==='logCont') { // 二级
            this.ruleForm.queryORList[index].fieldName = arr[0] ? arr[0]: ''
            this.ruleForm.queryORList[index].relationSign = arr[1] ? arr[1] : ''
          } else { // 三级
            this.ruleForm.queryORList[index].fieldName = arr[0] ? arr[0]: ''
            this.ruleForm.queryORList[index].relationSign = arr[1] ? arr[1] : ''
            this.ruleForm.queryORList[index].targetValue = arr[2] ? arr[2] : ''
          }
        } else {
          this.ruleForm.queryORList[index].targetValue = ''
        }
        // console.log(this.ruleForm.queryORList)
        console.log(this.rules)
      },
      // 添加逻辑与行
      addAnd(row) {
        this.ruleForm.queryANDList.push({
          fieldName: '',
          relationSign: '',
          targetValue: '',
          and: [],
        })
      },
      // 删除逻辑与行
      delAnd(row) {
        let index = this.ruleForm.queryANDList.indexOf(row)
        if (index !== -1) {
          this.ruleForm.queryANDList.splice(index, 1)
        }
      },
      // 逻辑与input变化必填
      andInputChange(val) {
        console.log(val)
      },
      // 逻辑或input变化必填
      orInputChange(val) {
        console.log(val)
      },
      // 添加逻辑或行
      addOr(row) {
        this.ruleForm.queryORList.push({
          fieldName: '',
          relationSign: '',
          targetValue: '',
          or: [],
        })
      },
      // 删除逻辑或行
      delOr(row) {
        let index = this.ruleForm.queryORList.indexOf(row)
        if (index !== -1) {
          this.ruleForm.queryORList.splice(index, 1)
        }
      },
      // 选择分桶下拉时，设置桶别名
      selectBucket(val) {
        val !== '' ? this.ruleForm.bucketBO.bucketName = val : this.ruleForm.bucketBO.bucketName = ''
        if (val === 'collectTime' || val === 'operationTime') {
          this.ruleForm.bucketBO.type = 'date'
        } else {
          this.ruleForm.bucketBO.type = 'normal'
        }
        this.ruleForm.bucketBO.fieldName = this.ruleForm.bucketBO.typ
      },
      // 选择桶内聚合下拉
      selectInner(row, index) {
        if (row.arr.length > 0) {
          this.ruleForm.bucketBO.aggregationBOList[index].fieldName = row.arr[0]
          this.ruleForm.bucketBO.aggregationBOList[index].aggSign = row.arr[1]
          this.ruleForm.bucketBO.aggregationBOList[index].aggName = row.arr[0] + row.arr[1] + index
        } else {
          this.ruleForm.bucketBO.aggregationBOList[index].fieldName = ''
          this.ruleForm.bucketBO.aggregationBOList[index].aggSign = ''
          this.ruleForm.bucketBO.aggregationBOList[index].aggName = ''
        }
      },
      // 添加桶内行
      addInner(row) {
        this.ruleForm.bucketBO.aggregationBOList.push({
          fieldName: '',
          aggName: '',
          aggSign: '',
          arr: [],
        })
      },
      // 删除桶内行
      delInner(row) {
        let index = this.ruleForm.bucketBO.aggregationBOList.indexOf(row)
        if (index !== -1) {
          this.ruleForm.bucketBO.aggregationBOList.splice(index, 1)
        }
      },
      // 选择桶外聚合下拉
      selectOuter(row, index) {
        if (row.arr.length > 0) {
          this.ruleForm.aggOutList[index].fieldName = row.arr[0]
          this.ruleForm.aggOutList[index].aggSign = row.arr[1]
          this.ruleForm.aggOutList[index].aggName = row.arr[0] + row.arr[1] + index
        } else {
          this.ruleForm.aggOutList[index].fieldName = ''
          this.ruleForm.aggOutList[index].aggSign = ''
          this.ruleForm.aggOutList[index].aggName = ''
        }
      },
      // 添加桶外行
      addOuter(row) {
        this.ruleForm.aggOutList.push({
          fieldName: '',
          aggName: '',
          aggSign: '',
          arr: [],
        })
      },
      // 删除桶外行
      delOuter(row) {
        let index = this.ruleForm.aggOutList.indexOf(row)
        if (index !== -1) {
          this.ruleForm.aggOutList.splice(index, 1)
        }
      },

    }
	}
</script>

<style scoped>
  .box-card{
    margin-bottom: 10px;
  }
  .el-card__header{
    padding: 2px 20px;
  }
</style>
