const day = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}

const hour = date => {

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute].map(formatNumber).join(':')
}


const afterDay = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() + 3


  return [year, month, day].map(formatNumber).join('/')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  day: day,
  hour: hour,
  afterDay: afterDay
}