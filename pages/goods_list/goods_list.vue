<template>
	<view>
		<!-- 搜索框 开始 -->
		<uni-search-bar :radius="100" @confirm="search" />
		<!-- 搜索框 结束 -->
		<!-- 内容 开始 -->
		<Tabs :tabs="tabs" v-on:tabsItemChange="handleItemChange">
			<view v-if="tabs[0].isActive">
				<view class="first_tab">
					<navigator 
					:url="'../goods_detail/goods_detail?goods_id='+item.goods_id" 
					class="goods_item" 
					v-for="(item, index) in goodsList" 
					:key="index">
						<!-- 左侧 图片容器 -->
						<view class="goods_img_wrap">
							<image 
							:src="item.goods_small_logo ? item.goods_small_logo : 'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'" 
							mode="widthFix" />
						</view>
						<!-- 右侧 文字容器 -->
						<view class="goods_info_wrap">
							<view class="goods_name">{{ item.goods_name }}</view>
							<view class="goods_price">￥{{ item.goods_price }}</view>
						</view>
					</navigator>
				</view>
			</view>
			<view v-else-if="tabs[1].isActive">
				<navigator
				:url="'../goods_detail/goods_detail?goods_id='+item.goods_id"
				class="goods_item" 
				v-for="(item, index) in goodsList" 
				:key="index">
					<!-- 左侧 图片容器 -->
					<view class="goods_img_wrap">
						<image 
						:src="item.goods_small_logo ? item.goods_small_logo : 'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'" 
						mode="widthFix" />
					</view>
					<!-- 右侧 文字容器 -->
					<view class="goods_info_wrap">
						<view class="goods_name">{{ item.goods_name }}</view>
						<view class="goods_price">￥{{ item.goods_price }}</view>
					</view>
				</navigator>
			</view>
			<view v-else-if="tabs[2].isActive">
				<navigator
				:url="'../goods_detail/goods_detail?goods_id='+item.goods_id"
				class="goods_item" 
				v-for="(item, index) in goodsList" 
				:key="index">
					<!-- 左侧 图片容器 -->
					<view class="goods_img_wrap">
						<image 
						:src="item.goods_small_logo ? item.goods_small_logo : 'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'" 
						mode="widthFix" />
					</view>
					<!-- 右侧 文字容器 -->
					<view class="goods_info_wrap">
						<view class="goods_name">{{ item.goods_name }}</view>
						<view class="goods_price">￥{{ item.goods_price }}</view>
					</view>
				</navigator>
			</view>
		</Tabs>
		<!-- 内容 结束 -->
	</view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import Tabs from '@/components/Tabs/Tabs.vue';

export default {
	data() {
		return {
			tabs: [
				{
					id: 0,
					value: '综合',
					isActive: true
				},
				{
					id: 1,
					value: '销量',
					isActive: false
				},
				{
					id: 2,
					value: '价格',
					isActive: false
				}
			],
			// 接口要的参数
			QueryParams: {
				query: '',
				cid: '',
				pagenum: 1,
				pagesize: 10
			},
			goodsList: [],
			// 总页数
			totalPages:1
		};
	},
	components: {
		uniSearchBar,
		Tabs
	},
	onLoad(options) {
		this.QueryParams.cid = options.cid;
		this.getGoodList();
	},
	onReachBottom(){
		// 判断还有没有下一页数据
		if(this.QueryParams.pagenum>=this.totalPages){
			// 没有下一页数据
			uni.showToast({
				title:'没有下一页数据'
			})
		}else{
			// 有下一页数据
			this.QueryParams.pagenum++
			this.getGoodList()
		}
	},
	onPullDownRefresh(){
		// 重置数组
		this.goodsList = []
		// 重置页码
		this.QueryParams.pagenum = 1
		// 发送请求
		this.getGoodList()
	},
	methods: {
		handleItemChange(i, e) {
			const { index } = e.mp.currentTarget.dataset;
			let { tabs } = this.$data;
			tabs.forEach((v, ii) => (ii == index ? (v.isActive = true) : (v.isActive = false)));
			this.tabs = tabs;
		},
		// 获取商品列表数据
		async getGoodList() {
			const res = await this.$http({
				url: '/goods/search',
				data: this.QueryParams
			});
			// 获取总条数
			const total = res.data.message.total
			this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
			this.goodsList = [...this.goodsList,...res.data.message.goods];
			// 关闭下拉刷新动作
			uni.stopPullDownRefresh()
		}
	}
};
</script>

<style lang="less">
	.goods_item {
		display: flex;
		border-bottom: 1px solid #ccc;
		.goods_img_wrap {
			flex: 2;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 70%;
			}
		}
		.goods_info_wrap {
			flex: 3;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.goods_name {
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.goods_price {
				color: #EB4450;
				font-size: 32rpx;
			}
		}
	}
</style>
