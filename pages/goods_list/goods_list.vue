<template>
	<view>
	<!-- 搜索框 开始 -->
	<uni-search-bar :radius="100" @confirm="search" />
	<!-- 搜索框 结束 -->
	<!-- 内容 开始 -->
		<Tabs :tabs="tabs" ></Tabs>
	<!-- 内容 结束 -->
	</view>
</template>	

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import Tabs from '@/components/Tabs/Tabs.vue';
	
	export default {
		data() {
			return {
				tabs:[
					{
						id:0,
						value:'综合',
						isActive:true
					},
					{
						id:1,
						value:'销量',
						isActive:false
					},
					{
						id:2,
						value:'价格',
						isActive:false
					}
				]
			};
		},
		components:{
			uniSearchBar,
			Tabs
		},
		onLoad(options) {
			console.log(options)
		},
		methods:{
			
		}
		
	}
</script>

<style lang="less">

</style>
