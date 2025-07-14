import { getPrintfulAPI } from '@/lib/printful';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogVariantId = searchParams.get('id');
    
    if (!catalogVariantId) {
      return NextResponse.json({ error: 'Missing catalog variant ID' }, { status: 400 });
    }
    
    const printful = getPrintfulAPI();
    const catalogVariant = await printful.getCatalogVariant(parseInt(catalogVariantId));
    
    return NextResponse.json({
      catalogVariantId: parseInt(catalogVariantId),
      catalogVariant,
      success: !!catalogVariant
    });
  } catch (error) {
    console.error('Error fetching catalog variant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog variant' },
      { status: 500 }
    );
  }
} 