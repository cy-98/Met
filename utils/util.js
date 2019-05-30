const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// let rootUrl = "https://jwxt.chpz527.cn/";
let rootUrl = "http://127.0.0.1:8888/";

function req(url, data, su, fa) {
  wx.request({
    url: rootUrl + url,
    data: data,
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      if (res.statusCode < 399)
        return typeof su == "function" && su(res.data);
      else {
        showError(res.data.errMsg);
        return typeof fa == "function" && fa(res.data)
      }

    },
    fail: function (error) {
      showError(error.data.errMsg);
      return typeof fa == "function" && fa(error)
    }
  })
}


function getReq(url, data, su, fa) {
  wx.request({
    url: rootUrl + url,
    data: data,
    method: 'get',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      if (res.statusCode < 399)
        return typeof su == "function" && su(res.data);
      else {
        showError(res.data.msg);
        return typeof fa == "function" && fa(res.data)
      }

    },
    fail: function (error) {
      showError(error.data.msg);
      return typeof fa == "function" && fa(error)
    }
  })
}

function showError(errMsg) {
  wx.showToast({
    title: errMsg,
    icon: 'none'
  })
}


module.exports = {
  formatTime: formatTime,
  getReq : getReq,
  req:req,
  rootUrl:rootUrl,
}
