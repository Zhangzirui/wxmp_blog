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
       
    },
    onReady() {
        this.avatarAnimation = wx.createAnimation();
        this.nameAnimation = wx.createAnimation();
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        console.log(this.scrollTop);
        this.animation();
    },
    animation(scrollTop) {
        if (scrollTop <= 160) {
            this.nameAnimation.translateY(-this.scrollTop).step();
            if (scrollTop <= 80) {
                this.avatarAnimation.translateY(-this.scrollTop).step();
                this.setData({
                    avatarAnimation: this.avatarAnimation.export(),
                    nameAnimation: this.nameAnimation.export()
                });
            } else {
                this.avatarAnimation.translateX()
            }
        }
    },
    translate() {
        // this.avatarAnimation.translate();
    },
    toggleShare(e) {
        const {open} = e.currentTarget.dataset;
        let {isShowShare, isDisableScroll} = this.data;

        if (open) {
            isShowShare = true;
            isDisableScroll = true;
        } else {
            isShowShare = false;
            isDisableScroll = false;
        }
        this.setData({
            isShowShare,
            isDisableScroll
        });
    }
});
