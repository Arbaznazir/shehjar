"use client";

// Initial table data structure with clear organization
const initialTables = {
  mainFloor: [
    {
      id: "m1",
      name: "Table 1",
      capacity: 4,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Main Area",
    },
    {
      id: "m2",
      name: "Table 2",
      capacity: 2,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Main Area",
    },
    {
      id: "m3",
      name: "Table 3",
      capacity: 6,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Main Area",
    },
    {
      id: "m4",
      name: "Table 4",
      capacity: 4,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Window Area",
    },
    {
      id: "m5",
      name: "Table 5",
      capacity: 2,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Window Area",
    },
    {
      id: "m6",
      name: "Table 6",
      capacity: 8,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Private Area",
    },
    {
      id: "m7",
      name: "Table 7",
      capacity: 4,
      status: "available",
      orderId: null,
      location: "mainFloor",
      section: "Private Area",
    },
  ],
  topFloor: [
    {
      id: "t1",
      name: "Table 8",
      capacity: 4,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "Balcony View",
    },
    {
      id: "t2",
      name: "Table 9",
      capacity: 2,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "Balcony View",
    },
    {
      id: "t3",
      name: "Table 10",
      capacity: 6,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "Balcony View",
    },
    {
      id: "t4",
      name: "Table 11",
      capacity: 8,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "Premium Section",
    },
    {
      id: "t5",
      name: "Table 12",
      capacity: 4,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "Premium Section",
    },
    {
      id: "t6",
      name: "Table 13",
      capacity: 2,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "VIP Area",
    },
    {
      id: "t7",
      name: "Table 14",
      capacity: 6,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "VIP Area",
    },
    {
      id: "t8",
      name: "Table 15",
      capacity: 4,
      status: "available",
      orderId: null,
      location: "topFloor",
      section: "VIP Area",
    },
  ],
};

// Sample orders data
const initialOrders = [
  {
    id: "order1",
    table: "m2",
    items: [
      { name: "Butter Chicken", price: 400, quantity: 1 },
      { name: "Naan", price: 50, quantity: 2 },
    ],
    status: "served",
    paymentStatus: "pending",
    total: 500,
    createdAt: new Date().toISOString(),
  },
  {
    id: "order2",
    table: "m6",
    items: [
      { name: "Paneer Tikka", price: 300, quantity: 1 },
      { name: "Roti", price: 30, quantity: 3 },
    ],
    status: "preparing",
    paymentStatus: "pending",
    total: 390,
    createdAt: new Date().toISOString(),
  },
  {
    id: "order3",
    table: "t1",
    items: [
      { name: "Chicken Biryani", price: 350, quantity: 2 },
      { name: "Raita", price: 50, quantity: 1 },
    ],
    status: "pending",
    paymentStatus: "pending",
    total: 750,
    createdAt: new Date().toISOString(),
  },
  {
    id: "order4",
    table: "t5",
    items: [
      { name: "Veg Pizza", price: 300, quantity: 1 },
      { name: "Garlic Bread", price: 120, quantity: 1 },
      { name: "Coke", price: 60, quantity: 2 },
    ],
    status: "served",
    paymentStatus: "pending",
    total: 540,
    createdAt: new Date().toISOString(),
  },
];

// Helper function to load tables from localStorage
const loadTables = () => {
  if (typeof window === "undefined") return initialTables;

  const savedTables = localStorage.getItem("shehjar_tables");

  if (!savedTables) {
    // Update some tables to show occupied status for demo
    const tablesToUpdate = ["m2", "m6", "t1", "t5"];
    const demoTables = JSON.parse(JSON.stringify(initialTables));

    // Set occupied status for tables with orders
    tablesToUpdate.forEach((tableId) => {
      const floor = tableId.startsWith("m") ? "mainFloor" : "topFloor";
      const table = demoTables[floor].find((t) => t.id === tableId);
      if (table) {
        table.status = "occupied";
        table.orderId = "order" + tableId.substring(1);
      }
    });

    localStorage.setItem("shehjar_tables", JSON.stringify(demoTables));
    return demoTables;
  }

  return JSON.parse(savedTables);
};

