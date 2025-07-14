import { getPrintfulAPI } from '@/lib/printful';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Debug Printful API endpoint called');
    
    const printful = getPrintfulAPI();
    
    // Test basic API connectivity
    console.log('Testing basic API connectivity...');
    const allProducts = await printful.getProducts(0, 5);
    console.log('Basic products fetch successful:', allProducts.data?.length || 0);
    
    // Test SwingHigh products
    console.log('Testing SwingHigh products...');
    const swingHighProducts = await printful.getSwingHighProducts(0, 10);
    console.log('SwingHigh products fetch successful:', swingHighProducts.data?.length || 0);
    
    // Test stores
    console.log('Testing stores...');
    const stores = await printful.getStores();
    console.log('Stores fetch successful:', stores?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: 'Printful API connectivity test successful',
      data: {
        totalProducts: allProducts.data?.length || 0,
        swingHighProducts: swingHighProducts.data?.length || 0,
        stores: stores?.length || 0,
        sampleProducts: allProducts.data?.slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          external_id: p.external_id
        })) || [],
        swingHighProductNames: swingHighProducts.data?.map((p: any) => p.name) || []
      }
    });
  } catch (error) {
    console.error('Printful API debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 