var formatTime = function (date) {
	// date num string
	console.log(date)
	console.log(typeof date)
	if (typeof date != "object") {
		if (/^[0-9]*$/.test(date)) {
			date = new Date(parseInt(date))
		} else {
			date = new Date(date)
		}

	}

	var year = date.getFullYear()
	var month = (date.getMonth() + 1)
	var day = date.getDate()
	var hour = date.getHours()
	var minute = date.getMinutes()
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

var formatNumber = function (n) {
	return n < 10 ? '0' + n : n
}
var splitf = function (times = '') {
	var li = times.split('/')
	var st = formatTime(li[0])
	var et = formatTime(li[1])
	return st + ' ~ ' + et
}

function defaultDate(yearnum) {
	let date = new Date()
	console.log(date.getFullYear())
	date.setFullYear(date.getFullYear() + yearnum)
	return formatTime(date)
}
module.exports.ft = formatTime
module.exports.ftn = formatNumber
module.exports.splitf = splitf
module.exports.defaultDate = defaultDate