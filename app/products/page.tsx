import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getPrintifyAPI } from '@/lib/printify';
import { Search, Filter, Grid, List } from 'lucide-react';

export default async function ProductsPage() {
  const printify = getPrintifyAPI();
  const shopId = process.env.PRINTIFY_SHOP_ID!;
  const productsResponse = await printify.getProducts(shopId, 1, 1); // Only fetch one product for now
  const products = productsResponse.data;

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our collection of custom products. Each item is carefully crafted 
              with quality materials and your unique design.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button className="p-2 rounded bg-primary-600 text-white">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-2 rounded hover:bg-gray-100">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="btn-primary text-lg px-8 py-3">
              Load More Products
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">T-Shirts</h3>
              <p className="text-sm text-gray-600">Custom designs on quality cotton</p>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mugs</h3>
              <p className="text-sm text-gray-600">Personalized ceramic mugs</p>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hoodies</h3>
              <p className="text-sm text-gray-600">Warm and comfortable designs</p>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Art Prints</h3>
              <p className="text-sm text-gray-600">Beautiful wall art</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 