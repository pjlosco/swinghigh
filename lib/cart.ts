import { UnifiedProduct } from './products';
import { getPrintfulAPI } from './printful';

export interface CartItem {
  id: string;
  product: UnifiedProduct;
  quantity: number;
  selectedVariant?: {
    id: number | string;
    title: string;
    price: number;
  };
}

export interface PlatformCart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface UnifiedCart {
  printify: PlatformCart;
  printful: PlatformCart;
  totalItems: number;
  totalValue: number;
}

class CartService {
  private cart: UnifiedCart = {
    printify: { items: [], total: 0, itemCount: 0 },
    printful: { items: [], total: 0, itemCount: 0 },
    totalItems: 0,
    totalValue: 0
  };

  // Add item to cart
  async addItem(product: UnifiedProduct, quantity: number = 1, selectedVariant?: any): Promise<void> {
    const platform = product.platform as 'printify' | 'printful';
    const itemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;
    
    // For Printful products, we need to fetch variants if they're not already loaded
    let productWithVariants = product;
    if (platform === 'printful' && (!product.variants || product.variants.length === 0)) {
      try {
        const printful = getPrintfulAPI();
        const syncProductId = product.id.replace('printful-', '');
        // Use comprehensive API method for rich product data
        const comprehensiveProduct = await printful.getProductComprehensive(parseInt(syncProductId));
        productWithVariants = {
          ...product,
          variants: comprehensiveProduct.variants?.map((variant: any) => ({
            id: variant.id,
            title: variant.title || variant.name,
            price: variant.price,
            currency: variant.currency || 'USD',
            is_enabled: variant.is_enabled !== false,
            color: variant.color,
            size: variant.size,
            catalog_info: variant.catalog_info,
            files: variant.files,
            options: variant.options
          })) || []
        };
      } catch (error) {
        console.error('Error fetching Printful variants for cart:', error);
      }
    }
    
    const existingItem = this.cart[platform].items.find(item => 
      selectedVariant 
        ? item.id === itemId 
        : item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        id: itemId,
        product: productWithVariants,
        quantity,
        selectedVariant: selectedVariant ? {
          id: selectedVariant.id,
          title: selectedVariant.title,
          price: selectedVariant.price
        } : undefined
      };
      this.cart[platform].items.push(cartItem);
    }

    this.updateCartTotals();
    this.saveToStorage();
  }

  // Remove item from cart
  removeItem(productId: string, platform: 'printify' | 'printful', variantId?: string): void {
    const itemId = variantId ? `${productId}-${variantId}` : productId;
    this.cart[platform].items = this.cart[platform].items.filter(item => item.id !== itemId);
    this.updateCartTotals();
    this.saveToStorage();
  }

  // Update item quantity
  updateQuantity(productId: string, platform: 'printify' | 'printful', quantity: number, variantId?: string): void {
    const itemId = variantId ? `${productId}-${variantId}` : productId;
    const item = this.cart[platform].items.find(item => item.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, platform, variantId);
      } else {
        item.quantity = quantity;
        this.updateCartTotals();
        this.saveToStorage();
      }
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.cart = {
      printify: { items: [], total: 0, itemCount: 0 },
      printful: { items: [], total: 0, itemCount: 0 },
      totalItems: 0,
      totalValue: 0
    };
    this.saveToStorage();
  }

  // Clear specific platform cart
  clearPlatformCart(platform: 'printify' | 'printful'): void {
    this.cart[platform] = { items: [], total: 0, itemCount: 0 };
    this.updateCartTotals();
    this.saveToStorage();
  }

  // Get cart data
  getCart(): UnifiedCart {
    return this.cart;
  }

  // Get platform-specific cart
  getPlatformCart(platform: 'printify' | 'printful'): PlatformCart {
    return this.cart[platform];
  }

  // Check if cart has items
  hasItems(): boolean {
    return this.cart.totalItems > 0;
  }

  // Check if specific platform has items
  hasPlatformItems(platform: 'printify' | 'printful'): boolean {
    return this.cart[platform].itemCount > 0;
  }

  // Update cart totals
  private updateCartTotals(): void {
    // Update platform totals
    this.cart.printify.total = this.cart.printify.items.reduce((sum, item) => {
      const price = item.selectedVariant?.price || item.product.variants[0]?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    this.cart.printify.itemCount = this.cart.printify.items.reduce((sum, item) => sum + item.quantity, 0);

    this.cart.printful.total = this.cart.printful.items.reduce((sum, item) => {
      const price = item.selectedVariant?.price || item.product.variants[0]?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    this.cart.printful.itemCount = this.cart.printful.items.reduce((sum, item) => sum + item.quantity, 0);

    // Update overall totals
    this.cart.totalItems = this.cart.printify.itemCount + this.cart.printful.itemCount;
    this.cart.totalValue = this.cart.printify.total + this.cart.printful.total;
  }

  // Save cart to localStorage
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('swinghigh-cart', JSON.stringify(this.cart));
    }
  }

  // Load cart from localStorage
  loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swinghigh-cart');
      if (saved) {
        try {
          this.cart = JSON.parse(saved);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }

  // Get checkout URLs for each platform
  getCheckoutUrls(): { printify?: string; printful?: string } {
    const urls: { printify?: string; printful?: string } = {};

    if (this.hasPlatformItems('printify')) {
      // For Printify, we'll need to create a checkout session
      // This would typically involve calling Printify's API
      urls.printify = '/checkout/printify';
    }

    if (this.hasPlatformItems('printful')) {
      // For Printful, we'll need to create a checkout session
      // This would typically involve calling Printful's API
      urls.printful = '/checkout/printful';
    }

    return urls;
  }

  // Format price for display
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }
}

// Create a singleton instance
let cartService: CartService | null = null;

export function getCartService(): CartService {
  if (!cartService) {
    cartService = new CartService();
    cartService.loadFromStorage();
  }
  return cartService;
} 