import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import { useState } from "react";
import cities from "../data/cities"; // 📌 81 ili içeren JSON dosyası (oluşturacağız)

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart, clearCart } = useCartStore(); // clearCart'i buradan aldık
	const [selectedCity, setSelectedCity] = useState("");
	const [selectedDistrict, setSelectedDistrict] = useState("");
	const [phone, setPhone] = useState("");

	const districts = selectedCity ? cities[selectedCity] || [] : []; // 📌 Seçilen ilin ilçeleri

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);
	const handlePayment = async () => {
		try {
			console.log("Proceed to Checkout tıklandı");
			console.log("Sepet Verisi:", cart);

			if (cart.length === 0) {
				alert("Sepetiniz boş!");
				return;
			}

			if (!selectedCity.trim() || !selectedDistrict.trim()) {
				alert("Lütfen il ve ilçe seçin!");
				return;
			}

			if (!phone.trim() || phone.length < 10) {
				alert("Geçerli bir telefon numarası girin!");
				return;
			}

			// 📌 API'ye gönderilecek ürünleri doğru formatta oluşturuyoruz
			const orderItems = cart.map((item) => ({
				product: item._id,  // ✅ Ürün ID'si
				name: item.name,  // ✅ Ürün Adı
				quantity: item.quantity,  // ✅ Miktar
				price: item.price,  // ✅ Fiyat
			}));

			const res = await axios.post("http://localhost:5000/api/orders/create-order", {
				products: orderItems,
				city: selectedCity,
				district: selectedDistrict,
				phone: phone,
			});

			if (res.data.success) {
				console.log("Sipariş oluşturuldu:", res.data);
				clearCart(); // Sepeti temizleme
				window.location.href = `/order-summary/${res.data.orderId}`;
			} else {
				console.error("Sipariş oluşturulurken hata:", res.data.message);
			}
		} catch (error) {
			console.error("Sipariş işleminde hata oluştu:", error);
		}
	};


	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className="text-xl font-semibold text-emerald-400">Order summary</p>

			<div className="space-y-4">
				<div className="space-y-2">
					<dl className="flex items-center justify-between gap-4">
						<dt className="text-base font-normal text-gray-300">Original price</dt>
						<dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className="flex items-center justify-between gap-4">
							<dt className="text-base font-normal text-gray-300">Savings</dt>
							<dd className="text-base font-medium text-emerald-400">-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className="flex items-center justify-between gap-4">
							<dt className="text-base font-normal text-gray-300">Coupon ({coupon.code})</dt>
							<dd className="text-base font-medium text-emerald-400">-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
						<dt className="text-base font-bold text-white">Total</dt>
						<dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
					</dl>
				</div>

				{/* 📌 İl Seçimi */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-300">City</label>
					<select
						className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						value={selectedCity}
						onChange={(e) => {
							setSelectedCity(e.target.value);
							setSelectedDistrict("");
						}}
					>
						<option value="">Select City</option>
						{Object.keys(cities).map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>

				{/* 📌 İlçe Seçimi */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-300">District</label>
					<select
						className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						value={selectedDistrict}
						onChange={(e) => setSelectedDistrict(e.target.value)}
						disabled={!selectedCity}
					>
						<option value="">Select District</option>
						{districts.map((district) => (
							<option key={district} value={district}>
								{district}
							</option>
						))}
					</select>
				</div>

				{/* 📌 Telefon Numarası */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-300">Phone Number</label>
					<input
						type="tel"
						placeholder="Enter your phone number"
						className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>

				{/* 📌 Proceed to Checkout Butonu */}
				<motion.button
					className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
