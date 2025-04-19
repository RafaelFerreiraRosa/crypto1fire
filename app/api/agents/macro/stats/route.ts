import { NextResponse } from 'next/server';
import { getAnalysisStats, getAnalysesByPeriod } from '@/lib/services/macroAnalysisDB';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');
    
    // Obter estatísticas gerais
    const stats = await getAnalysisStats();
    
    // Se um período específico for solicitado, adicionar as análises desse período
    let periodAnalyses = null;
    if (period) {
      const days = parseInt(period, 10) || 7; // Padrão é 7 dias se não for um número válido
      periodAnalyses = await getAnalysesByPeriod(days);
    }
    
    return NextResponse.json({
      stats,
      periodAnalyses,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching MacroX stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve MacroX analysis statistics' },
      { status: 500 }
    );
  }
} 