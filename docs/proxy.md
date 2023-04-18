## 背景
### 介绍
本文介绍了小程序中通过云函数代理转发，请求不符合小程序限制要求的域名。

### 关键词
云函数、代理转发、ICP 备案、小程序

### 小程序限制
在小程序开发中，有很多限制，其中有一个限制就是：当小程序需要请求后端接口时，对后端域名有一些限制：[限制说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/domain.html#%E9%99%90%E5%88%B6%E8%AF%B4%E6%98%8E)

- 域名只支持https协议，不支持IP地址；
- 业务域名需经过ICP备案；

这就导致个人开发者和个人开发学习会比较麻烦，需要找一些方式绕过这个限制。


## 代理转发

代理转发在前端的应用很广，一个常见的应用场景，就是解决前端的跨域问题。
前端访问跨域资源时，是存在跨域限制的；
前端请求资源限制

TODO: 前端 - 后端

而服务器访问服务资源时是没有问题的。通过这个方式，我们在前端工程化开发中，配置 devServer , 本地开启一个代理服务器。前端先请求道代理服务器，然后由代理服务器请求真正的服务端接口，然后在拿到数据以后，返回请求数据。

这在现在的前端开发中，解决本地开发代理问题，应该是最常用的方式。




TODO: 前端 - 代理服务器 - 服务器
补一张图

### 云函数代理
在本地的问题中，也可以用代理转发来解决问题，小程序只限制了前端的域名访问，但是没有限制云函数的请求。

而在 `uni-app` 框架中，用云函数来代理就更合适了。

- 白嫖：在 `uni-app`中， 有一个免费的阿里云函数可以使用，开发学习和小规模的线上使用基本没有问题。
- 日志：在管理后台，可以根据用户信息，查询到请求日志，不需要自己加，查问题更方便。

### code
#### 小程序代理
小程序中，请求数据使用的 request。如果是原生小程序
`wx.request`,如果是 uni-app, 使用  ` uni.request`。
我们实现一个新的函数。

在这个函数中，我们请求云函数
```js
uniCloud.callFunction({
			name: 'hack-request',
			data: {
				...
			},
			success: res => {},
			fail: err => {}
})
```




#### 云函数转发
在云函数中，只需要做一个代理转发，然后将请求扔回去。
```js
const axios = require('axios').default;

exports.main = (evt, ctx) => {
  return new Promise((RES, REJ) => {
	try{
		axios.request(evt.options)
        .then(function (response) {
		  RES(response.data)
		})
		.catch(function (error) {
		  REJ(error)
		});
	}catch(e){
		REJ(e)
	}
  });
}
```


#### 如何使用
和正常的小程序请求方式一样，只是调用的是我们做了拦截处理的请求函数 ，urequest(叫什么都可以)

```js
				uni.urequest({
					url: this.requestUrl,
					method: "POST",
					data: {
					},
					success: (res) => {
					},
					fail(err) {
					}
				}),
```


## 参考项目
[v-request](https://github.com/guren-cloud/v-request)
