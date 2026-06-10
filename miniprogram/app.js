// app.js
App({
  onLaunch: function () {
    this.globalData = {
      env: "cloud1-0gq2303k99f9a15c",
      userInfo: null,
      cart: [],
      orders: []
    };
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
    this.loadCart();
  },
  
  loadCart: function() {
    try {
      const cart = wx.getStorageSync('cart');
      if (cart) {
        this.globalData.cart = cart;
      }
    } catch (e) {
      console.error('加载购物车失败', e);
    }
  },
  
  saveCart: function() {
    try {
      wx.setStorageSync('cart', this.globalData.cart);
    } catch (e) {
      console.error('保存购物车失败', e);
    }
  },
  
  addToCart: function(goods) {
    const cart = this.globalData.cart;
    const existingIndex = cart.findIndex(item => item._id === goods._id && item.spec === goods.spec);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += goods.quantity;
    } else {
      cart.push({...goods});
    }
    this.saveCart();
  },
  
  removeFromCart: function(index) {
    this.globalData.cart.splice(index, 1);
    this.saveCart();
  },
  
  clearCart: function() {
    this.globalData.cart = [];
    this.saveCart();
  },
  
  getCartTotal: function() {
    return this.globalData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  
  getCartCount: function() {
    return this.globalData.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
});