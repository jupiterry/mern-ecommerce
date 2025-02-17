import React, { useEffect, useState } from "react";
import axios from "../lib/axios";

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await axios.get("/api/orders");  // Siparişleri alıyoruz
          setOrders(res.data);  // Siparişleri state'e kaydediyoruz
        } catch (error) {
          console.error("Siparişler alınırken hata oluştu:", error);
        }
      };
  
      fetchOrders();  // Siparişleri al
    }, []);
    return (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">Siparişler</h2>
          {orders.length === 0 ? (
            <p>Henüz sipariş bulunmamaktadır.</p>
          ) : (
            <table className="table-auto w-full text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Müşteri</th>
                  <th className="px-4 py-2">Ürünler</th>
                  <th className="px-4 py-2">Toplam</th>
                  <th className="px-4 py-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2">{order.user.name}</td>
                    <td className="px-4 py-2">
                      {order.products.map((product, index) => (
                        <div key={index}>{product.name} (x{product.quantity})</div>
                      ))}
                    </td>
                    <td className="px-4 py-2">${order.totalAmount}</td>
                    <td className="px-4 py-2">
                      <button className="text-red-500">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    };
    

export default OrdersTab;
