import { NextResponse } from 'next/server';
import { getNewsStats, getHighImpactNews, getRegulatoryNews } from '@/lib/services/macroNewsDB';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const region = searchParams.get('region');
    
    // Obter estatísticas gerais
    const stats = await getNewsStats();
    
    // Adicionar dados filtrados se solicitados
    let filteredNews = null;
    
    if (filter === 'high-impact') {
      filteredNews = await getHighImpactNews();
    } else if (filter === 'regulatory') {
      filteredNews = await getRegulatoryNews(region || undefined);
    }
    
    return NextResponse.json({
      stats,
      filteredNews,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching MacroN news stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve MacroN news statistics' },
      { status: 500 }
    );
  }
} 