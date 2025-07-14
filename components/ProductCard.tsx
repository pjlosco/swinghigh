'use client';

import { UnifiedProduct } from '@/lib/products';
import { generateSlug, formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: UnifiedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const mainImage = product.images?.[0]?.src || '';
  
  // Generate URL-friendly slug
  const productSlug = generateSlug(product.name);
  
  const lowestPrice = variants.length > 0
    ? Math.min(...variants.map(v => v.price))
    : 0;
  const highestPrice = variants.length > 0
    ? Math.max(...variants.map(v => v.price))
    : 0;
  const hasMultiplePrices = lowestPrice !== highestPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return; // Prevent multiple clicks
    
    setIsAddingToCart(true);
    try {
      // If there are variants, we'll need to handle variant selection
      // For now, just add the first variant or the product itself
      const selectedVariant = variants.length > 0 ? variants[0] : undefined;
      await addToCart(product, 1, selectedVariant);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/products/${productSlug}-${product.id}`}>
      <div 
        className="card group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          
          {/* Platform Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.platform === 'printify' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {product.platform === 'printify' ? 'Printify' : 'Printful'}
            </span>
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart className={`w-4 h-4 ${isAddingToCart ? 'animate-spin' : ''}`} />
              <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {variants.length > 0 ? (
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
              ) : (
                <span className="text-gray-500 text-sm">No variants available</span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(product.tags) ? product.tags : []).slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
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