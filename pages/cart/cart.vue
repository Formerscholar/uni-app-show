<template>
	<view class="page">
		<!-- 收货地址容器 -->
		<view class="revice_address_row">
			<!-- 收货按钮地址不存在时，按钮显示 -->
			<view class="address_btn" v-if="!address.userName"><button @click="handleChooseAddress" type="primary" plain>获取收货地址</button></view>
			<!-- 收货地址存在 详细地址显示 -->
			<view v-else class="address_box">
				<view class="box_left">
					<view class="left_name">收货人:{{ address.userName }}</view>
					<view class="left_info">{{ address.all }}</view>
				</view>
				<view class="box_right">{{ address.telNumber }}</view>
			</view>
		</view>
		<!-- 购物车的内容 -->
		<view class="cart_content">
			<view class="cart_name">购物车</view>
			<view class="cart_main">
				<!-- 当cart数组 长度不为0 显示商品信息 -->
				<block v-if="cart.length!==0" >
					<view class="cart_item" v-for="(item, index) in cart" :key="index" >
						<!-- 复选框 -->
						<view class="cart_chk">
							<checkbox-group :data-id="item.goods_id" @change="handleItemChange"><checkbox :checked="item.checked" /></checkbox-group>
						</view>
						<!-- 商品图片 -->
						<navigator class="cart_image"><image :src="item.goods_small_logo" mode="widthFix"></image></navigator>
						<!-- 商品信息 -->
						<view class="cart_info">
							<view class="goods_name">{{ item.goods_name }}</view>
							<view class="goods_pirce_wrap">
								<view class="goods_pirce">￥{{ item.goods_price }}</view>
								<view class="cart_num_tool">
									<view class="num_edit" @click="handleItemNumEdit" :data-id="item.goods_id" :data-operation="-1" >-</view>
									<view class="goods_num">{{ item.num }}</view>
									<view class="num_edit" @click="handleItemNumEdit" :data-id="item.goods_id" :data-operation="1" >+</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<image src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1584878313&di=5b183ae4bd22e619a49cd0ef8c05317f&src=http://hbimg.b0.upaiyun.com/e1b1467beea0a9c7d6a56b32bac6d7e5dcd914f7c3e6-YTwUd6_fw658" mode="widthFix" />
				</block>
			</view>
		</view>
		<!-- 底部工具栏 -->
		<view class="footer_tool">
			<!-- 全选 -->
			<view class="all_chk_wrap">
				<checkbox-group @change="handleItemAllCheck"><checkbox :checked="allChecked">全选</checkbox></checkbox-group>
			</view>
			<!-- 总价 -->
			<view class="total_price-wrap">
				<view class="total_price">
					合计:
					<text class="total_price_text">￥{{ totalPrice }}</text>
				</view>
				<view>包含运费</view>
			</view>
			<!-- 结算 -->
			<view class="order_pay_wrap" @click="handlePay">结算({{ totalNum }})</view>
		</view>
	</view>
</template>

<script>
import { getSetting, chooseAddress, openSetting,showModal,showToast } from '../../utils/asyncUni.js';

import regeneratorRuntime from '../../lib/runtime/runtime.js';

