export interface PrintfulProduct {
  id: number | null;
  external_id: string | null;
  source: string | null;
  name: string;
  thumbnail_url: string;
  published_to_stores: {
    store_id: number;
    sync_product_id: number;
    sync_product_external_id: string;
  }[];
  _links: {
    self: { href: string };
    variants: { href: string };
  };
  // Legacy fields for compatibility
  description?: string;
  images?: {
    id: number;
    src: string;
    width: number;
    height: number;
  }[];
  variants?: {
    id: number;
    name: string;
    retail_price: string;
    currency: string;
    is_enabled: boolean;
  }[];
  tags?: string[];
  is_ignored?: boolean;
  created?: number;
  updated?: number;
  title?: string;
  image?: string;
}

// Enhanced interface for v1 API data
export interface PrintfulV1Product {
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    thumbnail: string;
    is_ignored: boolean;
    created: number;
    updated: number;
    variants: number;
    synced: number;
  };
  sync_variants: Array<{
    id: number;
    external_id: string;
    sync_product_id: number;
    name: string;
    synced: boolean;
    variant_id: number;
    retail_price: string;
    currency: string;
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
    files: Array<{
      id: number;
      type: string;
      url: string;
      preview_url: string;
      visible: boolean;
    }>;
    options: Array<{
      id: string;
      value: string;
    }>;
  }>;
}

export interface PrintfulProductsResponse {
  data: PrintfulProduct[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}

class PrintfulAPI {
  private baseUrlV2 = 'https://api.printful.com/v2';
  private baseUrlV1 = 'https://api.printful.com';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, useV1: boolean = false): Promise<T> {
    const baseUrl = useV1 ? this.baseUrlV1 : this.baseUrlV2;
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // V2 API uses different response structure
    if (!useV1 && data.error) {
      throw new Error(`Printful API error: ${data.error.message || 'Unknown error'}`);
    }

    return data;
  }

  async getProducts(offset: number = 0, limit: number = 20): Promise<PrintfulProductsResponse> {
    return this.request<PrintfulProductsResponse>(`/products?offset=${offset}&limit=${limit}`);
  }

  async getStoreProducts(storeId: number, offset: number = 0, limit: number = 20): Promise<PrintfulProductsResponse> {
    return this.request<PrintfulProductsResponse>(`/stores/${storeId}/products?offset=${offset}&limit=${limit}`);
  }

  async getSwingHighProducts(offset: number = 0, limit: number = 20): Promise<PrintfulProductsResponse> {
    console.log('Fetching all Printful products...');
    // Get all products and filter for SwingHigh products
    const allProducts = await this.request<PrintfulProductsResponse>(`/products?offset=${offset}&limit=100`);
    console.log('All products fetched:', allProducts.data?.length || 0);
    
    // Filter for SwingHigh products with guards
    const swingHighProducts = allProducts.data.filter((product: any) => {
      // Get the product name from the correct field
      const productName = product.name || product.title || '';
      console.log(`Checking product: "${productName}"`);
      
      const isSwingHigh = productName && (
        productName.toLowerCase().includes('swing') ||
        productName.toLowerCase().includes('swinghigh') ||
        productName.toLowerCase().includes('custom') ||
        productName.toLowerCase().includes('personalized') ||
        (product.tags && product.tags.some((tag: any) => 
          tag && (tag.toLowerCase().includes('swing') || tag.toLowerCase().includes('swinghigh'))
        ))
      );
      
      if (isSwingHigh) {
        console.log(`Found SwingHigh product: "${productName}"`);
      }
      
      return isSwingHigh;
    });

    console.log('SwingHigh products found:', swingHighProducts.length);
    swingHighProducts.forEach((product: any) => {
      console.log(`- ${product.name} (ID: ${product.id})`);
    });

    return {
      data: swingHighProducts.slice(offset, offset + limit),
      paging: {
        total: swingHighProducts.length,
        offset: offset,
        limit: limit
      }
    };
  }

  async getProduct(productId: number): Promise<{ result: PrintfulProduct }> {
    // For sync products, we need to use the sync_product_id format
    return this.request<{ result: PrintfulProduct }>(`/products/sp${productId}`);
  }

