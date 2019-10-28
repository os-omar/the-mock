module.exports = function (data, message, violations){
	return {
		"message" : (!message ? null : message),
		"responseData" : (!data ? null : data),
		"status" : (!violations || violations == null || violations.length == 0 ? "success" : "fail"),
		"timeStamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
		"violations" : (!violations ? null : violations)
	}
}