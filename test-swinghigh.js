// Test SwingHigh products filtering
async function testSwingHigh() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  
  try {
    console.log('🔍 Testing SwingHigh products filtering...');
    
    // Get all products and filter for SwingHigh
    const response = await fetch('https://api.printful.com/products?limit=50', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`📦 Total products in catalog: ${data.paging?.total || 'unknown'}`);
      
      // Filter for SwingHigh products
      const swingHighProducts = data.result.filter(product => 
        product.name.toLowerCase().includes('swing') ||
        product.name.toLowerCase().includes('swinghigh') ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes('swing') || 
          tag.toLowerCase().includes('swinghigh')
        ))
      );
      
      console.log(`\n🎯 SwingHigh products found: ${swingHighProducts.length}`);
      
      if (swingHighProducts.length > 0) {
        swingHighProducts.forEach(product => {
          console.log(`   - ${product.name} (ID: ${product.id})`);
          if (product.tags && product.tags.length > 0) {
            console.log(`     Tags: ${product.tags.join(', ')}`);
          }
        });
        console.log('\n✅ Ready to use SwingHigh products!');
      } else {
        console.log('\n❌ No SwingHigh products found. Make sure your products have "swing" or "swinghigh" in the name or tags.');
      }
    } else {
      console.log('❌ Error fetching products:', response.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSwingHigh(); 