/**
 * Licensed under the Shepora Flower Plant Management System License (v1.0)
 * See the LICENSE.txt file for more details.
 */

import React, { useState, useEffect } from "react";

const PageLoading = () => {
  const [flowers, setFlowers] = useState([
    { x: 0, y: 0, size: 0, growth: 0 },
    { x: 0, y: 0, size: 0, growth: 0 },
    { x: 0, y: 0, size: 0, growth: 0 },
    { x: 0, y: 0, size: 0, growth: 0 },
    { x: 0, y: 0, size: 0, growth: 0 },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFlowers((prevFlowers) => {
        return prevFlowers.map((flower) => {
          const newSize = flower.size + Math.random() * 2;
          const newGrowth = flower.growth + Math.random() * 0.1;
          return {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            size: newSize > 50 ? 50 : newSize,
            growth: newGrowth > 1 ? 1 : newGrowth,
          };
        });
      });
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-green-100">
      <div className="flex flex-wrap justify-center">
        {flowers.map((flower, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `calc(50% + ${flower.x}px)`,
              top: `calc(50% + ${flower.y}px)`,
              transform: `scale(${flower.growth})`,
              transition: "transform 0.5s",
            }}
          >
            <div
              className={`rounded-full bg-pink-500 transition-transform duration-500`}
              style={{
                width: `${flower.size}px`,
                height: `${flower.size}px`,
              }}
            />
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            >
              <svg
                className="w-6 h-6 text-green-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707-1.414-1.414"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageLoading;
