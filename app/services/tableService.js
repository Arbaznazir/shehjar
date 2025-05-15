// Table management service
// This service manages tables, their statuses, and associated orders
// For demonstration purposes, this uses localStorage but in a real app would use a database

// Table statuses:
// - available: Table is available for seating
// - occupied: Table is currently occupied by customers
// - reserved: Table is reserved for future customers
// - preparing: Order is being prepared for this table
// - ready: Order is ready to be served to this table

// Initialize table data structure if it doesn't exist
export const initializeTables = () => {
  if (typeof window === "undefined") return;

  try {
    const existingTables = localStorage.getItem("restaurantTables");

    if (!existingTables) {
      // Create default tables configuration
      const defaultTables = {
        // Main floor has 7 tables
        mainFloor: [
          {
            id: 1,
            name: "Table 1",
            capacity: 4,
            status: "available",
            orderId: null,
            floor: "main",
          },
          {
            id: 2,
            name: "Table 2",
            capacity: 2,
            status: "available",
            orderId: null,
            floor: "main",
          },
          {
            id: 3,
            name: "Table 3",
            capacity: 6,
            status: "available",
            orderId: null,
            floor: "main",
          },
          {
            id: 4,
            name: "Table 4",
            capacity: 4,
            status: "available",
            orderId: null,
            floor: "main",
          },
          {
            id: 5,
            name: "Table 5",
            capacity: 2,
            status: "available",
            orderId: null,
            floor: "main",
          },
          {
            id: 6,
            name: "Table 6",
            capacity: 8,
            status: "available",
            orderId: null,
            floor: "main",
          },
          {
            id: 7,
            name: "Table 7",
            capacity: 4,
            status: "available",
            orderId: null,
            floor: "main",
          },
        ],
        // Top floor has 8 tables
        topFloor: [
          {
            id: 8,
            name: "Table 8",
            capacity: 4,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 9,
            name: "Table 9",
            capacity: 2,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 10,
            name: "Table 10",
            capacity: 6,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 11,
            name: "Table 11",
            capacity: 4,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 12,
            name: "Table 12",
            capacity: 2,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 13,
            name: "Table 13",
            capacity: 8,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 14,
            name: "Table 14",
            capacity: 4,
            status: "available",
            orderId: null,
            floor: "top",
          },
          {
            id: 15,
            name: "Table 15",
            capacity: 10,
            status: "available",
            orderId: null,
            floor: "top",
          },
        ],
      };

      localStorage.setItem("restaurantTables", JSON.stringify(defaultTables));
      return defaultTables;
    }

    return JSON.parse(existingTables);
  } catch (error) {
    console.error("Error initializing tables:", error);
    return null;
  }
};

// Get all tables
export const getAllTables = () => {
  if (typeof window === "undefined") return { mainFloor: [], topFloor: [] };

  try {
    const tables = localStorage.getItem("restaurantTables");
    if (tables) {
      return JSON.parse(tables);
    } else {
      return initializeTables();
    }
  } catch (error) {
    console.error("Error getting tables:", error);
    return { mainFloor: [], topFloor: [] };
  }
};

// Get tables by floor
export const getTablesByFloor = (floor) => {
  const allTables = getAllTables();
  return floor === "main" ? allTables.mainFloor : allTables.topFloor;
};

// Get table by ID
export const getTableById = (tableId) => {
  if (typeof tableId === "string") {
    tableId = parseInt(tableId, 10);
  }

  const allTables = getAllTables();

  // Check main floor
  const mainFloorTable = allTables.mainFloor.find(
    (table) => table.id === tableId
  );
  if (mainFloorTable) return { ...mainFloorTable, floor: "main" };

  // Check top floor
  const topFloorTable = allTables.topFloor.find(
    (table) => table.id === tableId
  );
  if (topFloorTable) return { ...topFloorTable, floor: "top" };

  return null;
};

// Get table status
export const getTableStatus = () => {
  return getAllTables();
};

