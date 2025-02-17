import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore";

const OrdersList = () => {
  const { orders, deleteOrder } = useOrderStore();
  console.log("orders", orders);
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Müşteri</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ürünler</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Toplam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlemler</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {orders?.map((order) => (
            <tr key={order._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{order.phone}</div>
                <div className="text-sm text-gray-300">{order.user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {order.products.map((product) => product.name).join(", ")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-emerald-400">${order.totalAmount.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => deleteOrder(order._id)} className="text-red-400 hover:text-red-300">
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default OrdersList;
