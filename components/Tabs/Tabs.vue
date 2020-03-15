<template>
	<view class="tabs">
		<view class="tabs_title">
			<view 
			v-for="(item, index) in tabs" 
			:key="index" 
			:class="item.isActive ? 'title_item active' : 'title_item'"
			@click="handleItemTap"
			:data-index="index">
			{{ item.value }}
			</view>
		</view>
		<view class="tabs_content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
	props: {
		tabs: {
			type: Array,
			value: []
		}
	},
	methods:{
	handleItemTap(e){
		const{index} =e.currentTarget.dataset
		this.$emit('tabsItemChange',index ,e )
	}
	}
};
</script>

<style lang="less">
.tabs {
	.tabs_title {
		display: flex;
		.title_item {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			padding: 15rpx 0;
		}
		.active {
			color: ~'var(--themeColor)';
			border-bottom: 5rpx solid currentColor;
		}
	}
	.tabs_content {
	}
}
</style>