// Update table status
export const updateTableStatus = (tableId, newStatus, orderId = null) => {
  if (typeof window === "undefined") return false;

  if (typeof tableId === "string") {
    tableId = parseInt(tableId, 10);
  }

  try {
    const allTables = getAllTables();

    // Determine which floor the table is on
    let floor = null;
    let tableIndex = -1;

    // Check main floor
    tableIndex = allTables.mainFloor.findIndex((table) => table.id === tableId);
    if (tableIndex !== -1) {
      floor = "mainFloor";
    } else {
      // Check top floor
      tableIndex = allTables.topFloor.findIndex(
        (table) => table.id === tableId
      );
      if (tableIndex !== -1) {
        floor = "topFloor";
      }
    }

    if (!floor || tableIndex === -1) {
      return false;
    }

    // Update the table
    allTables[floor][tableIndex] = {
      ...allTables[floor][tableIndex],
      status: newStatus,
      orderId:
        orderId !== undefined ? orderId : allTables[floor][tableIndex].orderId,
    };

    // If status is 'available', clear the order ID
    if (newStatus === "available") {
      allTables[floor][tableIndex].orderId = null;
    }

    // Save updated tables
    localStorage.setItem("restaurantTables", JSON.stringify(allTables));

    return true;
  } catch (error) {
    console.error("Error updating table status:", error);
    return false;
  }
};

// Assign order to table
export const assignOrderToTable = (tableId, orderId) => {
  if (typeof window === "undefined") return false;

  if (typeof tableId === "string") {
    tableId = parseInt(tableId, 10);
  }

  try {
    const allTables = getAllTables();

    // Determine which floor the table is on
    let floor = null;
    let tableIndex = -1;

    // Check main floor
    tableIndex = allTables.mainFloor.findIndex((table) => table.id === tableId);
    if (tableIndex !== -1) {
      floor = "mainFloor";
    } else {
      // Check top floor
      tableIndex = allTables.topFloor.findIndex(
        (table) => table.id === tableId
      );
      if (tableIndex !== -1) {
        floor = "topFloor";
      }
    }

    if (!floor || tableIndex === -1) {
      return false;
    }

    // Assign order to table and change status to occupied
    allTables[floor][tableIndex] = {
      ...allTables[floor][tableIndex],
      orderId,
      status: "occupied",
    };

    // Save updated tables
    localStorage.setItem("restaurantTables", JSON.stringify(allTables));

    return true;
  } catch (error) {
    console.error("Error assigning order to table:", error);
    return false;
  }
};

// Mark table as available (clear order)
export const markTableAvailable = (tableId) => {
  return updateTableStatus(tableId, "available", null);
};

// Free table is an alias for markTableAvailable for backward compatibility
export const freeTable = (tableId) => {
  return markTableAvailable(tableId);
};

// Reset all tables to available
export const resetAllTables = () => {
  if (typeof window === "undefined") return false;

  try {
    const allTables = getAllTables();

    // Reset main floor tables
    allTables.mainFloor = allTables.mainFloor.map((table) => ({
      ...table,
      status: "available",
      orderId: null,
    }));

    // Reset top floor tables
    allTables.topFloor = allTables.topFloor.map((table) => ({
      ...table,
      status: "available",
      orderId: null,
    }));

    // Save updated tables
    localStorage.setItem("restaurantTables", JSON.stringify(allTables));
    return true;
  } catch (error) {
    console.error("Error resetting tables:", error);
    return false;
  }
};

// Get tables by status
export const getTablesByStatus = (status) => {
  const allTables = getAllTables();

  const mainFloorMatches = allTables.mainFloor
    .filter((table) => table.status === status)
    .map((table) => ({ ...table, floor: "main" }));

  const topFloorMatches = allTables.topFloor
    .filter((table) => table.status === status)
    .map((table) => ({ ...table, floor: "top" }));

  return [...mainFloorMatches, ...topFloorMatches];
};

// Get table by order ID
export const getTableByOrderId = (orderId) => {
  const allTables = getAllTables();

  // Check main floor
  const mainFloorTable = allTables.mainFloor.find(
    (table) => table.orderId === orderId
  );
  if (mainFloorTable) return { ...mainFloorTable, floor: "main" };

  // Check top floor
  const topFloorTable = allTables.topFloor.find(
    (table) => table.orderId === orderId
  );
  if (topFloorTable) return { ...topFloorTable, floor: "top" };

  return null;
};

