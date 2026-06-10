const app = getApp();

Page({
  data: {
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待支付' },
      { key: 'paid', label: '待配送' },
      { key: 'delivered', label: '已送达' }
    ],
    currentTab: 'all',
    orders: [],
    filteredOrders: []
  },

  onShow: function () {
    this.loadOrders();
  },

  loadOrders: function() {
    const orders = app.globalData.orders.length > 0 ? app.globalData.orders : this.getMockOrders();
    this.setData({
      orders: orders
    });
    this.filterOrders();
  },

  getMockOrders: function() {
    return [
      {
        orderNo: 'NT' + (Date.now() - 3600000),
        items: [
          {
            name: '珍珠奶茶',
            price: 12,
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=classic%20bubble%20milk%20tea%20with%20black%20pearls%20in%20clear%20cup&image_size=square',
            spec: '大杯',
            sugar: '五分糖',
            temp: '冰',
            quantity: 2
          },
          {
            name: '芝士奶盖茶',
            price: 18,
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheese%20foam%20milk%20tea%20with%20green%20tea%20layered%20drink&image_size=square',
            spec: '中杯',
            sugar: '三分糖',
            temp: '温',
            quantity: 1
          }
        ],
        totalPrice: 42,
        createTime: Date.now() - 3600000,
        status: 'delivered'
      },
      {
        orderNo: 'NT' + (Date.now() - 7200000),
        items: [
          {
            name: '芒果果茶',
            price: 16,
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20mango%20fruit%20tea%20with%20slices%20in%20glass&image_size=square',
            spec: '大杯',
            sugar: '五分糖',
            temp: '冰',
            quantity: 1
          }
        ],
        totalPrice: 16,
        createTime: Date.now() - 7200000,
        status: 'paid'
      },
      {
        orderNo: 'NT' + (Date.now() - 1800000),
        items: [
          {
            name: '草莓芝士奶盖',
            price: 20,
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=strawberry%20cheese%20foam%20tea%20pink%20color%20in%20cup&image_size=square',
            spec: '大杯',
            sugar: '七分糖',
            temp: '冰',
            quantity: 1
          },
          {
            name: '芋泥波波奶茶',
            price: 15,
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=taro%20puree%20milk%20tea%20with%20boba%20purple%20color&image_size=square',
            spec: '中杯',
            sugar: '五分糖',
            temp: '热',
            quantity: 1
          }
        ],
        totalPrice: 35,
        createTime: Date.now() - 1800000,
        status: 'pending'
      }
    ];
  },

  switchTab: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      currentTab: key
    });
    this.filterOrders();
  },

  filterOrders: function() {
    const { orders, currentTab } = this.data;
    if (currentTab === 'all') {
      this.setData({
        filteredOrders: orders
      });
    } else {
      this.setData({
        filteredOrders: orders.filter(order => order.status === currentTab)
      });
    }
  },

  getStatusText: function(status) {
    const statusMap = {
      pending: '待支付',
      paid: '待配送',
      delivered: '已送达'
    };
    return statusMap[status] || status;
  },

  getStatusColor: function(status) {
    const colorMap = {
      pending: '#faad14',
      paid: '#1890ff',
      delivered: '#52c41a'
    };
    return colorMap[status] || '#999999';
  },

  getActionText: function(status) {
    const actionMap = {
      pending: '立即支付',
      paid: '确认收货',
      delivered: '再来一单'
    };
    return actionMap[status] || '查看详情';
  },

  handleOrderAction: function(e) {
    const order = e.currentTarget.dataset.order;
    if (order.status === 'pending') {
      this.payOrder(order);
    } else if (order.status === 'paid') {
      this.confirmDelivery(order);
    } else if (order.status === 'delivered') {
      this.reorder(order);
    }
  },

  payOrder: function(order) {
    wx.showModal({
      title: '支付订单',
      content: `订单金额: ¥${order.totalPrice}`,
      confirmText: '确认支付',
      success: (res) => {
        if (res.confirm) {
          const orders = this.data.orders;
          const index = orders.findIndex(o => o.orderNo === order.orderNo);
          if (index > -1) {
            orders[index].status = 'paid';
            this.setData({
              orders: orders
            });
            app.globalData.orders = orders;
            this.filterOrders();
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
          }
        }
      }
    });
  },

  confirmDelivery: function(order) {
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品吗？',
      confirmText: '确认收货',
      success: (res) => {
        if (res.confirm) {
          const orders = this.data.orders;
          const index = orders.findIndex(o => o.orderNo === order.orderNo);
          if (index > -1) {
            orders[index].status = 'delivered';
            this.setData({
              orders: orders
            });
            app.globalData.orders = orders;
            this.filterOrders();
            wx.showToast({
              title: '已确认收货',
              icon: 'success'
            });
          }
        }
      }
    });
  },

  reorder: function(order) {
    order.items.forEach(item => {
      const cartItem = {
        _id: item._id || Date.now().toString(),
        name: item.name,
        price: item.price,
        image: item.image,
        spec: item.spec,
        sugar: item.sugar,
        temp: item.temp,
        quantity: item.quantity
      };
      app.addToCart(cartItem);
    });
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/cart/cart'
      });
    }, 1500);
  },

  goShopping: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});