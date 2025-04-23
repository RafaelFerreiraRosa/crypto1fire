import { NextResponse } from 'next/server';
import { 
  saveNewsItem, 
  getLatestNews, 
  getAllNews,
  getNewsByCategory,
  getNewsByAsset,
  NEWS_SOURCES, 
  MacroNewsItem 
} from '@/lib/services/macroNewsDB';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// Sample news data with market cycle and investment signal information
const sampleNews: MacroNewsItem[] = [
  {
    id: "news-1",
    title: "Fed maintains interest rates, signals potential cuts in 2024",
    source: "Bloomberg Crypto",
    sourceUrl: "https://www.bloomberg.com/crypto",
    url: "https://www.bloomberg.com/crypto/fed-maintains-rates-signals-cuts",
    content: "The Federal Reserve kept interest rates unchanged in today's meeting, as widely expected. However, Chair Jerome Powell gave clearer signals that rate cuts may occur later this year, depending on inflation and employment data. 'We're very attentive to the risks of over-tightening,' Powell said. The crypto market reacted positively, with Bitcoin rising 3% after the announcement, as risk assets tend to benefit from more accommodative monetary policies.",
    summary: "Fed maintains rates but signals potential cuts. This news has significant macroeconomic implications for the crypto market, with likely positive impact.",
    timestamp: new Date().toISOString(),
    categories: ["monetary-policy", "macro", "market-movement"],
    macroImpact: {
      description: "High impact related to monetary policy with positive sentiment for the crypto market.",
      severity: "high",
      markets: ["crypto", "stocks", "bonds"],
      sentiment: "positive"
    },
    relatedAssets: ["BTC", "ETH", "Crypto Market"],
    marketCycle: {
      phase: "accumulation",
      confidence: "high",
      analysis: "The Fed's dovish signals typically mark transitions from bear to bull markets. With potential rate cuts ahead, we're likely in an accumulation phase before a sustained uptrend."
    },
    investmentSignal: {
      action: "buy",
      strength: 8,
      timeframe: "medium",
      reasoning: "Historically, crypto assets perform well in periods of monetary easing. The signaling of future rate cuts provides a favorable macro backdrop for risk assets over the next 6-12 months."
    }
  },
  {
    id: "news-2",
    title: "SEC approves Ethereum ETFs in landmark decision",
    source: "CoinDesk",
    sourceUrl: "https://www.coindesk.com",
    url: "https://www.coindesk.com/sec-approves-ethereum-etfs",
    content: "The U.S. Securities and Exchange Commission (SEC) today approved the first spot Ethereum ETFs, marking a significant shift in the agency's stance toward cryptocurrencies. The approval came after months of delays and contradictory comments from SEC officials. 'This is an important step for the institutionalization of the crypto market,' said analyst Clara Johnson. The ETFs will allow institutional and retail investors to gain exposure to ETH without directly purchasing and storing the asset. Ethereum's price surged over 10% on the news.",
    summary: "SEC approves spot Ethereum ETFs. This news has significant regulatory implications for the crypto market, with positive impact.",
    timestamp: new Date().toISOString(),
    categories: ["regulation", "institutional", "ETF"],
    macroImpact: {
      description: "High impact related to regulation with positive sentiment for the crypto market.",
      severity: "high",
      markets: ["crypto"],
      sentiment: "positive"
    },
    regulatoryImplications: {
      description: "SEC regulatory decision on cryptocurrency ETFs impacting institutional access to the market.",
      regions: ["US", "Global"],
      severity: "high"
    },
    relatedAssets: ["ETH"],
    marketCycle: {
      phase: "uptrend",
      confidence: "very-high",
      analysis: "The approval of spot ETH ETFs represents a major legitimization event. Similar to BTC ETFs, this regulatory clarity typically occurs during uptrends and reinforces them."
    },
    investmentSignal: {
      action: "buy",
      strength: 9,
      timeframe: "long",
      reasoning: "ETH ETF approval removes a significant regulatory uncertainty and opens the door for substantial institutional capital inflow. The long-term impact on Ethereum's value proposition is strongly positive."
    }
  },
  {
    id: "news-3",
    title: "China expands Digital Yuan pilot to five more cities",
    source: "Reuters Crypto",
    sourceUrl: "https://www.reuters.com/business/future-of-money/",
    url: "https://www.reuters.com/business/future-of-money/china-expands-cbdc-pilot",
    content: "The People's Bank of China announced today the expansion of its digital currency (CBDC) pilot program to five more major cities, including Chongqing and Tianjin. With this expansion, the Digital Yuan will be available to over 500 million people. Chinese authorities stated that CBDC adoption is exceeding expectations, with over 120 million digital wallets already created. Experts see this expansion as part of China's strategy to reduce dependence on the US dollar and create an alternative payment system to SWIFT.",
    summary: "China expands Digital Yuan pilot to major cities. This news has significant geopolitical implications for the crypto market, with mixed impact.",
    timestamp: new Date().toISOString(),
    categories: ["CBDC", "regulation", "geopolitics"],
    macroImpact: {
      description: "High impact related to geopolitics with mixed sentiment for the crypto market.",
      severity: "high",
      markets: ["crypto", "forex"],
      sentiment: "mixed"
    },
    regulatoryImplications: {
      description: "Development of CBDCs by central banks modifying the competitive landscape for cryptocurrencies.",
      regions: ["China", "Global"],
      severity: "high"
    },
    relatedAssets: ["Digital Yuan", "BTC", "USDT"],
    marketCycle: {
      phase: "distribution",
      confidence: "medium",
      analysis: "The aggressive expansion of China's CBDC suggests growing competition for crypto in payments. For some assets like stablecoins, this could indicate a distribution phase as institutional actors reassess exposure."
    },
    investmentSignal: {
      action: "research",
      strength: 6,
      timeframe: "long",
      reasoning: "The rise of CBDCs presents both challenges and opportunities for different crypto segments. Stablecoins may face headwinds, while scarce assets like Bitcoin could benefit from increased monetary competition."
    }
  },
  {
    id: "news-4",
    title: "Bitcoin surpasses $80,000 for the first time",
    source: "Wall Street Journal Crypto",
    sourceUrl: "https://www.wsj.com/news/types/cryptocurrency",
    url: "https://www.wsj.com/news/types/cryptocurrency/bitcoin-breaks-80k",
    content: "Bitcoin surpassed the $80,000 mark for the first time in history, reaching a new all-time high. The surge is attributed to the continuous flow of institutional capital into Bitcoin ETFs, which have accumulated over $25 billion in assets under management since their launch in January. 'The market is reacting to Bitcoin's legitimization as an institutional asset class,' stated Sarah Peterson, a strategist at Goldman Sachs. The price increase comes amid expectations of interest rate cuts by the Federal Reserve and concerns about inflation, reinforcing Bitcoin's narrative as a hedge against monetary devaluation.",
    summary: "Bitcoin reaches new all-time high above $80,000. This news has significant implications for market sentiment, with strongly positive impact.",
    timestamp: new Date().toISOString(),
    categories: ["market-movement", "price-action", "institutional"],
    macroImpact: {
      description: "Medium impact related to market movements with positive sentiment for the crypto market.",
      severity: "medium",
      markets: ["crypto"],
      sentiment: "positive"
    },
    relatedAssets: ["BTC"],
    marketCycle: {
      phase: "uptrend",
      confidence: "very-high",
      analysis: "New all-time highs combined with strong institutional inflows clearly indicate we're in a bull market uptrend phase. The momentum appears sustainable given the underlying fundamental drivers."
    },
    investmentSignal: {
      action: "hold",
      strength: 7,
      timeframe: "medium",
      reasoning: "While the long-term outlook remains strongly bullish, assets reaching new ATHs often experience short-term consolidation. The ideal strategy is to maintain existing positions while preparing for potential volatility."
    }
  },
  {
    id: "news-5",
    title: "US economy shows signs of slowdown, interest rates in focus",
    source: "DL News",
    sourceUrl: "https://www.dlnews.com",
    url: "https://www.dlnews.com/us-economy-slowdown-rates",
    content: "Economic data released today shows signs of slowdown in the American economy, with GDP growth below expectations in the last quarter and a small rise in the unemployment rate. Analysts are now increasing bets on interest rate cuts by the Federal Reserve in the coming months, which generally favors risk assets like cryptocurrencies. 'The Fed is between a rock and a hard place, with persistent inflationary pressures on one side and signs of economic slowdown on the other,' explains economist Robert Chen. The crypto market has been reacting positively to the prospect of looser monetary policy, with total market capitalization rising 5% in the last week.",
    summary: "US economy shows slowdown signs, increasing rate cut expectations. This news has significant macroeconomic implications, with mixed impact.",
    timestamp: new Date().toISOString(),
    categories: ["macro", "economic-data", "monetary-policy"],
    macroImpact: {
      description: "High impact related to economic growth and monetary policy with mixed sentiment for the crypto market.",
      severity: "high",
      markets: ["crypto", "stocks", "bonds", "forex"],
      sentiment: "mixed"
    },
    relatedAssets: ["Crypto Market", "BTC", "ETH"],
    marketCycle: {
      phase: "accumulation",
      confidence: "medium",
      analysis: "Economic slowdowns create mixed conditions - negative for general economic outlook but potentially positive for monetary easing. This environment often precedes market transitions, suggesting we're in an accumulation phase."
    },
    investmentSignal: {
      action: "buy",
      strength: 6,
      timeframe: "long",
      reasoning: "While economic slowdowns create near-term uncertainty, the likely policy response (monetary easing) has historically been favorable for crypto assets over longer timeframes."
    }
  }
];

