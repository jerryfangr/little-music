import API from '@/assets/api';


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
    // timeout clock
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const error = new Error('请求超时 !!!');
        error.type = 'timeout';
        reject(error);
      }, limitTime);
    }),
    // get token
    new Promise((resolve, reject) => {
      uni.request({
        url: API.token,
        success(res) { resolve(res.data); },
        fail(error) { reject(error); },
        // complete() { uni.hideLoading(); }
      });
    })
  ])
  // send request
  .then(data =>{
    return new Promise((resolve, reject) => {
      let token = data?.result?.token;
      uni.request({
        url: options.url + '?token=' + token,
        data: options.data,
        header: options.header,
        success(res) { resolve(res.data); },
        fail(error) { reject(error); },
        complete() { uni.hideLoading(); }
      });
    });
  }, error => {
    if (error.type === 'timeout') {
      uni.showToast({
        title: '请求超时!!',
        icon: 'none',
        duration: 2000
      });
    }
    uni.hideLoading();
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