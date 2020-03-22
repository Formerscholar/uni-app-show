<template>
	<view class="detail">
		<!-- 轮播图 -->
		<view class="detail_swiper">
			<swiper  indicator-dots autoplay circular interval="1500" duration="500" indicator-active-color="#eb4450">
				<swiper-item 
				v-for="(item,index) in goodsObj.pics"
				:key="index"
				@click="handlePrevewImage"
				:data-url="item.pics_mid">
					<image :src="item.pics_mid" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 商品价格 -->
		<view class="detail_price">
			￥{{goodsObj.goods_price}}
		</view>
		<!-- 商品名称/收藏 -->
		<view class="detail_name_row">
			<view class="detail_name">
				{{goodsObj.goods_name}}
			</view>
			<view class="detail_collect">
				<text class="iconfont icon-shoucang"></text>
				<view class="collect_text">
					收藏
				</view>
			</view>
		</view>
		<!-- 图文详情 -->
		<view class="detail_info">
			<view class="info_title">
				图文详情
			</view>
			<view class="info_content">
				<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
			</view>
		</view>
		<!-- 底部工具栏 -->
		<view class="btm_toool">
			<view class="tool_item">
				<view class="iconfont icon-kefu"></view>
				<view>客服</view>
				<button open-type="contact"></button>
			</view>
			<view class="tool_item">
				<view class="iconfont icon-yixianshi-"></view>
				<view>分享</view>
				<button open-type="share"></button>
			</view>
			<navigator open-type="switchTab" url="/pages/cart/cart" class="tool_item">
				<view class="iconfont icon-gouwuche"></view>
				<view>购物车</view>
			</navigator>
			<view 
			class="tool_item btn_cart"
			@click="handleCartAdd">
				加入购物车
			</view>
			<view class="tool_item btn_buy">
				立即购买
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsObj:{},
			goodsInfo:{}
		};
	},
	onLoad(options) {
		const { goods_id } = options;
		this.getDetailList(goods_id);
	},
	methods: {
		// 获取商品详情数据
		async getDetailList(goods_id) {
			const res = await this.$http({
				url: '/goods/detail',
				data: {goods_id}
			});
			this.goodsObj = res.data.message
			this.goodsInfo = this.goodsObj
			this.goodsObj = {
				goods_name:res.data.message.goods_name,
				goods_price:res.data.message.goods_price,
				goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
				pics:res.data.message.pics
			}
		},
		// 点击轮播图放大预览
		handlePrevewImage(e){
			const urls =  this.goodsObj.pics.map(v=>v.pics_mid)
			// 接受传递过来的url
			const current = e.currentTarget.dataset.url
			uni.previewImage({
				current,
				urls
			})
		},
		// 点击添加购物车
		handleCartAdd(){
			// 获取缓存中的购物车数组
			let cart = uni.getStorageSync('cart')||[]
			// 判断商品对象是否存在购物车数组中
			let index = cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id)
			if(index === -1){
				// 不存在 
				this.goodsInfo.num = 1
				this.goodsInfo.checked = true
				cart.push(this.goodsInfo)
			}else{
				// 已存在 执行num++
				cart[index].num++
			}
			// 把购物车重新添加到缓存中
			uni.setStorageSync('cart',cart)
			// 弹窗提示
			uni.showToast({
				title:'加入成功',
				icon:'success',
				mask:true
			})
		}
	}
};
</script>

<style lang="less">
	.detail{
		padding-bottom: 90rpx;
	}
	.detail_swiper {
		swiper{
			height: 65vw;
			text-align: center;
			image {
				width: 65%;
			}
		}
	}
	
	.detail_price{
		padding: 15rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #EB4450;
	}
	
	.detail_name_row{
		display: flex;
		border-top: 5rpx solid #dedede;
		border-bottom: 5rpx solid #dedede;
		padding: 10rpx 0;
		.detail_name{
			flex: 5;
			color: #000;
			font-size: 30rpx;
			padding: 0 10rpx;
			display: -webkit-box;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.detail_collect{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-left: 1rpx solid #000;
			.iconfont{
				
			}
			.collect_text{
				
			}
		}
	}
	
	.detail_info{
		.info_title{
			font-size: 32rpx;
			color: #EB4450;
			font-weight: 600;
			padding: 20rpx;
		}
		.info_content{
			
		}
	}
	
	.btm_toool{
		border-top: 1rpx solid #ccc;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 90rpx;
		background-color: #fff;
		display: flex;
		.tool_item{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			position: relative;
			button{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
			}
		}
		.btn_cart{
			flex: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #ffa500;
			color: #fff;
			font-size: 30rpx;
			font-weight: 600;
		}
		.btn_buy{
			flex: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #EB4450;
			color: #fff;
			font-size: 30rpx;
			font-weight: 600;
		}
	}
		
	
</style>
