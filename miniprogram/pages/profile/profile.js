const app = getApp();

Page({
  data: {
    orderStats: {
      total: 0,
      pending: 0,
      paid: 0,
      delivered: 0
    }
  },

  onShow: function () {
    this.updateOrderStats();
  },

  updateOrderStats: function() {
    const orders = app.globalData.orders.length > 0 ? app.globalData.orders : this.getMockOrders();
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };
    this.setData({
      orderStats: stats
    });
  },

  getMockOrders: function() {
    return [
      { status: 'pending' },
      { status: 'paid' },
      { status: 'delivered' },
      { status: 'delivered' }
    ];
  },

  editProfile: function() {
    wx.showToast({
      title: '编辑资料功能开发中',
      icon: 'none'
    });
  },

  goToOrders: function() {
    wx.switchTab({
      url: '/pages/orders/orders'
    });
  },

  goToOrdersWithStatus: function(e) {
    const status = e.currentTarget.dataset.status;
    wx.switchTab({
      url: '/pages/orders/orders'
    });
    setTimeout(() => {
      const pages = getCurrentPages();
      const orderPage = pages[pages.length - 1];
      if (orderPage && orderPage.switchTab) {
        orderPage.switchTab({ currentTarget: { dataset: { key: status } } });
      }
    }, 100);
  },

  goToCoupons: function() {
    wx.showToast({
      title: '优惠券功能开发中',
      icon: 'none'
    });
  },

  goToAddress: function() {
    wx.showToast({
      title: '收货地址功能开发中',
      icon: 'none'
    });
  },

  goToFavorites: function() {
    wx.showToast({
      title: '我的收藏功能开发中',
      icon: 'none'
    });
  },

  goToHistory: function() {
    wx.showToast({
      title: '浏览记录功能开发中',
      icon: 'none'
    });
  },

  goToHelp: function() {
    wx.showModal({
      title: '帮助中心',
      content: '如有任何问题，请联系在线客服。\n\n客服时间：9:00 - 22:00',
      showCancel: false
    });
  },

  goToSettings: function() {
    wx.showModal({
      title: '设置',
      content: '小程序设置页面',
      showCancel: false
    });
  },

  contactService: function() {
    wx.showToast({
      title: '正在连接客服...',
      icon: 'loading'
    });
    setTimeout(() => {
      wx.showModal({
        title: '在线客服',
        content: '您好！请问有什么可以帮助您的？',
        showCancel: false
      });
    }, 1000);
  }
});