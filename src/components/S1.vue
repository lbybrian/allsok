<template>
	<div>
		<hr />
		S1 孙子:
		{{$props.data1.name}}<br />
		<input type="button" value="测试间接祖籍方法" @click="$listeners.coneChange" /><br />
		<input type="button" value="测试直接父级方法" @click="$parent.coneChange" /><br />
		<input type="button" value="显示我的数据" @click="showDatas" /><br />
		看看我的根<p>{{this.$root[0]}}</p><br />
	</div>
</template>

<script>
	export default{
		name:'S1',
		data(){
			return{
				sun1:'这是孙子的数据1',
				sun2:'这是孙子的数据2',
				sun3:'这是孙子的数据3',
			}
		},
		props:['data1'],
		methods:{
			showDatas(){
				console.log(this.sun1,this.sun2,this.sun3)
			},
			myDatas(){
				
			}
		}
	}
</script>

<style>
</style>