  // Get detailed product info using v1 API
  async getProductV1(syncProductId: number): Promise<PrintfulV1Product> {
    try {
      console.log(`Making v1 API call to /sync/products/${syncProductId}`);
      const response = await this.request<PrintfulV1Product>(`/sync/products/${syncProductId}`, true);
      console.log('v1 API response received successfully');
      return response;
    } catch (error) {
      console.error(`v1 API error for sync product ${syncProductId}:`, error);
      throw error;
    }
  }

  async getProductVariants(syncProductId: number): Promise<any[]> {
    const response = await this.request<{ data: any[] }>(`/products/sp${syncProductId}/variants`);
    return response.data;
  }

  async getCatalogVariant(catalogVariantId: number): Promise<any> {
    try {
      // Try the catalog variants endpoint first
      const response = await this.request<{ result: any }>(`/catalog/variants/${catalogVariantId}`);
      return response.result;
    } catch (error) {
      // Try alternative endpoint
      try {
        const response = await this.request<{ result: any }>(`/catalog/variant/${catalogVariantId}`);
        return response.result;
      } catch (error2) {
        return null;
      }
    }
  }

  async getProductVariantsWithCatalogInfo(syncProductId: number): Promise<any[]> {
    try {
      // First get the sync product variants
      const syncVariants = await this.getProductVariants(syncProductId);
      
      // Then fetch catalog information for each variant
      const variantsWithCatalogInfo = await Promise.all(
        syncVariants.map(async (syncVariant) => {
          try {
            // Get catalog variant info if we have a catalog_variant_id
            if (syncVariant.catalog_variant_id) {
              const catalogVariant = await this.getCatalogVariant(syncVariant.catalog_variant_id);
              if (catalogVariant) {
                return {
                  ...syncVariant,
                  catalog_info: catalogVariant,
                  // Extract color and size from catalog variant
                  color: catalogVariant.color || null,
                  size: catalogVariant.size || null,
                  // Use catalog variant name if available
                  name: catalogVariant.name || syncVariant.name || `Variant ${syncVariant.id}`,
                };
              }
            }
            
            // Fallback to sync variant info
            return {
              ...syncVariant,
              catalog_info: null,
              color: null,
              size: null,
              name: syncVariant.name || `Variant ${syncVariant.id}`,
            };
          } catch (error) {
            console.error(`Error fetching catalog info for variant ${syncVariant.id}:`, error);
            return {
              ...syncVariant,
              catalog_info: null,
              color: null,
              size: null,
              name: syncVariant.name || `Variant ${syncVariant.id}`,
            };
          }
        })
      );
      
      return variantsWithCatalogInfo;
    } catch (error) {
      console.error('Error fetching product variants with catalog info:', error);
      // Fallback to basic variants
      return await this.getProductVariants(syncProductId);
    }
  }

