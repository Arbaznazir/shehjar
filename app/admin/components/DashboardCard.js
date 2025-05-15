"use client";

import { useState } from "react";
import { FadeIn, SlideIn } from "./AnimationUtils";

export const DashboardCard = ({
  title,
  value,
  icon,
  color = "amber",
  growthValue,
  className = "",
  children,
  delay = 0,
  variant = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Color mapping
  const colorMap = {
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: "text-amber-600",
      highlight: "bg-amber-500",
      shadow: "shadow-amber-200/50",
      growth: {
        positive: "text-green-600",
        negative: "text-red-600",
      },
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
      highlight: "bg-blue-500",
      shadow: "shadow-blue-200/50",
      growth: {
        positive: "text-green-600",
        negative: "text-red-600",
      },
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
      highlight: "bg-green-500",
      shadow: "shadow-green-200/50",
      growth: {
        positive: "text-green-600",
        negative: "text-red-600",
      },
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-800",
      icon: "text-purple-600",
      highlight: "bg-purple-500",
      shadow: "shadow-purple-200/50",
      growth: {
        positive: "text-green-600",
        negative: "text-red-600",
      },
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-800",
      icon: "text-gray-600",
      highlight: "bg-gray-500",
      shadow: "shadow-gray-200/50",
      growth: {
        positive: "text-green-600",
        negative: "text-red-600",
      },
    },
  };

  const colorStyle = colorMap[color] || colorMap.amber;
  const isPositive = growthValue > 0;
  const growthColor = isPositive
    ? colorStyle.growth.positive
    : colorStyle.growth.negative;

  // Card variants
  const variantStyles = {
    default: `${colorStyle.bg} ${colorStyle.border} border rounded-xl shadow-lg ${colorStyle.shadow}`,
    flat: `bg-white border ${colorStyle.border} rounded-xl shadow-sm`,
    glass: `bg-white/80 backdrop-blur-md border ${colorStyle.border} rounded-xl shadow-xl`,
    elevated: `bg-white border-none rounded-xl shadow-xl ${colorStyle.shadow}`,
    outlined: `bg-white border-2 ${colorStyle.border} rounded-xl`,
    gradient: `bg-gradient-to-br from-${color}-400 to-${color}-600 border-none rounded-xl shadow-lg text-white`,
  };

  const cardStyle = variantStyles[variant] || variantStyles.default;

  return (
    <FadeIn delay={delay}>
      <SlideIn direction="up" delay={delay + 0.1} duration={0.5}>
        <div
          className={`p-5 transition-all duration-300 ${cardStyle} ${className} 
            ${isHovered ? "transform -translate-y-1 shadow-xl" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3
              className={`text-sm font-medium ${
                variant === "gradient" ? "text-white/90" : colorStyle.text
              }`}
            >
              {title}
            </h3>
            {icon && (
              <div
                className={`p-2 rounded-full ${
                  variant === "gradient" ? "bg-white/20" : "bg-white"
                }`}
              >
                <span
                  className={
                    variant === "gradient" ? "text-white" : colorStyle.icon
                  }
                >
                  {icon}
                </span>
              </div>
            )}
          </div>

          <div
            className={`text-2xl font-bold ${
              variant === "gradient" ? "text-white" : "text-gray-800"
            } mb-2`}
          >
            {value}
          </div>

          {growthValue !== undefined && (
            <div className="flex items-center">
              <span
                className={`text-xs font-medium ${
                  variant === "gradient" ? "text-white/90" : growthColor
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(growthValue)}%
              </span>
              <span
                className={`ml-1 text-xs ${
                  variant === "gradient" ? "text-white/70" : "text-gray-500"
                }`}
              >
                vs previous period
              </span>
            </div>
          )}

          {children && <div className="mt-3">{children}</div>}
        </div>
      </SlideIn>
    </FadeIn>
  );
};

export const StatsGrid = ({
  children,
  columns = 4,
  gap = 4,
  className = "",
}) => {
  const gapMap = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };

  const colMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
  };

  const gapClass = gapMap[gap] || "gap-4";
  const colClass =
    colMap[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${colClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

export const ChartCard = ({
  title,
  subtitle,
  icon,
  color = "amber",
  className = "",
  children,
  delay = 0,
  actions,
  variant = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Color mapping
  const colorMap = {
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: "text-amber-600",
      shadow: "shadow-amber-200/50",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
      shadow: "shadow-blue-200/50",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
      shadow: "shadow-green-200/50",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-800",
      icon: "text-purple-600",
      shadow: "shadow-purple-200/50",
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-800",
      icon: "text-gray-600",
      shadow: "shadow-gray-200/50",
    },
  };

  const colorStyle = colorMap[color] || colorMap.amber;

  // Card variants
  const variantStyles = {
    default: `${colorStyle.bg} ${colorStyle.border} border rounded-xl shadow-lg ${colorStyle.shadow}`,
    flat: `bg-white border ${colorStyle.border} rounded-xl shadow-sm`,
    glass: `bg-white/80 backdrop-blur-md border ${colorStyle.border} rounded-xl shadow-xl`,
    elevated: `bg-white border-none rounded-xl shadow-xl ${colorStyle.shadow}`,
    outlined: `bg-white border-2 ${colorStyle.border} rounded-xl`,
    minimal: `bg-white shadow-sm rounded-xl`,
  };

  const cardStyle = variantStyles[variant] || variantStyles.default;

  return (
    <FadeIn delay={delay}>
      <SlideIn direction="up" delay={delay + 0.1} duration={0.5}>
        <div
          className={`p-5 transition-all duration-300 ${cardStyle} ${className} 
            ${isHovered ? "transform -translate-y-1 shadow-xl" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`text-base font-semibold ${colorStyle.text}`}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            {icon && (
              <div className="p-2 rounded-full bg-white">
                <span className={colorStyle.icon}>{icon}</span>
              </div>
            )}
          </div>

          <div className="mb-2">{children}</div>

          {actions && (
            <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
              {actions}
            </div>
          )}
        </div>
      </SlideIn>
    </FadeIn>
  );
};
