const PREFIX = 'ZZR_';

const storage = {
    get: function (key) {
        try {
            return wx.getStorageSync(PREFIX + key);
        } catch (err) {
            return null;
        }
    },
    set: function (key, data) {
        try {
            return wx.setStorageSync(PREFIX + key, data);
        } catch (err) {
            return null;
        }
    },
    remove: function (key) {
        try {
            return wx.removeStorage({
                key: PREFIX + key
            });
        } catch (err) {
            return null;
        }
    }
};

export default storage;