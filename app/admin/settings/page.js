"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useConfig } from "../services/configService";
import { isAuthenticated } from "../services/authService";

export default function SettingsPage() {
  const router = useRouter();
  const { config, updateConfig, isLoaded } = useConfig();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [gstRates, setGstRates] = useState([]);
  const [defaultGSTRate, setDefaultGSTRate] = useState(5);
  const [defaultDiscountType, setDefaultDiscountType] = useState("none");
  const [defaultDiscountValue, setDefaultDiscountValue] = useState(0);
  const [allowUserControls, setAllowUserControls] = useState(false);
  const [newGSTRate, setNewGSTRate] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
    } else {
      setIsUserAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  // Load config data when component mounts
  useEffect(() => {
    if (isLoaded) {
      setGstRates(config.gstRates || []);
      setDefaultGSTRate(config.defaultGSTRate || 5);
      setDefaultDiscountType(config.defaultDiscountType || "none");
      setDefaultDiscountValue(config.defaultDiscountValue || 0);
      setAllowUserControls(config.allowUserPriceControls || false);
    }
  }, [config, isLoaded]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Update all config values at once
    updateConfig("gstRates", gstRates);
    updateConfig("defaultGSTRate", defaultGSTRate);
    updateConfig("defaultDiscountType", defaultDiscountType);
    updateConfig("defaultDiscountValue", defaultDiscountValue);
    updateConfig("allowUserPriceControls", allowUserControls);

    setStatusMessage({
      type: "success",
      message: "Settings saved successfully",
    });

    // Clear status message after a delay
    setTimeout(() => {
      setStatusMessage({ type: "", message: "" });
    }, 3000);
  };

  // Add a new GST rate
  const addGSTRate = () => {
    const value = parseFloat(newGSTRate);
    if (!isNaN(value) && value > 0 && value <= 100) {
      const newRate = { value, label: `${value}%` };
      setGstRates([...gstRates, newRate]);
      setNewGSTRate("");
    }
  };

  // Remove a GST rate
  const removeGSTRate = (index) => {
    const updatedRates = [...gstRates];
    updatedRates.splice(index, 1);
    setGstRates(updatedRates);

    // If removing the default rate, update default to first available
    if (
      updatedRates.length > 0 &&
      !updatedRates.some((rate) => rate.value === defaultGSTRate)
    ) {
      setDefaultGSTRate(updatedRates[0].value);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[rgba(234,219,102,1)]">Loading...</div>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Global Settings
            </h1>
            <p className="text-gray-400">
              Manage GST rates, discounts, and other global configurations.
            </p>
          </div>

          {statusMessage.message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                statusMessage.type === "success"
                  ? "bg-green-900/50 text-green-200"
                  : "bg-red-900/50 text-red-200"
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="dish-card rounded-lg p-6">
            {/* GST Rates Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                GST Rate Configuration
              </h2>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Available GST Rates
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {gstRates.map((rate, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-full px-3 py-1 flex items-center"
                    >
                      <span className="mr-2">{rate.label}</span>
                      <button
                        type="button"
                        onClick={() => removeGSTRate(index)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex mt-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newGSTRate}
                    onChange={(e) => setNewGSTRate(e.target.value)}
                    placeholder="Add new rate (%)"
                    className="bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                  />
                  <button
                    type="button"
                    onClick={addGSTRate}
                    className="bg-gray-700 px-4 py-2 rounded-r-lg hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Default GST Rate
                </label>
                <select
                  value={defaultGSTRate}
                  onChange={(e) =>
                    setDefaultGSTRate(parseFloat(e.target.value))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                >
                  {gstRates.map((rate, index) => (
                    <option key={index} value={rate.value}>
                      {rate.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Discount Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                Default Discount Configuration
              </h2>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Default Discount Type
                </label>
                <select
                  value={defaultDiscountType}
                  onChange={(e) => setDefaultDiscountType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                >
                  <option value="none">No Discount</option>
                  <option value="flat">Flat Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              {defaultDiscountType !== "none" && (
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">
                    Default Discount Value
                    {defaultDiscountType === "percentage" ? " (%)" : " (₹)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={defaultDiscountType === "percentage" ? "100" : "10000"}
                    step={defaultDiscountType === "percentage" ? "1" : "10"}
                    value={defaultDiscountValue}
                    onChange={(e) =>
                      setDefaultDiscountValue(parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                  />
                </div>
              )}
            </div>

            {/* User Controls */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                User Interface Settings
              </h2>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allow-user-controls"
                  checked={allowUserControls}
                  onChange={(e) => setAllowUserControls(e.target.checked)}
                  className="mr-2 h-5 w-5 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                />
                <label htmlFor="allow-user-controls" className="text-gray-400">
                  Allow customers to modify GST rates and discounts on menu page
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
