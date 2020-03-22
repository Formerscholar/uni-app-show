export const getSetting = () => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}


export const chooseAddress = () => {
	return new Promise((resolve, reject) => {
		uni.chooseAddress({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}


export const openSetting = () => {
	return new Promise((resolve, reject) => {
		uni.openSetting({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}


export const showModal = ({content}) => {
	return new Promise((resolve, reject) => {
		uni.showModal({
		    title: '提示',
		    content,
		    success:res=> {
		       resolve(res)
		    },
				fail: (err) => {
					reject(err)
				}
		});
	})
}



export const showToast = ({title}) => {
	return new Promise((resolve, reject) => {
		uni.showToast({
		    title,
				icon:'none',
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					reject(err)
				}
		});
	})
}


