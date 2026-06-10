const app = getApp();

Page({
  data: {
    banners: [
      {
        id: 1,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=beautiful%20milk%20tea%20shop%20banner%20with%20colorful%20drinks%20pink%20background&image_size=landscape_16_9'
      },
      {
        id: 2,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=delicious%20bubble%20tea%20promotion%20banner%20summer%20drinks&image_size=landscape_16_9'
      },
      {
        id: 3,
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20cartoon%20milk%20tea%20characters%20banner%20colorful&image_size=landscape_16_9'
      }
    ],
    categories: [
      { id: 1, name: '经典奶茶', icon: '🍵', color: '#ffe4e1' },
      { id: 2, name: '果茶系列', icon: '🍊', color: '#ffe4b5' },
      { id: 3, name: '芝士奶盖', icon: '🧀', color: '#e0ffc1' },
      { id: 4, name: '季节限定', icon: '🌸', color: '#ffd1dc' },
      { id: 5, name: '咖啡系列', icon: '☕', color: '#d2b48c' },
      { id: 6, name: '甜品小食', icon: '🍰', color: '#fff5e6' },
      { id: 7, name: '冰淇淋', icon: '🍦', color: '#e6f7ff' },
      { id: 8, name: '新品上市', icon: '✨', color: '#fce4ec' }
    ],
    products: []
  },

  onLoad: function () {
    this.loadProducts();
  },

  loadProducts: function() {
    const db = wx.cloud.database();
    db.collection('products').get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          products: res.data
        });
      } else {
        this.setData({
          products: this.getMockProducts()
        });
      }
    }).catch(err => {
      console.error('获取商品失败', err);
      this.setData({
        products: this.getMockProducts()
      });
    });
  },

  getMockProducts: function() {
    return [
      {
        _id: '1',
        name: '珍珠奶茶',
        description: '经典黑糖珍珠，Q弹有嚼劲',
        price: 12,
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
        description: '浓郁芝士搭配清香绿茶',
        price: 18,
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
        description: '新鲜芒果现榨，果香四溢',
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
        description: '新鲜草莓搭配浓郁芝士',
        price: 20,
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
        description: '香甜芋泥配Q弹波波',
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
        description: '芒果西柚西米露经典搭配',
        price: 22,
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
        description: '香浓咖啡配焦糖酱',
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
        description: '日本宇治抹茶配鲜奶',
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
  },

  goToCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  goToMore: function() {
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  handleAddToCart: function(e) {
    const item = e.currentTarget.dataset.item;
    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      spec: item.specs[0] || '中杯',
      sugar: '五分糖',
      temp: '冰',
      quantity: 1
    };
    app.addToCart(cartItem);
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  }
});