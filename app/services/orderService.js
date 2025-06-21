import { menuData } from "../data/menuData";

// Get orders from localStorage
const getLocalOrders = () => {
  if (typeof window === "undefined") return [];

  try {
    const orders = localStorage.getItem("restaurantOrders");
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error getting local orders:", error);
    return [];
  }
};

// Save orders to localStorage
const saveLocalOrders = (orders) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("restaurantOrders", JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving local orders:", error);
  }
};

// Create a new order (localStorage only)
export const createOrder = async (orderData) => {
  try {
    const orders = getLocalOrders();
    const newOrder = {
      order_id: Date.now().toString(), // Simple ID generation
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      order_type: orderData.orderType,
      table_number: orderData.tableNumber,
      delivery_address: orderData.deliveryAddress,
      payment_method: orderData.paymentMethod,
      status: "pending",
      items: orderData.items,
      timestamp: new Date().toISOString(),
      is_paid: false,
    };

    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get all orders (localStorage only)
export const getOrders = async () => {
  try {
    return getLocalOrders();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orders = getLocalOrders();
    const orderIndex = orders.findIndex((order) => order.order_id === orderId);

    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      saveLocalOrders(orders);
      return orders[orderIndex];
    }

    throw new Error("Order not found");
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Get orders by date range
export const getOrdersByDateRange = async (startDate, endDate) => {
  try {
    const orders = getLocalOrders();
    return orders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
  } catch (error) {
    console.error("Error fetching orders by date range:", error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orders = getLocalOrders();
    const order = orders.find((order) => order.order_id === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Get orders for a specific month
export const getOrdersByMonth = async (
  month,
  year = new Date().getFullYear()
) => {
  try {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === month.toLowerCase()
    );

    if (monthIndex === -1) throw new Error("Invalid month name");

    const orders = getLocalOrders();
    return orders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return (
        orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year
      );
    });
  } catch (error) {
    console.error("Error fetching orders by month:", error);
    return [];
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const orders = getLocalOrders();
    const filteredOrders = orders.filter((order) => order.order_id !== orderId);
    saveLocalOrders(filteredOrders);
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// Update order details
export const updateOrder = async (orderId, orderData) => {
  try {
    const orders = getLocalOrders();
    const orderIndex = orders.findIndex((order) => order.order_id === orderId);

    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        order_type: orderData.orderType,
        table_number: orderData.tableNumber,
        delivery_address: orderData.deliveryAddress,
        payment_method: orderData.paymentMethod,
        status: orderData.status,
        items: orderData.items,
      };
      saveLocalOrders(orders);
      return orders[orderIndex];
    }

    throw new Error("Order not found");
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Get order statistics
export const getOrderStats = (
  month = null,
  year = new Date().getFullYear()
) => {
  const orders = getLocalOrders();

  let filteredOrders = orders;
  if (month) {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === month.toLowerCase()
    );

    if (monthIndex !== -1) {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.timestamp);
        return (
          orderDate.getMonth() === monthIndex &&
          orderDate.getFullYear() === year
        );
      });
    }
  }

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((itemSum, item) => {
      return itemSum + item.price * item.quantity;
    }, 0);
    return sum + orderTotal;
  }, 0);

  const ordersByStatus = filteredOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const revenueByCategory = calculateRevenueByCategory(
    filteredOrders.flatMap((order) => order.items)
  );

  return {
    totalOrders,
    totalRevenue,
    ordersByStatus,
    revenueByCategory,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
};

const calculateRevenueByCategory = (items) => {
  const categoryRevenue = {};

  items.forEach((item) => {
    const menuItem = menuData.sections
      .flatMap((section) => section.items)
      .find((menuItem) => menuItem.name === item.name);

    const category = menuItem ? menuItem.category || "Other" : "Other";
    categoryRevenue[category] =
      (categoryRevenue[category] || 0) + item.price * item.quantity;
  });

  return categoryRevenue;
};

export const updateLocalOrderStatus = (orderId, newStatus) => {
  const orders = getLocalOrders();
  const orderIndex = orders.findIndex((order) => order.order_id === orderId);

  if (orderIndex !== -1) {
    const updatedOrder = { ...orders[orderIndex], status: newStatus };
    orders[orderIndex] = updatedOrder;
    saveLocalOrders(orders);
    return updatedOrder;
  }
  return null;
};

export const generateOrderCSV = (orders) => {
  const headers = [
    "Order ID",
    "Customer Name",
    "Phone",
    "Order Type",
    "Table Number",
    "Status",
    "Payment Method",
    "Total Amount",
    "Items",
    "Timestamp",
  ];

  const csvContent = [
    headers.join(","),
    ...orders.map((order) => {
      const totalAmount = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemsString = order.items
        .map((item) => `${item.name} x${item.quantity}`)
        .join("; ");

      return [
        order.order_id,
        `"${order.customer_name}"`,
        order.customer_phone,
        order.order_type,
        order.table_number || "",
        order.status,
        order.payment_method,
        totalAmount.toFixed(2),
        `"${itemsString}"`,
        new Date(order.timestamp).toLocaleString(),
      ].join(",");
    }),
  ].join("\n");

  return csvContent;
};

export const getRecentOrders = (limit = 10) => {
  const orders = getLocalOrders();
  return orders.slice(0, limit);
};

export const getRevenueData = (period = "monthly") => {
  const orders = getLocalOrders();
  const revenueData = {};

  orders.forEach((order) => {
    const date = new Date(order.timestamp);
    let key;

    if (period === "daily") {
      key = date.toISOString().split("T")[0];
    } else if (period === "weekly") {
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      key = weekStart.toISOString().split("T")[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    const orderTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    revenueData[key] = (revenueData[key] || 0) + orderTotal;
  });

  return Object.entries(revenueData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));
};
