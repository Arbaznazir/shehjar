// Order History Service - localStorage based

const ORDER_HISTORY_KEY = "shehjar-order-history";
const ORDER_TEMPLATES_KEY = "shehjar-order-templates";
const MAX_HISTORY_ITEMS = 50; // Limit to prevent localStorage bloat
const MAX_TEMPLATES = 10; // Limit for order templates

// Get order history from localStorage
export const getOrderHistory = () => {
  try {
    const history = localStorage.getItem(ORDER_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error loading order history:", error);
    return [];
  }
};

// Add order to history
export const addToOrderHistory = (order) => {
  try {
    const history = getOrderHistory();

    // Add timestamp if not present
    const orderWithTimestamp = {
      ...order,
      completedAt: order.completedAt || new Date().toISOString(),
      status: "completed",
    };

    // Add to beginning of array (most recent first)
    history.unshift(orderWithTimestamp);

    // Limit history size
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(limitedHistory));
    return true;
  } catch (error) {
    console.error("Error saving order to history:", error);
    return false;
  }
};

// Get recent orders (last N orders)
export const getRecentOrders = (limit = 5) => {
  const history = getOrderHistory();
  return history.slice(0, limit);
};

// Get favorite items based on order frequency
export const getFavoriteItemsFromHistory = (limit = 10) => {
  const history = getOrderHistory();
  const itemFrequency = {};

  // Count item frequencies
  history.forEach((order) => {
    order.items?.forEach((item) => {
      const key = `${item.id}-${item.selectedVariant || "default"}`;
      if (!itemFrequency[key]) {
        itemFrequency[key] = {
          item: item,
          count: 0,
          lastOrdered: order.completedAt,
        };
      }
      itemFrequency[key].count += item.quantity;

      // Update last ordered date if more recent
      if (
        new Date(order.completedAt) > new Date(itemFrequency[key].lastOrdered)
      ) {
        itemFrequency[key].lastOrdered = order.completedAt;
      }
    });
  });

  // Sort by frequency and recency
  return Object.values(itemFrequency)
    .sort((a, b) => {
      // Primary sort: frequency
      if (b.count !== a.count) return b.count - a.count;
      // Secondary sort: recency
      return new Date(b.lastOrdered) - new Date(a.lastOrdered);
    })
    .slice(0, limit)
    .map((entry) => entry.item);
};

// Search order history
export const searchOrderHistory = (searchTerm) => {
  const history = getOrderHistory();
  const term = searchTerm.toLowerCase();

  return history.filter((order) => {
    // Search in order ID
    if (order.id?.toString().includes(term)) return true;

    // Search in customer info
    if (order.customerInfo?.name?.toLowerCase().includes(term)) return true;
    if (order.customerInfo?.phone?.includes(term)) return true;

    // Search in items
    return order.items?.some(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
    );
  });
};

// Get order statistics
export const getOrderStatistics = () => {
  const history = getOrderHistory();

  if (history.length === 0) {
    return {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      favoriteCategory: null,
      mostOrderedItem: null,
    };
  }

  const totalOrders = history.length;
  const totalSpent = history.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );
  const averageOrderValue = totalSpent / totalOrders;

  // Find favorite category and most ordered item
  const categoryCount = {};
  const itemCount = {};

  history.forEach((order) => {
    order.items?.forEach((item) => {
      // Count categories
      if (item.category) {
        categoryCount[item.category] =
          (categoryCount[item.category] || 0) + item.quantity;
      }

      // Count items
      const itemKey = item.name;
      itemCount[itemKey] = (itemCount[itemKey] || 0) + item.quantity;
    });
  });

  const favoriteCategory = Object.keys(categoryCount).reduce(
    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
    null
  );

  const mostOrderedItem = Object.keys(itemCount).reduce(
    (a, b) => (itemCount[a] > itemCount[b] ? a : b),
    null
  );

  return {
    totalOrders,
    totalSpent,
    averageOrderValue,
    favoriteCategory,
    mostOrderedItem,
    firstOrderDate: history[history.length - 1]?.completedAt,
    lastOrderDate: history[0]?.completedAt,
  };
};

