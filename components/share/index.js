const FIX_WIDTH = 650;
let isFirst = true;

Component({
    properties: {
        defineAllInfo: {
            type: Boolean,
            value: false
        },
        isShowShare: {
            type: Boolean,
            value: false,
            observer: function(newValue) {
                if (newValue && isFirst) {
                    this.draw();
                    isFirst = false;
                }
            }
        },
        shareData: {
            type: Object,
            value: {
                wrapSrc: 'https://s.qunarzz.com/vacation_react/wxapp/carp/carpShare_02.jpg',
                qrcode: 'https://b-wechatcentercp.qunarzz.com/b_wechatcenter_b_wechatcenter/15399320976685ed7d9fb3b274d2686903f25044d4cff.jpeg',
                wrapSize: {
                    // h: 923,
                    h: 2418,
                    w: 650
                },
                qrcodeSize: {
                    h: 180,
                    w: 180,
                    left: 56,
                    top: 673
                }
            }
        }
    },
    data: {
        isShowZoneShare: false,
        canvasH: 923,
        canvasW: FIX_WIDTH,
        tempFilePath: ''
    },
    attached() {
        this.rectify();
        this.getTransformSize();
        this.rectifyAuthorization();
    },
    methods: {
        draw() {
            const {wrapSrc, qrcode} = this.data.shareData;
            const {
                wrapW,
                wrapH,
                qrcodeH,
                qrcodeW,
                qrcodeLeft,
                qrcodeTop
            } = this.size;
            const ratio = this.ratio;
            const ctx = wx.createCanvasContext('share', this);
            Promise.all([this.getImageInfo(wrapSrc), this.getImageInfo(qrcode)])
                .then((res) => {
                    ctx.drawImage(res[0].path, 0, 0, wrapW * ratio, wrapH * ratio);
                    ctx.drawImage(res[1].path, qrcodeLeft * ratio, qrcodeTop * ratio, qrcodeW * ratio, qrcodeH * ratio);
                    ctx.draw(false, () => {
                        this.getImg();
                    });
                })
                .catch((e) => {
                    wx.showToast({
                        title: '未知错误',
                        icon: 'none',
                        duration: 2000
                    });
                });
        },
        getImageInfo(src) {
            return new Promise((resolve, reject) => {
                wx.getImageInfo({
                    src,
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });
        },
        getImg() {
            const {canvasH, canvasW, shareData} = this.data;
            const {h: wrapH, w: wrapW} = shareData.wrapSize;
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: canvasW,
                height: canvasH,
                destWidth: wrapW,
                destHeight: wrapH,
                canvasId: 'share',
                success: (res) => {
                    this.setData({
                        tempFilePath: res.tempFilePath
                    });
                }
            }, this);
        },
        onSaveImg() {
            const {canvasH, canvasW, shareData} = this.data;
            const {h: wrapH, w: wrapW} = shareData.wrapSize;

            if (this.writePhotosAlbum === false) {
                wx.showModal({
                    title: '是否打开设置页面',
                    content: '需要获取您保存图片到手机的权限认可，请允许打开设置页面进行授权',
                    success: (res) => {
                        if (res.confirm) {
                            wx.openSetting({
                                complete: () => {
                                    this.rectifyAuthorization();
                                }
                            });
                        }
                    }
                });
            }

            wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: canvasW,
                        height: canvasH,
                        destWidth: wrapW,
                        destHeight: wrapH,
                        canvasId: 'share',
                        success: (res) => {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: () => {
                                    wx.showToast({
                                        title: '图片保存成功'
                                    });
                                },
                                fail: () => {
                                    wx.showToast({
                                        icon: 'none',
                                        title: '图片保存失败'
                                    });
                                }
                            });
                        },
                        complete: () => {
                            this.onCloseShare();
                        }
                    }, this);
                },
                complete: () => {
                    this.rectifyAuthorization();
                }
            });
        },
        onCloseShare() {
            this.onToggleZoneShare();
            this.triggerEvent('closeshare');
        },
        onToggleZoneShare(e) {
            let open = false;

            if (e && e.currentTarget) {
                open = e.currentTarget.dataset.open || false;
            }

            this.setData({
                isShowZoneShare: open
            });
        },
        rectify() {
            wx.getSystemInfo({
                success: (res) => {
                    this.ratio = res.windowWidth / 750;
                }
            });
        },
        getTransformSize() {
            const {wrapSize, qrcodeSize} = this.data.shareData;
            const {h: wrapH, w: wrapW} = wrapSize;
            const {h: qrcodeH, w: qrcodeW, left: qrcodeLeft, top: qrcodeTop} = qrcodeSize;
            const imageRatio = wrapW / FIX_WIDTH;

            this.size = {
                wrapW: FIX_WIDTH,
                wrapH: wrapH * imageRatio,
                qrcodeH: qrcodeH * imageRatio,
                qrcodeW: qrcodeW * imageRatio,
                qrcodeLeft: qrcodeLeft * imageRatio,
                qrcodeTop: qrcodeTop * imageRatio
            };
            this.setData({
                canvasH: wrapH * imageRatio
            });
        },
        rectifyAuthorization() {
            wx.getSetting({success: (res) => {
                this.writePhotosAlbum = res.authSetting['scope.writePhotosAlbum'];
            }});
        }
    }
});
