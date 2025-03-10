"use client";

import React, { useState } from "react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
}

export function Tabs({ items, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-1" aria-label="Tabs">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                w-1/2 py-3 px-4 text-center border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200
                ${
                  activeIndex === index
                    ? "border-indigo-500 text-indigo-700 bg-white"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
              aria-current={activeIndex === index ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-2 transition-all duration-300 ease-in-out">
        {items[activeIndex].content}
      </div>
    </div>
  );
}