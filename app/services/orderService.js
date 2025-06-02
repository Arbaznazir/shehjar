import { supabase } from "../../lib/supabaseClient";
import { menuData } from "../data/menuData";

// Create a new order in Supabase
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          order_type: orderData.orderType,
          table_number: orderData.tableNumber,
          delivery_address: orderData.deliveryAddress,
          payment_method: orderData.paymentMethod,
          status: 'pending',
          items: orderData.items
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders from Supabase
export const getOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', orderId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Get orders by date range
export const getOrdersByDateRange = async (startDate, endDate) => {
    try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders by date range:', error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
      try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Get orders for a specific month
export const getOrdersByMonth = async (month, year = new Date().getFullYear()) => {
  try {
    // Convert month name to number (0-11)
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
    const monthIndex = months.findIndex((m) => m.toLowerCase() === month.toLowerCase());
    
    if (monthIndex === -1) throw new Error('Invalid month name');

    // Create date range for the specified month
    const startDate = new Date(year, monthIndex, 1).toISOString();
    const endDate = new Date(year, monthIndex + 1, 0).toISOString();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders by month:', error);
    return [];
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Update order details
export const updateOrder = async (orderId, orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        order_type: orderData.orderType,
        table_number: orderData.tableNumber,
        delivery_address: orderData.deliveryAddress,
        payment_method: orderData.paymentMethod,
        status: orderData.status,
        items: orderData.items
      })
      .eq('order_id', orderId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

    (m) => m.toLowerCase() === month.toLowerCase()
  );

  if (monthIndex === -1) return [];

  return allOrders.filter((order) => {
    const orderDate = new Date(order.date);
    return (
      orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year
    );
  });
};

// Add a new order
export const addOrder = (order) => {
  if (typeof window === "undefined") return null;

  try {
    const orders = getOrders();

    // Generate ID if not provided
    if (!order.id) {
      const now = new Date();
      const id = `ORD-${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${
        orders.length
      }`;
      order.id = id;
    }

    // Set date if not provided
    if (!order.date) {
      order.date = new Date().toISOString();
    }

    const updatedOrders = [order, ...orders];
    localStorage.setItem("restaurantOrders", JSON.stringify(updatedOrders));
    return order;
  } catch (error) {
    console.error("Error adding order:", error);
    return null;
  }
};

// Get aggregated statistics
export const getOrderStats = (
  month = null,
  year = new Date().getFullYear()
) => {
  let orders;

  if (month) {
    orders = getOrdersByMonth(month, year);
  } else {
    orders = getOrders();
  }

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  // Calculate basic metrics
  const totalOrders = completedOrders.length;
  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancelRate =
    orders.length > 0
      ? ((orders.length - completedOrders.length) / orders.length) * 100
      : 0;

  // Calculate item statistics
  const itemStats = {};

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemStats[item.id]) {
        itemStats[item.id] = {
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: 0,
          revenue: 0,
        };
      }

      itemStats[item.id].quantity += item.quantity;
      itemStats[item.id].revenue += item.price * item.quantity;
    });
  });

  const topSellingItems = Object.values(itemStats).sort(
    (a, b) => b.revenue - a.revenue
  );

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    cancelRate,
    topSellingItems: topSellingItems.slice(0, 10),
    revenueByCategory: calculateRevenueByCategory(topSellingItems),
  };
};

// Helper to calculate revenue by category
const calculateRevenueByCategory = (items) => {
  const categoryRevenue = {};

  items.forEach((item) => {
    if (!categoryRevenue[item.category]) {
      categoryRevenue[item.category] = 0;
    }
    categoryRevenue[item.category] += item.revenue;
  });

  // Convert to array and sort
  return Object.entries(categoryRevenue)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
};

