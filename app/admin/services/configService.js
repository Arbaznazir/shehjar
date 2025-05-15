// Configuration service for app-wide settings
import { useState, useEffect } from "react";

// Default configurations
const DEFAULT_CONFIG = {
  // GST settings
  gstRates: [
    { value: 5, label: "5%" },
    { value: 12, label: "12%" },
    { value: 18, label: "18%" },
    { value: 28, label: "28%" },
  ],
  defaultGSTRate: 5,

  // Discount settings
  defaultDiscountType: "none", // none, flat, percentage
  defaultDiscountValue: 0,

  // Enable/disable user control of pricing
  allowUserPriceControls: false,
};

// Get config from localStorage or use defaults
export const getConfig = () => {
  if (typeof window === "undefined") {
    return DEFAULT_CONFIG;
  }

  const savedConfig = localStorage.getItem("appConfig");
  return savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
};

// Save config to localStorage
export const saveConfig = (config) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("appConfig", JSON.stringify(config));
  }
};

// Custom hook to manage config
export const useConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load config on first render
  useEffect(() => {
    setConfig(getConfig());
    setIsLoaded(true);
  }, []);

  // Save config whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveConfig(config);
    }
  }, [config, isLoaded]);

  // Update a specific config value
  const updateConfig = (key, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  return {
    config,
    updateConfig,
    isLoaded,
  };
};

// Individual config getters (for convenience)
export const getGSTRates = () => getConfig().gstRates;
export const getDefaultGSTRate = () => getConfig().defaultGSTRate;
export const getDefaultDiscountType = () => getConfig().defaultDiscountType;
export const getDefaultDiscountValue = () => getConfig().defaultDiscountValue;
export const allowUserPriceControls = () => getConfig().allowUserPriceControls;
