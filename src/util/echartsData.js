// 获取各个月份的天数
function getDaysByYear(year) {
  let temp = []
  for (let i = 1; i < 13; i++) {
    temp.push(new Date(year, i, 0).getDate())
  }
  return temp
}
// 计算精度
function accAdd(arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
// 获取一个月的总值
function getMonValue(data, ids, mounths) {
  if (data == undefined) {
    return
  }
  if (data.length == 0) {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
  let daysArr = getDaysByYear(mounths)
  var mounthDay = daysArr
  let start = 0,
    end = 0
  daysArr = daysArr.map((item) => {
    start = end
    end += item
    return data.slice(start, end)
  })
  let arr = []
  daysArr.map((item, index) => {
    var arrMax = []
    var arrMin = []
    if (ids == 0) {
      item.map((v) => {
        arrMax.push(v.max)
      })
      arr.push(Math.max.apply(null, arrMax))
    } else if (ids == 1) {
      item.map((v) => {
        arrMin.push(v.min)
      })
      arr.push(Math.min.apply(null, arrMin))
    } else if (ids == 2) {
      // 求和(当月总计)
      let count = item.reduce((total, obj) => {
        let nums = ''
        switch (ids) {
          case 2:
            nums = obj.avg
            break
        }
        return accAdd(total.toString(), nums)
      }, 0)
      arr.push((Math.floor(count * 100) / 100 / mounthDay[index]).toFixed(3))
    }
  })
  return arr
}
export { getMonValue, getDaysByYear }
