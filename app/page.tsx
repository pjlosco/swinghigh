import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getPrintfulAPI } from '@/lib/printful';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  let featuredProducts: any[] = [];
  
  try {
    const printful = getPrintfulAPI();
    // Fetch SwingHigh products specifically
    const productsResponse = await printful.getSwingHighProducts(0, 6); // Fetch 6 SwingHigh products
    featuredProducts = Array.isArray(productsResponse.data) ? productsResponse.data : [];
  } catch (error) {
    console.log('Could not fetch products:', error);
    featuredProducts = [];
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center">
            <div className="mb-10 flex justify-center">
              <Image
                src="/swinghighplain.jpg"
                alt="Swing High Logo Hero"
                width={340}
                height={340}
                className="mx-auto drop-shadow-[0_0_40px_rgba(34,197,94,0.25)]"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Custom Products Made with
              <span className="text-gradient"> Love</span>
            </h1>
            <p className="text-xl text-black/70 mb-8 max-w-3xl mx-auto">
              Discover unique, personalized items created just for you. From custom t-shirts to 
              personalized mugs, each product is crafted with quality materials and your vision in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/about" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50. Quick delivery to your doorstep.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium materials and craftsmanship. We stand behind every product.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy. Not satisfied? We'll make it right.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out our most popular custom products. Each item is carefully designed and 
              made with premium materials.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real reviews from happy customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Amazing quality! The custom t-shirt I ordered is exactly what I wanted. 
                Fast shipping and great customer service."
              </p>
              <div className="font-semibold text-gray-900">- Sarah M.</div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Perfect gift for my friend's birthday. The personalized mug is beautiful 
                and the design quality is outstanding."
              </p>
              <div className="font-semibold text-gray-900">- Mike R.</div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Love my custom hoodie! The material is soft and the print is vibrant. 
                Will definitely order again!"
              </p>
              <div className="font-semibold text-gray-900">- Jessica L.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex flex-col items-start mb-4">
                <Image
                  src="/swinghighplain.jpg"
                  alt="Swing High Logo Footer"
                  width={64}
                  height={64}
                  className="mb-2"
                />
                <span className="text-xl font-bold">SwingHigh</span>
              </div>
              <p className="text-gray-400">
                Creating unique custom products that bring your ideas to life.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/instagram" className="hover:text-white transition-colors">Instagram</Link></li>
                <li><Link href="/facebook" className="hover:text-white transition-colors">Facebook</Link></li>
                <li><Link href="/twitter" className="hover:text-white transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SwingHigh Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 