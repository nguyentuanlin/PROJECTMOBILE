import React, { createContext, useState } from 'react';

// Tạo context
export const OrderContext = createContext();

// Tạo provider cho context
export const OrderProvider = ({ children }) => {
  const [orderHistory, setOrderHistory] = useState([]);

  // Hàm thêm đơn hàng vào lịch sử
  const addOrderToHistory = (order) => {
    setOrderHistory((prevOrderHistory) => [...prevOrderHistory, order]);
  };

  return (
    <OrderContext.Provider value={{ orderHistory, addOrderToHistory }}>
      {children}
    </OrderContext.Provider>
  );
};
