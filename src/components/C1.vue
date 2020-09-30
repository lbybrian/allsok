<template>
	<div>
		C1孩子：
		{{$props}}<br />
		<input type="button" value="使用父级方法" @click="$listeners.change" /><br />
		{{$attrs}}<br />
		拿取父级数据:{{data1.name}}{{this.$parent.data2}}<br />
		<input type="button" value="我是儿子,点我用孙子的方法看数据" @click="getChildrenDatas"/>
		<!-- <p>拿取儿子数据:{{this.$children[0].sun2}}<br /></p> -->
		<p>拿取儿子数据:{{this.$refs.sun2}}<br /></p>
		<!-- <template solt-scope="ss">{{ss}}</template> -->
		<Sone v-bind="$props" @coneChange="coneChange" ref="Sunze"></Sone><br />
	</div>
</template>

<script>
	import Sone from '@/components/S1.vue'
	export default{
		name:'C1',
		data(){
			return{
				
			}
		},
		props:['data1'],
		components:{
			Sone
		},
		watch:{
			data1:{
				handler(newValue, oldValue) {
				  console.log(this.data1)
				},
				deep: true,
				// immediate: true,
			}
		},
		methods:{
			coneChange(){
				this.$listeners.change()
			},
			getChildrenDatas(){
				console.log('this.$children.sun1',this.$children[0].sun1)
			}
		},
		mounted() {
			// console.log('C1-this.$attrs:',this.$attrs)
			// console.log('C1-$refs:',this.$refs.Sunze.sun3)
		}
	}
</script>

<style>
</style>
