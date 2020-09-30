<template>
	<div>
		DATAS:
		<!-- <router-link to="/cs/rule">Rule</router-link> | -->
		<p><b>data1数据</b>{{data1}}</p>
		<h4>{{data2}}</h4>
		<p><b>data3数据</b>{{data3}}</p>
		<!-- <transition
			mode="out-in"
			@before-enter="beforeEnter"
			@enter="enter"
			@before-leave="beforeLeave"
			@leave="leave"
			:css="false">
		</transition> -->
		<hr />
		<Cone :data1="data1" date2="data2" hehe="这又是什么玩意" @change="change"></Cone>
		<Ctwo :obj="obj"></Ctwo>
		<!-- <Rule ></Rule> -->
		<!-- <keey-alive>
			<router-view></router-view>
		</keey-alive> -->
	</div>
</template>

<script>
	import Cone from '@/components/C1.vue' 
	import Ctwo from '@/components/C2.vue' 
	// import Rule from '@/components/Rule.vue' 
	
	export default{
		name:'cs',
		data(){
			return{
				obj:{},
				
				data1:{
					name:'我是你祖宗!!!',
					age:131,
					hobby:'adoihadn'
				},
				data2:'我是data22222数据',
				data3:'我是data33333数据',
				api:'/api'
			}
		},
		components:{
			Cone,
			Ctwo,
			// Rule
		},
		methods:{
			change(){
				console.log('这个是CS-change函数')
			},
			audit(pageNum,pageSize,params){
				params.pageNum=pageNum;
				params.pageSize=pageSize;
				// this.$axios.get(this.api+'/exportLogData/exportCycleStatResultData?id=65').then(res=>{
				this.$axios.get(this.api+'/analyzeRule/getAnalyzePageList'+obj).then(res=>{
					console.log('csssssssssss:',res)
				})
			}
		},
		created(){
			this.audit()
		},
		mounted() {
			// console.log('CS看根',this.$root,this);
			
		}
	}
</script>

<style>
</style>
