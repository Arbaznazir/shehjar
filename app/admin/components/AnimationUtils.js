"use client";

import { useEffect, useState } from "react";

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.3,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity duration-${Math.round(
        duration * 1000
      )} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = 0.3,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "translateX(-20px)";
        case "right":
          return "translateX(20px)";
        case "up":
          return "translateY(20px)";
        case "down":
          return "translateY(-20px)";
        default:
          return "translateX(-20px)";
      }
    }
    return "translate(0, 0)";
  };

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.3,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        transform: isVisible ? "scale(1)" : "scale(0.95)",
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export const Staggered = ({
  children,
  baseDelay = 0,
  stagger = 0.1,
  as = "div",
  className = "",
}) => {
  const Component = as;
  return (
    <Component className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <FadeIn key={index} delay={baseDelay + index * stagger}>
              <SlideIn delay={baseDelay + index * stagger}>{child}</SlideIn>
            </FadeIn>
          ))
        : children}
    </Component>
  );
};
