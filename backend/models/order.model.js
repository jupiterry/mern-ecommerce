import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    city: {
      type: String,
      required: true, // ✅ Adresin şehir kısmı zorunlu hale getirildi
    },
    district: {
      type: String,
      required: true, // ✅ Adresin ilçe kısmı zorunlu hale getirildi
    },
    phone: {
      type: String,
      required: true, // ✅ Kullanıcı telefon numarası eklenerek zorunlu hale getirildi
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v); // 📌 10-15 haneli numara kontrolü
        },
        message: "Geçerli bir telefon numarası girin!",
      },
    },
    couponCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
