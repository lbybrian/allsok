<template>
  <div>
    <el-row>
      <el-col :offset="6" :span="12" class="center">
        <el-form>
          <el-form-item label="告警名称：">
            {{detail.name}}
          </el-form-item>
          <el-form-item label="告警内容：">
            {{detail.alarmCont}}
          </el-form-item>
          <el-form-item label="告警级别：">
            {{alarmRank[detail.alarmRank]}}
          </el-form-item>
          <el-form-item label="告警状态：">
            {{alarmStatus[detail.status]}}
            <el-button v-if="detail.status!=='1'&&detail.status!=='2'" type="text" size="small" @click="handleAlarm(detail)">处理</el-button>
            <el-button v-if="detail.status!=='1'&&detail.status!=='2'" type="text" size="small" @click="ignoreAlarm(detail)">忽略</el-button>
          </el-form-item>
          <el-form-item label="告警时间：">
            {{detail.alarmTime}}
          </el-form-item>
          <el-form-item label="结果名：">
            {{detail.resultFiledName}}
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const API = '/api'
	export default {
		name: "AlarmDetail",
    props: ["detail"],
    data() {
		  return {
        // 数据字典
        dict: JSON.parse(localStorage.getItem('dict')),
        // 告警级别
        alarmRank: JSON.parse(localStorage.getItem('alarmRank')),
        // 告警状态
        alarmStatus: JSON.parse(localStorage.getItem('alarmStatus')),
      }
    },
    created() {
    },
    watch: {
      detail: {
        handler(newValue, oldValue) {
        },
        deep: true
      }
    },
    methods: {
      // 处理
      handleAlarm(row) {
        this.$confirm('此操作将处理该日志, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/abnormalAlarm/updateAbnormalStatusById', {
            id: row.id,
            status: 1
          }).then(r => {
            if (r.data.code === 200) {
              this.$message({
                type: 'success',
                message: '已处理!'
              });
              this.$emit('handleChange', true)
            } else {
              this.$message({
                type: 'info',
                message: '处理失败!'
              });
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '处理报错：' + e
            });
          })
        }).catch(() => {
        });
      },
      // 忽略
      ignoreAlarm(row) {
        this.$confirm('此操作将忽略该日志, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(API + '/abnormalAlarm/updateAbnormalStatusById', {
            id: row.id,
            status: 2
          }).then(r => {
            if (r.data.code === 200) {
              this.$message({
                type: 'success',
                message: '已忽略!'
              });
              this.$emit('handleChange', true)
            } else {
              this.$message({
                type: 'info',
                message: '忽略失败!'
              });
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '忽略报错：' + e
            });
          })
        }).catch(() => {
        });
      },
    }
	}
</script>

<style scoped>
  .center{
    text-align: center;
  }
</style>