  // Get comprehensive product data combining v1 and v2 APIs
  async getProductComprehensive(syncProductId: number): Promise<any> {
    try {
      console.log(`Fetching comprehensive product data for sync product ID: ${syncProductId}`);
      
      // Get v1 product data (rich variant info, files, options)
      console.log('Fetching v1 product data...');
      const v1Product = await this.getProductV1(syncProductId);
      console.log('v1 product data received:', v1Product ? 'yes' : 'no');
      
      // Get v2 product data (basic product info)
      console.log('Fetching v2 product data...');
      const v2Product = await this.getProduct(syncProductId);
      console.log('v2 product data received:', v2Product ? 'yes' : 'no');
      console.log('v2 product result:', v2Product?.result ? 'exists' : 'null/undefined');
      
      // Combine the data
      const combinedProduct = {
        // Basic info from v2
        id: v2Product.result?.id || syncProductId,
        external_id: v2Product.result?.external_id,
        name: v2Product.result?.name || v1Product.sync_product?.name,
        thumbnail_url: v2Product.result?.thumbnail_url || v1Product.sync_product?.thumbnail,
        description: v2Product.result?.description,
        tags: v2Product.result?.tags,
        platform: 'printful',
        
        // Rich variant data from v1
        variants: v1Product.sync_variants?.map((variant: any) => ({
          id: variant.id,
          title: variant.name,
          price: parseFloat(variant.retail_price),
          currency: variant.currency,
          is_enabled: variant.synced,
          // Extract color and size from options
          color: variant.options?.find((opt: any) => opt.id === 'Color')?.value || null,
          size: variant.options?.find((opt: any) => opt.id === 'Size')?.value || null,
          // Additional variant info
          variant_id: variant.variant_id,
          product_id: variant.product?.product_id,
          image: variant.product?.image,
          files: variant.files,
          options: variant.options
        })) || [],
        
        // Multiple images from variant files
        images: v1Product.sync_variants
          ?.flatMap((variant: any) => variant.files || [])
          .filter((file: any) => file.visible && file.type === 'preview')
          .map((file: any, index: number) => ({
            id: index,
            src: file.url,
            alt: v2Product.result?.name || v1Product.sync_product?.name,
            width: 800,
            height: 800
          }))
          .slice(0, 10) || [], // Limit to 10 images
        
        // Additional metadata
        created: v1Product.sync_product?.created,
        updated: v1Product.sync_product?.updated,
        variant_count: v1Product.sync_product?.variants,
        synced_count: v1Product.sync_product?.synced
      };
      
      console.log('Combined product created successfully');
      return combinedProduct;
    } catch (error) {
      console.error('Error fetching comprehensive product data:', error);
      // Fallback to v2 only
      try {
        console.log('Attempting v2-only fallback...');
        const v2Product = await this.getProduct(syncProductId);
        console.log('v2 fallback successful:', v2Product ? 'yes' : 'no');
        console.log('v2 product structure:', JSON.stringify(v2Product, null, 2));
        
        if (!v2Product) {
          throw new Error('v2 product response is null or undefined');
        }
        
        if (!v2Product.result) {
          console.log('v2 product result is null/undefined, checking response structure...');
          // Try to extract data from different possible structures
          const productData = (v2Product as any).data || (v2Product as any).product || v2Product;
          if (!productData) {
            throw new Error('No product data found in v2 response');
          }
          
          console.log('Using alternative product data structure');
          const variants = await this.getProductVariantsWithCatalogInfo(syncProductId);
          
          return {
            id: productData.id || syncProductId,
            external_id: productData.external_id,
            name: productData.name,
            thumbnail_url: productData.thumbnail_url,
            description: productData.description,
            tags: productData.tags,
            platform: 'printful',
            variants: variants.map((variant: any) => ({
              id: variant.id,
              title: variant.name || `Variant ${variant.id}`,
              price: parseFloat(variant.retail_price),
              currency: variant.retail_price_currency || 'USD',
              is_enabled: true,
              color: variant.color,
              size: variant.size,
              catalog_info: variant.catalog_info
            })),
            images: [{
              id: 1,
              src: productData.thumbnail_url || '',
              alt: productData.name,
              width: 800,
              height: 800
            }]
          };
        }
        
        const variants = await this.getProductVariantsWithCatalogInfo(syncProductId);
        
        return {
          id: v2Product.result.id,
          external_id: v2Product.result.external_id,
          name: v2Product.result.name,
          thumbnail_url: v2Product.result.thumbnail_url,
          description: v2Product.result.description,
          tags: v2Product.result.tags,
          platform: 'printful',
          variants: variants.map((variant: any) => ({
            id: variant.id,
            title: variant.name || `Variant ${variant.id}`,
            price: parseFloat(variant.retail_price),
            currency: variant.retail_price_currency || 'USD',
            is_enabled: true,
            color: variant.color,
            size: variant.size,
            catalog_info: variant.catalog_info
          })),
          images: [{
            id: 1,
            src: v2Product.result.thumbnail_url || '',
            alt: v2Product.result.name,
            width: 800,
            height: 800
          }]
        };
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        throw error;
      }
    }
  }