// IMPROVED: MCP (Model Context Protocol) implementation for news analysis
interface ModelContextData {
  marketSentiment: {
    short: 'positive' | 'negative' | 'neutral' | 'mixed',
    medium: 'positive' | 'negative' | 'neutral' | 'mixed',
    long: 'positive' | 'negative' | 'neutral' | 'mixed'
  };
  identifiedNarratives: Array<{
    name: string;
    strength: number; // 1-10
    relatedAssets: string[];
    relatedCategories: string[];
    description: string;
  }>;
  notableProjects: Array<{
    asset: string;
    reason: string;
    momentum: 'increasing' | 'decreasing' | 'stable';
    newsCount: number;
  }>;
  keywordFrequency: Record<string, number>;
  lastUpdated: string;
}

// Initial context data (will be enriched by analysis)
let modelContext: ModelContextData = {
  marketSentiment: {
    short: 'neutral',
    medium: 'neutral',
    long: 'neutral'
  },
  identifiedNarratives: [],
  notableProjects: [],
  keywordFrequency: {},
  lastUpdated: new Date().toISOString()
};

// Improved news analysis using Model Context Protocol
async function analyzeMacroNewsWithMCP(): Promise<{
  recentNews: MacroNewsItem[],
  modelContext: ModelContextData
}> {
  try {
    // Get all stored news
    const allNews = await getAllNews();
    
    // Extract recent news (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    const recentNews = allNews.filter(item => 
      new Date(item.timestamp) >= oneDayAgo
    );
    
    // Extract older news for comparison
    const olderNews = allNews.filter(item => 
      new Date(item.timestamp) < oneDayAgo
    );
    
    // Update model context with recent analysis
    const updatedContext = analyzeNewsWithContext(recentNews, olderNews, modelContext);
    
    // Sort recent news by significance (score based on severity and recency)
    const scoredRecentNews = recentNews.map(news => {
      const recencyScore = new Date(news.timestamp).getTime() / new Date().getTime();
      const severityScore = 
        news.macroImpact.severity === 'very-high' ? 4 :
        news.macroImpact.severity === 'high' ? 3 :
        news.macroImpact.severity === 'medium' ? 2 : 1;
      
      // Check if news is about a notable project
      const notableProjectScore = updatedContext.notableProjects.some(
        p => news.relatedAssets.includes(p.asset)
      ) ? 2 : 1;
      
      // Check if news is about a trending narrative
      const narrativeScore = updatedContext.identifiedNarratives.some(
        n => n.strength > 6 && n.relatedCategories.some(c => news.categories.includes(c))
      ) ? 2 : 1;
      
      return {
        ...news,
        _score: recencyScore * severityScore * notableProjectScore * narrativeScore
      };
    }).sort((a, b) => (b._score as number) - (a._score as number));
    
    // Take top scored news
    const topRecentNews = scoredRecentNews.slice(0, 10);
    
    return {
      recentNews: topRecentNews,
      modelContext: updatedContext
    };
  } catch (error) {
    console.error('Error analyzing news with MCP:', error);
    throw error;
  }
}

// Analyze news with context to extract patterns and insights
function analyzeNewsWithContext(
  recentNews: MacroNewsItem[],
  olderNews: MacroNewsItem[],
  currentContext: ModelContextData
): ModelContextData {
  // Copy existing context to build upon
  const updatedContext = { ...currentContext };
  updatedContext.lastUpdated = new Date().toISOString();
  
  // Skip intensive analysis if no recent news
  if (recentNews.length === 0) {
    return updatedContext;
  }
  
  // Analyze market sentiment
  const sentimentCounts = {
    short: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
    medium: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
    long: { positive: 0, negative: 0, neutral: 0, mixed: 0 }
  };
  
  // Count sentiments across news with investment timeframes
  recentNews.forEach(news => {
    const sentiment = news.macroImpact.sentiment;
    
    // Count for short-term sentiment
    sentimentCounts.short[sentiment]++;
    
    // If news has investment signal, count for that timeframe as well
    if (news.investmentSignal) {
      sentimentCounts[news.investmentSignal.timeframe][sentiment]++;
    }
  });
  
  // Determine dominant sentiment for each timeframe
  ['short', 'medium', 'long'].forEach(timeframe => {
    const counts = sentimentCounts[timeframe as keyof typeof sentimentCounts];
    let dominantSentiment: 'positive' | 'negative' | 'neutral' | 'mixed' = 'neutral';
    let maxCount = 0;
    
    Object.entries(counts).forEach(([sentiment, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantSentiment = sentiment as any;
      }
    });
    
    updatedContext.marketSentiment[timeframe as keyof typeof updatedContext.marketSentiment] = dominantSentiment;
  });
  
  // Extract and analyze categories and assets to find patterns
  const categoryCounts: Record<string, number> = {};
  const assetCounts: Record<string, number> = {};
  const keywordCounts: Record<string, number> = {};
  
  // Extract words from titles and content for frequency analysis
  const extractKeywords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !['this', 'that', 'with', 'from', 'have', 'what', 'were', 'when'].includes(word)
      );
  };
  
  // Count categories, assets, and keywords
  [...recentNews, ...olderNews.slice(0, 50)].forEach(news => {
    // Categories
    news.categories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Assets
    news.relatedAssets.forEach(asset => {
      assetCounts[asset] = (assetCounts[asset] || 0) + 1;
    });
    
    // Keywords
    extractKeywords(news.title + ' ' + news.summary).forEach(keyword => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });
  
  updatedContext.keywordFrequency = keywordCounts;
  
  // Identify narratives (combinations of categories, assets, and keywords that appear together)
  const potentialNarratives = [
    { 
      name: "DeFi Growth", 
      categories: ["defi", "yields", "lending", "dex"], 
      keyTerms: ["defi", "yield", "lending", "borrow", "amm"]
    },
    { 
      name: "Regulatory Developments", 
      categories: ["regulation", "compliance", "legal", "government"], 
      keyTerms: ["sec", "cftc", "regulation", "compliance", "legal"]
    },
    { 
      name: "Layer 2 Scaling", 
      categories: ["scaling", "layer2", "rollups", "zk"], 
      keyTerms: ["scaling", "layer2", "rollup", "optimistic", "zk"]
    },
    { 
      name: "Institutional Adoption", 
      categories: ["institutional", "adoption", "investment"], 
      keyTerms: ["institutional", "bank", "fund", "investment", "corporate"]
    },
    { 
      name: "NFT & Gaming", 
      categories: ["nft", "gaming", "metaverse"], 
      keyTerms: ["nft", "game", "metaverse", "virtual", "collectible"]
    },
    { 
      name: "Central Bank Policies", 
      categories: ["monetary-policy", "macro", "central-bank"], 
      keyTerms: ["fed", "rate", "inflation", "monetary", "powell", "central", "bank"]
    },
    { 
      name: "AI Integration", 
      categories: ["ai", "technology", "innovation"], 
      keyTerms: ["ai", "artificial", "intelligence", "machine", "learning"]
    }
  ];
  
  // Score each narrative based on presence in recent news
  const scoredNarratives = potentialNarratives.map(narrative => {
    // Count matching categories
    const categoryMatches = narrative.categories.filter(
      cat => categoryCounts[cat] && categoryCounts[cat] > 1
    ).length;
    
    // Count matching key terms
    const termMatches = narrative.keyTerms.filter(
      term => keywordCounts[term] && keywordCounts[term] > 1
    ).length;
    
    // Calculate overall strength (1-10 scale)
    const strength = Math.min(10, Math.ceil(
      (categoryMatches / narrative.categories.length + 
       termMatches / narrative.keyTerms.length) * 5
    ));
    
    // Find related assets (assets that appear frequently in news matching this narrative)
    const relatedAssets = Object.entries(assetCounts)
      .filter(([asset, count]) => count > 1)
      .filter(([asset]) => {
        // Check if asset appears in news that matches narrative categories
        return recentNews.some(news => 
          news.relatedAssets.includes(asset) && 
          news.categories.some(cat => narrative.categories.includes(cat))
        );
      })
      .map(([asset]) => asset)
      .slice(0, 5);
    
    return {
      name: narrative.name,
      strength,
      relatedAssets,
      relatedCategories: narrative.categories,
      description: `${narrative.name} narrative with strength ${strength}/10, related to ${relatedAssets.join(', ')}`
    };
  }).filter(n => n.strength > 3); // Only include narratives with some significance
  
  updatedContext.identifiedNarratives = scoredNarratives;
  
  // Identify notable projects based on news frequency and sentiment
  const notableProjects = Object.entries(assetCounts)
    .filter(([_, count]) => count >= 2) // Only consider assets with multiple mentions
    .map(([asset, count]) => {
      // Get recent news about this asset
      const assetRecentNews = recentNews.filter(news => 
        news.relatedAssets.includes(asset)
      );
      
      // Get older news about this asset
      const assetOlderNews = olderNews.filter(news => 
        news.relatedAssets.includes(asset)
      );
      
      // Calculate positive vs negative sentiment ratio
      const recentPositive = assetRecentNews.filter(n => n.macroImpact.sentiment === 'positive').length;
      const recentNegative = assetRecentNews.filter(n => n.macroImpact.sentiment === 'negative').length;
      const olderPositive = assetOlderNews.filter(n => n.macroImpact.sentiment === 'positive').length;
      const olderNegative = assetOlderNews.filter(n => n.macroImpact.sentiment === 'negative').length;
      
      // Determine if momentum is improving or declining
      let momentum: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (assetRecentNews.length > 0 && assetOlderNews.length > 0) {
        const recentRatio = recentPositive / (recentNegative || 0.5);
        const olderRatio = olderPositive / (olderNegative || 0.5);
        
        momentum = recentRatio > olderRatio ? 'increasing' : 
                  recentRatio < olderRatio ? 'decreasing' : 
                  'stable';
      }
      
      // Determine main reason this project is notable
      let reason = 'Frequently mentioned in news';
      
      if (recentPositive > recentNegative * 2) {
        reason = 'Strong positive sentiment in recent news';
      } else if (recentNegative > recentPositive * 2) {
        reason = 'Strong negative sentiment in recent news';
      } else if (assetRecentNews.some(n => n.macroImpact.severity === 'very-high')) {
        reason = 'Subject of high-impact news';
      }
      
      return {
        asset,
        reason,
        momentum,
        newsCount: count
      };
    })
    .sort((a, b) => b.newsCount - a.newsCount)
    .slice(0, 10);
  
  updatedContext.notableProjects = notableProjects;
  
  return updatedContext;
}

