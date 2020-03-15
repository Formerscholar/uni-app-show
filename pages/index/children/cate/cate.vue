<template>
		<view class="index_cate">
			<navigator v-for="(item, index) in cateList" :key="index"><image :src="item.image_src" mode="widthFix"></image></navigator>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			cateList:{
				type:Array,
				value:[]
			}
		}
	}
</script>

<style lang="less" scoped>
.index_cate {
		display: flex;
		navigator {
			flex: 1;
			padding: 20rpx;
			image {
				width: 100%;
			}
		}
	}
</style>