  async getStores(): Promise<any[]> {
    const response = await this.request<{ result: any[] }>('/stores');
    return response.result;
  }

  async getStore(storeId: number): Promise<any> {
    const response = await this.request<{ result: any }>(`/stores/${storeId}`);
    return response.result;
  }
}

// Create a singleton instance
let printfulAPI: PrintfulAPI | null = null;

export function getPrintfulAPI(): PrintfulAPI {
  if (!printfulAPI) {
    const apiKey = process.env.PRINTFUL_API_KEY;
    if (!apiKey) {
      throw new Error('PRINTFUL_API_KEY environment variable is required');
    }
    printfulAPI = new PrintfulAPI(apiKey);
  }
  return printfulAPI;
}

// Mock data for development (if needed)
export const mockProducts: PrintfulProduct[] = [
  {
    id: 1,
    external_id: 'mock-1',
    source: 'mock',
    name: 'Custom T-Shirt Design',
    thumbnail_url: 'https://images.printful.com/mock/tshirt-1.jpg',
    published_to_stores: [
      {
        store_id: 16386751,
        sync_product_id: 1,
        sync_product_external_id: 'mock-1'
      }
    ],
    _links: {
      self: { href: 'https://api.printful.com/v2/products/1' },
      variants: { href: 'https://api.printful.com/v2/products/1/variants' }
    },
    description: 'High-quality cotton t-shirt with your custom design. Perfect for everyday wear or special occasions.',
    images: [
      {
        id: 1,
        src: 'https://images.printful.com/mock/tshirt-1.jpg',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 1,
        name: 'Small - White',
        retail_price: '25.00',
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 2,
        name: 'Medium - White',
        retail_price: '25.00',
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 3,
        name: 'Large - White',
        retail_price: '25.00',
        currency: 'USD',
        is_enabled: true
      }
    ],
    tags: ['t-shirt', 'custom', 'cotton'],
    is_ignored: false,
    created: Date.now(),
    updated: Date.now()
  },
  {
    id: 2,
    external_id: 'mock-2',
    source: 'mock',
    name: 'Personalized Mug',
    thumbnail_url: 'https://images.printful.com/mock/mug-1.jpg',
    published_to_stores: [
      {
        store_id: 16386751,
        sync_product_id: 2,
        sync_product_external_id: 'mock-2'
      }
    ],
    _links: {
      self: { href: 'https://api.printful.com/v2/products/2' },
      variants: { href: 'https://api.printful.com/v2/products/2/variants' }
    },
    description: 'Ceramic mug with your custom design. Microwave and dishwasher safe.',
    images: [
      {
        id: 2,
        src: 'https://images.printful.com/mock/mug-1.jpg',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 4,
        name: 'Standard - White',
        retail_price: '15.00',
        currency: 'USD',
        is_enabled: true
      }
    ],
    tags: ['mug', 'ceramic', 'personalized'],
    is_ignored: false,
    created: Date.now(),
    updated: Date.now()
  },
  {
    id: 3,
    external_id: 'mock-3',
    source: 'mock',
    name: 'Custom Hoodie',
    thumbnail_url: 'https://images.printful.com/mock/hoodie-1.jpg',
    published_to_stores: [
      {
        store_id: 16386751,
        sync_product_id: 3,
        sync_product_external_id: 'mock-3'
      }
    ],
    _links: {
      self: { href: 'https://api.printful.com/v2/products/3' },
      variants: { href: 'https://api.printful.com/v2/products/3/variants' }
    },
    description: 'Warm and comfortable hoodie with your unique design. Perfect for cooler weather.',
    images: [
      {
        id: 3,
        src: 'https://images.printful.com/mock/hoodie-1.jpg',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 5,
        name: 'Small - Black',
        retail_price: '45.00',
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 6,
        name: 'Medium - Black',
        retail_price: '45.00',
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 7,
        name: 'Large - Black',
        retail_price: '45.00',
        currency: 'USD',
        is_enabled: true
      }
    ],
    tags: ['hoodie', 'warm', 'custom'],
    is_ignored: false,
    created: Date.now(),
    updated: Date.now()
  }
]; 