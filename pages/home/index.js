Page({
    data: {
        selfInfo: {
            avatar: '',
            nickname: '吃肉吃肉'
        },
        isShowShare: false,
        isDisableScroll: false,
        testImg: ''
    },
    onLoad() {
        this.rectify();
    },
    onReady() {
        this.avatarAnimation = wx.createAnimation();
        this.nameAnimation = wx.createAnimation();
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        this.animation(this.scrollTop);
    },
    animation(scrollTop) {
        const ratio = this.ratio;

        if (scrollTop <= 320 * ratio) {
            this.avatarAnimation.translate(-(345 * scrollTop / 320), -170 * scrollTop / 320).step();
            this.avatarAnimation.scale(1 - scrollTop / 320).step();
            this.nameAnimation.translate(0, -288 * scrollTop / 320).step();
        } else {
            this.nameAnimation.translate(0, -288 * this.ratio).step();
            this.avatarAnimation.translate(-325 * this.ratio, -170 * this.ratio).step();
            this.avatarAnimation.scale(0.5).step();
        }
        this.setData({
            avatarAnimation: this.avatarAnimation.export(),
            nameAnimation: this.nameAnimation.export()
        });
    },
    toggleShare(e) {
        let open = false;

        if (e && e.currentTarget) {
            open = e.currentTarget.dataset.open || false;
        }
        this.setData({
            isShowShare: open,
            isDisableScroll: open
        });
    },
    rectify() {
        wx.getSystemInfo({
            success: (res) => {
                this.ratio = res.windowWidth / 750;
            }
        });
    }
});
