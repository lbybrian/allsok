<template>
  <div class="auditResult">
    <el-page-header @back="goBack" content="审计结果"></el-page-header>
    <instant-audit class="childA" :objId="params.id" v-if="cycleSign==='2'"></instant-audit>
    <cycle-audit-list class="childA" :obj="params" v-if="cycleSign==='1'"></cycle-audit-list>
  </div>
</template>

<script>
	import InstantAudit from "@/components/InstantAudit";
  import CycleAuditList from "@/components/CycleAuditList";
  export default {
		name: "AuditResult",
    components: {CycleAuditList, InstantAudit},
    data() {
      return {
        cycleSign: '',
        params: {
          id: '',
          pageNum: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.cycleSign = this.$route.query.cycleSign
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
  .auditResult{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
  .auditResult::-webkit-scrollbar {display: none;}
  .auditResult { -ms-overflow-style: none; }
  .auditResult { overflow: -moz-scrollbars-none; }
  .childA{
    overflow-x: hidden;
  }
  .childA::-webkit-scrollbar {display: none;}
  .childA { -ms-overflow-style: none; }
  .childA { overflow: -moz-scrollbars-none; }
  .center{
    text-align: center;
  }
</style>
