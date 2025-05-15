// Authentication service for admin functions

// Check if user is logged in
export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const adminUser = localStorage.getItem("adminAuth");
  return !!adminUser;
};

// Login user
export const login = (username) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminAuth", JSON.stringify({ username }));
  }
};

// Logout user
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminAuth");
  }
};

// Get current user data
export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const adminUser = localStorage.getItem("adminAuth");
  return adminUser ? JSON.parse(adminUser) : null;
};
