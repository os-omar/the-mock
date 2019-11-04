module.exports = (message = null, status = "fail") => {
	return {
		"message" : (!message ? null : message),
		"status" : status,
		"timeStamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
	}
};
