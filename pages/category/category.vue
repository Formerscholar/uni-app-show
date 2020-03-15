<template>
	<view class="cates">
		<!-- 搜索框 开始 -->
		<uni-search-bar :radius="100" @confirm="search" />
		<!-- 搜索框 结束 -->
		<view class="cates_container">
			<!-- 左侧菜单 -->
			<scroll-view scroll-y class="left_menu">
				<view :class="index === currentIndex ? 'menu_item active' : 'menu_item'" v-for="(item, index) in leftMenuList" :key="index" @click="handleItemTap(index)">{{ item }}</view>
			</scroll-view>
			<!-- 右侧商品 -->
			<scroll-view scroll-y class="right_content" :scroll-top="scrolltop" >
				<view class="goods_group" v-for="(item, index) in rightContent" :key="index">
					<view class="goods_title">
						<text class="delimiter">/</text>
						<text class="title">{{ item.cat_name }}</text>
						<text class="delimiter">/</text>
					</view>
					<view class="goods_list">
						<navigator :url="'../goods_list/goods_list?cid='+item1.cat_id" v-for="(item1, index1) in item.children" :key="index1">
							<image :src="item1.cat_icon" mode="widthFix" />
							<view class="goods_name">{{ item1.cat_name }}</view>
						</navigator>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';

export default {
	data() {
		return {
			// 总数据
			Cates: [],
			// 左侧菜单数据
			leftMenuList: [],
			// 右侧商品数据
			rightContent: [],
			// 被点击的左侧菜单
			currentIndex: 0,
			// 右侧内容滚动距离顶部的距离
			scrolltop: 0
		};
	},
	components:{
		uniSearchBar
	},
	onLoad() {
		// 获取本地存储数据
		const Cates = uni.getStorageSync('cates');
		if (!Cates) {
			// 不存在数据 发送请求
			this.getCates();
		} else {
			// 有旧数据 判断是否过期
			if (Date.now() - Cates.time > 1000 * 600) {
				this.getCates();
			} else {
				// 可以使用旧数据
				this.Cates = Cates.data;
				// 构造左侧菜单数据
				this.leftMenuList = this.Cates.map(v => v.cat_name);
				// 构造右侧商品数据
				this.rightContent = this.Cates[0].children;
			}
		}
	},
	methods: {
		search() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		async getCates() {
			const res = await this.$http({
				url: '/categories'
			});
			this.Cates = res.data.message;
			// 把数据存储到本地存储中
			uni.setStorageSync('cates', {
				time: Date.now(),
				data: this.Cates
			});
			// 构造左侧菜单数据
			this.leftMenuList = this.Cates.map(v => v.cat_name);
			// 构造右侧商品数据
			this.rightContent = this.Cates[0].children;
		},
		// 左侧菜单的点击事件
		handleItemTap(i) {
			// 重新设置右侧内容的距离顶部距离
			this.scrolltop = 0;
			// 获取被点击的标题身上的索引
			// 给 currentIndex 赋值
			this.currentIndex = i;
			// 构造右侧商品数据
			this.rightContent = this.Cates[i].children;
		}
	}
};
</script>

<style lang="less">
.cates {
	height: 100%;
	.cates_container {
		height: calc(100vh - 72rpx);
		display: flex;
		.left_menu {
			flex: 2;
			.menu_item {
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
			}
			.active {
				color: var(--themeColor);
				border-left: 5rpx solid currentColor;
			}
		}
		.right_content {
			flex: 5;
			height: 100%;
			.goods_group {
				height: 100%;
				.goods_title {
					height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.delimiter {
						color: #ccc;
						padding: 0 10rpx;
					}
					.title {
					}
				}
				.goods_list {
					display: flex;
					flex-wrap: wrap;
					navigator {
						width: 33.33%;
						text-align: center;
						image {
							width: 50%;
						}
						.goods_name {
						}
					}
				}
			}
		}
	}
}
</style>
