import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Debug: Fetching catalog product data...');
    
    // Get catalog product data for better images
    const catalogProductId = 762; // From the API response we saw earlier
    const catalogUrl = `/catalog/products/${catalogProductId}`;
    
    console.log('Debug: Fetching catalog from:', catalogUrl);
    
    const response = await fetch(`https://api.printful.com/v2${catalogUrl}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Debug: Catalog response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Debug: Catalog error response:', errorText);
      return NextResponse.json({
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
        errorText
      }, { status: response.status });
    }

    const catalogData = await response.json();
    console.log('Debug: Catalog response structure:', Object.keys(catalogData));
    
    return NextResponse.json({
      success: true,
      catalogData,
      catalogProductId
    });
    
  } catch (error) {
    console.error('Debug: Error fetching catalog:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 