
import React from 'react';
import { COLOR_PALETTE } from '../constants';

interface ColorGridProps {
  selectedColor: string;
  onSelect: (color: string) => void;
  label: string;
}

const ColorGrid: React.FC<ColorGridProps> = ({ selectedColor, onSelect, label }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="mb-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">
        {label} Palette
      </div>
      <div className="grid grid-cols-10 gap-1 mb-4">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-full aspect-square rounded-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-blue-600 scale-110 z-10' : ''
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorGrid;
