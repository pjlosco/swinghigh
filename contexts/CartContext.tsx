'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCartService, UnifiedCart, CartItem } from '@/lib/cart';
import { UnifiedProduct } from '@/lib/products';

interface CartContextType {
  cart: UnifiedCart;
  addToCart: (product: UnifiedProduct, quantity?: number, selectedVariant?: any) => void;
  removeFromCart: (productId: string, platform: 'printify' | 'printful', variantId?: string) => void;
  updateQuantity: (productId: string, platform: 'printify' | 'printful', quantity: number, variantId?: string) => void;
  clearCart: () => void;
  clearPlatformCart: (platform: 'printify' | 'printful') => void;
  hasItems: () => boolean;
  hasPlatformItems: (platform: 'printify' | 'printful') => boolean;
  formatPrice: (price: number) => string;
  getCheckoutUrls: () => { printify?: string; printful?: string };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<UnifiedCart>({
    printify: { items: [], total: 0, itemCount: 0 },
    printful: { items: [], total: 0, itemCount: 0 },
    totalItems: 0,
    totalValue: 0
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const cartService = getCartService();

  // Load cart from storage on mount
  useEffect(() => {
    const savedCart = cartService.getCart();
    setCart(savedCart);
    setIsLoaded(true);
  }, []);

  // Update cart state when cart service changes
  const updateCartState = () => {
    if (isLoaded) {
      setCart(cartService.getCart());
    }
  };

  const addToCart = async (product: UnifiedProduct, quantity: number = 1, selectedVariant?: any) => {
    await cartService.addItem(product, quantity, selectedVariant);
    updateCartState();
  };

  const removeFromCart = (productId: string, platform: 'printify' | 'printful', variantId?: string) => {
    cartService.removeItem(productId, platform, variantId);
    updateCartState();
  };

  const updateQuantity = (productId: string, platform: 'printify' | 'printful', quantity: number, variantId?: string) => {
    cartService.updateQuantity(productId, platform, quantity, variantId);
    updateCartState();
  };

  const clearCart = () => {
    cartService.clearCart();
    updateCartState();
  };

  const clearPlatformCart = (platform: 'printify' | 'printful') => {
    cartService.clearPlatformCart(platform);
    updateCartState();
  };

  const hasItems = () => cartService.hasItems();

  const hasPlatformItems = (platform: 'printify' | 'printful') => cartService.hasPlatformItems(platform);

  const formatPrice = (price: number) => cartService.formatPrice(price);

  const getCheckoutUrls = () => cartService.getCheckoutUrls();

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearPlatformCart,
    hasItems,
    hasPlatformItems,
    formatPrice,
    getCheckoutUrls
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 