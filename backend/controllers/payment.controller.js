import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Sipariş oluşturma fonksiyonu
export const createOrder = async (req, res) => {
  try {
    const { products, city, district, phone } = req.body;

    // Geçerli ürünlerin olup olmadığını kontrol et
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Sepetiniz boş!" });
    }

    // Geçerli şehir ve ilçe seçimi kontrolü
    if (!city || !district) {
      return res.status(400).json({ error: "Lütfen il ve ilçe seçin!" });
    }

    // Geçerli telefon numarası kontrolü
    if (!phone || phone.length < 10) {
      return res.status(400).json({ error: "Geçerli bir telefon numarası girin!" });
    }

    let totalAmount = 0;

    // Ürünleri kontrol et ve sipariş için gerekli verileri oluştur
    const orderProducts = await Promise.all(
      products.map(async (p) => {
        if (!p.product) {
          throw new Error("Ürün ID'si eksik!");
        }

        const product = await Product.findById(p.product);
        if (!product) {
          throw new Error(`Ürün bulunamadı: ${p.product}`);
        }

        totalAmount += product.price * p.quantity;

        return {
          product: product._id,
          name: product.name,
          quantity: p.quantity,
          price: product.price,
        };
      })
    );

    // Yeni siparişi oluştur
    const newOrder = new Order({
      user: req.user._id,
      products: orderProducts,
      totalAmount,
      city,
      district,
      phone,
    });

    // Siparişi kaydet
    await newOrder.save();

    // Sipariş başarıyla oluşturulduğunda, kullanıcının sepetini temizle
    req.user.cartItems = [];
    await req.user.save(); // Sepeti sıfırla

    res.status(201).json({
      success: true,
      message: "Sipariş başarıyla oluşturuldu.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Sipariş oluşturulurken hata oluştu:", error);
    res.status(500).json({ message: "Sipariş oluşturulurken hata oluştu", error: error.message });
  }
};

// Sipariş detaylarını döndürme
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Siparişi ID ile bulalım
    const order = await Order.findById(orderId)
      .populate("products.product", "name price") // Ürün ismi ve fiyatını da alalım
      .populate("user", "name email"); // Kullanıcı bilgileri
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı!" });
    }

    res.status(200).json(order); // Sipariş bilgilerini gönderiyoruz
  } catch (error) {
    console.error("Sipariş detayları alınırken hata oluştu:", error);
    res.status(500).json({ message: "Sipariş detayları alınırken hata oluştu", error: error.message });
  }
};
// Admin siparişlerini listeleme

// payment.controller.js

export const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find()  // Veritabanındaki tüm siparişleri alıyoruz
            .populate("user", "name email")  // Sipariş veren kişinin bilgilerini alıyoruz
            .populate("products.product", "name price");  // Ürün bilgilerini alıyoruz
        
        if (orders.length === 0) {
            return res.status(404).json({ message: "Sipariş bulunamadı!" });
        }

        res.status(200).json(orders);  // Siparişleri döndürüyoruz
    } catch (error) {
        console.error("Siparişler alınırken hata oluştu:", error);
        res.status(500).json({ message: "Siparişler alınırken hata oluştu", error: error.message });
    }
};
