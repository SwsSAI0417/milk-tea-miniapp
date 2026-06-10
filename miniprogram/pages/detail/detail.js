const app = getApp();

Page({
  data: {
    product: {},
    selectedSpec: '',
    selectedSugar: '',
    selectedTemp: '',
    quantity: 1,
    cartCount: 0
  },

  onLoad: function(options) {
    const id = options.id;
    this.loadProduct(id);
    this.updateCartCount();
  },

  onShow: function() {
    this.updateCartCount();
  },

  loadProduct: function(id) {
    const db = wx.cloud.database();
    db.collection('products').doc(id).get().then(res => {
      this.setProduct(res.data);
    }).catch(err => {
      console.error('获取商品详情失败', err);
      this.setProduct(this.getMockProduct(id));
    });
  },

  getMockProduct: function(id) {
    const products = [
      {
        _id: '1',
        name: '珍珠奶茶',
        description: '经典黑糖珍珠，Q弹有嚼劲，浓郁奶茶香',
        price: 12,
        originalPrice: 15,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=classic%20bubble%20milk%20tea%20with%20black%20pearls%20in%20clear%20cup&image_size=square',
        sales: 1234,
        tag: '爆款',
        category: '经典奶茶',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['热', '温', '冰']
      },
      {
        _id: '2',
        name: '芝士奶盖茶',
        description: '浓郁芝士搭配清香绿茶，口感丰富',
        price: 18,
        originalPrice: 22,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheese%20foam%20milk%20tea%20with%20green%20tea%20layered%20drink&image_size=square',
        sales: 892,
        tag: '人气',
        category: '芝士奶盖',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['热', '温', '冰']
      },
      {
        _id: '3',
        name: '芒果果茶',
        description: '新鲜芒果现榨，果香四溢，清爽解渴',
        price: 16,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20mango%20fruit%20tea%20with%20slices%20in%20glass&image_size=square',
        sales: 756,
        tag: '',
        category: '果茶系列',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['冰']
      },
      {
        _id: '4',
        name: '草莓芝士奶盖',
        description: '新鲜草莓搭配浓郁芝士，少女心爆棚',
        price: 20,
        originalPrice: 25,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=strawberry%20cheese%20foam%20tea%20pink%20color%20in%20cup&image_size=square',
        sales: 634,
        tag: '新品',
        category: '芝士奶盖',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['冰']
      },
      {
        _id: '5',
        name: '芋泥波波奶茶',
        description: '香甜芋泥配Q弹波波，口感丰富',
        price: 15,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=taro%20puree%20milk%20tea%20with%20boba%20purple%20color&image_size=square',
        sales: 521,
        tag: '',
        category: '经典奶茶',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['热', '温', '冰']
      },
      {
        _id: '6',
        name: '杨枝甘露',
        description: '芒果西柚西米露经典搭配，港式甜品',
        price: 22,
        originalPrice: 28,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=classic%20hong%20kong%20style%20mango%20sago%20dessert%20in%20cup&image_size=square',
        sales: 445,
        tag: '推荐',
        category: '果茶系列',
        specs: ['中杯', '大杯'],
        sugar: ['三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['冰']
      },
      {
        _id: '7',
        name: '焦糖玛奇朵',
        description: '香浓咖啡配焦糖酱，经典咖啡饮品',
        price: 24,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=caramel%20macchiato%20coffee%20with%20latte%20art&image_size=square',
        sales: 389,
        tag: '',
        category: '咖啡系列',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['热', '冰']
      },
      {
        _id: '8',
        name: '抹茶拿铁',
        description: '日本宇治抹茶配鲜奶，茶香浓郁',
        price: 22,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=matcha%20latte%20green%20tea%20milk%20coffee%20in%20cup&image_size=square',
        sales: 342,
        tag: '',
        category: '咖啡系列',
        specs: ['中杯', '大杯'],
        sugar: ['无糖', '三分糖', '五分糖', '七分糖', '全糖'],
        temp: ['热', '冰']
      }
    ];
    return products.find(p => p._id === id) || products[0];
  },

  setProduct: function(product) {
    this.setData({
      product: product,
      selectedSpec: product.specs && product.specs.length > 0 ? product.specs[0] : '中杯',
      selectedSugar: product.sugar && product.sugar.length > 0 ? product.sugar[2] || '五分糖' : '五分糖',
      selectedTemp: product.temp && product.temp.length > 0 ? product.temp[0] : '冰'
    });
  },

  selectSpec: function(e) {
    const spec = e.currentTarget.dataset.spec;
    this.setData({
      selectedSpec: spec
    });
  },

  selectSugar: function(e) {
    const sugar = e.currentTarget.dataset.sugar;
    this.setData({
      selectedSugar: sugar
    });
  },

  selectTemp: function(e) {
    const temp = e.currentTarget.dataset.temp;
    this.setData({
      selectedTemp: temp
    });
  },

  increaseQty: function() {
    this.setData({
      quantity: this.data.quantity + 1
    });
  },

  decreaseQty: function() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },

  increaseQtyFast: function() {
    this.setData({
      quantity: this.data.quantity + 5
    });
  },

  decreaseQtyFast: function() {
    if (this.data.quantity > 5) {
      this.setData({
        quantity: this.data.quantity - 5
      });
    } else if (this.data.quantity > 1) {
      this.setData({
        quantity: 1
      });
    }
  },

  updateCartCount: function() {
    this.setData({
      cartCount: app.getCartCount()
    });
  },

  addToCart: function() {
    const { product, selectedSpec, selectedSugar, selectedTemp, quantity } = this.data;
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      spec: selectedSpec,
      sugar: selectedSugar,
      temp: selectedTemp,
      quantity: quantity
    };
    for (let i = 0; i < quantity; i++) {
      app.addToCart({...cartItem, quantity: 1});
    }
    this.updateCartCount();
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  buyNow: function() {
    const { product, selectedSpec, selectedSugar, selectedTemp, quantity } = this.data;
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      spec: selectedSpec,
      sugar: selectedSugar,
      temp: selectedTemp,
      quantity: quantity
    };
    for (let i = 0; i < quantity; i++) {
      app.addToCart({...cartItem, quantity: 1});
    }
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  }
});