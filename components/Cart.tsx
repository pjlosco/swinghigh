'use client';

import { useCart } from '@/contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearPlatformCart, 
    hasItems, 
    hasPlatformItems, 
    formatPrice,
    getCheckoutUrls 
  } = useCart();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkoutUrls = getCheckoutUrls();

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
              <h2 className="mt-2 text-lg font-medium text-gray-300">Loading cart...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasItems()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <Link href="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            {/* Printify Items */}
            {hasPlatformItems('printify') && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Printify Items
                  </h2>
                  <button
                    onClick={() => clearPlatformCart('printify')}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  {cart.printify.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      platform="printify"
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Printful Items */}
            {hasPlatformItems('printful') && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Printful Items
                  </h2>
                  <button
                    onClick={() => clearPlatformCart('printful')}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  {cart.printful.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      platform="printful"
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {hasPlatformItems('printify') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Printify Items ({cart.printify.itemCount})</span>
                    <span className="font-medium">{formatPrice(cart.printify.total)}</span>
                  </div>
                )}
                {hasPlatformItems('printful') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Printful Items ({cart.printful.itemCount})</span>
                    <span className="font-medium">{formatPrice(cart.printful.total)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total ({cart.totalItems} items)</span>
                    <span>{formatPrice(cart.totalValue)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3">
                {checkoutUrls.printify && (
                  <Link
                    href={checkoutUrls.printify}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    Checkout Printify Items
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                )}
                {checkoutUrls.printful && (
                  <Link
                    href={checkoutUrls.printful}
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    Checkout Printful Items
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                )}
                <Link href="/products" className="w-full btn-outline">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>* Items from different platforms require separate checkout processes.</p>
                <p>* Shipping and taxes will be calculated at checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: any;
  platform: 'printify' | 'printful';
  onRemove: (productId: string, platform: 'printify' | 'printful', variantId?: string) => void;
  onUpdateQuantity: (productId: string, platform: 'printify' | 'printful', quantity: number, variantId?: string) => void;
  formatPrice: (price: number) => string;
}

function CartItemCard({ item, platform, onRemove, onUpdateQuantity, formatPrice }: CartItemCardProps) {
  const product = item.product;
  const variant = item.selectedVariant;
  const price = variant?.price || product.variants[0]?.price || 0;
  const totalPrice = price * item.quantity;

  // Generate URL-friendly slug and product link
  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const productUrl = `/products/${productSlug}-${product.id}`;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(product.id, platform, variant?.id?.toString());
  };

  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateQuantity(product.id, platform, newQuantity, variant?.id?.toString());
  };

  return (
    <Link href={productUrl} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              {product.images?.[0]?.src ? (
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                {variant && (
                  <p className="text-sm text-gray-500 mt-1">
                    {variant.title}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatPrice(price)}
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={(e) => handleQuantityChange(e, item.quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-3 py-1 border-x border-gray-300 text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(e, item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(totalPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 