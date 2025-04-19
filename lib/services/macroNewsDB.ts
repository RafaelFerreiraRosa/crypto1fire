import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface NewsSource {
  name: string;
  url: string;
  category: 'general' | 'technical' | 'regulatory' | 'market' | 'research';
  priority: number; // 1-5, com 5 sendo a mais alta
}

export interface MacroNewsItem {
  id?: string;
  title: string;
  source: string;
  sourceUrl: string;
  url: string;
  content: string;
  summary: string;
  timestamp: string;
  categories: string[];
  macroImpact: {
    description: string;
    severity: 'low' | 'medium' | 'high' | 'very-high';
    markets: string[]; // ex: ["crypto", "stocks", "bonds"]
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  };
  regulatoryImplications?: {
    description: string;
    regions: string[]; // ex: ["US", "EU", "Global"]
    severity: 'low' | 'medium' | 'high' | 'very-high';
  };
  relatedAssets: string[]; // Tokens/assets mencionados ou afetados
  marketCycle?: {
    phase: 'accumulation' | 'uptrend' | 'distribution' | 'downtrend';
    confidence: 'low' | 'medium' | 'high' | 'very-high';
    analysis: string;
  };
  investmentSignal?: {
    action: 'buy' | 'sell' | 'hold' | 'research';
    strength: number; // 1-10
    timeframe: 'short' | 'medium' | 'long';
    reasoning: string;
  };
}

// Lista de fontes para monitorar
export const NEWS_SOURCES: NewsSource[] = [
  { name: 'CoinDesk', url: 'https://www.coindesk.com', category: 'general', priority: 5 },
  { name: 'CoinDesk Research', url: 'https://www.coindesk.com/research', category: 'research', priority: 5 },
  { name: 'The Block', url: 'https://www.theblock.co', category: 'research', priority: 5 },
  { name: 'Galaxy Research', url: 'https://www.galaxy.com/research', category: 'research', priority: 5 },
  { name: 'CryptoSlate Research', url: 'https://cryptoslate.com/research', category: 'research', priority: 4 },
  { name: 'DL News', url: 'https://www.dlnews.com', category: 'general', priority: 4 },
  { name: 'Decrypt', url: 'https://decrypt.co', category: 'general', priority: 4 },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com', category: 'general', priority: 3 },
  { name: 'Blackworks', url: 'https://blackworks.org', category: 'research', priority: 4 },
  { name: 'Bloomberg Crypto', url: 'https://www.bloomberg.com/crypto', category: 'market', priority: 5 },
  { name: 'Investing.com Crypto', url: 'https://www.investing.com/crypto', category: 'market', priority: 4 },
  { name: 'Forbes Digital Assets', url: 'https://www.forbes.com/digital-assets', category: 'market', priority: 3 },
  { name: 'Wall Street Journal Crypto', url: 'https://www.wsj.com/news/types/cryptocurrency', category: 'market', priority: 5 },
  { name: 'Financial Times Crypto', url: 'https://www.ft.com/cryptocurrencies', category: 'market', priority: 5 },
  { name: 'Reuters Crypto', url: 'https://www.reuters.com/business/future-of-money/', category: 'regulatory', priority: 4 }
];

const DB_DIR = path.join(process.cwd(), 'data');
const NEWS_DB_FILE = path.join(DB_DIR, 'macro-news.json');

