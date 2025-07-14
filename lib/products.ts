import { getPrintfulAPI } from './printful';
import { getPrintifyAPI, PrintifyProduct } from './printify';

// Unified product interface that works with both APIs
export interface UnifiedProduct {
  id: string;
  name: string;
  description?: string;
  images: {
    src: string;
    alt?: string;
  }[];
  variants: {
    id: number | string;
    title: string;
    price: number;
    currency: string;
    is_enabled?: boolean;
    color?: string; // Added for Printful variants
    size?: string; // Added for Printful variants
    catalog_info?: any; // Added for Printful variants
  }[];
  tags?: string[];
  platform: 'printify' | 'printful';
  originalData: any; // Keep original data for reference
}

export interface UnifiedProductsResponse {
  data: UnifiedProduct[];
  total: number;
  hasMore: boolean;
}

class ProductService {
  private printful = getPrintfulAPI();
  private printify = getPrintifyAPI();

  // Convert Printify product to unified format
  private convertPrintifyProduct(product: PrintifyProduct): UnifiedProduct {
    return {
      id: `printify-${product.id}`,
      name: product.title,
      description: product.description,
      images: product.images.map(img => ({
        src: img.src,
        alt: product.title
      })),
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price / 100, // Convert cents to dollars
        currency: variant.currency,
        is_enabled: variant.is_enabled
      })),
      tags: product.tags,
      platform: 'printify',
      originalData: product
    };
  }

  // Convert Printful product to unified format
  private convertPrintfulProduct(product: any): UnifiedProduct {
    return {
      id: `printful-${product.published_to_stores?.[0]?.sync_product_id || product.id}`,
      name: product.name,
      description: product.description,
      images: [{
        src: product.thumbnail_url || product.image || '',
        alt: product.name
      }],
      variants: [], // Will be populated separately when fetching variants
      tags: product.tags,
      platform: 'printful',
      originalData: product
    };
  }

  // Convert comprehensive Printful product to unified format
  private convertComprehensivePrintfulProduct(product: any): UnifiedProduct {
    return {
      id: `printful-${product.id || product.sync_product_id}`,
      name: product.name,
      description: product.description,
      images: product.images?.map((img: any) => ({
        src: img.src || img.url,
        alt: product.name
      })) || [{
        src: product.thumbnail_url || product.image || '',
        alt: product.name
      }],
      variants: product.variants?.map((variant: any) => ({
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
      })) || [],
      tags: product.tags,
      platform: 'printful',
      originalData: product
    };
  }

  // Get products from both platforms
  async getUnifiedProducts(limit: number = 20): Promise<UnifiedProductsResponse> {
    const products: UnifiedProduct[] = [];

    try {
      // Get Printify products
      const printifyShopId = process.env.PRINTIFY_SHOP_ID || 'default-shop';
      const printifyResponse = await this.printify.getProducts(printifyShopId, 1, Math.ceil(limit / 2));
      if (printifyResponse.data) {
        const printifyProducts = printifyResponse.data.map(product => this.convertPrintifyProduct(product));
        products.push(...printifyProducts);
      }
    } catch (error) {
      console.error('Error fetching Printify products:', error);
    }

    try {
      // Get Printful products
      const printfulResponse = await this.printful.getSwingHighProducts(0, Math.ceil(limit / 2));
      if (printfulResponse.data) {
        const printfulProducts = printfulResponse.data.map(product => this.convertPrintfulProduct(product));
        products.push(...printfulProducts);
      }
    } catch (error) {
      console.error('Error fetching Printful products:', error);
    }

    // Sort products by name and limit results
    const sortedProducts = products
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, limit);

    return {
      data: sortedProducts,
      total: products.length,
      hasMore: products.length > limit
    };
  }

  // Get a single product by ID
  async getUnifiedProduct(productId: string): Promise<UnifiedProduct | null> {
    const [platform, id] = productId.split('-');
    
    if (platform === 'printify') {
      try {
        const printifyShopId = process.env.PRINTIFY_SHOP_ID || 'default-shop';
        const product = await this.printify.getProduct(printifyShopId, id);
        return this.convertPrintifyProduct(product);
      } catch (error) {
        console.error('Error fetching Printify product:', error);
        return null;
      }
    } else if (platform === 'printful') {
      try {
        console.log(`Fetching Printful product with ID: ${id}`);
        
        // Get SwingHigh products and find the one with matching sync_product_id
        console.log('Fetching SwingHigh products...');
        const productsResponse = await this.printful.getSwingHighProducts(0, 100);
        console.log('SwingHigh products response:', productsResponse ? 'received' : 'null');
        console.log('SwingHigh products count:', productsResponse.data?.length || 0);
        
        const swingHighProducts = productsResponse.data || [];
        const product = swingHighProducts.find((p: any) => 
          p.published_to_stores?.some((store: any) => store.sync_product_id === parseInt(id))
        );
        
        console.log('Found matching product:', product ? 'yes' : 'no');
        if (product) {
          console.log('Product name:', product.name);
          console.log('Product sync IDs:', product.published_to_stores?.map((s: any) => s.sync_product_id));
        }
        
        if (!product) {
          console.log('No matching product found, returning null');
          return null;
        }
        
        // Try comprehensive API method first for rich product data
        try {
          console.log('Attempting comprehensive API method...');
          const comprehensiveProduct = await this.printful.getProductComprehensive(parseInt(id));
          console.log('Comprehensive product received:', comprehensiveProduct ? 'yes' : 'no');
          if (comprehensiveProduct) {
            console.log('Comprehensive product name:', comprehensiveProduct.name);
            console.log('Comprehensive product variants count:', comprehensiveProduct.variants?.length || 0);
          }
          return this.convertComprehensivePrintfulProduct(comprehensiveProduct);
        } catch (comprehensiveError) {
          console.error('Comprehensive API failed, falling back to original method:', comprehensiveError);
          
          // Fallback to original method
          console.log('Using original method fallback...');
          const unifiedProduct = this.convertPrintfulProduct(product);
          console.log('Converted product:', unifiedProduct.name);
          
          const variants = await this.printful.getProductVariantsWithCatalogInfo(parseInt(id));
          console.log('Variants fetched:', variants.length);
          
          unifiedProduct.variants = variants.map((variant: any) => ({
            id: variant.id,
            title: variant.name || `Variant ${variant.id}`,
            price: parseFloat(variant.retail_price),
            currency: variant.retail_price_currency || 'USD',
            is_enabled: true,
            color: variant.color,
            size: variant.size,
            catalog_info: variant.catalog_info
          }));
          
          console.log('Final unified product variants:', unifiedProduct.variants.length);
          return unifiedProduct;
        }
      } catch (error) {
        console.error('Error fetching Printful product:', error);
        return null;
      }
    }
    return null;
  }
}

// Create a singleton instance
let productService: ProductService | null = null;

export function getProductService(): ProductService {
  if (!productService) {
    productService = new ProductService();
  }
  return productService;
} 