// Clear order history
export const clearOrderHistory = () => {
  try {
    localStorage.removeItem(ORDER_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing order history:", error);
    return false;
  }
};

// Reorder items from a previous order
export const createReorderItems = (order) => {
  return (
    order.items?.map((item) => ({
      ...item,
      // Reset any order-specific data
      cartId: `${item.id}-${item.selectedVariant || "default"}-${Date.now()}`,
      cartItemId: `${item.id}_${
        item.selectedVariant || "default"
      }_${Date.now()}`,
    })) || []
  );
};

// ===== ORDER TEMPLATES FUNCTIONALITY =====

// Get order templates from localStorage
export const getOrderTemplates = () => {
  try {
    const templates = localStorage.getItem(ORDER_TEMPLATES_KEY);
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error("Error loading order templates:", error);
    return [];
  }
};

// Save order as template
export const saveOrderAsTemplate = (order, templateName, description = "") => {
  try {
    const templates = getOrderTemplates();

    const template = {
      id: `template-${Date.now()}`,
      name: templateName,
      description: description,
      items: order.items || [],
      totalItems:
        order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      estimatedTotal: order.total || 0,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      useCount: 0,
      tags: [], // For categorizing templates
    };

    // Check if template with same name exists
    const existingIndex = templates.findIndex((t) => t.name === templateName);
    if (existingIndex >= 0) {
      // Update existing template
      templates[existingIndex] = {
        ...templates[existingIndex],
        ...template,
        id: templates[existingIndex].id,
      };
    } else {
      // Add new template
      templates.unshift(template);
    }

    // Limit templates
    const limitedTemplates = templates.slice(0, MAX_TEMPLATES);

    localStorage.setItem(ORDER_TEMPLATES_KEY, JSON.stringify(limitedTemplates));
    return template;
  } catch (error) {
    console.error("Error saving order template:", error);
    return null;
  }
};

// Delete order template
export const deleteOrderTemplate = (templateId) => {
  try {
    const templates = getOrderTemplates();
    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    localStorage.setItem(ORDER_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.error("Error deleting order template:", error);
    return false;
  }
};

// Update template usage
export const updateTemplateUsage = (templateId) => {
  try {
    const templates = getOrderTemplates();
    const templateIndex = templates.findIndex((t) => t.id === templateId);

    if (templateIndex >= 0) {
      templates[templateIndex].useCount += 1;
      templates[templateIndex].lastUsed = new Date().toISOString();
      localStorage.setItem(ORDER_TEMPLATES_KEY, JSON.stringify(templates));
    }

    return true;
  } catch (error) {
    console.error("Error updating template usage:", error);
    return false;
  }
};

// Get popular templates (by usage)
export const getPopularTemplates = (limit = 5) => {
  const templates = getOrderTemplates();
  return templates.sort((a, b) => b.useCount - a.useCount).slice(0, limit);
};

// Search templates
export const searchOrderTemplates = (searchTerm) => {
  const templates = getOrderTemplates();
  const term = searchTerm.toLowerCase();

  return templates.filter((template) => {
    // Search in template name and description
    if (template.name?.toLowerCase().includes(term)) return true;
    if (template.description?.toLowerCase().includes(term)) return true;

    // Search in items
    return template.items?.some(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
    );
  });
};

// Add tags to template
export const addTagsToTemplate = (templateId, tags) => {
  try {
    const templates = getOrderTemplates();
    const templateIndex = templates.findIndex((t) => t.id === templateId);

    if (templateIndex >= 0) {
      templates[templateIndex].tags = [
        ...new Set([...templates[templateIndex].tags, ...tags]),
      ];
      localStorage.setItem(ORDER_TEMPLATES_KEY, JSON.stringify(templates));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error adding tags to template:", error);
    return false;
  }
};

// Get templates by tag
export const getTemplatesByTag = (tag) => {
  const templates = getOrderTemplates();
  return templates.filter((template) => template.tags.includes(tag));
};

// Clear all templates
export const clearOrderTemplates = () => {
  try {
    localStorage.removeItem(ORDER_TEMPLATES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing order templates:", error);
    return false;
  }
};

// Get order frequency analysis
export const getOrderFrequencyAnalysis = () => {
  const history = getOrderHistory();
  const now = new Date();

  // Group orders by time periods
  const daily = {};
  const weekly = {};
  const monthly = {};

  history.forEach((order) => {
    const orderDate = new Date(order.completedAt);
    const dayKey = orderDate.toDateString();
    const weekKey = `${orderDate.getFullYear()}-W${Math.ceil(
      orderDate.getDate() / 7
    )}`;
    const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;

    daily[dayKey] = (daily[dayKey] || 0) + 1;
    weekly[weekKey] = (weekly[weekKey] || 0) + 1;
    monthly[monthKey] = (monthly[monthKey] || 0) + 1;
  });

  // Calculate averages
  const totalDays = Object.keys(daily).length;
  const totalWeeks = Object.keys(weekly).length;
  const totalMonths = Object.keys(monthly).length;

  return {
    totalOrders: history.length,
    averageOrdersPerDay: totalDays > 0 ? history.length / totalDays : 0,
    averageOrdersPerWeek: totalWeeks > 0 ? history.length / totalWeeks : 0,
    averageOrdersPerMonth: totalMonths > 0 ? history.length / totalMonths : 0,
    peakOrderDay: Object.keys(daily).reduce(
      (a, b) => (daily[a] > daily[b] ? a : b),
      null
    ),
    ordersByDay: daily,
    ordersByWeek: weekly,
    ordersByMonth: monthly,
  };
};
