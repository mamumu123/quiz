// import store from '@/stores';
	
uni.urequest = function(options) {
	
	// const { token } = store;
	
	// 默认配置
	const OPT = Object.assign({
		method: 'GET',
	}, options);

	// 默认header
	OPT['headers'] = Object.assign({
		'Content-Type': 'application/json',
		// 'Authorization': `Bearer ${store.state.token}`,
		'User-Agent': 'cloud/hack-proxy'
	}, options.header);

	// 开始请求
	return new Promise((RES, REJ) => {
		uniCloud.callFunction({
			name: 'hack-request',
			data: {
				options: Object.assign({
					url: options.url,
				}, OPT)
			},
			success: res => {
				const { result } = res || {};
				const {
					code,
					msg,
					data
				} = result || {};
				
				// 如果请求的 code 状态码不正确
				if (code !== 20000) {
					options.fail && options.fail({
						errMsg: msg,
						err: msg,
						code,
					});
					REJ(res);
					return;
				}
				
				options.success && options.success(data);
				RES(data);
			},
			fail: err => {
				options.fail && options.fail({
					errMsg: 'request:fail',
					err
				});
				REJ(err);
			},
			complete: options.complete
		})
	})
}
