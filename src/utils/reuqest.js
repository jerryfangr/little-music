/**
 * * request function with loading toast
 * @param {*} options 
 * @returns 
 */
const request = (options) => {
  const title = options.title || '请求数据中...';
  const limitTime = options.limitTime || 10*1000;

  uni.showLoading({ title });
  return Promise.race([
    // timeout length
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const error = new Error('请求超时 !!!');
        error.type = 'timeout';
        reject(error);
      }, limitTime);
    }),
    // send request
    new Promise((resolve, reject) => {
      uni.request({
        url: options.url,
        data: options.data,
        header: options.header,
        success(res) {
          // console.log(JSON.stringify(res))
          resolve(res.data);
        },
        fail(error) {
          reject(error);
        },
        complete() {
          uni.hideLoading();
        }
      });
    })
  ]).then(res=>res, error => {
    if (error.type === 'timeout') {
      uni.showToast({
        title: '请求超时!!',
        icon: 'none',
        duration: 2000
      });
    }
    return Promise.reject(error);
  });
}

/**
 * * vue plugin install function
 */
request.install = function (Vue, configOptions) {
  Vue.prototype.$request = function (options) {
    return request(options);
  }
}


export default request;