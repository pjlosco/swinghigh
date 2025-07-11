'use client';

import { PrintifyProduct } from '@/lib/printify';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: PrintifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));
  const hasMultiplePrices = lowestPrice !== highestPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div 
        className="card group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0].src}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add to Cart Button */}
          <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button 
              onClick={(e) => e.preventDefault()}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {hasMultiplePrices ? (
                  <>
                    <span>{formatPrice(lowestPrice)}</span>
                    <span className="text-sm text-gray-500">- {formatPrice(highestPrice)}</span>
                  </>
                ) : (
                  formatPrice(lowestPrice)
                )}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 