// Update tables when order status changes
export const updateTableForOrderStatus = (orderId, orderStatus) => {
  if (typeof window === "undefined") return false;

  const table = getTableByOrderId(orderId);
  if (!table) return false;

  // Map order status to table status
  let tableStatus;
  switch (orderStatus) {
    case "preparing":
      tableStatus = "preparing";
      break;
    case "ready":
      tableStatus = "ready";
      break;
    case "served":
      tableStatus = "occupied";
      break;
    case "completed":
      tableStatus = "available"; // Free the table when order is completed
      break;
    case "cancelled":
      tableStatus = "available"; // Free the table when order is cancelled
      break;
    default:
      tableStatus = table.status; // Keep current status
  }

  return updateTableStatus(table.id, tableStatus, orderId);
};

// Get active orders (orders that are currently in progress)
export const getActiveOrders = () => {
  if (typeof window === "undefined") return [];

  try {
    // Get orders from localStorage
    const ordersData = localStorage.getItem("restaurantOrders");

    if (!ordersData) {
      return [];
    }

    const orders = JSON.parse(ordersData);

    // Filter out only active orders (not completed or cancelled)
    const activeOrders = orders.filter(
      (order) => order.status !== "completed" && order.status !== "cancelled"
    );

    // Enrich with table information
    return activeOrders.map((order) => {
      const table = getTableByOrderId(order.id);
      return {
        ...order,
        table: table ? table.id : null,
        tableStatus: table ? table.status : null,
      };
    });
  } catch (error) {
    console.error("Error getting active orders:", error);
    return [];
  }
};

// Update order payment status
export const updateOrderPayment = (
  orderId,
  paymentStatus,
  paymentMethod = null
) => {
  if (typeof window === "undefined") return null;

  try {
    // Get orders from localStorage
    const ordersData = localStorage.getItem("restaurantOrders");

    if (!ordersData) {
      return null;
    }

    const orders = JSON.parse(ordersData);

    // Find the order to update
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
      return null;
    }

    // Update the order
    const updatedOrder = {
      ...orders[orderIndex],
      paymentStatus,
      paymentMethod: paymentMethod || orders[orderIndex].paymentMethod,
      paymentDate:
        paymentStatus === "completed" ? new Date().toISOString() : null,
    };

    orders[orderIndex] = updatedOrder;

    // Save back to localStorage
    localStorage.setItem("restaurantOrders", JSON.stringify(orders));

    // If payment is completed, update table status accordingly
    if (paymentStatus === "completed") {
      const table = getTableByOrderId(orderId);
      if (table) {
        // Keep table as occupied but clear the order association if needed
        // Alternatively, you might want to mark the table as available
        // depending on your business logic
        updateTableStatus(table.id, "available", null);
      }
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order payment:", error);
    return null;
  }
};

// Update table capacity
export const updateTableCapacity = (tableId, newCapacity) => {
  if (typeof window === "undefined") return false;

  if (typeof tableId === "string") {
    tableId = parseInt(tableId, 10);
  }

  try {
    const allTables = getAllTables();

    // Determine which floor the table is on
    let floor = null;
    let tableIndex = -1;

    // Check main floor
    tableIndex = allTables.mainFloor.findIndex((table) => table.id === tableId);
    if (tableIndex !== -1) {
      floor = "mainFloor";
    } else {
      // Check top floor
      tableIndex = allTables.topFloor.findIndex(
        (table) => table.id === tableId
      );
      if (tableIndex !== -1) {
        floor = "topFloor";
      }
    }

    if (!floor || tableIndex === -1) {
      return false;
    }

    // Update the table capacity
    allTables[floor][tableIndex] = {
      ...allTables[floor][tableIndex],
      capacity: parseInt(newCapacity, 10),
    };

    // Save the updated tables data
    localStorage.setItem("restaurantTables", JSON.stringify(allTables));
    return true;
  } catch (error) {
    console.error("Error updating table capacity:", error);
    return false;
  }
};
