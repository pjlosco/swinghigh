import { getPrintfulAPI } from '@/lib/printful';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const printful = getPrintfulAPI();
    console.log('Debug: Fetching product variants...');
    
    // Get a specific product's variants
    const productId = 386830215; // Swing High Under Armour® men's polo
    const variantsUrl = `/products/sp${productId}/variants`;
    
    console.log('Debug: Fetching variants from:', variantsUrl);
    
    const response = await fetch(`https://api.printful.com/v2${variantsUrl}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Debug: Variants response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Debug: Variants error response:', errorText);
      return NextResponse.json({
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
        errorText
      }, { status: response.status });
    }

    const variantsData = await response.json();
    console.log('Debug: Variants response structure:', Object.keys(variantsData));
    
    return NextResponse.json({
      success: true,
      variantsData,
      productId
    });
    
  } catch (error) {
    console.error('Debug: Error fetching variants:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 