// Inicializa o banco de dados local
async function initializeDB() {
  try {
    await mkdir(DB_DIR, { recursive: true });
    
    try {
      await readFile(NEWS_DB_FILE, 'utf-8');
      // Se conseguir ler, o arquivo existe
    } catch (error) {
      // Se o arquivo não existir, cria ele com um array vazio
      await writeFile(NEWS_DB_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing MacroN database:', error);
  }
}

// Busca todas as notícias armazenadas
export async function getAllNews(): Promise<MacroNewsItem[]> {
  try {
    await initializeDB();
    const data = await readFile(NEWS_DB_FILE, 'utf-8');
    return JSON.parse(data) as MacroNewsItem[];
  } catch (error) {
    console.error('Error reading MacroN news:', error);
    return [];
  }
}

// Busca as notícias mais recentes (limita a quantidade)
export async function getLatestNews(limit: number = 10): Promise<MacroNewsItem[]> {
  try {
    const news = await getAllNews();
    
    // Ordena por timestamp (mais recente primeiro)
    return news
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting latest MacroN news:', error);
    return [];
  }
}

// Salva uma nova notícia no banco de dados
export async function saveNewsItem(newsItem: MacroNewsItem): Promise<MacroNewsItem> {
  try {
    await initializeDB();
    const newsItems = await getAllNews();
    
    // Gera um ID único baseado no timestamp e título
    const newNewsItem = {
      ...newsItem,
      id: `news-${Date.now()}-${newsItem.title.substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
    };
    
    newsItems.push(newNewsItem);
    
    // Limita o histórico para os últimos 500 itens para não crescer demais
    const limitedNews = newsItems
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 500);
    
    await writeFile(NEWS_DB_FILE, JSON.stringify(limitedNews, null, 2));
    return newNewsItem;
  } catch (error) {
    console.error('Error saving MacroN news item:', error);
    throw new Error('Failed to save MacroN news item');
  }
}

// Busca notícias por categoria
export async function getNewsByCategory(category: string): Promise<MacroNewsItem[]> {
  try {
    const news = await getAllNews();
    return news.filter(item => item.categories.includes(category));
  } catch (error) {
    console.error(`Error getting MacroN news for category ${category}:`, error);
    return [];
  }
}

// Busca notícias relacionadas a um ativo específico
export async function getNewsByAsset(asset: string): Promise<MacroNewsItem[]> {
  try {
    const news = await getAllNews();
    return news.filter(item => 
      item.relatedAssets.some(a => a.toLowerCase() === asset.toLowerCase())
    );
  } catch (error) {
    console.error(`Error getting MacroN news for asset ${asset}:`, error);
    return [];
  }
}

// Busca notícias com alto impacto macroeconômico
export async function getHighImpactNews(): Promise<MacroNewsItem[]> {
  try {
    const news = await getAllNews();
    return news.filter(item => 
      ['high', 'very-high'].includes(item.macroImpact.severity)
    );
  } catch (error) {
    console.error('Error getting high impact MacroN news:', error);
    return [];
  }
}

// Busca notícias com implicações regulatórias
export async function getRegulatoryNews(region?: string): Promise<MacroNewsItem[]> {
  try {
    const news = await getAllNews();
    return news.filter(item => 
      item.regulatoryImplications && 
      (region ? item.regulatoryImplications.regions.includes(region) : true)
    );
  } catch (error) {
    console.error('Error getting regulatory MacroN news:', error);
    return [];
  }
}

// Retorna estatísticas sobre as notícias
export async function getNewsStats() {
  try {
    const news = await getAllNews();
    const lastWeekCutoff = new Date();
    lastWeekCutoff.setDate(lastWeekCutoff.getDate() - 7);
    
    const recentNews = news.filter(item => new Date(item.timestamp) >= lastWeekCutoff);
    
    // Contagem de sentimentos
    const sentimentCounts = {
      positive: recentNews.filter(item => item.macroImpact.sentiment === 'positive').length,
      negative: recentNews.filter(item => item.macroImpact.sentiment === 'negative').length,
      neutral: recentNews.filter(item => item.macroImpact.sentiment === 'neutral').length,
      mixed: recentNews.filter(item => item.macroImpact.sentiment === 'mixed').length
    };
    
    // Fontes mais frequentes
    const sourceCounts: Record<string, number> = {};
    recentNews.forEach(item => {
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
    });
    
    const topSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));
    
    // Ativos mais mencionados
    const assetCounts: Record<string, number> = {};
    recentNews.forEach(item => {
      item.relatedAssets.forEach(asset => {
        assetCounts[asset] = (assetCounts[asset] || 0) + 1;
      });
    });
    
    const topAssets = Object.entries(assetCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([asset, count]) => ({ asset, count }));
    
    // Contagem por categorias
    const categoryCounts: Record<string, number> = {};
    recentNews.forEach(item => {
      item.categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    
    return {
      totalNews: news.length,
      recentNews: recentNews.length,
      sentimentCounts,
      topSources,
      topAssets,
      categoryCounts,
      lastUpdated: news.length > 0 ? 
        news.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp : 
        null
    };
  } catch (error) {
    console.error('Error getting MacroN news stats:', error);
    return null;
  }
} 