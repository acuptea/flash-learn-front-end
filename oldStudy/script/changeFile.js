const request = require('request')
const baseUrl = require('./config.js')
const Blob = require('blob')

async function getFile(item) {
  return new Promise((resolve, reject)=>{
      const option ={
        url: `${baseUrl.VUE_APP_API_URL}project/apply/clin/export/pdf/${item.id}?token=9ed98cc9-842d-4bb0-829f-fc656659f1a8`,
        method: "get"
      }
      request(option, function(error, response, body) {
        downloadBlobFile(response)
        // if (!error && response.statusCode == 200) {
        // }
      })
  })
}

function downloadBlobFile (response) {
  const blob = response.data
  let fileName = response.headers['content-disposition'].split(';')[1].split('=')[1]
  fileName = decodeURIComponent(fileName)
  console.log(Blob)
  // if ('download' in document.createElement('a')) { // 非IE下载
  //   const elink = document.createElement('a')
  //   elink.download = fileName
  //   elink.style.display = 'none'
  //   elink.href = window.URL.createObjectURL(blob)
  //   document.body.appendChild(elink)
  //   elink.click()
  //   window.URL.revokeObjectURL(elink.href) // 释放URL 对象
  //   document.body.removeChild(elink)
  // } else { // IE10+下载
  //   navigator.msSaveBlob(blob, fileName)
  // }
}

request({
  url: `${baseUrl.VUE_APP_API_URL}project/page/conditions`,
  method: "POST",
  json: true,
  headers: {
      "content-type": "application/json",
      "token":"9ed98cc9-842d-4bb0-829f-fc656659f1a8"
  },
  body: {
    queryRoleType: "member",
    pageSize: 5,
    currentPage: 1,
    projectType: "10010105"
  }
}, function(error, response, body) {
  if(response.body && response.body.code === '000000') {
    // console.log()
    const arr = response.body.data.records
    getFile(arr[0])
  }
})