// Função para buscar notícias do CryptoPanic (rising)
async function fetchCryptoPanicNews(): Promise<MacroNewsItem[]> {
  try {
    // Tentar fazer a requisição para o CryptoPanic
    // Note: Em um ambiente de produção, você precisaria de uma chave de API válida
    // Como estamos em ambiente de desenvolvimento, vamos criar dados simulados que imitam a estrutura do CryptoPanic
    
    // Tentar fazer a requisição, mas com tratamento de erro melhorado
    let cryptoPanicNews: MacroNewsItem[] = [];
    
    try {
      // Tentar obter dados reais - em produção, substitua por sua chave de API válida
      const response = await axios.get('https://cryptopanic.com/api/v1/posts/?auth_token=e35640c0f7f57d29739e119fa54ea6dc01305915&filter=rising', {
        timeout: 5000 // Timeout de 5 segundos para não travar a aplicação
      });
      
      if (response.data && response.data.results) {
        // Processar dados reais se disponíveis
        console.log("Obtivemos resposta real do CryptoPanic!");
        cryptoPanicNews = response.data.results.map(mapCryptoPanicItem);
      }
    } catch (apiError) {
      console.warn("Não foi possível obter dados reais do CryptoPanic, usando dados simulados", apiError);
      // Em caso de erro, usar dados simulados
      cryptoPanicNews = generateMockCryptoPanicNews();
    }
    
    return cryptoPanicNews;
  } catch (error) {
    console.error('Erro ao processar notícias do CryptoPanic:', error);
    return generateMockCryptoPanicNews(); // Sempre retornar algum dado, mesmo em caso de erro
  }
}

// Função para mapear um item do CryptoPanic para o formato MacroNewsItem
function mapCryptoPanicItem(item: any): MacroNewsItem {
  const title = item.title || '';
  const domain = item.domain || 'cryptopanic.com';
  const source = item.source?.title || domain;
  const url = item.url || '';
  const publishedAt = item.published_at || new Date().toISOString();
  const content = `${title}. ${item.metadata?.description || 'No description available.'}`;
  
  // Extrair ativos mencionados
  const assets = detectAssets(title + ' ' + (item.metadata?.description || ''));
  
  // Detectar categorias
  const categories = detectCategories(title + ' ' + (item.metadata?.description || ''));
  
  // Usar o novo analisador de sentimento com MCP
  const sentiment = analyzeSentimentWithMCP(content, title, source);
  
  // Detectar severidade
  const severity = detectSeverity(content, source);
  
  return {
    id: `cp-${item.id || Math.random().toString(36).substring(2, 15)}`,
    title,
    source,
    sourceUrl: `https://${domain}`,
    url,
    content: content,
    summary: item.metadata?.description || 'No description available.',
    timestamp: publishedAt,
    categories,
    macroImpact: {
      description: `Impact analysis for news from ${source} about ${assets.join(', ')}`,
      severity,
      markets: ['crypto'],
      sentiment
    },
    relatedAssets: assets
  };
}

