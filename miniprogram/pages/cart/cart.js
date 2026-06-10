const app = getApp();

Page({
  data: {
    cart: [],
    selectedItems: {},
    selectAll: false,
    isEditMode: false,
    totalPrice: 0,
    totalCount: 0,
    selectedCount: 0
  },

  onShow: function () {
    this.loadCart();
  },

  loadCart: function() {
    const cart = app.globalData.cart;
    const selectedItems = {};
    cart.forEach((item, index) => {
      selectedItems[index] = true;
    });
    this.setData({
      cart: cart,
      selectedItems: selectedItems
    });
    this.updateSelectAll();
    this.calculateTotal();
  },

  toggleSelectAll: function() {
    const { cart, selectAll } = this.data;
    const selectedItems = {};
    cart.forEach((item, index) => {
      selectedItems[index] = !selectAll;
    });
    this.setData({
      selectedItems: selectedItems,
      selectAll: !selectAll
    });
    this.calculateTotal();
  },

  toggleItemSelect: function(e) {
    const index = e.currentTarget.dataset.index;
    const { selectedItems, cart } = this.data;
    selectedItems[index] = !selectedItems[index];
    this.setData({
      selectedItems: selectedItems
    });
    this.updateSelectAll();
    this.calculateTotal();
  },

  updateSelectAll: function() {
    const { cart, selectedItems } = this.data;
    const selectAll = cart.length > 0 && cart.every((item, index) => selectedItems[index]);
    this.setData({
      selectAll: selectAll
    });
  },

  calculateTotal: function() {
    const { cart, selectedItems } = this.data;
    let totalPrice = 0;
    let totalCount = 0;
    let selectedCount = 0;

    cart.forEach((item, index) => {
      totalCount += item.quantity;
      if (selectedItems[index]) {
        totalPrice += item.price * item.quantity;
        selectedCount += item.quantity;
      }
    });

    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      selectedCount: selectedCount
    });
  },

  increaseQty: function(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart[index].quantity += 1;
    this.setData({
      cart: cart
    });
    app.saveCart();
    this.calculateTotal();
  },

  decreaseQty: function(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      this.setData({
        cart: cart
      });
      app.saveCart();
      this.calculateTotal();
    }
  },

  toggleEdit: function() {
    this.setData({
      isEditMode: !this.data.isEditMode
    });
  },

  deleteItem: function(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart.splice(index, 1);
    const selectedItems = {};
    cart.forEach((item, idx) => {
      selectedItems[idx] = true;
    });
    this.setData({
      cart: cart,
      selectedItems: selectedItems
    });
    app.saveCart();
    this.updateSelectAll();
    this.calculateTotal();
    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },

  checkout: function() {
    if (this.data.isEditMode) {
      this.deleteSelectedItems();
    } else {
      if (this.data.selectedCount === 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        });
        return;
      }
      const selectedProducts = this.data.cart.filter((item, index) => this.data.selectedItems[index]);
      if (selectedProducts.length === 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        });
        return;
      }
      const order = {
        orderNo: 'NT' + Date.now(),
        items: selectedProducts,
        totalPrice: this.data.totalPrice,
        createTime: Date.now(),
        status: 'pending'
      };
      app.globalData.orders.unshift(order);
      const newCart = this.data.cart.filter((item, index) => !this.data.selectedItems[index]);
      app.globalData.cart = newCart;
      app.saveCart();
      wx.showToast({
        title: '下单成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/orders/orders'
        });
      }, 1500);
    }
  },

  deleteSelectedItems: function() {
    const newCart = this.data.cart.filter((item, index) => !this.data.selectedItems[index]);
    const selectedItems = {};
    newCart.forEach((item, idx) => {
      selectedItems[idx] = true;
    });
    this.setData({
      cart: newCart,
      selectedItems: selectedItems,
      isEditMode: false
    });
    app.globalData.cart = newCart;
    app.saveCart();
    this.updateSelectAll();
    this.calculateTotal();
    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },

  goShopping: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});