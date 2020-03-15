const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'
export const request =(params)=>{
	return new Promise((resolve,rejeck)=>{
		uni.request({
			...params,
			url:baseURL + params.url,
			success: (res) => {
				resolve(res)
			},
			fail:(err)=>{
				rejeck(err)
			}
		})
	})
}