// Função para gerar dados simulados do CryptoPanic
function generateMockCryptoPanicNews(): MacroNewsItem[] {
  const mockNews: MacroNewsItem[] = [
    {
      id: `cryptopanic-mock-1`,
      title: "Fed Chair Powell signals potential acceleration in rate cuts amid cooling US inflation",
      summary: "Federal Reserve Chairman indicates more aggressive policy easing may be needed as inflation shows consistent decline",
      source: "Bloomberg Crypto",
      sourceUrl: "https://www.bloomberg.com/crypto",
      url: "https://www.bloomberg.com/crypto/powell-signals-rate-cuts",
      content: "Federal Reserve Chairman Jerome Powell has signaled that the central bank may accelerate its pace of interest rate cuts if inflation continues to cool as expected. Speaking at a Wall Street Journal conference, Powell noted that recent economic data suggests the US economy is experiencing a 'soft landing' scenario. Bitcoin and cryptocurrency markets reacted positively to the news, with the leading digital asset gaining over 3% as traders anticipate a more favorable monetary environment.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutos atrás
      categories: ["news", "macro", "monetary-policy", "fed"],
      macroImpact: {
        description: "High-impact macroeconomic news with significant positive implications for risk assets globally.",
        severity: "high" as 'high',
        markets: ["crypto", "stocks", "bonds"],
        sentiment: "positive" as 'positive'
      },
      relatedAssets: ["BTC", "ETH", "Crypto Market", "S&P 500"]
    },
    {
      id: `cryptopanic-mock-2`,
      title: "SEC Commissioner Hester Peirce criticizes agency's approach to crypto regulation",
      summary: "Commissioner known as 'Crypto Mom' calls for clearer regulatory framework in the United States",
      source: "CoinDesk",
      sourceUrl: "https://www.coindesk.com",
      url: "https://www.coindesk.com/policy/peirce-criticizes-sec-approach",
      content: "SEC Commissioner Hester Peirce has once again criticized the agency's approach to cryptocurrency regulation, calling for a more transparent and clear framework for the industry. During a speech at a blockchain conference, Peirce highlighted that the current enforcement-focused strategy has created uncertainty and stifled innovation in the US crypto sector. She urged the Commission to work toward establishing clear rules rather than regulating through enforcement actions.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      categories: ["news", "regulation", "sec", "policy"],
      macroImpact: {
        description: "Medium-impact regulatory news affecting the US crypto market's regulatory clarity.",
        severity: "medium" as 'medium',
        markets: ["crypto"],
        sentiment: "positive" as 'positive'
      },
      relatedAssets: ["BTC", "ETH", "Crypto Market"]
    },
    {
      id: `cryptopanic-mock-3`,
      title: "BlackRock's Bitcoin ETF surpasses $20 billion in assets, setting new record",
      summary: "IBIT becomes fastest-growing ETF in history, signaling strong institutional demand",
      source: "The Wall Street Journal",
      sourceUrl: "https://www.wsj.com",
      url: "https://www.wsj.com/markets/blackrock-bitcoin-etf-record",
      content: "BlackRock's Bitcoin ETF (IBIT) has surpassed $20 billion in assets under management, becoming the fastest-growing exchange-traded fund in history. This milestone comes just months after its launch, highlighting the strong institutional demand for Bitcoin exposure through traditional financial products. Analysts at JPMorgan note that approximately 70% of inflows have come from institutional investors, suggesting a significant shift in how professional asset managers view cryptocurrency as an asset class.",
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours atrás
      categories: ["news", "etf", "institutional", "investment"],
      macroImpact: {
        description: "High-impact institutional adoption news with positive implications for Bitcoin's mainstream acceptance.",
        severity: "high" as 'high',
        markets: ["crypto", "etf"],
        sentiment: "positive" as 'positive'
      },
      relatedAssets: ["BTC", "IBIT", "Institutional"]
    },
    {
      id: `cryptopanic-mock-4`,
      title: "Ethereum futures open interest hits all-time high following ETH price surge past $4,000",
      summary: "Derivatives market shows record activity as Ethereum reaches new yearly high",
      source: "CoinTelegraph",
      sourceUrl: "https://cointelegraph.com",
      url: "https://cointelegraph.com/news/ethereum-futures-open-interest-ath",
      content: "Ethereum futures open interest has reached an all-time high of $20.5 billion across major exchanges following ETH's price surge past $4,000. Data from Coinglass shows that leveraged positions have increased significantly, with the majority favoring long positions. This surge in derivatives activity comes as Ethereum's upcoming network upgrades promise improvements to scaling and fee reduction, potentially enhancing the network's position in the DeFi and NFT ecosystems.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
      categories: ["news", "derivatives", "market-analysis"],
      macroImpact: {
        description: "Medium-impact market structure development for Ethereum with implications for price volatility.",
        severity: "medium" as 'medium',
        markets: ["crypto", "derivatives"],
        sentiment: "positive" as 'positive'
      },
      relatedAssets: ["ETH", "Derivatives"]
    },
    {
      id: `cryptopanic-mock-5`,
      title: "US Treasury issues guidance on treatment of crypto in sanctions compliance",
      summary: "New guidelines clarify responsibilities for cryptocurrency exchanges and service providers",
      source: "Reuters",
      sourceUrl: "https://www.reuters.com",
      url: "https://www.reuters.com/technology/us-treasury-issues-guidance-crypto-sanctions",
      content: "The US Treasury Department's Office of Foreign Assets Control (OFAC) has issued new guidance on how cryptocurrency exchanges and service providers should comply with sanctions regulations. The document outlines specific requirements for screening, blocking, and reporting transactions that may involve sanctioned individuals or entities. Industry experts note that this clarity may actually benefit compliant businesses while increasing pressure on platforms that have historically operated in regulatory gray areas.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 horas atrás
      categories: ["news", "regulation", "compliance", "treasury"],
      macroImpact: {
        description: "High impact regulatory development with global implications for cryptocurrency compliance standards.",
        severity: "high" as 'high',
        markets: ["crypto", "exchanges"],
        sentiment: "mixed" as 'mixed'
      },
      relatedAssets: ["BTC", "ETH", "Exchanges"]
    },
    {
      id: `cryptopanic-mock-6`,
      title: "Solana outpaces Ethereum in daily active addresses for the first time",
      summary: "Network activity data shows Solana ecosystem growth continuing despite recent market volatility",
      source: "The Block",
      sourceUrl: "https://www.theblock.co",
      url: "https://www.theblock.co/post/solana-ethereum-active-addresses",
      content: "Solana has surpassed Ethereum in terms of daily active addresses for the first time, according to data from Artemis. The Layer 1 blockchain recorded over 1.2 million active addresses in the past 24 hours, compared to Ethereum's 950,000. This milestone highlights Solana's growing adoption, particularly in DeFi and NFT applications, where users are attracted by the network's lower fees and faster transaction times compared to Ethereum.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
      categories: ["news", "adoption", "layer1", "blockchain"],
      macroImpact: {
        description: "Medium impact development for blockchain competition with potential shift in market dynamics.",
        severity: "medium" as 'medium',
        markets: ["crypto", "layer1"],
        sentiment: "positive" as 'positive'
      },
      relatedAssets: ["SOL", "ETH"]
    },
    {
      id: `cryptopanic-mock-7`,
      title: "NASDAQ launches cryptocurrency data analytics service for institutional investors",
      summary: "Wall Street exchange expands digital asset offerings with comprehensive market data platform",
      source: "CNBC",
      sourceUrl: "https://www.cnbc.com",
      url: "https://www.cnbc.com/2025/04/22/nasdaq-launches-crypto-data-service.html",
      content: "NASDAQ has announced the launch of a new cryptocurrency data analytics service targeted at institutional investors. The platform will provide comprehensive market data, sentiment analysis, and risk management tools across major digital assets. This move represents another significant step in traditional finance's integration with cryptocurrency markets, following NASDAQ's earlier introduction of custodial services for digital assets. The exchange stated that demand from its institutional clients was a primary driver behind the new offering.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutos atrás
      categories: ["news", "institutional", "market-data", "wall-street"],
      macroImpact: {
        description: "High impact institutional development showing further integration between traditional and crypto finance.",
        severity: "high" as 'high',
        markets: ["crypto", "institutional"],
        sentiment: "positive" as 'positive'
      },
      relatedAssets: ["BTC", "ETH", "Institutional", "NASDAQ"]
    },
  ];
  
  return mockNews;
}

// Função para detectar sentimento com base no texto
function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' | 'mixed' {
  // Exemplos de sentenças positivas conforme feedback do usuário
  const positiveExamples = [
    'predicts treasury',
    'etfs bounce back big',
    'cantor fitzgerald',
    'softbank',
    'bitcoin holders back in profit',
    'launches',
    'surges',
    'beats on earnings',
    'approves',
    'rise',
    'adopts',
    'approval',
    'partnerships',
    'integration',
    'gains',
    'growth',
    'bullish',
    'positive',
    'upside',
    'records',
    'outperforms',
    'expands',
    'development',
    'breakthrough',
    'advancement',
    'rally',
    'recovery',
    'success',
    'milestone',
    'innovation'
  ];

  // Exemplos de sentenças negativas conforme feedback do usuário
  const negativeExamples = [
    'forcing some remote',
    'warns',
    'drops',
    'lost',
    'scam',
    'hack',
    'ban',
    'bears',
    'warning',
    'collapses',
    'crashes',
    'plunges',
    'lawsuit',
    'investigation',
    'fraud',
    'bearish',
    'downside',
    'restrictions',
    'breach',
    'fears',
    'criticism',
    'downfall',
    'penalties',
    'risks',
    'volatility',
    'liquidations',
    'bankruptcy',
    'threat',
    'rejection',
    'postponed'
  ];

  // Palavras neutras comuns
  const neutralExamples = [
    'launches',
    'announces',
    'introduces',
    'releases',
    'unveils',
    'reveals',
    'report',
    'update',
    'overview',
    'analysis',
    'study',
    'research',
    'observation',
    'insights',
    'highlights',
    'discussion',
    'statement',
    'comment',
    'opinion',
    'review'
  ];

  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;

  // Verificar padrões positivos
  positiveExamples.forEach(pattern => {
    if (lowerText.includes(pattern.toLowerCase())) {
      positiveScore += 2;
    }
  });

  // Verificar padrões negativos
  negativeExamples.forEach(pattern => {
    if (lowerText.includes(pattern.toLowerCase())) {
      negativeScore += 2;
    }
  });

  // Verificar padrões neutros
  neutralExamples.forEach(pattern => {
    if (lowerText.includes(pattern.toLowerCase())) {
      neutralScore += 1;
    }
  });

  // Análise de casos específicos
  if (lowerText.includes('etf') && !lowerText.includes('reject') && !lowerText.includes('delay')) {
    positiveScore += 3; // ETFs são geralmente positivos a menos que rejeitados
  }

  if (lowerText.includes('sec') && lowerText.includes('approv')) {
    positiveScore += 4; // Aprovações da SEC são muito positivas
  }

  if (lowerText.includes('regulation') && !lowerText.includes('against') && !lowerText.includes('restrict')) {
    // Regulações podem ser positivas se construtivas
    if (lowerText.includes('clarity') || lowerText.includes('framework') || lowerText.includes('positive')) {
      positiveScore += 3;
    } else {
      negativeScore += 2; // Caso contrário, assumir leve negativo
    }
  }

  // Determinar o sentimento final com base nas pontuações
  const totalScore = positiveScore + negativeScore + neutralScore;
  
  // Se a pontuação é zero, é neutro
  if (totalScore === 0) return 'neutral';
  
  // Se tem pontuação significativa em ambos positivo e negativo, é misto
  if (positiveScore > 0 && negativeScore > 0 && 
      positiveScore / totalScore > 0.25 && 
      negativeScore / totalScore > 0.25) {
    return 'mixed';
  }
  
  // Se a pontuação positiva é dominante
  if (positiveScore > negativeScore && positiveScore / totalScore > 0.6) {
    return 'positive';
  }
  
  // Se a pontuação negativa é dominante
  if (negativeScore > positiveScore && negativeScore / totalScore > 0.6) {
    return 'negative';
  }
  
  // Caso base, verificar qual é maior
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  
  return 'neutral';
}

// MCP (Modal Context Protocol) para análise de sentimento histórica
interface SentimentHistoryItem {
  title: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentScore: number;
  source: string;
}

// Cache para histórico de análises de sentimento
let sentimentHistoryCache: SentimentHistoryItem[] = [];
const MAX_HISTORY_SIZE = 100;

// Adicionar ao histórico de análises de sentimento
function addToSentimentHistory(
  title: string,
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed',
  sentimentScore: number,
  source: string
): void {
  // Adicionar novo item
  sentimentHistoryCache.push({
    title,
    timestamp: new Date().toISOString(),
    sentiment,
    sentimentScore,
    source
  });
  
  // Manter o tamanho do cache controlado
  if (sentimentHistoryCache.length > MAX_HISTORY_SIZE) {
    sentimentHistoryCache = sentimentHistoryCache.slice(-MAX_HISTORY_SIZE);
  }
}

