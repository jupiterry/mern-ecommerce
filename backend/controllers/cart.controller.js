import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity = 1 } = req.body;  // 🚀 `quantity` eksikse 1 olarak ayarla
		const user = req.user;

		if (!productId) {
			return res.status(400).json({ error: "Ürün ID eksik!" });
		}

		if (isNaN(quantity) || quantity <= 0) {
			console.log("HATA: Geçersiz miktar!", quantity);
			return res.status(400).json({ error: "Geçersiz miktar!" });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ error: "Ürün bulunamadı!" });
		}

		// Kullanıcının sepetindeki ürünleri kontrol et
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			user.cartItems.push({ product: productId, quantity });
		}

		await user.save();
		res.status(200).json(user.cartItems);
	} catch (error) {
		console.error("Sepete ürün eklerken hata oluştu:", error.message);
		res.status(500).json({ message: "Sepete ürün eklenirken hata oluştu", error: error.message });
	}
};



// ✅ Sepetteki ürünleri getiren fonksiyon
export const getCartProducts = async (req, res) => {
	try {
		const validCartItems = req.user.cartItems.filter(item => item.product);
		const products = await Product.find({ _id: { $in: validCartItems.map(item => item.product) } });

		const cartItems = products.map((product) => {
			const item = validCartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.error("Error in getCartProducts controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ✅ Sepetteki tüm ürünleri kaldırma fonksiyonu
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.error("Error in removeAllFromCart controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ✅ Sepetteki ürün miktarını güncelleyen fonksiyon
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find(item => item.product && item.product.toString() === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.error("Error in updateQuantity controller:", error.message);
		res.status(500).json({ message: "Error updating quantity", error: error.message });
	}
};

// ✅ Sipariş oluşturma fonksiyonu
export const placeOrder = async (req, res) => {
	try {
		const { address } = req.body;
		const user = req.user;

		if (!user.cartItems || user.cartItems.length === 0) {
			return res.status(400).json({ error: "Sepetiniz boş!" });
		}

		let totalAmount = 0;
		const orderProducts = await Promise.all(
			user.cartItems.map(async (cartItem) => {
				const product = await Product.findById(cartItem.product);
				if (!product) {
					throw new Error(`Ürün bulunamadı: ${cartItem.product}`);
				}
				totalAmount += product.price * cartItem.quantity;

				return {
					product: product._id,
					name: product.name,
					quantity: cartItem.quantity,
					price: product.price,
				};
			})
		);

		const newOrder = new Order({
			user: user._id,
			products: orderProducts,
			totalAmount,
			address,
		});

		await newOrder.save();

		user.cartItems = []; // **Sipariş oluşturulduktan sonra sepeti temizle**
		await user.save();

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

// ✅ **Tüm fonksiyonları düzgün şekilde export ettiğimizden emin olalım**

