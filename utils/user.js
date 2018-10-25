import Storage from './storage';

let currentPage = '';

function getCurrentPage() {
    if (!currentPage) {
        currentPage = getCurrentPages().slice(-1)[0];
    }
    return currentPage;
}

/**
 * 获取用户信息
 * 如果本地已存储用户信息，则读取本地缓存，否则正常获取用户信息
 * 如果未授权或者拒绝过授权则跳转到授权页面
 *
 * @export
 * @param {*} callback
 * @param {*} app 调用该函数的页面实例
 *
 * 获取到用户信息或者用户拒绝授权后都会执行callback
 * 如果用户拒绝授权，则回调函数的参数为 undefined
 */
export function getUserInfo(callback, app) {
    const USER_INFO_KEY = 'userInfo';
    let that = app ? app : getCurrentPage();
    const userInfo = Storage.get(USER_INFO_KEY);

    if (userInfo) {
        callback && callback.call(that, JSON.parse(userInfo));
        return;
    }
    wx.getUserInfo({
        success: res => {
            // 到底传递所有的信息，还是只是用户信息
            // callback && callback.call(that, res);
            const { userInfo } = res;
            Storage.set(USER_INFO_KEY, userInfo);
            callback && callback.call(that, userInfo);
        },
        fail: () => {
            // 未获得授权和拒绝过授权都会触发
            const pagePath = '/' + that.route;
            that.getUserInfoSuccess = callback; // 将回调函数赋值到页面实例上，保证跳转页面后仍能获取到
            wx.navigateTo({
                url: `/utils/pages/authorization/index?backUrl=${pagePath}&callbackName=getUserInfoSuccess`
            });
        }
    });
}

export function login() {
    //TODO: 判断本地缓存是否有用户信息

    wx.login({
        success: res => {}
    });
}