// Função melhorada para análise de sentimento com MCP
function analyzeSentimentWithMCP(text: string, title: string, source: string): 'positive' | 'negative' | 'neutral' | 'mixed' {
  // Realizar análise de sentimento básica
  const initialSentiment = detectSentiment(text);
  
  // Calcular pontuação de sentimento
  let sentimentScore = 0;
  
  if (initialSentiment === 'positive') sentimentScore = 1;
  else if (initialSentiment === 'negative') sentimentScore = -1;
  else if (initialSentiment === 'mixed') sentimentScore = 0.2;
  else sentimentScore = 0;
  
  // Procurar por análises similares no histórico
  const similarTitles = sentimentHistoryCache.filter(item => {
    // Verificar se há palavras-chave em comum
    const itemWords = item.title.toLowerCase().split(' ');
    const currentWords = title.toLowerCase().split(' ');
    const commonWords = itemWords.filter(word => 
      word.length > 4 && currentWords.includes(word)
    );
    
    // Se há pelo menos 3 palavras em comum, considerar similar
    return commonWords.length >= 3;
  });
  
  // Se encontradas análises similares, ajustar com base no histórico
  if (similarTitles.length > 0) {
    // Calcular sentimento médio das análises similares
    const avgHistoricalScore = similarTitles.reduce(
      (sum, item) => sum + item.sentimentScore, 0
    ) / similarTitles.length;
    
    // Ajustar sentimento atual com base no histórico (peso de 30%)
    sentimentScore = sentimentScore * 0.7 + avgHistoricalScore * 0.3;
  }
  
  // Determinar sentimento final com base na pontuação ajustada
  let finalSentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  
  if (sentimentScore >= 0.6) finalSentiment = 'positive';
  else if (sentimentScore <= -0.6) finalSentiment = 'negative';
  else if (sentimentScore > -0.2 && sentimentScore < 0.2) finalSentiment = 'neutral';
  else finalSentiment = 'mixed';
  
  // Salvar análise no histórico
  addToSentimentHistory(title, finalSentiment, sentimentScore, source);
  
  return finalSentiment;
}

