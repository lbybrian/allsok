<template>
  <div class="alarmResult">
    <el-page-header @back="goBack" content="告警结果"></el-page-header>
    <alarm-list :obj="params" v-if="params.id!==''"></alarm-list>
  </div>
</template>

<script>
	import AlarmList from "@/components/AlarmList";
  export default {
		name: "AlarmResult",
    components: {AlarmList},
    data() {
		  return {
        params: {
		      id: ''
        },
      }
    },
    created() {
      this.params.id = this.$route.query.id
    },
    mounted() {},
    methods: {
      goBack() {
        this.$router.push({
          path: '/rule'
        })
      },
    }
	}
</script>

<style scoped>
  .alarmResult{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
  .alarmResult::-webkit-scrollbar {display: none;}
  .alarmResult { -ms-overflow-style: none; }
  .alarmResult { overflow: -moz-scrollbars-none; }
  .center{
    text-align: center;
  }
</style>
