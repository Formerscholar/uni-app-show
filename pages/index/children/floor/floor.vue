<template>
	<view class="index_floor">
		<view class="floor_group" v-for="(item, index) in floorList" :key="index">
			<!-- 标题 -->
			<view class="floor_title"><image :src="item.floor_title.image_src" mode="widthFix" /></view>
			<!-- 内容 -->
			<view class="floor_list">
				<navigator v-for="(item1, index1) in item.product_list" :key="index1">
					<image :src="item1.image_src" :mode="index1 === 0 ? 'widthFix' : 'scaleToFill'" />
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			floorList:{
				type:Array,
				value:[]
			}
		}
	}
</script>

<style lang="less" >
.index_floor {
		.floor_group {
			.floor_title{
				padding: 10rpx 0;
				image{
					width: 100%;
				}
			}
			.floor_list{
				overflow: hidden;
				navigator{
					float: left;
					width: 32.33%;
					&:nth-last-child(-n+4){
						height: 33.33vw * 386 / 232 / 2 ;
						border-left: 10rpx solid #fff;
					}
					&:nth-child(2),
					&:nth-child(3){
						border-bottom: 10rpx solid #fff;
					}
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
