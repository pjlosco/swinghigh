import Header from '@/components/Header';
import { getProductService } from '@/lib/products';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VariantSelector from './VariantSelector';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productService = getProductService();
  let product;
  
  try {
    // Extract product ID from the slug format: "product-name-platform-id"
    // The URL format is: /products/product-name-platform-id
    // We need to extract the platform-id part, handling product names with dashes
    const productIdMatch = params.id.match(/-(printify|printful)-([^-]+)$/);
    let finalProductId = params.id;
    
    if (productIdMatch) {
      // We found a platform identifier, use it
      finalProductId = `${productIdMatch[1]}-${productIdMatch[2]}`;
    } else {
      // Fallback: try to extract just the last part and assume Printful
      const lastDashMatch = params.id.match(/-([^-]+)$/);
      if (lastDashMatch) {
        finalProductId = `printful-${lastDashMatch[1]}`;
      }
    }
    
    console.log('Product details page - params.id:', params.id);
    console.log('Product details page - final productId:', finalProductId);
    
    // Get the unified product
    product = await productService.getUnifiedProduct(finalProductId);
    console.log('Product details page - found product:', product ? 'yes' : 'no');
    
    if (!product) {
      console.log('Product details page - product not found, returning 404');
      notFound();
    }
  } catch (error) {
    console.log('Product details page - error:', error);
    notFound();
  }

  const mainImage = product.images?.[0]?.src || '';
  
  // Since there's only one product, we'll show an empty related products section
  const relatedProducts: any[] = [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const lowestPrice = product.variants.length > 0 ? Math.min(...product.variants.map(v => v.price)) : 0;
  const highestPrice = product.variants.length > 0 ? Math.max(...product.variants.map(v => v.price)) : 0;
  const hasMultiplePrices = lowestPrice !== highestPrice;

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={image.src}
                      alt={`${product.name} ${index + 2}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  product.platform === 'printify' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.platform === 'printify' ? 'Printify' : 'Printful'}
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                </div>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Wishlist</span>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900">
              {hasMultiplePrices ? (
                <div>
                  <span>{formatPrice(lowestPrice)}</span>
                  <span className="text-lg text-gray-500 ml-2">- {formatPrice(highestPrice)}</span>
                </div>
              ) : (
                formatPrice(lowestPrice)
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              {product.description ? (
                <div 
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: product.description 
                      .replace(/<p>/g, '<p class="mb-4">')
                      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-1">')
                      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-1">')
                      .replace(/<li>/g, '<li class="text-gray-600">')
                      .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
                      .replace(/<em>/g, '<em class="italic">')
                      .replace(/<h[1-6]>/g, '<h3 class="font-semibold text-gray-900 mt-6 mb-2">')
                      .replace(/<\/h[1-6]>/g, '</h3>')
                      .replace(/<a /g, '<a class="text-primary-600 hover:text-primary-700 underline" ')
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">No description available.</p>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <VariantSelector variants={product.variants} />
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button className="px-3 py-2 text-gray-600 hover:text-gray-900">-</button>
                  <span className="px-4 py-2 border-x border-gray-300">1</span>
                  <button className="px-3 py-2 text-gray-600 hover:text-gray-900">+</button>
                </div>
                <button 
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                  disabled={product.platform === 'printful' && product.variants.length === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {product.platform === 'printful' && product.variants.length === 0 
                      ? 'Loading...' 
                      : 'Add to Cart'
                    }
                  </span>
                </button>
              </div>
              
              <button className="w-full btn-secondary py-3">
                Buy Now
              </button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Quality Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
            <p className="text-lg text-gray-600">Discover more amazing products</p>
          </div>
          
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="card group">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <Image
                        src={relatedProduct.images[0].src}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(Math.min(...relatedProduct.variants.map((v: any) => v.price)))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No related products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 