<template>
	<view class="pyg_index">
		<!-- 搜索框 开始 -->
		<uni-search-bar :radius="100" @confirm="search" />
		<!-- 搜索框 结束 -->
		<!-- 轮播图 开始  #eb4450-->
		<swiper indicator-dots autoplay circular interval="1500" duration="500" indicator-active-color="#eb4450">
			<swiper-item v-for="(item, index) in swiperList" :key="index"><image :src="item.image_src" mode="widthFix" /></swiper-item>
		</swiper>
		<!-- 轮播图 结束 -->
		<!-- 导航 开始 -->
		<cate :cateList="cateList" />
		<!-- 导航 结束 -->
		<!-- 楼层 开始 -->
		<floor :floorList="floorList" />
		<!-- 楼层 结束 -->
	</view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import cate from './children/cate/cate.vue';
import floor from './children/floor/floor.vue';

export default {
	data() {
		return {
			//轮播图数组
			swiperList: [],
			// 导航数组
			cateList: [],
			// 楼层数据
			floorList: []
		};
	},
	components: {
		uniSearchBar,
		cate,
		floor
	},
	onLoad() {
		// 发送异步请求，获取轮播数据
		this.getswiperList();
		this.getCateList();
		this.getFloorList();
	},
	methods: {
		search() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		// 获取轮播数据
		async getswiperList() {
			const res = await this.$http({
				url: '/home/swiperdata'
			});
			this.swiperList = res.data.message;
		},
		// 获取导航数据
		async getCateList() {
			const res = await this.$http({
				url: '/home/catitems'
			});
			this.cateList = res.data.message;
		},
		// 获取楼层数据
		async getFloorList() {
			const res = await this.$http({
				url: '/home/floordata'
			});
			this.floorList = res.data.message;
		}
	}
};
</script>

<style lang="less">
swiper {
	width: 750rpx;
	height: 340rpx;
	image {
		width: 100%;
	}
}
</style>
