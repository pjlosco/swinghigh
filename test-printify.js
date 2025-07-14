require('dotenv').config({ path: '.env.local' });

const { getPrintifyAPI } = require('./lib/printify');

async function testPrintify() {
  try {
    console.log('Testing Printify API...');
    console.log('API Key exists:', !!process.env.PRINTIFY_API_KEY);
    console.log('Shop ID:', process.env.PRINTIFY_SHOP_ID);
    
    const printify = getPrintifyAPI();
    
    // Test getting shops
    console.log('\n1. Testing getShops()...');
    const shops = await printify.getShops();
    console.log('Shops found:', shops.length);
    console.log('First shop:', shops[0]);
    
    // Test getting products
    console.log('\n2. Testing getProducts()...');
    const products = await printify.getProducts(process.env.PRINTIFY_SHOP_ID, 1, 5);
    console.log('Products response:', !!products);
    console.log('Products count:', products.data?.length || 0);
    
    if (products.data && products.data.length > 0) {
      console.log('First product:', {
        id: products.data[0].id,
        title: products.data[0].title,
        variants: products.data[0].variants?.length || 0
      });
    }
    
  } catch (error) {
    console.error('Error testing Printify:', error.message);
    console.error('Full error:', error);
  }
}

testPrintify(); 