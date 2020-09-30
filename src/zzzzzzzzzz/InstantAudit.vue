<template>
  <div class="instantAudit" v-loading="loading">
    <div v-if="tableData.length===0&&chartList.length===0">暂无数据</div>
    <el-row v-if="chartList.length>0">
      <el-col :span="12" v-for="(item, index) in chartList" :key="index">
        <div class="echart" :id="'echart'+index" :v-loading="'load'+index" element-loading-text="请求数据中，请稍候" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-spinner="el-icon-loading"></div>
      </el-col>
    </el-row>
    <el-row style="margin: 5px 0" v-if="tableData.length>0">
      <el-col :span="2">
        <el-button size="small" type="primary" @click="ecportFun">导出列表数据</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading2" v-if="tableData.length>0" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="softwareSign" label="软件名称">
        <template slot-scope="scope">
          <div class="tableTitle ellipsis">{{softName[scope.row.softwareSign]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="moduleSign" label="模块名称" width="200">
        <template slot-scope="scope">{{blockName[scope.row.moduleSign]}}</template>
      </el-table-column>
      <el-table-column prop="log" label="操作类型" width="120">
        <template slot-scope="scope">{{operationType[scope.row.operationType]}}</template>
      </el-table-column>
      <el-table-column prop="log" label="日志类型" width="120">
        <template slot-scope="scope">{{logType[scope.row.logType]}}</template>
      </el-table-column>
      <el-table-column prop="user" label="操作用户" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.operationUserId}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="date" sortable label="日期" width="200">
        <template slot-scope="scope">{{scope.row.operationTime}}</template>
      </el-table-column>
    </el-table>
    <div class="page center" v-if="total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage2"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import { getWordCloudColor, getPieColor } from "../assets/echartsColor"
  const Color = ['#ff4343', '#f69846', '#f6d54a', '#45dbf7', '#f69846', '#44aff0', '#4777f5', '#5045f6', '#ad46f3', '#f845f1']
  const API = '/api'
	export default {
		name: "InstantAudit",
    props: ['instantId', 'objId', 'obj'],
    data() {
		  return {
        loading: false,
        // 头部左右切换翻页
        currentPage: 1,
        pageSize: 5,
        loading2: false,
        // 列表翻页
        currentPage2: 1,
        pageSize2: 10,
        total: 0,
        tableData: [],
        // 图结果
        chartList: [],
        // 图没数据样式
        load1: false,
        params: {},
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        // 软件名称模块名下拉框联动选项
        options: JSON.parse(localStorage.getItem('dict'))['004']['dataValue'],
        softName: JSON.parse(localStorage.getItem('softName')),
        blockName: JSON.parse(localStorage.getItem('blockName')),
        logType: JSON.parse(localStorage.getItem('logType')),
        operationType: JSON.parse(localStorage.getItem('operationType')),
      }
    },
    watch: {
      instantId: {
        handler(newValue, oldValue) {
          this.instantId = newValue
          this.params.ruleId = newValue
          this.getList(this.currentPage2, this.pageSize2, this.params)
        },
        deep: true
      },
      obj: {
        handler(newValue, oldValue) {
          this.params.id = newValue.id
          this.params.url = newValue.url
          this.getList(this.currentPage2, this.pageSize2, this.params)
        },
        deep: true
      },
    },
    created() {
		  this.params.ruleId = this.objId
      this.getList(this.currentPage2, this.pageSize2, this.params)
      if (this.obj) {
        this.params.id = this.obj.id
        this.params.url = this.obj.url
        this.getList(this.currentPage2, this.pageSize2, this.params)
      }
    },
    mounted() {
    },
    methods: {
      // 自定义表格序号
      indexMethod(index) {
        return this.pageSize2*(this.currentPage2 - 1) + index + 1
      },
      // 导出列表数据
      ecportFun() {
        if (this.instantId === '') {
          return false
        }
        let url = API + '/exportLogData/exportExecuteRuleData?id=' + this.instantId
        location.href = url
      },
      getList(page, pageSize, params) {
        this.loading = true
        params.pageNum = page
        params.pageSize = pageSize
        let url = params.url || '/analyzeRule/executeAnalyzeRuleById'
        console.log(params.id)
        this.$axios.post(API + url, params).then(r => {
          let res = r.data.data
          if (res === null) {
            this.loading = false
            return false
          }
          if (res.hits!==null && res.hits.length > 0) { // 有列表数据
            this.tableData = res.hits
            this.total = res.total
          } else { // 无列表数据
            this.tableData = []
            this.total = 0
          }
          if (res.chartResultList!==null && res.chartResultList.length > 0) { // 有图表数据
            this.chartList = res.chartResultList
            setTimeout(() => {
              this.getChart(res.chartResultList)
            }, 500)
          } else {
            this.chartList = []
          }
          this.loading = false
        }).catch(e => { // 请求出错
          this.loading = false
          this.$message({
            message: '请求审计信息失败：' + e,
            type: 'warning'
          })
        })
      },
      // 每页几条
      handleSizeChange(val) {
        this.pageSize2 = val
        this.currentPage2 = 1
        this.getList(this.currentPage2, this.pageSize2, this.params)
      },

      // 当前第几页
      handleCurrentChange(val) {
        this.currentPage2 = val
        this.getList(this.currentPage2, this.pageSize2, this.params)
      },
      // 渲染图表数据
      getChart(arr) {
        arr.forEach((d, index) => {
          let dom = document.getElementById('echart' + index)
          let myChart = echarts.init(dom)
          let option = {}
          if (d.chartType === 1) { // 饼图
            if (d.chartTemplateId === 11) {
              option = {
                title: {
                  show: true,
                  text: d.chartName,
                  x: 'center',
                  y: 'top',
                  textAlign: 'center',
                  textStyle: {
                    fontFamily: 'Arial, Verdana, sans...',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontColor: '#47AFAE'
                  },
                },
                color: Color,
                tooltip : {
                  trigger: 'item',
                  formatter: "{b}({d}%)"
                },
                toolbox: {
                  show : true,
                  feature: {
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2
                    }
                  }
                },
                // legend: {
                //   type: "scroll",
                //   orient: 'vertical',
                //   left: '10%',
                //   align: 'left',
                //   top: 'middle',
                //   textStyle: {
                //     color:'#8C8C8C'
                //   },
                //   height: 150
                // },
                series : [
                  {
                    name: ' ',
                    type: 'pie',
                    radius : [0, 80],
                    label: {
                      normal: {
                        formatter: "{b}({d}%)",
                      },
                    },
                    data: d.pieDataList
                  }
                ]
              }
            } else {
              option = {
                title: {
                  show: true,
                  text: d.chartName,
                  x: 'center',
                  y: 'top',
                  textAlign: 'center',
                  textStyle: {
                    fontFamily: 'Arial, Verdana, sans...',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontColor: '#47AFAE'
                  },
                },
                color: Color,
                tooltip : {
                  trigger: 'item',
                  formatter: "{b}({d}%)"
                },
                toolbox: {
                  show : true,
                  feature: {
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2
                    }
                  }
                },
                // legend: {
                //   type: "scroll",
                //   orient: 'vertical',
                //   left: '10%',
                //   align: 'left',
                //   top: 'middle',
                //   textStyle: {
                //     color:'#8C8C8C'
                //   },
                //   height: 150
                // },
                series: [{
                  type: 'pie',
                  roseType: 'radius',
                  radius: ['30%', '60%'],
                  data: d.pieDataList,
                  label: {
                    normal: {
                      formatter: "{b}({d}%)",
                    },
                  },
                  labelLine: {
                    lineStyle: {
                      color: '#fff'
                    }
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0,0,0,0.5)'
                    }
                  }
                }]
              }
            }
          } else if (d.chartType === 2) { // 柱状图
            if (d.noPieDataMap.xDataList.length === 0) {return false}
            if (d.noPieDataMap.yDataList === null) {return false}
            let series = []
            for (let i = 0; i< d.noPieDataMap.yDataList.length; i++) {
              series.push({
                type: 'bar',
                data: d.noPieDataMap.yDataList[i].data
              })
            }
            if (d.chartTemplateId === 21) {
              option = {
                title: {
                  show: true,
                  text: d.chartName,
                  x: 'center',
                  y: 'top',
                  textAlign: 'center',
                  textStyle: {
                    fontFamily: 'Arial, Verdana, sans...',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontColor: '#47AFAE'
                  },
                },
                color: Color,
                tooltip: {
                  //提示框组件
                  trigger: 'axis',
                  formatter: function (params) {
                    var relVal = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                      relVal += '<br/>';
                      relVal += '<span style="display:inline-block;margin-right:5px;border-radius:2px;width:9px;height:9px;background-color:' + params[i].color + '"></span>';
                      relVal += params[i].seriesName + ' : ' + params[i].value;
                    }
                    return relVal;
                  },
                  axisPointer: {
                    type: 'shadow',
                  },
                  textStyle: {
                    color: '#fff',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                  },
                },
                toolbox: {
                  show : true,
                  feature: {
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2
                    }
                  }
                },
                grid: {
                  left: '10px',
                  right: '15px',
                  bottom: '30px',
                  top: '40px',
                  containLabel: true,
                },
                xAxis: [
                  {
                    type: 'category',
                    //	boundaryGap: true,//坐标轴两边留白
                    data: d.noPieDataMap.xDataList,
                    axisTick: {
                      //坐标轴刻度相关设置。
                      show: false,
                    },
                    axisLabel: {
                      interval:0,
                      rotate:40
                    },
                    axisLine: {
                      //坐标轴轴线相关设置
                      lineStyle: {
                        color: '#204C6F',
                        opacity: 0.2,
                      },
                    },
                    splitLine: {
                      //坐标轴在 grid 区域中的分隔线。
                      show: false,
                    },
                  },
                ],
                yAxis: [
                  {
                    type: 'value',
                    splitNumber: 5,
                    axisLabel: {
                      textStyle: {
                        color: '#204C6F',
                        fontStyle: 'normal',
                        fontFamily: '微软雅黑',
                        fontSize: 12,
                      },
                    },
                    axisLine: {
                      show: false,
                    },
                    axisTick: {
                      show: false,
                    },
                    splitLine: {
                      show: true,
                      lineStyle: {
                        color: ['#204C6F'],
                        opacity: 0.3,
                      },
                    },
                    boundaryGap: ['0', '20%'],
                  },
                ],
                series: series,
              }
            } else {
              option = {
                color: Color,
                title: {
                  show: true,
                  text: d.chartName,
                  x: 'center',
                  y: 'top',
                  textAlign: 'center',
                  textStyle: {
                    fontFamily: 'Arial, Verdana, sans...',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontColor: '#47AFAE'
                  },
                },
                grid: {
                  left: "4%",
                  right: "8%",
                  bottom: "10%",
                  top: "14%",
                  containLabel: true
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow"
                  },
                  textStyle: {
                    align: 'left'
                  }
                },
                toolbox: {
                  show : true,
                  feature: {
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2
                    }
                  }
                },
                xAxis: [
                  {
                    type: 'category',
                    //	boundaryGap: true,//坐标轴两边留白
                    data: d.noPieDataMap.xDataList,
                    axisTick: {
                      //坐标轴刻度相关设置。
                      show: false,
                    },
                    axisLabel: {
                      interval:0,
                      rotate:40
                    },
                    axisLine: {
                      //坐标轴轴线相关设置
                      lineStyle: {
                        color: '#204C6F',
                        opacity: 0.2,
                      },
                    },
                    splitLine: {
                      //坐标轴在 grid 区域中的分隔线。
                      show: false,
                    },
                  },
                ],
                yAxis: [{
                  type: "value",
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  },
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: "#DFDFDF",
                      fontSize: 14
                    }
                  },
                  splitLine: { //网格线
                    show: false,
                    lineStyle: {
                      color: "rgba(255,255,255,0.2)"
                    }
                  }
                }],
                series: series
              }
            }
          } else { // 折线图
            let series = []
            let series2 = []
            if (d.noPieDataMap.xDataList.length === 0) {return false}
            if (d.noPieDataMap.yDataList === null) {return false}
            for (let i = 0; i< d.noPieDataMap.yDataList.length; i++) {
              series.push({
                type: 'line',
                data: d.noPieDataMap.yDataList[i].data
              })
              series2.push({
                type: 'line',
                smooth: true,
                smoothMonotone: "x",
                cursor: "pointer",
                showSymbol: false,
                lineStyle: {
                  "shadowColor": "rgba(115,226,226,0.5)",
                  "shadowBlur": 10
                },
                data: d.noPieDataMap.yDataList[i].data
              })
            }
            if (d.chartTemplateId === 31) {
              option = {
                color:Color,
                title: {
                  show: true,
                  text: d.chartName,
                  x: 'center',
                  y: 'top',
                  textAlign: 'center',
                  textStyle: {
                    fontFamily: 'Arial, Verdana, sans...',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontColor: '#47AFAE'
                  },
                },
                legend: {
                  top: '14%',
                  data: ['500hPa', '700hPa', '850hPa', '925hPa', '地面']
                },
                toolbox: {
                  show : true,
                  feature: {
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2
                    }
                  }
                },
                tooltip: {
                  // show: true
                  trigger: 'axis',
                  axisPointer: { type: 'cross' },
                },
                grid: {
                  left: '10%',
                  right: '10%',
                  top: '20%',
                  bottom: '20%',
                  containLabel: true
                },
                xAxis: {
                  axisTick: { show: false },
                  axisLabel: {
                    interval:0,
                    rotate:40
                  },
                  axisLine: {
                    // onZero: false, // X轴脱离Y轴0刻度
                    lineStyle: { color: '#204C6F',
                      opacity: 0.2, }
                  },
                  data: d.noPieDataMap.xDataList
                },
                yAxis: {
                  name: '',
                  nameTextStyle:{
                    color: '#707070', fontSize: 14
                  },
                  axisLabel: {
                    textStyle: { color: '#707070', fontSize: 14 },
                    showMaxLabel:false
                  },
                  axisLine: {
                    symbol :['none', 'arrow'],
                    symbolOffset: [0, 4],
                    lineStyle: { color: '#707070' }
                  },
                  splitLine: { show: false },
                  boundaryGap: [0, 0.1]
                },
                series: series
              }
            } else {
              option = {
                color:Color,
                title: {
                  show: true,
                  text: d.chartName,
                  x: 'center',
                  y: 'top',
                  textAlign: 'center',
                  textStyle: {
                    fontFamily: 'Arial, Verdana, sans...',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontColor: '#47AFAE'
                  },
                },
                legend: {
                  top: '14%',
                  data: ['500hPa', '700hPa', '850hPa', '925hPa', '地面']
                },
                toolbox: {
                  show : true,
                  feature: {
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2
                    }
                  }
                },
                tooltip: {
                  // show: true
                  trigger: 'axis',
                  axisPointer: { type: 'cross' },
                },
                grid: {
                  left: '10%',
                  right: '10%',
                  top: '20%',
                  bottom: '20%',
                  containLabel: true
                },
                xAxis: {
                  axisTick: { show: false },
                  axisLabel: {
                    interval:0,
                    rotate:40
                  },
                  axisLine: {
                    // onZero: false, // X轴脱离Y轴0刻度
                    lineStyle: { color: '#204C6F',
                      opacity: 0.2, }
                  },
                  data: d.noPieDataMap.xDataList
                },
                yAxis: {
                  name: '',
                  nameTextStyle:{
                    color: '#707070', fontSize: 14
                  },
                  axisLabel: {
                    textStyle: { color: '#707070', fontSize: 14 },
                    showMaxLabel:false
                  },
                  axisLine: {
                    symbol :['none', 'arrow'],
                    symbolOffset: [0, 4],
                    lineStyle: { color: '#707070' }
                  },
                  splitLine: { show: false },
                  boundaryGap: [0, 0.1]
                },
                series: series2
              }
            }
          }
          myChart.setOption(option, true)
        })
      },
    }
	}
</script>

<style scoped>
 .instantAudit{
   height: 100%;
   overflow-y: auto;
 }
 .center{
   text-align: center;
 }
 .echart{
   width: 100%;
   height: 300px;
   background: rgba(14,238,252,0.1);
   /*background: #ffffff;*/
 }
</style>
