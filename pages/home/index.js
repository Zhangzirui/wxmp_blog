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
        this.infoAnimation = wx.createAnimation();
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        this.animation(this.scrollTop);
    },
    animation(scrollTop) {
        const ratio = this.ratio;
        if (scrollTop <= 500 * ratio) {
            if (scrollTop <= 220 * ratio) {
                this.avatarAnimation.translate(0, -170 * scrollTop / 220 );
                this.avatarAnimation.scale(1 - scrollTop / (220 * ratio * 2));
                this.avatarAnimation.step();
            } else {
                this.avatarAnimation.translate(-(345 * (scrollTop - 220 * ratio) / 280 ), -170 * this.ratio).step();
            }
            this.nameAnimation.translate(0, -288 * scrollTop / 500).step();
            this.infoAnimation.opacity(1 - scrollTop / (164 * ratio)).step();
        } else {
            this.nameAnimation.translate(0, -288 * this.ratio).step();
            this.avatarAnimation.translate(-325 * this.ratio, -170 * this.ratio);
            this.avatarAnimation.scale(0.5);
            this.avatarAnimation.step();
            this.infoAnimation.opacity(0).step();
        }
        this.setData({
            avatarAnimation: this.avatarAnimation.export(),
            nameAnimation: this.nameAnimation.export(),
            infoAnimation: this.infoAnimation.export()
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
