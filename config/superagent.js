const superagent = require('superagent')

/**
 * 接口请求封装  使用superagent发送请求
 * @param {*} url 
 * @param {*} method 
 * @param {*} params 
 * @param {*} data 
 * @param {*} cookies 
 */
function req(url, method, params, data, cookies) {
	return new Promise(function (resolve, reject) {
		superagent(method, url)
			.query(params)
			.send(data)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.end(function (err, response) {
				if (err) {
					reject(err)
				}
				resolve(response)
			})
	})
}
module.exports = {
	req
}