import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface MacroAnalysisResult {
  sentimento_geral: 'bullish' | 'bearish' | 'neutro';
  sinais_macro: string;
  narrativas_emergentes: string[];
  tokens_mencionados: string[];
  fase_ciclo_mercado: 'acumulação' | 'alta' | 'distribuição' | 'baixa';
  justificativa: string;
  timestamp: string;
  id?: string;
  influenciadores_chave?: string[];
  cached?: boolean;
}

const DB_DIR = path.join(process.cwd(), 'data');
const MACRO_DB_FILE = path.join(DB_DIR, 'macro-analysis.json');

// Inicializa o banco de dados local
async function initializeDB() {
  try {
    await mkdir(DB_DIR, { recursive: true });
    
    try {
      await readFile(MACRO_DB_FILE, 'utf-8');
      // Se conseguir ler, o arquivo existe
    } catch (error) {
      // Se o arquivo não existir, cria ele com um array vazio
      await writeFile(MACRO_DB_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing MacroX database:', error);
  }
}

// Busca todas as análises armazenadas
export async function getAllAnalyses(): Promise<MacroAnalysisResult[]> {
  try {
    await initializeDB();
    const data = await readFile(MACRO_DB_FILE, 'utf-8');
    return JSON.parse(data) as MacroAnalysisResult[];
  } catch (error) {
    console.error('Error reading MacroX analyses:', error);
    return [];
  }
}

// Busca a análise mais recente
export async function getLatestAnalysis(): Promise<MacroAnalysisResult | null> {
  try {
    const analyses = await getAllAnalyses();
    if (analyses.length === 0) return null;
    
    // Ordena por timestamp (mais recente primeiro)
    analyses.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return analyses[0];
  } catch (error) {
    console.error('Error getting latest MacroX analysis:', error);
    return null;
  }
}

// Salva uma nova análise no banco de dados
export async function saveAnalysis(analysis: MacroAnalysisResult): Promise<MacroAnalysisResult> {
  try {
    await initializeDB();
    const analyses = await getAllAnalyses();
    
    // Gera um ID único baseado no timestamp
    const newAnalysis = {
      ...analysis,
      id: `macro-${Date.now()}`
    };
    
    analyses.push(newAnalysis);
    
    // Limita o histórico para as últimas 20 análises para não crescer demais
    const limitedAnalyses = analyses
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
    
    await writeFile(MACRO_DB_FILE, JSON.stringify(limitedAnalyses, null, 2));
    return newAnalysis;
  } catch (error) {
    console.error('Error saving MacroX analysis:', error);
    throw new Error('Failed to save MacroX analysis');
  }
}

// Busca análises por período de tempo
export async function getAnalysesByPeriod(days: number): Promise<MacroAnalysisResult[]> {
  try {
    const analyses = await getAllAnalyses();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return analyses.filter(analysis => {
      const analysisDate = new Date(analysis.timestamp);
      return analysisDate >= cutoffDate;
    });
  } catch (error) {
    console.error(`Error getting MacroX analyses for last ${days} days:`, error);
    return [];
  }
}

// Busca análises por sentimento de mercado
export async function getAnalysesBySentiment(sentiment: 'bullish' | 'bearish' | 'neutro'): Promise<MacroAnalysisResult[]> {
  try {
    const analyses = await getAllAnalyses();
    return analyses.filter(analysis => analysis.sentimento_geral === sentiment);
  } catch (error) {
    console.error(`Error getting MacroX analyses with sentiment ${sentiment}:`, error);
    return [];
  }
}

// Retorna estatísticas sobre as análises
export async function getAnalysisStats() {
  try {
    const analyses = await getAllAnalyses();
    const lastWeekCutoff = new Date();
    lastWeekCutoff.setDate(lastWeekCutoff.getDate() - 7);
    
    const recentAnalyses = analyses.filter(a => new Date(a.timestamp) >= lastWeekCutoff);
    
    // Contagem de sentimentos
    const sentimentCounts = {
      bullish: recentAnalyses.filter(a => a.sentimento_geral === 'bullish').length,
      bearish: recentAnalyses.filter(a => a.sentimento_geral === 'bearish').length,
      neutro: recentAnalyses.filter(a => a.sentimento_geral === 'neutro').length
    };
    
    // Tokens mais mencionados
    const tokenMentions: Record<string, number> = {};
    recentAnalyses.forEach(analysis => {
      analysis.tokens_mencionados.forEach(token => {
        tokenMentions[token] = (tokenMentions[token] || 0) + 1;
      });
    });
    
    const topTokens = Object.entries(tokenMentions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([token, count]) => ({ token, count }));
    
    // Narrativas mais comuns
    const narrativeMentions: Record<string, number> = {};
    recentAnalyses.forEach(analysis => {
      analysis.narrativas_emergentes.forEach(narrative => {
        narrativeMentions[narrative] = (narrativeMentions[narrative] || 0) + 1;
      });
    });
    
    const topNarratives = Object.entries(narrativeMentions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([narrative, count]) => ({ narrative, count }));
    
    return {
      totalAnalyses: analyses.length,
      recentAnalyses: recentAnalyses.length,
      sentimentCounts,
      topTokens,
      topNarratives,
      lastUpdated: analyses.length > 0 ? 
        analyses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp : 
        null
    };
  } catch (error) {
    console.error('Error getting MacroX analysis stats:', error);
    return null;
  }
} 