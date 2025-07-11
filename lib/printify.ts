export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: {
    id: number;
    src: string;
    variant_ids: number[];
  }[];
  variants: {
    id: number;
    title: string;
    price: number;
    currency: string;
    is_enabled: boolean;
  }[];
  tags: string[];
  is_locked: boolean;
  sales_channel_properties: any[];
}

export interface PrintifyProductsResponse {
  current_page: number;
  data: PrintifyProduct[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

class PrintifyAPI {
  private baseUrl = 'https://api.printify.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(shopId: string, page: number = 1, limit: number = 20): Promise<PrintifyProductsResponse> {
    return this.request<PrintifyProductsResponse>(`/shops/${shopId}/products.json?page=${page}&limit=${limit}`);
  }

  async getProduct(shopId: string, productId: string): Promise<PrintifyProduct> {
    return this.request<PrintifyProduct>(`/shops/${shopId}/products/${productId}.json`);
  }

  async getShops(): Promise<any[]> {
    return this.request<any[]>('/shops.json');
  }
}

// Create a singleton instance
let printifyAPI: PrintifyAPI | null = null;

export function getPrintifyAPI(): PrintifyAPI {
  if (!printifyAPI) {
    const apiKey = process.env.PRINTIFY_API_KEY;
    if (!apiKey) {
      throw new Error('PRINTIFY_API_KEY environment variable is required');
    }
    printifyAPI = new PrintifyAPI(apiKey);
  }
  return printifyAPI;
}

// Mock data for development
export const mockProducts: PrintifyProduct[] = [
  {
    id: '1',
    title: 'Custom T-Shirt Design',
    description: 'High-quality cotton t-shirt with your custom design. Perfect for everyday wear or special occasions.',
    images: [
      {
        id: 1,
        src: 'https://images.printify.com/mock/tshirt-1.jpg',
        variant_ids: [1, 2, 3]
      }
    ],
    variants: [
      {
        id: 1,
        title: 'Small - White',
        price: 2500, // $25.00 in cents
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 2,
        title: 'Medium - White',
        price: 2500,
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 3,
        title: 'Large - White',
        price: 2500,
        currency: 'USD',
        is_enabled: true
      }
    ],
    tags: ['t-shirt', 'custom', 'cotton'],
    is_locked: false,
    sales_channel_properties: []
  },
  {
    id: '2',
    title: 'Personalized Mug',
    description: 'Ceramic mug with your custom design. Microwave and dishwasher safe.',
    images: [
      {
        id: 2,
        src: 'https://images.printify.com/mock/mug-1.jpg',
        variant_ids: [4]
      }
    ],
    variants: [
      {
        id: 4,
        title: 'Standard - White',
        price: 1500, // $15.00 in cents
        currency: 'USD',
        is_enabled: true
      }
    ],
    tags: ['mug', 'ceramic', 'personalized'],
    is_locked: false,
    sales_channel_properties: []
  },
  {
    id: '3',
    title: 'Custom Hoodie',
    description: 'Warm and comfortable hoodie with your unique design. Perfect for cooler weather.',
    images: [
      {
        id: 3,
        src: 'https://images.printify.com/mock/hoodie-1.jpg',
        variant_ids: [5, 6, 7]
      }
    ],
    variants: [
      {
        id: 5,
        title: 'Small - Black',
        price: 4500, // $45.00 in cents
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 6,
        title: 'Medium - Black',
        price: 4500,
        currency: 'USD',
        is_enabled: true
      },
      {
        id: 7,
        title: 'Large - Black',
        price: 4500,
        currency: 'USD',
        is_enabled: true
      }
    ],
    tags: ['hoodie', 'warm', 'custom'],
    is_locked: false,
    sales_channel_properties: []
  }
]; 