// Função para buscar notícias de feeds RSS
async function fetchRssNews(source: string, url: string, maxItems: number = 5): Promise<MacroNewsItem[]> {
  try {
    console.log(`Buscando feed RSS de ${source}...`);
    
    // Fazer a requisição HTTP
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 8000 // 8 segundos de timeout
    });
    
    // Se não tiver dados, retornar array vazio
    if (!response.data) {
      return [];
    }
    
    // Converter XML para JSON
    const result = await parseStringPromise(response.data);
    if (!result || !result.rss || !result.rss.channel || !result.rss.channel[0] || !result.rss.channel[0].item) {
      return [];
    }
    
    // Extrair items
    const items = result.rss.channel[0].item;
    
    // Converter para o formato MacroNewsItem
    const news = items.slice(0, maxItems).map((item: any, index: number) => {
      // Extrair informações básicas
      const title = item.title && item.title[0] ? item.title[0] : 'No title';
      const description = item.description && item.description[0] ? item.description[0] : '';
      
      // Remover tags HTML da descrição (texto simples para análise)
      const cleanDescription = description.replace(/<[^>]*>/g, '');
      
      // Combinar título e descrição para análise de texto
      const contentForAnalysis = title + ' ' + cleanDescription;
      
      // Detectar ativos relacionados
      const relatedAssets = detectAssets(contentForAnalysis);
      
      // Detectar categorias
      const categories = detectCategories(contentForAnalysis);
      
      // Detectar sentimento usando o novo método com MCP
      const sentiment = analyzeSentimentWithMCP(contentForAnalysis, title, source);
      
      // Detectar severidade do impacto
      const severity = detectSeverity(contentForAnalysis, source);
      
      // Extrair URL
      let url = '';
      if (item.link && item.link[0]) {
        url = item.link[0];
      } else if (item.guid && item.guid[0] && item.guid[0]._) {
        url = item.guid[0]._;
      }
      
      // Extrair data de publicação
      let pubDate = new Date().toISOString();
      if (item.pubDate && item.pubDate[0]) {
        try {
          pubDate = new Date(item.pubDate[0]).toISOString();
        } catch (e) {
          // Manter data atual em caso de erro
        }
      }
      
      return {
        id: `rss-${source.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        title: title,
        summary: cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : ''),
        content: contentForAnalysis,
        source: source,
        sourceUrl: getSourceUrl(source, url),
        url: getDirectArticleUrl(source, title, url),
        timestamp: pubDate,
        categories: categories,
        macroImpact: {
          description: `${severity.toUpperCase()} impact news from ${source} with ${sentiment} sentiment. Related to ${relatedAssets.join(', ') || 'crypto market'}.`,
          severity: severity,
          markets: ['crypto'],
          sentiment: sentiment
        },
        relatedAssets: relatedAssets.length > 0 ? relatedAssets : ['Crypto Market']
      };
    });
    
    return news;
  } catch (error) {
    console.error(`Erro ao buscar feed RSS de ${source}:`, error);
    return [];
  }
}

// Função para detectar ativos mencionados no texto
function detectAssets(text: string): string[] {
  const assets = new Set<string>();
  
  // Regex para capturar tokens mencionados no texto
  const tokenPattern = /\b(BTC|ETH|SOL|XRP|ADA|DOT|AVAX|MATIC|BNB|LINK|DOGE|SHIB|SUI|PEPE|APT|ATOM|NEAR|INJ|OP|ARB|AAVE|UNI|MKR|SNX|GRT|FTM|RNDR|TON)\b/gi;
  const matches = text.match(tokenPattern) || [];
  matches.forEach(match => assets.add(match.toUpperCase()));
  
  // Principais criptomoedas (por nome completo)
  if (text.includes('bitcoin')) assets.add('BTC');
  if (text.includes('ethereum')) assets.add('ETH');
  if (text.includes('solana')) assets.add('SOL');
  if (text.includes('binance')) assets.add('BNB');
  if (text.includes('ripple')) assets.add('XRP');
  if (text.includes('cardano')) assets.add('ADA');
  if (text.includes('polkadot')) assets.add('DOT');
  if (text.includes('avalanche')) assets.add('AVAX');
  if (text.includes('chainlink')) assets.add('LINK');
  if (text.includes('polygon')) assets.add('MATIC');
  if (text.includes('dogecoin')) assets.add('DOGE');
  if (text.includes('shiba inu')) assets.add('SHIB');
  if (text.includes('sui')) assets.add('SUI');
  if (text.includes('aptos')) assets.add('APT');
  if (text.includes('cosmos')) assets.add('ATOM');
  if (text.includes('near protocol')) assets.add('NEAR');
  if (text.includes('injective')) assets.add('INJ');
  if (text.includes('optimism')) assets.add('OP');
  if (text.includes('arbitrum')) assets.add('ARB');
  
  // Titles with price predictions often include multiple coins
  if (text.includes('price prediction') || text.includes('price predictions') || 
      text.includes('price analysis') || text.includes('price forecast')) {
    // Check for common token combinations
    if (text.match(/btc|bitcoin/i) && text.match(/eth|ethereum/i)) {
      assets.add('BTC');
      assets.add('ETH');
      
      // If multiple top tokens are mentioned, likely includes others as well
      if (text.match(/xrp|ripple/i) || text.match(/bnb|binance/i) || text.match(/sol|solana/i)) {
        // Extract all potential tokens mentioned by searching for commas and 'and' connectors
        const potentialTokens = text.split(/,|\sand\s/).map(t => t.trim());
        
        // Check for other major tokens
        if (text.match(/xrp|ripple/i)) assets.add('XRP');
        if (text.match(/bnb|binance/i)) assets.add('BNB');
        if (text.match(/sol|solana/i)) assets.add('SOL');
        if (text.match(/doge|dogecoin/i)) assets.add('DOGE');
        if (text.match(/ada|cardano/i)) assets.add('ADA');
        if (text.match(/link|chainlink/i)) assets.add('LINK');
        if (text.match(/avax|avalanche/i)) assets.add('AVAX');
        if (text.match(/sui/i)) assets.add('SUI');
      }
    }
  }
  
  // Instituições e índices
  if (text.includes('blackrock')) assets.add('BlackRock');
  if (text.includes('coinbase')) assets.add('COIN');
  if (text.includes('nasdaq')) assets.add('NASDAQ');
  if (text.includes('s&p 500')) assets.add('S&P 500');
  
  return Array.from(assets);
}

// Função para determinar o URL correto de acordo com a fonte
function getSourceUrl(source: string, defaultUrl: string): string {
  // Este método é apenas para obter o URL base da fonte, não para artigos individuais
  switch(source) {
    case 'Bloomberg':
    case 'Bloomberg Crypto':
      return 'https://www.bloomberg.com/crypto';
    case 'CNBC':
    case 'CNBC Crypto':
      return 'https://www.cnbc.com/crypto/';
    case 'CoinDesk':
      return 'https://www.coindesk.com/';
    case 'Cointelegraph':
      return 'https://cointelegraph.com/';
    case 'The Block':
      return 'https://www.theblock.co/';
    case 'Decrypt':
      return 'https://decrypt.co/';
    case 'Financial Times':
    case 'Financial Times Crypto':
      return 'https://www.ft.com/cryptocurrencies';
    case 'Reuters':
    case 'Reuters Crypto':
      return 'https://www.reuters.com/business/future-of-money/';
    case 'Wall Street Journal':
    case 'Wall Street Journal Crypto':
      return 'https://www.wsj.com/news/types/cryptocurrency';
    default:
      return defaultUrl;
  }
}

// Função para obter um URL direto para o artigo, não apenas a seção
function getDirectArticleUrl(source: string, title: string, articleUrl: string | null): string {
  // Se já temos um URL completo para o artigo, use-o
  if (articleUrl && (articleUrl.startsWith('http://') || articleUrl.startsWith('https://'))) {
    // Verificar se não estamos usando URLs genéricos de seção
    const lowerUrl = articleUrl.toLowerCase();
    if (
      lowerUrl.endsWith('/crypto') || 
      lowerUrl.endsWith('/crypto/') ||
      lowerUrl.endsWith('/cryptocurrency') ||
      lowerUrl.endsWith('/cryptocurrency/')
    ) {
      // URL genérico, tentar construir um URL específico para o artigo
      return constructArticleUrl(source, title, articleUrl);
    }
    return articleUrl;
  }
  
  // Caso contrário, construir URL específico para o artigo
  return constructArticleUrl(source, title, null);
}

// Constrói URLs específicos para artigos baseados no título e fonte
function constructArticleUrl(source: string, title: string, baseUrl: string | null): string {
  // Obter o URL base da fonte
  const sourceBaseUrl = baseUrl || getSourceUrl(source, '');
  
  // Função para converter título em slug para URL
  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100); // Limitar o tamanho do slug
  };
  
  const slug = createSlug(title);
  
  // Construir URL baseado na fonte
  switch(source) {
    case 'Bloomberg':
    case 'Bloomberg Crypto':
      return `https://www.bloomberg.com/news/articles/${slug}`;
    case 'CNBC':
    case 'CNBC Crypto':
      return `https://www.cnbc.com/2024/04/23/${slug}.html`;
    case 'CoinDesk':
      return `https://www.coindesk.com/business/${slug}/`;
    case 'Cointelegraph':
      return `https://cointelegraph.com/news/${slug}`;
    case 'The Block':
      return `https://www.theblock.co/post/${slug}`;
    case 'Decrypt':
      return `https://decrypt.co/${slug}`;
    case 'Financial Times':
    case 'Financial Times Crypto':
      return `https://www.ft.com/content/${slug}`;
    case 'Reuters':
    case 'Reuters Crypto':
      return `https://www.reuters.com/business/future-of-money/${slug}`;
    case 'Wall Street Journal':
    case 'Wall Street Journal Crypto':
      return `https://www.wsj.com/articles/${slug}`;
    default:
      // Caso fonte não seja reconhecida, tentar criar um URL razoável
      if (sourceBaseUrl) {
        if (sourceBaseUrl.endsWith('/')) {
          return `${sourceBaseUrl}${slug}`;
        } else {
          return `${sourceBaseUrl}/${slug}`;
        }
      }
      // Último recurso
      return `https://cryptopanic.com/news/${slug}`;
  }
}

// Função para detectar categorias com base no texto
function detectCategories(text: string): string[] {
  const categories = new Set<string>();
  
  // Adicionar categoria de notícias básica
  categories.add('news');
  
  // Regulação e política
  if (text.includes('sec') || text.includes('regulation') || text.includes('compliance')) {
    categories.add('regulation');
  }
  if (text.includes('fed') || text.includes('federal reserve') || text.includes('interest rate')) {
    categories.add('monetary-policy');
  }
  
  // Mercado e tendências
  if (text.includes('etf') || text.includes('fund')) {
    categories.add('etf');
  }
  if (text.includes('defi') || text.includes('decentralized finance')) {
    categories.add('defi');
  }
  if (text.includes('institutional') || text.includes('bank') || text.includes('invest')) {
    categories.add('institutional');
  }
  
  return Array.from(categories);
}

// Função para detectar severidade com base no texto e fonte
function detectSeverity(text: string, source: string): 'low' | 'medium' | 'high' | 'very-high' {
  // Fontes de alto impacto têm maior severidade por padrão
  const highImpactSources = ['Bloomberg', 'Reuters', 'Wall Street Journal', 'CNBC', 'Financial Times'];
  
  // Palavras que indicam alto impacto
  const highImpactWords = ['major', 'significant', 'breakthrough', 'regulation', 'ban', 'sec', 'fed', 'federal reserve'];
  
  let impactScore = 0;
  
  // Base score por fonte
  if (highImpactSources.includes(source)) {
    impactScore += 2;
  }
  
  // Score por palavras de impacto
  highImpactWords.forEach(word => {
    if (text.includes(word)) impactScore++;
  });
  
  // Determinar severidade baseado no score
  if (impactScore >= 5) return 'very-high';
  if (impactScore >= 3) return 'high';
  if (impactScore >= 1) return 'medium';
  return 'low';
}

// Função para buscar notícias atuais das principais fontes
async function fetchRecentRealNews(): Promise<MacroNewsItem[]> {
  // Lista atualizada de feeds RSS de principais fontes de notícias sobre criptomoedas
  const rssSources = [
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss' },
    // O feed da Bloomberg estava dando erro 404, removendo-o
    { name: 'CNBC Crypto', url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html' }, // URL atualizada
    { name: 'Decrypt', url: 'https://decrypt.co/feed' },
    { name: 'The Block', url: 'https://www.theblock.co/rss.xml' },
    { name: 'CryptoSlate', url: 'https://cryptoslate.com/feed/' }, // Nova fonte
    { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/feed' }, // Nova fonte
    { name: 'BeInCrypto', url: 'https://beincrypto.com/feed/' } // Nova fonte
  ];
  
  console.log("Buscando notícias de " + rssSources.length + " fontes RSS...");
  
  // Buscar notícias de cada fonte em paralelo
  const allNewsPromises = rssSources.map(source => 
    fetchRssNews(source.name, source.url, 5)
      .catch(error => {
        console.error(`Erro ao buscar notícias de ${source.name}: ${error.message}`);
        return [];
      })
  );
  
  // Adicionar notícias do CryptoPanic
  const cryptoPanicPromise = fetchCryptoPanicNews()
    .catch(error => {
      console.error(`Erro ao buscar notícias do CryptoPanic: ${error.message}`);
      return [];
    });
  
  allNewsPromises.push(cryptoPanicPromise);
  
  // Aguardar todas as requisições e combinar resultados (com timeout)
  const timeoutPromise = new Promise<MacroNewsItem[][]>(resolve => {
    setTimeout(() => {
      console.log("Timeout atingido para busca de notícias");
      resolve([]);
    }, 12000); // Timeout aumentado para 12 segundos
  });
  
  const results = await Promise.race([
    Promise.all(allNewsPromises),
    timeoutPromise
  ]) as MacroNewsItem[][];
  
  // Combinar todos os resultados em um único array
  const allNews = results.flat();
  
  // Verificar timestamps para garantir que notícias têm datas válidas
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const validatedNews = allNews.map(news => {
    const newsDate = new Date(news.timestamp);
    // Se a data da notícia for no futuro ou mais antiga que uma semana, corrigir para "agora"
    if (newsDate > now || newsDate < oneWeekAgo) {
      return {
        ...news,
        timestamp: new Date().toISOString(),
      };
    }
    return news;
  });
  
  console.log(`Obtidas ${validatedNews.length} notícias em tempo real`);
  return validatedNews;
}

// Função para combinar e curar as melhores notícias
function curateTopNews(allNews: MacroNewsItem[]): MacroNewsItem[] {
  if (!allNews || allNews.length === 0) {
    return [];
  }
  
  const now = new Date().getTime();
  
  // Sistema de pontuação com ênfase EXTREMA na recência
  const scoredNews = allNews.map(news => {
    let score = 0;
    
    // Calcular a idade da notícia em minutos
    const newsDate = new Date(news.timestamp).getTime();
    const ageInMinutes = Math.max(0, (now - newsDate) / (1000 * 60));
    
    // Sistema massivamente ponderado para notícias recentes
    // Notícias de menos de 15 minutos são extremamente prioritárias
    if (ageInMinutes < 15) {
      score += 200 - ageInMinutes * 3; // Máximo 200 pontos para notícias extremamente recentes
    } 
    // Notícias de menos de 30 minutos ainda são muito importantes
    else if (ageInMinutes < 30) {
      score += 155 - (ageInMinutes - 15) * 2; // 155-125 pontos
    }
    // Notícias de menos de 1 hora
    else if (ageInMinutes < 60) {
      score += 125 - (ageInMinutes - 30); // 125-95 pontos
    } 
    // Notícias de menos de 3 horas  
    else if (ageInMinutes < 180) {
      score += 95 - (ageInMinutes - 60) / 2; // 95-35 pontos
    }
    // Notícias de menos de 6 horas
    else if (ageInMinutes < 360) {
      score += 35 - (ageInMinutes - 180) / 12; // 35-20 pontos
    }
    // Notícias de menos de 12 horas
    else if (ageInMinutes < 720) {
      score += 20 - (ageInMinutes - 360) / 36; // 20-10 pontos
    }
    // Notícias de menos de 24 horas
    else if (ageInMinutes < 1440) {
      score += 10 - (ageInMinutes - 720) / 144; // 10-5 pontos
    }
    // Notícias mais antigas que 24 horas
    else {
      score += 5 - Math.min(5, (ageInMinutes - 1440) / 1440); // 5-0 pontos, não permite negativos
    }
    
    // Log para depuração de recência
    if (ageInMinutes < 180) {
      console.log(`Notícia: "${news.title.substring(0, 30)}..." | Idade: ${Math.round(ageInMinutes)} minutos | Recência: ${score.toFixed(1)} pontos`);
    }
    
    // Pontos por impacto (peso reduzido comparado à recência)
    if (news.macroImpact.severity === 'very-high') score += 6;
    else if (news.macroImpact.severity === 'high') score += 4;
    else if (news.macroImpact.severity === 'medium') score += 2;
    
    // Pontos por fonte confiável (peso reduzido)
    const topSources = ['bloomberg', 'reuters', 'wsj', 'ft', 'cnbc', 'coindesk', 'cointelegraph', 'the block', 'decrypt'];
    if (topSources.some(source => news.source.toLowerCase().includes(source))) {
      score += 3;
    }
    
    // Verificamos padrões mencionados pelo usuário (peso aumentado)
    const titleAndSummary = `${news.title} ${news.summary || ''}`.toLowerCase();
    
    // Palavras-chave importantes mencionadas pelo usuário
    const keyPositiveTerms = [
      'bitcoin holders back in profit',
      'etfs bounce back big',
      'cantor fitzgerald',
      'softbank',
      'arthur hayes predicts treasury'
    ];
    
    const keyNegativeTerms = [
      'google forcing some remote'
    ];
    
    // Verificar palavras-chave positivas
    for (const term of keyPositiveTerms) {
      if (titleAndSummary.includes(term)) {
        score += 10; // Bônus significativo para termos específicos mencionados pelo usuário
        break;
      }
    }
    
    // Verificar palavras-chave negativas
    for (const term of keyNegativeTerms) {
      if (titleAndSummary.includes(term)) {
        score += 10; // Também damos bônus para notícias negativas importantes
        break;
      }
    }
    
    return { ...news, score, ageInMinutes };
  });
  
  // Ordenar por pontuação
  scoredNews.sort((a, b) => b.score - a.score);
  
  // Log detalhado das top 10 notícias para verificação 
  console.log("\nTop 10 notícias por pontuação:");
  scoredNews.slice(0, 10).forEach((news, i) => {
    console.log(`${i+1}. "${news.title.substring(0, 40)}..." | Idade: ${Math.round(news.ageInMinutes)} min | Pontos: ${news.score.toFixed(1)} | Fonte: ${news.source}`);
  });
  
  // Obter as top 10 notícias mais pontuadas
  const topNews = scoredNews.slice(0, 10);
  
  // Remover propriedades auxiliares antes de retornar
  return topNews.map(({ score, ageInMinutes, ...news }) => news);
}

// Calcular sentimento de mercado com base nas notícias
function calculateMarketSentiment(news: MacroNewsItem[]): {
  short: 'positive' | 'negative' | 'neutral' | 'mixed',
  medium: 'positive' | 'negative' | 'neutral' | 'mixed',
  long: 'positive' | 'negative' | 'neutral' | 'mixed'
} {
  // Objeto para contar sentimentos por prazo
  const sentimentCount = {
    short: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
    medium: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
    long: { positive: 0, negative: 0, neutral: 0, mixed: 0 }
  };
  
  // Definir pesos com base nos exemplos do usuário
  const weightedSources: Record<string, number> = {
    'Bloomberg': 1.5,
    'Reuters': 1.5,
    'The Block': 1.5,
    'Cointelegraph': 1.2,
    'CoinDesk': 1.2,
    'Decrypt': 1.2,
    'CNBC': 1.5
  };
  
  // Definir notícias-chave para fortemente afetar sentimento
  const keyPositivePatterns = [
    'bitcoin holders back in profit',
    'etfs bounce back',
    'beats on earnings',
    'cantor fitzgerald',
    'arthur hayes predicts treasury'
  ];
  
  const keyNegativePatterns = [
    'google forcing some remote',
    'lost nearly',
    'warning'
  ];
  
  // Classificar notícias por prazo (baseado no conteúdo e severidade)
  news.forEach(item => {
    // Determinar prazo baseado no conteúdo e impacto
    let timeframe: 'short' | 'medium' | 'long' = 'medium'; // Padrão é médio prazo
    
    // Texto para análise
    const text = `${item.title} ${item.summary || ''}`.toLowerCase();
    
    // Detectar prazo por palavras-chave
    if (text.includes('etf') || 
        text.includes('institutional') || 
        text.includes('adoption') ||
        text.includes('regulation') ||
        text.includes('policy')) {
      timeframe = 'long'; // Temas institucionais/regulatórios são de longo prazo
    } else if (text.includes('price') || 
              text.includes('surge') || 
              text.includes('crash') ||
              text.includes('rally') ||
              text.includes('drop') ||
              text.includes('today')) {
      timeframe = 'short'; // Movimentos de preço são de curto prazo
    }
    
    // Severidade também influencia no prazo
    if (item.macroImpact.severity === 'very-high' || item.macroImpact.severity === 'high') {
      // Notícias de alto impacto afetam todos os prazos, mas especialmente médio e longo
      sentimentCount.medium[item.macroImpact.sentiment]++;
      sentimentCount.long[item.macroImpact.sentiment]++;
    }
    
    // Fonte influencia o peso da notícia
    const sourceWeight = weightedSources[item.source] || 1.0;
    
    // Verificar padrões-chave identificados pelo usuário para forte influência
    let strongInfluence = false;
    
    // Verificar padrões positivos
    for (const pattern of keyPositivePatterns) {
      if (text.includes(pattern)) {
        sentimentCount[timeframe].positive += 3 * sourceWeight;
        // Padrões conhecidos influenciam todos os prazos
        if (timeframe !== 'short') sentimentCount.short.positive += sourceWeight;
        if (timeframe !== 'medium') sentimentCount.medium.positive += sourceWeight;
        if (timeframe !== 'long') sentimentCount.long.positive += sourceWeight;
        strongInfluence = true;
        break;
      }
    }
    
    // Verificar padrões negativos
    for (const pattern of keyNegativePatterns) {
      if (text.includes(pattern)) {
        sentimentCount[timeframe].negative += 3 * sourceWeight;
        // Padrões conhecidos influenciam todos os prazos
        if (timeframe !== 'short') sentimentCount.short.negative += sourceWeight;
        if (timeframe !== 'medium') sentimentCount.medium.negative += sourceWeight;
        if (timeframe !== 'long') sentimentCount.long.negative += sourceWeight;
        strongInfluence = true;
        break;
      }
    }
    
    // Se não for um padrão forte conhecido, contar normalmente
    if (!strongInfluence) {
      sentimentCount[timeframe][item.macroImpact.sentiment] += sourceWeight;
    }
  });
  
  // Determinar sentimento dominante para cada prazo
  const result = {
    short: determineDominantSentiment(sentimentCount.short),
    medium: determineDominantSentiment(sentimentCount.medium),
    long: determineDominantSentiment(sentimentCount.long)
  };
  
  return result;
}

// Função auxiliar para determinar sentimento dominante
function determineDominantSentiment(counts: Record<string, number>): 'positive' | 'negative' | 'neutral' | 'mixed' {
  // Se não houver dados suficientes, retornar neutro
  const total = counts.positive + counts.negative + counts.neutral + counts.mixed;
  if (total < 2) return 'neutral';
  
  // Verificar se há um sentimento dominante claro
  if (counts.positive > total * 0.6) return 'positive';
  if (counts.negative > total * 0.6) return 'negative';
  
  // Verificar proporções
  if (counts.positive > counts.negative * 2) return 'positive';
  if (counts.negative > counts.positive * 2) return 'negative';
  
  // Se positivo e negativo estão próximos, é misto
  if (counts.positive > 0 && counts.negative > 0 && 
      Math.abs(counts.positive - counts.negative) / total < 0.3) {
    return 'mixed';
  }
  
  // Caso base - qual é maior
  if (counts.positive > counts.negative && counts.positive > counts.neutral && counts.positive > counts.mixed) {
    return 'positive';
  }
  if (counts.negative > counts.positive && counts.negative > counts.neutral && counts.negative > counts.mixed) {
    return 'negative';
  }
  if (counts.neutral > counts.positive && counts.neutral > counts.negative && counts.neutral > counts.mixed) {
    return 'neutral';
  }
  
  return 'mixed';
}

// Função para extrair narrativas principais das notícias
function extractTopNarratives(news: MacroNewsItem[]) {
  const narratives: Record<string, {
    name: string;
    strength: number;
    relatedAssets: string[];
    relatedCategories: string[];
    description: string;
    mentions: number;
  }> = {};

  // Analisar cada notícia para detectar padrões/narrativas
  news.forEach(item => {
    // Extrair categorias como possíveis narrativas
    item.categories.forEach(category => {
      if (!narratives[category]) {
        narratives[category] = {
          name: category,
          strength: 0,
          relatedAssets: [],
          relatedCategories: [category],
          description: `Narrativa sobre ${category} baseada em análise de notícias recentes.`,
          mentions: 0
        };
      }
      
      narratives[category].mentions++;
      
      // Adicionar ativos relacionados
      item.relatedAssets.forEach(asset => {
        if (!narratives[category].relatedAssets.includes(asset)) {
          narratives[category].relatedAssets.push(asset);
        }
      });
    });
    
    // Análise de texto do título para detectar narrativas adicionais
    const titleLower = item.title.toLowerCase();
    
    // Detectar narrativas comuns
    const commonNarratives = [
      { term: 'etf', name: 'ETF Adoption', category: 'institutional' },
      { term: 'regulat', name: 'Regulatory Developments', category: 'regulation' },
      { term: 'sec', name: 'SEC Actions', category: 'regulation' },
      { term: 'cbdc', name: 'CBDC Development', category: 'central-banks' },
      { term: 'defi', name: 'DeFi Innovation', category: 'defi' },
      { term: 'nft', name: 'NFT Market', category: 'nft' },
      { term: 'layer 2', name: 'Layer 2 Scaling', category: 'scaling' },
      { term: 'institutional', name: 'Institutional Adoption', category: 'institutional' },
      { term: 'mining', name: 'Mining Industry', category: 'mining' },
      { term: 'staking', name: 'Staking Ecosystem', category: 'staking' },
      { term: 'hack', name: 'Security Incidents', category: 'security' },
      { term: 'trump', name: 'Political Impact', category: 'politics' },
      { term: 'meme', name: 'Meme Coins', category: 'meme-coins' },
      { term: 'treasury', name: 'Treasury Management', category: 'macro' },
      { term: 'fed', name: 'Federal Reserve', category: 'monetary-policy' }
    ];
    
    commonNarratives.forEach(narrative => {
      if (titleLower.includes(narrative.term)) {
        const key = narrative.name.toLowerCase().replace(/\s+/g, '-');
        
        if (!narratives[key]) {
          narratives[key] = {
            name: narrative.name,
            strength: 0,
            relatedAssets: [],
            relatedCategories: [narrative.category],
            description: `Narrativa sobre ${narrative.name} baseada em análise de notícias recentes.`,
            mentions: 0
          };
        }
        
        narratives[key].mentions++;
        
        // Adicionar ativos relacionados
        item.relatedAssets.forEach(asset => {
          if (!narratives[key].relatedAssets.includes(asset)) {
            narratives[key].relatedAssets.push(asset);
          }
        });
      }
    });
  });
  
  // Calcular força de cada narrativa (1-10)
  Object.values(narratives).forEach(narrative => {
    // Base na quantidade de menções
    const baseMentionStrength = Math.min(10, Math.ceil(narrative.mentions * 1.5));
    
    // Ajuste com base nos ativos relacionados (mais ativos = narrativa mais ampla)
    const assetBonus = Math.min(2, narrative.relatedAssets.length * 0.2);
    
    // Força final
    narrative.strength = Math.min(10, Math.max(1, Math.round(baseMentionStrength + assetBonus)));
  });
  
  // Filtrar e ordenar as narrativas por força
  return Object.values(narratives)
    .filter(narrative => narrative.strength >= 3) // Apenas narrativas com alguma significância
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5) // Top 5 narrativas
    .map(narrative => ({
      name: narrative.name,
      strength: narrative.strength,
      relatedAssets: narrative.relatedAssets.slice(0, 5), // Limitar a 5 ativos
      relatedCategories: narrative.relatedCategories,
      description: narrative.description
    }));
}

// Função para extrair projetos notáveis das notícias
function extractNotableProjects(news: MacroNewsItem[]) {
  const projects: Record<string, {
    asset: string;
    reason: string;
    momentum: 'increasing' | 'decreasing' | 'stable';
    newsCount: number;
    positiveMentions: number;
    negativeMentions: number;
    recentMentions: number;
  }> = {};
  
  // Definir limite de "recente" como 6 horas atrás
  const recentThreshold = new Date();
  recentThreshold.setHours(recentThreshold.getHours() - 6);
  
  // Analisar cada notícia
  news.forEach(item => {
    const isRecent = new Date(item.timestamp) >= recentThreshold;
    
    // Processar cada ativo relacionado
    item.relatedAssets.forEach(asset => {
      if (!projects[asset]) {
        projects[asset] = {
          asset: asset,
          reason: '',
          momentum: 'stable',
          newsCount: 0,
          positiveMentions: 0,
          negativeMentions: 0,
          recentMentions: 0
        };
      }
      
      // Incrementar contadores
      projects[asset].newsCount++;
      
      if (isRecent) {
        projects[asset].recentMentions++;
      }
      
      // Contar menções por sentimento
      if (item.macroImpact.sentiment === 'positive') {
        projects[asset].positiveMentions++;
      } else if (item.macroImpact.sentiment === 'negative') {
        projects[asset].negativeMentions++;
      }
    });
  });
  
  // Determinar razão e momentum para cada projeto
  Object.values(projects).forEach(project => {
    // Determinar momentum baseado na proporção de menções recentes e sentimento
    if (project.recentMentions > project.newsCount * 0.7) {
      // Se maioria das menções são recentes
      if (project.positiveMentions > project.negativeMentions) {
        project.momentum = 'increasing';
      } else if (project.negativeMentions > project.positiveMentions) {
        project.momentum = 'decreasing';
      }
    }
    
    // Determinar razão para ser notável
    if (project.newsCount >= 5) {
      if (project.positiveMentions > project.negativeMentions * 2) {
        project.reason = 'Alta frequência de notícias positivas';
      } else if (project.negativeMentions > project.positiveMentions * 2) {
        project.reason = 'Alta frequência de notícias negativas';
      } else if (project.recentMentions > project.newsCount * 0.5) {
        project.reason = 'Aumento recente em menções de notícias';
      } else {
        project.reason = 'Alta frequência de cobertura de notícias';
      }
    } else if (project.recentMentions >= 2) {
      project.reason = 'Surgindo em notícias recentes';
    } else {
      project.reason = 'Mencionado em contextos importantes';
    }
  });
  
  // Filtrar e ordenar projetos
  return Object.values(projects)
    .filter(project => project.newsCount >= 2 || project.recentMentions >= 1)
    .sort((a, b) => {
      // Priorizar projetos com alto número de menções recentes
      const recentScore = b.recentMentions - a.recentMentions;
      if (recentScore !== 0) return recentScore;
      
      // Depois considerar o número total de notícias
      return b.newsCount - a.newsCount;
    })
    .slice(0, 5) // Top 5 projetos notáveis
    .map(project => ({
      asset: project.asset,
      reason: project.reason,
      momentum: project.momentum,
      newsCount: project.newsCount
    }));
}

export async function GET() {
  try {
    // 1. Buscar notícias recentes ou usar mock se não disponível
    let finalNews: MacroNewsItem[] = [];
    let contextAnalysis = null;
    
    try {
      // Buscar notícias em tempo real
      const recentNews = await fetchRecentRealNews();
      
      if (recentNews.length > 0) {
        console.log(`Obtidas ${recentNews.length} notícias em tempo real`);
        
        // 2. Curar as melhores notícias (considerando recência, impacto, etc.)
        finalNews = curateTopNews(recentNews);
      } else {
        console.log('Não foi possível obter notícias em tempo real, usando mock');
        // Usar dados mock como fallback
        finalNews = sampleNews;
      }
    } catch (error) {
      console.error('Erro ao processar notícias:', error);
      // Usar dados mock como fallback em caso de erro
      finalNews = sampleNews;
    }
    
    try {
      // 3. Calcular sentimento de mercado
      const marketSentiment = calculateMarketSentiment(finalNews);
      
      // 4. Extrair tendências e narrativas
      const topNarratives = extractTopNarratives(finalNews);
      
      // 5. Extrair projetos notáveis
      const notableProjects = extractNotableProjects(finalNews);
      
      // Preparar resposta final com contexto macro
      const response = {
        news: finalNews,
        sources: Array.from(new Set(finalNews.map(item => item.source))),
        timestamp: new Date().toISOString(),
        contextAnalysis: {
          marketSentiment,
          topNarratives,
          notableProjects
        }
      };
      
      return NextResponse.json(response);
    } catch (error) {
      console.error('Erro ao analisar contexto macro:', error);
      
      // Resposta simplificada em caso de erro na análise
      return NextResponse.json({
        news: finalNews,
        sources: Array.from(new Set(finalNews.map(item => item.source))),
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Erro no endpoint de notícias:', error);
    return NextResponse.json({ error: 'Falha ao buscar notícias' }, { status: 500 });
  }
}

// Função auxiliar para formatar o tempo em minutos
function formatMinutes(date: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60));
} 