// Helper function to save tables to localStorage
const saveTables = (tables) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("shehjar_tables", JSON.stringify(tables));
};

// Get all tables from both floors
export const getAllTables = () => {
  const tables = loadTables();
  return [...tables.mainFloor, ...tables.topFloor];
};

// Get tables by floor
export const getTablesByFloor = (floor) => {
  const tables = loadTables();
  return tables[floor] || [];
};

// Get table by ID
export const getTableById = (tableId) => {
  const allTables = getAllTables();
  return allTables.find((table) => table.id === tableId) || null;
};

// Update table status
export const updateTableStatus = (tableId, newStatus, orderId = null) => {
  const tables = loadTables();

  // Find which floor the table is on
  let floor = null;
  let tableIndex = -1;

  // Check main floor
  tableIndex = tables.mainFloor.findIndex((table) => table.id === tableId);
  if (tableIndex !== -1) {
    floor = "mainFloor";
  } else {
    // Check top floor
    tableIndex = tables.topFloor.findIndex((table) => table.id === tableId);
    if (tableIndex !== -1) {
      floor = "topFloor";
    }
  }

  if (floor && tableIndex !== -1) {
    // Update the table status
    tables[floor][tableIndex] = {
      ...tables[floor][tableIndex],
      status: newStatus,
      orderId:
        orderId !== undefined ? orderId : tables[floor][tableIndex].orderId,
    };

    saveTables(tables);
    return true;
  }

  return false;
};

// Assign an order to a table
export const assignOrderToTable = (tableId, orderId) => {
  return updateTableStatus(tableId, "occupied", orderId);
};

// Free up a table (make it available)
export const freeTable = (tableId) => {
  return updateTableStatus(tableId, "available", null);
};

// Get the status of all tables
export const getTableStatus = () => {
  return getAllTables();
};

// Reset all tables to available
export const resetAllTables = () => {
  const tables = loadTables();

  // Reset main floor tables
  tables.mainFloor = tables.mainFloor.map((table) => ({
    ...table,
    status: "available",
    orderId: null,
  }));

  // Reset top floor tables
  tables.topFloor = tables.topFloor.map((table) => ({
    ...table,
    status: "available",
    orderId: null,
  }));

  saveTables(tables);
  return true;
};

// Update table based on order status
export const updateTableBasedOnOrder = (orderId, orderStatus) => {
  const tables = loadTables();
  let updated = false;

  // Function to update tables in a specific floor
  const updateTablesInFloor = (floor) => {
    tables[floor] = tables[floor].map((table) => {
      if (table.orderId === orderId) {
        updated = true;

        // Set table status based on order status
        let tableStatus = table.status;

        switch (orderStatus) {
          case "pending":
            tableStatus = "occupied";
            break;
          case "preparing":
            tableStatus = "preparing";
            break;
          case "ready":
            tableStatus = "ready";
            break;
          case "delivered":
            tableStatus = "occupied";
            break;
          case "completed":
            tableStatus = "available";
            return { ...table, status: tableStatus, orderId: null };
          case "cancelled":
            tableStatus = "available";
            return { ...table, status: tableStatus, orderId: null };
          default:
            break;
        }

        return { ...table, status: tableStatus };
      }
      return table;
    });
  };

  // Update tables in both floors
  updateTablesInFloor("mainFloor");
  updateTablesInFloor("topFloor");

  if (updated) {
    saveTables(tables);
  }

  return updated;
};

// Get active orders
export const getActiveOrders = () => {
  if (typeof window === "undefined") return initialOrders;

  const savedOrders = localStorage.getItem("shehjar_orders");

  if (!savedOrders) {
    localStorage.setItem("shehjar_orders", JSON.stringify(initialOrders));
    return initialOrders;
  }

  return JSON.parse(savedOrders);
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
    const ordersData = localStorage.getItem("shehjar_orders");

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
    localStorage.setItem("shehjar_orders", JSON.stringify(orders));

    // If payment is completed, update table status accordingly
    if (paymentStatus === "completed") {
      // Mark the table as available
      freeTable(updatedOrder.table);
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
