"use client";

import { useEffect, useRef } from "react";

// Simple lightweight chart renderer function since we can't use Chart.js directly in this demo
// In a real app, you'd use a proper chart library like Chart.js, recharts, or nivo

export const BarChart = ({
  data,
  labels,
  colors = ["rgba(234,219,102,0.8)"],
  height = 200,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const chartHeight = height - 30; // Reserve space for labels

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find the maximum value to scale the bars
    const maxValue = Math.max(...data);

    // Calculate bar width based on number of items
    const barWidth = (width / data.length) * 0.6;
    const spacing = (width / data.length) * 0.4;

    // Draw the bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = index * (barWidth + spacing) + spacing / 2;
      const y = height - barHeight - 30;

      // Draw gradient bar
      const gradient = ctx.createLinearGradient(x, y, x, height - 30);
      gradient.addColorStop(0, colors[index % colors.length]);
      gradient.addColorStop(1, "rgba(182,155,76,0.5)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 5);
      ctx.fill();

      // Draw value on top of bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(value.toFixed(0), x + barWidth / 2, y - 5);

      // Draw label below bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, height - 10);
    });
  }, [data, labels, colors, height]);

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height={height}
      className="w-full h-auto"
    />
  );
};

export const PieChart = ({ data, labels, colors, height = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate total for percentages
    const total = data.reduce((sum, value) => sum + value, 0);

    // Define chart dimensions
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Draw pie slices
    let startAngle = -0.5 * Math.PI;

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * (2 * Math.PI);
      const endAngle = startAngle + sliceAngle;

      // Create gradient for slice
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, colors[index % colors.length]);
      gradient.addColorStop(
        1,
        colors[index % colors.length].replace("1)", "0.7)")
      );

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw slice border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Calculate position for label
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + radius * 0.7 * Math.cos(labelAngle);
      const labelY = centerY + radius * 0.7 * Math.sin(labelAngle);

      // Draw percentage label
      const percentage = ((value / total) * 100).toFixed(1) + "%";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percentage, labelX, labelY);

      startAngle = endAngle;
    });

    // Draw legend
    const legendX = width - 90;
    const legendY = 20;

    labels.forEach((label, index) => {
      const y = legendY + index * 20;

      // Color box
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 12, 12);

      // Label text
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, legendX + 20, y + 6);
    });
  }, [data, labels, colors, height]);

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height={height}
      className="w-full h-auto"
    />
  );
};

export const LineChart = ({
  data,
  labels,
  color = "rgba(234,219,102,0.8)",
  height = 200,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const chartHeight = height - 30; // Reserve space for labels

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find the maximum value to scale the line
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const valueRange = maxValue - minValue;

    // Calculate point spacing based on number of items
    const pointSpacing = width / (data.length - 1);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
      const y = chartHeight * (1 - i / 4) + 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Draw grid value
      const gridValue = (minValue + valueRange * (i / 4)).toFixed(0);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(gridValue, 5, y - 5);
    }

    // Plot points
    const points = data.map((value, index) => {
      const x = index * pointSpacing;
      const normalizedValue = (value - minValue) / valueRange;
      const y = chartHeight * (1 - normalizedValue) + 10;
      return { x, y };
    });

    // Create gradient for the line area
    const gradient = ctx.createLinearGradient(0, 10, 0, height - 20);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color.replace("0.8)", "0)"));

    // Draw filled area under the line
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - 20);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height - 20);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = color.replace("0.8)", "1)");
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw points
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(234,219,102,1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw value
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(data[index].toFixed(0), point.x, point.y - 10);

      // Draw label
      if (
        labels &&
        labels[index] &&
        index % Math.ceil(labels.length / 5) === 0
      ) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(labels[index], point.x, height - 10);
      }
    });
  }, [data, labels, color, height]);

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height={height}
      className="w-full h-auto"
    />
  );
};

// A modern stat card component
export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend = null,
  trendValue = null,
}) => {
  return (
    <div className="dish-card p-6 rounded-lg overflow-hidden relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,219,102,0.1)] hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">{icon}</div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
          <div className="text-3xl font-bold text-white mb-1">{value}</div>

          {trend && (
            <div
              className={`text-sm flex items-center mt-1 ${
                trend === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend === "up" ? (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
          )}

          <div className="text-[rgba(234,219,102,0.8)] text-sm mt-2">
            {subtitle}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgba(182,155,76,0.3)] to-[rgba(234,219,102,0.3)]"></div>
    </div>
  );
};

// Data table component with enhanced styling
export const DataTable = ({ headers, data, rowRender }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-800">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`pb-3 text-gray-400 ${
                  header.align === "right"
                    ? "text-right"
                    : header.align === "center"
                    ? "text-center"
                    : ""
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
            >
              {rowRender(row, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// A section title with animated underline
export const SectionTitle = ({ title }) => {
  return (
    <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] relative inline-block group">
      {title}
      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] group-hover:w-full transition-all duration-300 ease-in-out"></span>
    </h2>
  );
};
