import Header from '@/components/Header';
import { getPrintifyAPI } from '@/lib/printify';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const printify = getPrintifyAPI();
  const shopId = process.env.PRINTIFY_SHOP_ID!;
  let product;
  try {
    product = await printify.getProduct(shopId, params.id);
  } catch {
    notFound();
  }

  // Fetch one related product (not the current one)
  const productsResponse = await printify.getProducts(shopId, 1, 2);
  const relatedProducts = productsResponse.data.filter(p => p.id !== params.id).slice(0, 1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));
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
            <span className="text-gray-900">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0].src}
                  alt={product.title}
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
                      alt={`${product.title} ${index + 2}`}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
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
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select Options</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="p-3 border border-gray-300 rounded-lg text-left hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{variant.title}</div>
                    <div className="text-sm text-gray-600">{formatPrice(variant.price)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button className="px-3 py-2 text-gray-600 hover:text-gray-900">-</button>
                  <span className="px-4 py-2 border-x border-gray-300">1</span>
                  <button className="px-3 py-2 text-gray-600 hover:text-gray-900">+</button>
                </div>
                <button className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
              
              <button className="w-full btn-secondary py-3">
                Buy Now
              </button>
            </div>

            {/* Tags */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="card group">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  {relatedProduct.images.length > 0 ? (
                    <Image
                      src={relatedProduct.images[0].src}
                      alt={relatedProduct.title}
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
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.title}</h3>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(Math.min(...relatedProduct.variants.map(v => v.price)))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 