export default {
	data() {
		return {
			address: {},
			cart: [],
			allChecked: false,
			totalPrice: 0,
			totalNum: 0
		};
	},
	onShow() {
		// 获取地址信息
		const address = uni.getStorageSync('address');
		// 获取缓存中的购物车数据
		const cart = uni.getStorageSync('cart') || [];
		this.address = address;
		this.setCart(cart);
	},
	methods: {
		// 收货地址
		async handleChooseAddress() {
			try {
				const res1 = await getSetting();
				const scopeAddress = res1.authSetting['scope.address'];
				if (scopeAddress === false) {
					await openSetting();
				}
				let address = await chooseAddress();
				address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
				uni.setStorageSync('address', address);
			} catch (err) {
				console.log(err);
			}
		},
		// 商品的选中
		handleItemChange(e) {
			// 获取被修改的商品ID
			const goods_id = e.currentTarget.dataset.id;
			// 获取购物车数组
			let cart = this.cart;
			// 找到被修改的商品对象
			let index = cart.findIndex(v => v.goods_id === goods_id);
			cart[index].checked = !cart[index].checked;
			this.setCart(cart);
		},
		// 设置购物车状态 重新计算数据
		setCart(cart) {
			// 计算全选
			let allChecked = true;
			// 总价格 总数量
			let totalPrice = 0;
			let totalNum = 0;
			cart.forEach(v => {
				if (v.checked) {
					totalPrice += v.num * v.goods_price;
					totalNum += v.num;
				} else {
					allChecked = false;
				}
			});
			// 判断数组是否为空
			allChecked = cart.length != 0 ? allChecked : false;
			// 数据重新赋值到data和缓存中
			this.cart = cart;
			this.totalPrice = totalPrice;
			this.totalNum = totalNum;
			this.allChecked = allChecked;
			uni.setStorageSync('cart', cart);
		},
		// 商品的全选功能
		handleItemAllCheck() {
			// 获取data中的数据
			let cart = this.cart,
				allChecked = this.allChecked;
			// 修改
			allChecked = !allChecked;
			// 循环数组中的商品选中状态
			cart.forEach(v => (v.checked = allChecked));
			// 把修改后的值 设置回 data和缓存中
			this.setCart(cart);
		},
		// 商品数量编辑的功能
		async handleItemNumEdit(e){
			// 获取传递过来的参数
			const { operation,id } = e.currentTarget.dataset
			// 获取购物车数组
			let cart = this.cart
			 // 找到需要修改的商品的索引
			 const index = cart.findIndex(v=>v.goods_id === id)
			 // 判断是否要执行删除
			 if(cart[index].num === 1 && operation === -1){
				 const res  = await showModal({content:'您是否要删除？'})
				 if(res.confirm){
					 cart.splice(index,1)
					 this.setCart(cart);
				 }
			 }
			 // 开始进行修改数量
			 cart[index].num += operation
			 // 把修改后的值 设置回 data和缓存中
			 this.setCart(cart);
		},
		// 结算按钮
	async	handlePay(){
			// 判断收货地址
			const address = this.address
			const totalNum = this.totalNum
			if(!address.userName){
			 await showToast({title:'您还没有选择收货地址'})
				return
			}
			// 判断用户有没有选择商品
			if(totalNum === 0){
				await showToast({title:'您还没有选购商品'})
								return
			}
			// 跳转到支付页面
			uni.navigateTo({
				url:'/pages/pay/pay'
			})
		}
	}
};
</script>

<style lang="less">
.page {
	padding-bottom: 90rpx;
}
.revice_address_row {
	.address_btn {
		padding: 20rpx;
		button {
			width: 60%;
		}
	}
	.address_box {
		padding: 20rpx;
		font-size: 28rpx;
		display: flex;
		border-bottom: 1px solid red;
		.box_left {
			flex: 8;
			.left_name {
			}
			.left_info {
			}
		}
		.box_right {
			text-align: right;
			flex: 5;
		}
	}
}

.cart_content {
	.cart_name {
		padding: 20rpx;
		font-size: 36rpx;
		color: #eb4450;
		border-bottom: 1rpx solid currentColor;
	}

	.cart_main {
		.cart_item {
			display: flex;
			padding: 10rpx;
			border-bottom: 1rpx solid #ccc;
			.cart_chk {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				checkbox-group {
					checkbox {
					}
				}
			}
			.cart_image {
				flex: 2;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 80%;
				}
			}
			.cart_info {
				flex: 4;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.goods_name {
					display: -webkit-box;
					overflow: hidden;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					color: #666;
				}
				.goods_pirce_wrap {
					display: flex;
					justify-content: space-between;
					.goods_pirce {
						color: #eb4450;
						font-size: 34rpx;
					}
					.cart_num_tool {
						display: flex;
						.num_edit {
							width: 55rpx;
							height: 55rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border: 1rpx solid #ccc;
						}
						.goods_num {
							width: 55rpx;
							height: 55rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}
		}
	}
}

.footer_tool {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 90rpx;
	background-color: #fff;
	display: flex;
	border-top: 1rpx solid #ccc;
	.all_chk_wrap {
		flex: 2;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.total_price-wrap {
		flex: 5;
		text-align: right;
		padding-right: 15rpx;
		.total_price {
			.total_price_text {
				color: #eb4450;
				font-size: 34rpx;
				font-weight: 600;
			}
		}
	}
	.order_pay_wrap {
		flex: 3;
		background-color: #eb4450;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
