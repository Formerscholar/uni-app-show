const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'
let ajaxTimes = 0
export const request =(params)=>{
	ajaxTimes++
	return new Promise((resolve,rejeck)=>{
		// 显示加载中 效果
		uni.showLoading({
		    title: '加载中',
				mask:true
		});
		uni.request({
			...params,
			url:baseURL + params.url,
			success: (res) => {
				resolve(res)
			},
			fail:(err)=>{
				rejeck(err)
			},
			complete:()=>{
				ajaxTimes--
				if(ajaxTimes == 0){
					uni.hideLoading();
				}
			}
		})
	})
}