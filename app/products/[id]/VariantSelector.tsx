'use client';

import { useState } from 'react';

interface Variant {
  id: number | string;
  title: string;
  price: number;
  currency: string;
  is_enabled?: boolean;
  color?: string; // Added for Printful variants
  size?: string; // Added for Printful variants
  catalog_info?: any; // Added for Printful variants
  files?: any[]; // Added for Printful variants
  options?: any[]; // Added for Printful variants
}

interface VariantSelectorProps {
  variants: Variant[];
}

export default function VariantSelector({ variants }: VariantSelectorProps) {
  // If only one variant, render nothing
  if (!variants || variants.length <= 1) return null;

  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0] || null);

  // Get color from variant - prioritize catalog color, then fallback to title parsing
  const getSwatchColor = (variant: Variant) => {
    // First try to use the color from catalog info
    if (variant.color) {
      return variant.color;
    }
    
    // Then try to extract from catalog_info if available
    if (variant.catalog_info?.color) {
      return variant.catalog_info.color;
    }
    
    // Try to extract color from options (Printful v1 API)
    if (variant.options) {
      const colorOption = variant.options.find((opt: any) => opt.id === 'Color');
      if (colorOption?.value) {
        return colorOption.value;
      }
    }
    
    // Fallback to parsing the title
    if (variant.title) {
      const title = variant.title.toLowerCase();
      const colorPatterns = [
        { pattern: /black/i, color: '#000000' },
        { pattern: /white/i, color: '#FFFFFF' },
        { pattern: /navy/i, color: '#000080' },
        { pattern: /red/i, color: '#FF0000' },
        { pattern: /blue/i, color: '#0000FF' },
        { pattern: /green/i, color: '#008000' },
        { pattern: /yellow/i, color: '#FFFF00' },
        { pattern: /purple/i, color: '#800080' },
        { pattern: /pink/i, color: '#FFC0CB' },
        { pattern: /orange/i, color: '#FFA500' },
        { pattern: /gray|grey/i, color: '#808080' },
        { pattern: /brown/i, color: '#A52A2A' },
        { pattern: /maroon/i, color: '#800000' },
        { pattern: /olive/i, color: '#808000' },
        { pattern: /teal/i, color: '#008080' },
        { pattern: /lime/i, color: '#00FF00' },
        { pattern: /aqua|cyan/i, color: '#00FFFF' },
        { pattern: /silver/i, color: '#C0C0C0' },
        { pattern: /gold/i, color: '#FFD700' },
        { pattern: /cream/i, color: '#FFFDD0' },
        { pattern: /beige/i, color: '#F5F5DC' },
        { pattern: /tan/i, color: '#D2B48C' },
        { pattern: /khaki/i, color: '#C3B091' },
        { pattern: /burgundy/i, color: '#800020' },
        { pattern: /coral/i, color: '#FF7F50' },
        { pattern: /salmon/i, color: '#FA8072' },
        { pattern: /lavender/i, color: '#E6E6FA' },
        { pattern: /mint/i, color: '#98FF98' },
        { pattern: /turquoise/i, color: '#40E0D0' },
        { pattern: /indigo/i, color: '#4B0082' },
        { pattern: /violet/i, color: '#8B00FF' },
        { pattern: /magenta/i, color: '#FF00FF' },
        { pattern: /fuchsia/i, color: '#FF00FF' },
        { pattern: /plum/i, color: '#DDA0DD' },
        { pattern: /orchid/i, color: '#DA70D6' },
        { pattern: /thistle/i, color: '#D8BFD8' },
        { pattern: /wheat/i, color: '#F5DEB3' },
        { pattern: /bisque/i, color: '#FFE4C4' },
        { pattern: /peach/i, color: '#FFCBA4' },
        { pattern: /moccasin/i, color: '#FFE4B5' },
        { pattern: /navajo/i, color: '#FFDEAD' },
        { pattern: /blanched/i, color: '#FFEBCD' },
        { pattern: /antique/i, color: '#FAEBD7' },
        { pattern: /linen/i, color: '#FAF0E6' },
        { pattern: /old/i, color: '#FDF5E6' },
        { pattern: /seashell/i, color: '#FFF5EE' },
        { pattern: /cornsilk/i, color: '#FFF8DC' },
        { pattern: /ivory/i, color: '#FFFFF0' },
        { pattern: /honeydew/i, color: '#F0FFF0' },
        { pattern: /azure/i, color: '#F0FFFF' },
        { pattern: /alice/i, color: '#F0F8FF' },
        { pattern: /ghost/i, color: '#F8F8FF' },
        { pattern: /snow/i, color: '#FFFAFA' },
        { pattern: /misty/i, color: '#FFE4E1' },
        { pattern: /rosy/i, color: '#FFE4E1' },
        { pattern: /light/i, color: '#F0F0F0' },
        { pattern: /dark/i, color: '#404040' },
      ];
      for (const color of colorPatterns) {
        if (color.pattern.test(title)) {
          return color.color;
        }
      }
    }
    return '#CCCCCC';
  };

  // Get display name for variant
  const getVariantDisplayName = (variant: Variant) => {
    // If we have size and color from options (Printful v1), use them
    if (variant.options) {
      const sizeOption = variant.options.find((opt: any) => opt.id === 'Size');
      const colorOption = variant.options.find((opt: any) => opt.id === 'Color');
      
      if (sizeOption?.value && colorOption?.value) {
        return `${sizeOption.value} - ${colorOption.value}`;
      } else if (sizeOption?.value) {
        return `${sizeOption.value} - ${variant.title}`;
      } else if (colorOption?.value) {
        return `${colorOption.value} - ${variant.title}`;
      }
    }
    
    // If we have size and color from catalog, use them
    if (variant.size && variant.color) {
      return `${variant.size} - ${variant.color}`;
    }
    // If we have size from catalog
    if (variant.size) {
      return `${variant.size} - ${variant.title}`;
    }
    // If we have color from catalog
    if (variant.color) {
      return `${variant.color} - ${variant.title}`;
    }
    // Fallback to title
    return variant.title;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Select Option</h3>
      <div className="flex gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const swatchColor = getSwatchColor(variant);
          return (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50 shadow-md'
                  : 'border-gray-300 hover:border-primary-300 bg-white'
              }`}
              aria-label={`Select ${getVariantDisplayName(variant)}`}
              type="button"
            >
              <span
                className="block w-7 h-7 rounded-full"
                style={{ backgroundColor: swatchColor }}
              />
            </button>
          );
        })}
      </div>
      
      {/* Selected variant info */}
      {selectedVariant && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Selected:</span>
            <span className="font-semibold text-gray-900">{getVariantDisplayName(selectedVariant)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="font-bold text-lg text-primary-600">
              {formatPrice(selectedVariant.price)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 