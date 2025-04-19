"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { mockSortOptions } from "./mockData";

interface ProductsSortControlsProps {
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

/**
 * Sort controls for the products page
 */
export default function ProductsSortControls({ onSortChange }: ProductsSortControlsProps) {
  const [currentSort, setCurrentSort] = useState('');
  const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortClick = (name: string) => {
    let newDirection: 'asc' | 'desc';
    
    if (name === currentSort) {
      // Toggle direction if same sort field is clicked
      newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Use default direction for new sort field
      const sortOption = mockSortOptions.find(opt => opt.name === name);
      newDirection = (sortOption?.defaultDirection as 'asc' | 'desc') || 'asc';
    }
    
    setCurrentSort(name);
    setCurrentDirection(newDirection);
    onSortChange(name, newDirection);
  };

  const getSortLabel = (option: any) => {
    const { displayName, type } = option;

    switch (type) {
      case "alphabetic":
        return `${displayName} (A-Z)`;
      case "numeric":
        return `${displayName} (Low-High)`;
      case "date":
        return `${displayName} (Newest)`;
      default:
        return displayName;
    }
  };

  const getDirectionIcon = (isActive: boolean, direction: 'asc' | 'desc') => {
    if (!isActive) return <ArrowUp className="h-5 w-5 text-slate-500 opacity-40" />;

    return (
      <>
        {direction === "asc" ? (
          <div className="flex items-center">
            <ArrowDown className="h-5 w-5 text-white" />
            <ArrowUp className="h-5 w-5 text-orange-500" />
          </div>
        ) : (
          <div className="flex items-center">
            <ArrowDown className="h-5 w-5 text-orange-500" />
            <ArrowUp className="h-5 w-5 text-white" />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-blue-950 shadow-xl text-white rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4 border-b border-blue-800 pb-2">Sort By</h2>
      
      <div className="space-y-2">
        {mockSortOptions.map((option) => {
          const isActive = option.name === currentSort;
          return (
            <button
              key={option.name}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "bg-white hover:bg-blue-400 text-black"
              }`}
              onClick={() => handleSortClick(option.name)}
            >
              <span>{getSortLabel(option)}</span>
              <div className="flex items-center">
                {getDirectionIcon(isActive, currentDirection)}
              </div>
            </button>
          );
        })}
      </div>
      
      {currentSort && (
        <button
          onClick={() => {
            setCurrentSort('');
            onSortChange('', 'asc');
          }}
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded text-center hover:bg-gray-100 text-gray-300 hover:text-gray-700"
        >
          Clear Sort
        </button>
      )}
    </div>
  );
}