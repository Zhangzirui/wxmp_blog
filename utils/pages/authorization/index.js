import Storage from '../../storage';

const USER_INFO_KEY = 'userInfo';

Page({
    data: {
        backUrl: '',
        callbackName: ''
    },
    onLoad(options) {
        let { backUrl, callbackName } = options;
        this.setData({
            backUrl: backUrl || '',
            callbackName: callbackName || ''
        });
    },
    getUserInfo(res) {
        const backObj = getCurrentPages().slice(-2, -1)[0];
        const { userInfo } = res;
        const { callbackName } = this.data;

        wx.navigateBack({
            delta: 1,
            success: () => {
                Storage.set(USER_INFO_KEY, userInfo);
                backObj[callbackName] && backObj[callbackName](userInfo);
            }
        });
    }
});