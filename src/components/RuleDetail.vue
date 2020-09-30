<template>
  <div class="all">
    <el-row>
      <el-col :offset="6" :span="12" class="center">
        <el-form>
          <el-form-item label="规则名称：">
            {{detail.name}}
          </el-form-item>
          <el-form-item label="规则描述：">
            {{detail.ruleDesc}}
          </el-form-item>
          <el-form-item label="规则类型：">
            {{ruleType[detail.type]}}
          </el-form-item>

          <el-form-item label="规则状态：">
            {{ruleStatus[detail.status]}}
            <el-button v-if="detail.status!=='1'&&detail.status==='2'" @click="startRule(detail)" type="text" size="small">启用</el-button>
            <el-button v-if="detail.status==='1'&&detail.status!=='2'" @click="stopRule(detail)" type="text" size="small">停用</el-button>
          </el-form-item>

          <el-form-item label="统计类型：">
            {{cycleSign[detail.cycleSign]}}
          </el-form-item>
          <!-- 周期统计数据 -->
            <el-form-item label="周期统计数据表：" v-if="detail.cycleSign==='1'&&detail.cycleStatTastDetail">
              <el-table :data="cycleStatTastDetail" style="width: 100%">
                <el-table-column prop="cycleUnit" label="周期单位" width="120" key="t1">
                </el-table-column>
                <el-table-column prop="cycleNum" label="周期数" width="120" key="t2">
                </el-table-column>
                <el-table-column prop='executeNum' label="已执行次数" width="120" key="t3">
                </el-table-column>
                <!-- <el-table-column prop='executeTime' label="执行时间" width="165" key="t4">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="165" key="t5">
                </el-table-column> -->
                <el-table-column prop='startTime' label="开始时间" width="165" key="t6">
                </el-table-column>
                <el-table-column prop='endTime' label="结束时间" width="165" key="t7">
                </el-table-column>
              </el-table>
            </el-form-item>
          <!-- 及时统计数据 -->
          <el-card v-else-if="detail.cycleSign==='2'&&detail.cycleStatTastDetail===null">
            <el-form-item label="时间范围标识：">
              {{detail.queryRuleJson.timeRangeSign?timeRangeSign[detail.queryRuleJson.timeRangeSign]:'暂无数据'}}
            </el-form-item>
            <!-- <el-form-item label="结果集：">
              {{detail.queryRuleJson.resultList?detail.queryRuleJson.resultList:'暂无数据'}}
            </el-form-item> -->
            <!-- <el-form-item label="排序字段：">
              {{detail.queryRuleJson.sort?detail.queryRuleJson.sort:'暂无数据'}}
            </el-form-item>
            <el-form-item label="排序方向：">
              {{detail.queryRuleJson.direction?detail.queryRuleJson.direction:'暂无数据'}}
            </el-form-item> -->
            <!-- <el-form-item label="分页页数：">
              {{detail.queryRuleJson.page?detail.queryRuleJson.page:'暂无数据'}}
            </el-form-item>
            <el-form-item label="当前页数：">
              {{detail.queryRuleJson.size?detail.queryRuleJson.size:'暂无数据'}}
            </el-form-item>
            <el-form-item label="返回数据的数量限制：">
              {{detail.queryRuleJson.sizeLimit?detail.queryRuleJson.sizeLimit:'暂无数据'}}
            </el-form-item> -->
          </el-card>

          <!-- 分桶信息表 -->
          <el-card class="box-card" v-if="detail.queryRuleJson.bucketBO">
            <div slot="header" class="clearfix">
              <span>分桶信息</span>
            </div>
            <el-form>
              <el-form-item label="桶名称：">
                {{detail.queryRuleJson.bucketBO.bucketName}}
              </el-form-item>
              <el-form-item label="字段名：" v-for="dc in dict['011'].dataValue" v-if="detail.queryRuleJson.bucketBO.fieldName===dc.value">
                {{dc.label}}
              </el-form-item>
              <el-form-item label="桶类型：" v-for="dc in dict['019'].dataValue" v-if="detail.queryRuleJson.bucketBO.type===dc.value">
                {{dc.label}}
              </el-form-item>
              <el-form-item label="时间桶类型：" v-if="detail.queryRuleJson.bucketBO.type==='date'">
                {{detail.queryRuleJson.bucketBO.dateType?detail.queryRuleJson.bucketBO.dateType:"暂无数据"}}
              </el-form-item>
              <el-form-item label="时间格式：" v-if="detail.queryRuleJson.bucketBO.type==='date'">
                {{detail.queryRuleJson.bucketBO.format?detail.queryRuleJson.bucketBO.format:'暂无数据'}}
              </el-form-item>

              <el-card class="box-card" v-for="item in detail.queryRuleJson.bucketBO.aggregationBOList">
                <div slot="header" class="clearfix">
                  <span>桶内聚合</span>
                </div>
                <el-form>
                  <el-form-item label="聚合名称：">
                    {{item.aggName?item.aggName:'暂无数据'}}
                  </el-form-item>
                  <el-form-item label="字段名：" v-for="dc in dict['012'].dataValue" v-if="item.fieldName===dc.value">
                    <!-- {{item.fieldName?item.fieldName:'暂无数据'}} -->
                    {{dc.label}}
                  </el-form-item>
                  <el-form-item label="聚合标识：" v-for="dcx in dict['013'].dataValue" v-if="item.aggSign===dcx.value">
                    <!-- {{item.aggSign?item.aggSign:'暂无数据'}} -->
                    {{dcx.label}}
                  </el-form-item>
                </el-form>
              </el-card>
            </el-form>
          </el-card>
          <!-- 桶外聚合信息 -->
          <el-card class="box-card" v-if="detail.queryRuleJson.aggOutList">
            <!-- 空数据不显示 -->
            <div slot="header" class="clearfix" v-for="item in detail.queryRuleJson.aggOutList">
              <span>桶外聚合</span>
              <el-form>
                <el-form-item label="聚合名称：">
                  {{item.aggName?item.aggName:'暂无数据'}}
                </el-form-item>
                <el-form-item label="字段名：" v-for="dc in dict['012'].dataValue" v-if="item.fieldName===dc.value">
                  <!-- {{item.fieldName?item.fieldName:'暂无数据'}} -->
                  {{dc.label}}
                </el-form-item>
                <el-form-item label="聚合标识：" v-for="dcx in dict['013'].dataValue" v-if="item.aggSign===dcx.value">
                  <!-- {{item.aggSign?item.aggSign:'暂无数据'}} -->
                  {{dcx.label}}
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <!-- 逻辑列表 -->
          <el-card>
            <span style="float: left;">逻辑列表:</span><br />
            <el-card v-for="(item,index) in detail.queryRuleJson.queryANDList" v-if="item.fieldName">
              <div slot="header" class="clearfix">
                <span>逻辑与列表{{++index}}</span><br />
                <el-form-item label="字段名：">
                  {{item.fieldName}}
                </el-form-item>
                <el-form-item label="关系标识：" v-for="bs in dict['018']['dataValue']" v-if="bs.value===item.relationSign">
                  {{bs.label}}
                </el-form-item>
                <el-form-item label="目标值：" v-if="item.fieldName==='systemSign'">
                  {{systemSign[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else-if="item.fieldName==='logType'">
                  {{logType[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else-if="item.fieldName==='moduleSign'">
                  {{blockName[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else-if="item.fieldName==='softwareSign'">
                  {{softName[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else>
                  {{operationType[item.targetValue]}}
                </el-form-item>
                <el-form-item label="最大值：" v-if="item.relationSign==='bt'">
                  {{item.maxValue}}
                </el-form-item>
                <el-form-item label="最小值：" v-if="item.relationSign==='bt'">
                  {{item.minValue}}
                </el-form-item>
              </div>
            </el-card>

            <el-card v-for="(item,index) in detail.queryRuleJson.queryORList" v-if="">
              <div slot="header" class="clearfix" v-for="(item,index) in detail.queryRuleJson.queryORList" v-if="item.fieldName">
                <span>逻辑或列表{{++index}}</span><br />
                <el-form-item label="字段名：">
                  {{item.fieldName}}
                </el-form-item>
                <el-form-item label="关系标识：" v-for="bs in dict['018']['dataValue']" v-if="bs.value===item.relationSign">
                  {{bs.label}}
                </el-form-item>
                <el-form-item label="目标值：" v-if="item.fieldName==='systemSign'">
                  {{systemSign[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else-if="item.fieldName==='logType'">
                  {{logType[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else-if="item.fieldName==='moduleSign'">
                  {{blockName[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else-if="item.fieldName==='softwareSign'">
                  {{softName[item.targetValue]}}
                </el-form-item>
                <el-form-item label="目标值：" v-else>
                  {{operationType[item.targetValue]}}
                </el-form-item>
                <el-form-item label="最大值：" v-if="item.relationSign==='bt'">
                  {{item.maxValue}}
                </el-form-item>
                <el-form-item label="最小值：" v-if="item.relationSign==='bt'">
                  {{item.minValue}}
                </el-form-item>
              </div>
            </el-card>

          </el-card>
        </el-form>



        <!-- 异常告警规则详情 -->
        <el-card>
          <span style="float: left;">异常告警规则详情:</span><br />
          <el-card class="box-card" v-for="(item,index) in detail.aardList" v-if="detail.aardList.length>1">
            <div slot="header" class="clearfix" >
              <span>异常告警规则详情单{{++index}}</span><br />
              <el-form>
                <el-form-item label="规则名称：">
                  {{item.ruleName?item.ruleName:'暂无数据'}}
                </el-form-item>
                <el-form-item label="规则描述：" v-if="item.ruleDesc!==null">
                  {{item.ruleDesc?item.ruleDesc:'暂无数据'}}
                </el-form-item>
                <el-form-item label="桶名称：" v-if="item.bucketName">
                  {{item.bucketName}}
                </el-form-item>
                <el-form-item label="结果集字段名称：">
                  {{item.resultFiledName?item.resultFiledName:'暂无数据'}}
                </el-form-item>
                <el-form-item label="聚合标识：">
                  {{item.aggregationSign==='1'?'聚合类型':'非聚合类型'}}
                </el-form-item>
                <el-form-item label="比较关系标识：" v-for="bj in dict['018']['dataValue']" v-if="bj.value===item.relationSign">
                  {{bj.label}}
                </el-form-item>
                <el-form-item label="告警级别：">
                  {{alarmRank[item.alarmRank]}}
                </el-form-item>
                <el-form-item label="字符类目标值：">
                  {{item.targetStrValue?item.targetStrValue:"暂无数据"}}
                </el-form-item>
                <el-form-item label="数字类目标值：">
                  {{item.targetNumValue?item.targetNumValue:'暂无数据'}}
                </el-form-item>
                <el-form-item label="最大值：">
                  {{item.maxValue?item.maxValue:'暂无数据'}}
                </el-form-item>
                <el-form-item label="最小值：">
                  {{item.minValue?item.minValue:'暂无数据'}}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ruleStatus[detail.status]}}
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-card>

        <!-- 图文模板映射列表 -->
        <el-card class="box-card ">
          <!-- <div id="csEcharts" style="width: 600px;height:400px;">显示图表Echarts</div> -->
          <el-form v-if="detail.arctList.length>0" v-for="item in detail.arctList">
            <el-form-item label="图类型：">
              {{item.chartType?item.chartType:'暂无数据'}}
            </el-form-item>
            <el-form-item label="图表名称：">
              {{item.chartName?item.chartName:'暂无数据'}}
            </el-form-item>
            <el-form-item label="x轴：">
              {{item.xaxis?item.xaxis:'暂无数据'}}
            </el-form-item>
            <el-form-item label="y轴：">
              {{item.yaxisArr?item.yaxisArr:'暂无数据'}}
            </el-form-item>
          </el-form>
        </el-card>


      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "RuleDetail",
    props: ['detail', 'startRule', 'stopRule', 'ruleType', 'dict', 'ruleStatus', 'alarmRank', 'cycleSign', 'xq'],
    data() {
      let tData = {
        // 数据字典
        systemSign: JSON.parse(localStorage.getItem('systemSign')),
        operationType: JSON.parse(localStorage.getItem('operationType')),
        logType: JSON.parse(localStorage.getItem('logType')),
        timeRangeSign: JSON.parse(localStorage.getItem('timeRangeSign')),
        blockName: JSON.parse(localStorage.getItem('blockName')),
        softName: JSON.parse(localStorage.getItem('softName')),
        cycleStatTastDetail: []
      };
      if (this.detail && this.detail.cycleStatTastDetail) {
        tData.cycleStatTastDetail = [{
          startTime: this.detail.cycleStatTastDetail.startTime ? this.detail.cycleStatTastDetail.startTime : '暂无数据',
          createTime: this.detail.cycleStatTastDetail.createTime ? this.detail.cycleStatTastDetail.createTime : '暂无数据',
          endTime: this.detail.cycleStatTastDetail.endTime ? this.detail.cycleStatTastDetail.endTime : '暂无数据',
          executeTime: this.detail.cycleStatTastDetail.executeTime ? this.detail.cycleStatTastDetail.executeTime : '暂无数据',
          cycleNum: this.detail.cycleStatTastDetail.cycleNum ? this.detail.cycleStatTastDetail.cycleNum : '暂无数据',
          executeNum: this.detail.cycleStatTastDetail.executeNum ? this.detail.cycleStatTastDetail.executeNum : '暂无数据',
          cycleUnit: this.detail.cycleStatTastDetail.cycleUnit ? this.detail.cycleStatTastDetail.cycleUnit : '暂无数据',
        }]
      }
      return tData;
    },
    created() {},
    mounted() {
      // console.log(this.$props.dict['012'].dataValue)
    },
    watch: {
      detail: {
        handler(newValue, oldValue) {
          console.log(this.detail)
        },
        status,
        deep: true,
        immediate: true,
      },
    },
    methods: {}
  }
</script>

<style scoped>
  .center {
    text-align:center;
    /* min-width: 1000px; */
  }

/* .el-form{
  min-width: 860px;
}
.el-table{
  float: left;
}
.el-table-column{
  margin: 10px;
} */
</style>