// Update order status and track revenue for completed orders
export const updateOrderStatus = (orderId, newStatus) => {
  if (typeof window === "undefined") return false;

  try {
    const allOrders = getOrders();
    const orderIndex = allOrders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) return false;

    const order = allOrders[orderIndex];
    const oldStatus = order.status;

    // Update order status
    allOrders[orderIndex] = { ...order, status: newStatus };

    // If status changed to 'completed', update revenue metrics
    if (newStatus === "completed" && oldStatus !== "completed") {
      // Add order to recent orders and update revenue metrics
      updateRevenueMetrics(order);
    }

    // Save updated orders
    localStorage.setItem("restaurantOrders", JSON.stringify(allOrders));

    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

// Helper function to update revenue metrics
const updateRevenueMetrics = (order) => {
  try {
    // Get daily revenue data or initialize it
    const revenueData = localStorage.getItem("revenueData")
      ? JSON.parse(localStorage.getItem("revenueData"))
      : { daily: {}, monthly: {}, items: {} };

    const orderDate = new Date(order.date);
    const dateString = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const monthString = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    // Update daily revenue
    if (!revenueData.daily[dateString]) {
      revenueData.daily[dateString] = {
        totalRevenue: 0,
        orderCount: 0,
        items: [],
      };
    }

    revenueData.daily[dateString].totalRevenue += order.total;
    revenueData.daily[dateString].orderCount += 1;

    // Update monthly revenue
    if (!revenueData.monthly[monthString]) {
      revenueData.monthly[monthString] = {
        totalRevenue: 0,
        orderCount: 0,
      };
    }

    revenueData.monthly[monthString].totalRevenue += order.total;
    revenueData.monthly[monthString].orderCount += 1;

    // Update item sales data
    order.items.forEach((item) => {
      if (!revenueData.items[item.id]) {
        revenueData.items[item.id] = {
          id: item.id,
          name: item.name,
          category: item.category,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }

      revenueData.items[item.id].totalQuantity += item.quantity;
      revenueData.items[item.id].totalRevenue += item.price * item.quantity;
    });

    // Save updated revenue data
    localStorage.setItem("revenueData", JSON.stringify(revenueData));

    // Add to recent orders (keep top 100)
    const recentOrders = localStorage.getItem("recentOrders")
      ? JSON.parse(localStorage.getItem("recentOrders"))
      : [];

    // Add current order to the beginning
    recentOrders.unshift(order);

    // Keep only the most recent 100 orders
    if (recentOrders.length > 100) {
      recentOrders.length = 100;
    }

    localStorage.setItem("recentOrders", JSON.stringify(recentOrders));
  } catch (error) {
    console.error("Error updating revenue metrics:", error);
  }
};

// Generate a CSV export of orders
export const generateOrderCSV = (orders) => {
  if (!orders || !orders.length) return "";

  // Create CSV header
  let csv = "Order ID,Date,Total,Items,Status,Payment Method\n";

  // Add data rows
  orders.forEach((order) => {
    const date = new Date(order.date).toLocaleDateString();
    const items = order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join("; ");

    csv += `"${order.id}","${date}","₹${order.total.toFixed(2)}","${items}","${
      order.status
    }","${order.paymentMethod}"\n`;
  });

  return csv;
};

// Get recent orders for displaying in dashboard or reports
export const getRecentOrders = (limit = 10) => {
  if (typeof window === "undefined") return [];

  try {
    const recentOrders = localStorage.getItem("recentOrders")
      ? JSON.parse(localStorage.getItem("recentOrders"))
      : [];

    return recentOrders.slice(0, limit);
  } catch (error) {
    console.error("Error retrieving recent orders:", error);
    return [];
  }
};

// Get revenue data for specified period
export const getRevenueData = (period = "monthly") => {
  if (typeof window === "undefined")
    return { dailyData: {}, monthlyData: {}, topItems: [] };

  try {
    const revenueData = localStorage.getItem("revenueData")
      ? JSON.parse(localStorage.getItem("revenueData"))
      : { daily: {}, monthly: {}, items: {} };

    // Sort items by revenue to get top selling
    const topItems = Object.values(revenueData.items)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    return {
      dailyData: revenueData.daily,
      monthlyData: revenueData.monthly,
      topItems,
    };
  } catch (error) {
    console.error("Error retrieving revenue data:", error);
    return { dailyData: {}, monthlyData: {}, topItems: [] };
  }
};
