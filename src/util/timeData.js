export function timesfun(times) {
  let date = new Date(times)
  let year = date.getFullYear() //年
  let month = date.getMonth() + 1 //月
  let strDate = date.getDate() //日
  let hours = date.getHours() //时
  let minits = date.getMinutes() //分
  let seconds = date.getSeconds() //秒
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hours >= 0 && hours <= 9) {
    hours = '0' + hours
  }
  if (minits >= 0 && minits <= 9) {
    minits = '0' + minits
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }
  return year + '-' + month + '-' + strDate + ' ' + hours + ':' + minits + ':' + seconds
}
