import { NextRequest, NextResponse } from 'next/server';
import { saveAnalysis, getLatestAnalysis, MacroAnalysisResult } from '@/lib/services/macroAnalysisDB';

// Lista de influenciadores cripto importantes para monitorar
const KEY_INFLUENCERS = [
  { handle: '@100trillionUSD', name: 'PlanB', focus: 'Bitcoin S2F model, macro' },
  { handle: '@krugermacro', name: 'Alex Krüger', focus: 'macro economics, trading' },
  { handle: '@CryptoHayes', name: 'Arthur Hayes', focus: 'market structure, crypto macro' },
  { handle: '@Ashcryptoreal', name: 'Ash Crypto', focus: 'market analysis, altcoins' },
  { handle: '@scottmelker', name: 'The Wolf Of All Streets', focus: 'trading, market sentiment' },
  { handle: '@zhusu', name: 'Su Zhu', focus: 'market cycles, venture capital' },
  { handle: '@LynAldenContact', name: 'Lyn Alden', focus: 'macro economics, fundamentals' },
  { handle: '@MustStopMurad', name: 'Murad Mahmudov', focus: 'Bitcoin analysis, macro' },
  { handle: '@danheld', name: 'Dan Held', focus: 'Bitcoin narrative, adoption' },
  { handle: '@udiWertheimer', name: 'Udi Wertheimer', focus: 'Bitcoin development, criticism' },
  { handle: '@TheCryptoDog', name: 'The Crypto Dog', focus: 'trading, sentiment analysis' },
  { handle: '@Pentosh1', name: 'Pentoshi', focus: 'market analysis, trading strategies' },
  { handle: '@cobie', name: 'Cobie', focus: 'project analysis, crypto commentary' }
];

// Simulated tweets that would normally be fetched from Twitter API
// Em um ambiente real, buscaríamos tweets recentes dos influenciadores acima
const mockTweets = [
  "FED mantém juros estáveis. BTC mostrando força acima dos 68k. Narrativas de DePIN e L2 aquecendo novamente. [via @100trillionUSD]",
  "Inflação nos EUA em queda. Mercado vê chance de corte de juros em setembro. ETH beneficiado pelo crescimento de L2s. [via @krugermacro]",
  "Dados de emprego melhores que o esperado. Risco de recessão reduzido. Ativos de risco em alta, BTC e altcoins reagindo bem. [via @LynAldenContact]",
  "Geopolítica tensa mas mercados resilientes. SOL e memecoins ainda com forte fluxo. BTC acima da média móvel de 200 dias. [via @scottmelker]",
  "Japão com política monetária ainda acomodativa. Carry trade continua favorável para cripto. Narrativas de RWA e ZK ganhando tração. [via @CryptoHayes]",
  "Bitcoin mantendo suportes importantes após queda. Acumulação visível nas exchanges. Próximos 3 meses serão decisivos. [via @MustStopMurad]",
  "ETH devs confirmam próximas atualizações. Dencun mostrou resultados positivos para escalabilidade. L2s continuam em crescimento. [via @zhusu]",
  "Bitcoin dominance em alta após aprovação dos ETFs. Investidores institucionais continuam comprando. Quebra de recorde de ATH é questão de tempo. [via @danheld]",
  "Memecoins demonstrando fraqueza de curto prazo. Foco voltando para projetos com utilidade real. DePIN e AI tokens liderando recuperação. [via @Ashcryptoreal]",
  "Regulamentação nos EUA sendo mais construtiva. SEC recuando em algumas posições extremas. Isso poderia ser positivo para o mercado cripto. [via @udiWertheimer]",
  "Estamos vendo uma consolidação da tendência de alta. Suporte principal em 67k sendo defendido. Próxima resistência a ser superada em 72k. [via @TheCryptoDog]",
  "90% dos projetos vão falhar no próximo bear market. Foco em projetos com fundamentos sólidos e utilidade real é essencial neste momento. [via @Pentosh1]",
  "Mercado está precificando cortes de juros que podem não acontecer tão cedo. Cuidado com o excesso de alavancagem neste momento. [via @cobie]",
  "Análise on-chain mostra acumulação por endereços antigos. Long-term holders seguem a estratégia de stack sats. Bullish a longo prazo. [via @TheCryptoDog]",
  "ETH tem grande potencial com a expansão do ecossistema L2. Solana também mostrando crescimento real em TVL e usuários ativos. [via @Pentosh1]",
  "Ciclos de cripto estão se relacionando cada vez mais com o ciclo macro. Fed pivot será o principal driver do próximo impulso. [via @cobie]"
];

// Cache the responses for 10 minutes to avoid hammering the other APIs
const CACHE_TIME_MS = 10 * 60 * 1000;
let cachedResponse: any = null;
let lastFetchTime: number = 0;

async function fetchTwitterData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/agents/twitter`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Twitter API responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return null;
  }
}

async function fetchNewsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/agents/news`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`News API responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching News data:', error);
    return null;
  }
}

async function fetchYoutubeData() {
  try {
    // Usando a URL mock para evitar o erro de URL inválida
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/agents/transcript`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`YouTube API responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return null;
  }
}

// Normalize the format of the narratives from different sources
function normalizeNarratives(
  twitterData: any,
  newsData: any,
  youtubeData: any
) {
  const normalizedNarratives: Record<string, {
    name: string;
    occurrences: number;
    sources: {
      twitter: boolean;
      news: boolean;
      youtube: boolean;
    };
    sentiment: {
      twitter?: string;
      news?: string;
      youtube?: string;
    };
    strength: string;
    descriptions: string[];
  }> = {};

  // Process Twitter narratives
  if (twitterData && twitterData.narrativas) {
    twitterData.narrativas.forEach((narrative: any) => {
      const name = narrative.nome.toLowerCase();
      
      if (!normalizedNarratives[name]) {
        normalizedNarratives[name] = {
          name: narrative.nome,
          occurrences: 0,
          sources: { twitter: false, news: false, youtube: false },
          sentiment: {},
          strength: 'medium',
          descriptions: []
        };
      }
      
      normalizedNarratives[name].occurrences += narrative.menções || 1;
      normalizedNarratives[name].sources.twitter = true;
      
      // Map Twitter sentiment to standard format
      const sentimentMap: Record<string, string> = {
        1: 'negative',
        2: 'neutral',
        3: 'positive',
      };
      normalizedNarratives[name].sentiment.twitter = 
        sentimentMap[narrative.sentimento.toString()] || 'neutral';
      
      if (narrative.tendência === 'up') {
        normalizedNarratives[name].strength = 'growing';
      } else if (narrative.tendência === 'down') {
        normalizedNarratives[name].strength = 'fading';
      }
    });
  }

  // Process News narratives (from categories and macroImpact)
  if (newsData && newsData.news) {
    // Create a map for categories
    const categoryMap: Record<string, number> = {};
    
    newsData.news.forEach((news: any) => {
      if (news.categories && news.categories.length) {
        news.categories.forEach((category: string) => {
          const name = category.toLowerCase();
          categoryMap[name] = (categoryMap[name] || 0) + 1;
          
          if (!normalizedNarratives[name]) {
            normalizedNarratives[name] = {
              name: category,
              occurrences: 0,
              sources: { twitter: false, news: false, youtube: false },
              sentiment: {},
              strength: 'medium',
              descriptions: []
            };
          }
          
          normalizedNarratives[name].occurrences += 1;
          normalizedNarratives[name].sources.news = true;
          
          // Use the macroImpact sentiment for this category
          if (news.macroImpact && news.macroImpact.sentiment) {
            normalizedNarratives[name].sentiment.news = news.macroImpact.sentiment;
          }
          
          // Add a description if available
          if (news.macroImpact && news.macroImpact.description) {
            normalizedNarratives[name].descriptions.push(news.macroImpact.description);
          }
        });
      }
      
      // Process related assets as potential narratives
      if (news.relatedAssets && news.relatedAssets.length) {
        news.relatedAssets.forEach((asset: any) => {
          if (asset.type === 'narrative' || asset.type === 'sector') {
            const name = asset.name.toLowerCase();
            
            if (!normalizedNarratives[name]) {
              normalizedNarratives[name] = {
                name: asset.name,
                occurrences: 0,
                sources: { twitter: false, news: false, youtube: false },
                sentiment: {},
                strength: 'medium',
                descriptions: []
              };
            }
            
            normalizedNarratives[name].occurrences += 1;
            normalizedNarratives[name].sources.news = true;
            
            if (news.macroImpact && news.macroImpact.sentiment) {
              normalizedNarratives[name].sentiment.news = news.macroImpact.sentiment;
            }
          }
        });
      }
    });
    
    // Determine strength based on occurrence frequency
    Object.keys(categoryMap).forEach(category => {
      const count = categoryMap[category];
      if (normalizedNarratives[category]) {
        if (count >= 5) {
          normalizedNarratives[category].strength = 'established';
        } else if (count >= 3) {
          normalizedNarratives[category].strength = 'growing';
        } else {
          normalizedNarratives[category].strength = 'emerging';
        }
      }
    });
  }

  // Process YouTube narratives
  if (youtubeData && youtubeData.analyses) {
    youtubeData.analyses.forEach((analysis: any) => {
      if (analysis.content && analysis.content.narratives) {
        analysis.content.narratives.forEach((narrative: any) => {
          const name = narrative.name.toLowerCase();
          
          if (!normalizedNarratives[name]) {
            normalizedNarratives[name] = {
              name: narrative.name,
              occurrences: 0,
              sources: { twitter: false, news: false, youtube: false },
              sentiment: {},
              strength: narrative.strength || 'medium',
              descriptions: []
            };
          }
          
          normalizedNarratives[name].occurrences += 1;
          normalizedNarratives[name].sources.youtube = true;
          normalizedNarratives[name].sentiment.youtube = analysis.content.sentiment.overall;
          
          if (narrative.description) {
            normalizedNarratives[name].descriptions.push(narrative.description);
          }
        });
      }
    });
  }

  // Only keep narratives that appear in at least 2 sources
  const crossPlatformNarratives = Object.values(normalizedNarratives)
    .filter(narrative => {
      const sourceCount = Object.values(narrative.sources).filter(Boolean).length;
      return sourceCount >= 2;
    })
    .map(narrative => {
      // Calculate overall sentiment
      const sentiments = Object.values(narrative.sentiment).filter(Boolean);
      let overallSentiment = 'neutral';
      
      if (sentiments.length) {
        const sentimentCount: Record<string, number> = {};
        sentiments.forEach(sentiment => {
          sentimentCount[sentiment] = (sentimentCount[sentiment] || 0) + 1;
        });
        
        // Find the most common sentiment
        const maxSentiment = Object.entries(sentimentCount)
          .sort((a, b) => b[1] - a[1])[0];
          
        overallSentiment = maxSentiment[0];
      }
      
      // Choose the best description
      let description = narrative.descriptions.length 
        ? narrative.descriptions[0] 
        : `Analysis of the ${narrative.name} narrative across multiple sources.`;
      
      return {
        name: narrative.name,
        occurrences: narrative.occurrences,
        sources: narrative.sources,
        sentiment: {
          ...narrative.sentiment,
          overall: overallSentiment
        },
        strength: narrative.strength,
        description
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences);

  return crossPlatformNarratives;
}

// Normalize the format of the tokens from different sources
function normalizeTokens(
  twitterData: any,
  newsData: any,
  youtubeData: any
) {
  const normalizedTokens: Record<string, {
    symbol: string;
    occurrences: number;
    sources: {
      twitter: boolean;
      news: boolean;
      youtube: boolean;
    };
    sentiment: {
      twitter?: string;
      news?: string;
      youtube?: string;
    };
  }> = {};

  // Process Twitter tokens
  if (twitterData && twitterData.tokens) {
    twitterData.tokens.forEach((token: any) => {
      const symbol = token.symbol.toUpperCase();
      
      if (!normalizedTokens[symbol]) {
        normalizedTokens[symbol] = {
          symbol,
          occurrences: 0,
          sources: { twitter: false, news: false, youtube: false },
          sentiment: {}
        };
      }
      
      normalizedTokens[symbol].occurrences += token.menções || 1;
      normalizedTokens[symbol].sources.twitter = true;
      normalizedTokens[symbol].sentiment.twitter = token.sentimento;
    });
  }

  // Process News tokens (from relatedAssets)
  if (newsData && newsData.news) {
    newsData.news.forEach((news: any) => {
      if (news.relatedAssets && news.relatedAssets.length) {
        news.relatedAssets.forEach((asset: any) => {
          if (asset.type === 'cryptocurrency' && asset.symbol) {
            const symbol = asset.symbol.toUpperCase();
            
            if (!normalizedTokens[symbol]) {
              normalizedTokens[symbol] = {
                symbol,
                occurrences: 0,
                sources: { twitter: false, news: false, youtube: false },
                sentiment: {}
              };
            }
            
            normalizedTokens[symbol].occurrences += 1;
            normalizedTokens[symbol].sources.news = true;
            
            if (news.macroImpact && news.macroImpact.sentiment) {
              normalizedTokens[symbol].sentiment.news = news.macroImpact.sentiment;
            }
          }
        });
      }
    });
  }

  // Process YouTube tokens
  if (youtubeData && youtubeData.analyses) {
    youtubeData.analyses.forEach((analysis: any) => {
      if (analysis.content && analysis.content.tokens) {
        analysis.content.tokens.forEach((token: any) => {
          const symbol = token.symbol.toUpperCase();
          
          if (!normalizedTokens[symbol]) {
            normalizedTokens[symbol] = {
              symbol,
              occurrences: 0,
              sources: { twitter: false, news: false, youtube: false },
              sentiment: {}
            };
          }
          
          normalizedTokens[symbol].occurrences += 1;
          normalizedTokens[symbol].sources.youtube = true;
          normalizedTokens[symbol].sentiment.youtube = token.sentiment;
        });
      }
    });
  }

  // Only keep tokens that appear in at least 2 sources
  const crossPlatformTokens = Object.values(normalizedTokens)
    .filter(token => {
      const sourceCount = Object.values(token.sources).filter(Boolean).length;
      return sourceCount >= 2;
    })
    .map(token => {
      // Calculate overall sentiment
      const sentiments = Object.values(token.sentiment).filter(Boolean);
      let overallSentiment = 'neutral';
      
      if (sentiments.length) {
        const sentimentCount: Record<string, number> = {};
        sentiments.forEach(sentiment => {
          sentimentCount[sentiment] = (sentimentCount[sentiment] || 0) + 1;
        });
        
        // Find the most common sentiment
        const maxSentiment = Object.entries(sentimentCount)
          .sort((a, b) => b[1] - a[1])[0];
          
        overallSentiment = maxSentiment[0];
      }
      
      return {
        symbol: token.symbol,
        occurrences: token.occurrences,
        sources: token.sources,
        sentiment: {
          ...token.sentiment,
          overall: overallSentiment
        }
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences);

  return crossPlatformTokens;
}

// Generate macro insights based on the cross-platform data
function generateInsights(
  narratives: any[],
  tokens: any[],
  twitterData: any,
  newsData: any,
  youtubeData: any
) {
  const insights = [];
  
  // Only generate insights if we have meaningful data
  if (narratives.length === 0 && tokens.length === 0) {
    return [];
  }
  
  // Insight 1: Most significant narrative across platforms
  if (narratives.length > 0) {
    const topNarrative = narratives[0];
    const sourceCount = Object.values(topNarrative.sources).filter(Boolean).length;
    
    insights.push({
      title: `${topNarrative.name} is the Dominant Narrative`,
      description: `This narrative appears across ${sourceCount} sources with ${topNarrative.occurrences} mentions. ${topNarrative.description}`,
      narratives: [topNarrative.name],
      tokens: tokens.filter(t => t.sentiment.overall === topNarrative.sentiment.overall).slice(0, 3).map(t => t.symbol),
      sentiment: topNarrative.sentiment.overall,
      timeframe: topNarrative.strength === 'established' ? 'medium' : (topNarrative.strength === 'emerging' ? 'long' : 'short'),
      conviction: topNarrative.strength === 'established' ? 'high' : (topNarrative.strength === 'growing' ? 'medium' : 'low')
    });
  }
  
  // Insight 2: Top bullish token across platforms
  const bullishTokens = tokens.filter(t => t.sentiment.overall === 'positive' || t.sentiment.overall === 'bullish');
  if (bullishTokens.length > 0) {
    const topBullishToken = bullishTokens[0];
    const relatedNarratives = narratives.filter(n => n.sentiment.overall === 'positive' || n.sentiment.overall === 'bullish').slice(0, 2).map(n => n.name);
    
    insights.push({
      title: `${topBullishToken.symbol} Shows Strong Positive Sentiment`,
      description: `This token has positive sentiment across multiple sources with ${topBullishToken.occurrences} mentions.`,
      narratives: relatedNarratives,
      tokens: [topBullishToken.symbol],
      sentiment: 'bullish',
      timeframe: 'medium',
      conviction: Object.values(topBullishToken.sources).filter(Boolean).length >= 3 ? 'high' : 'medium'
    });
  }
  
  // Insight 3: Emerging narrative with potential
  const emergingNarratives = narratives.filter(n => n.strength === 'emerging' || n.strength === 'growing');
  if (emergingNarratives.length > 0) {
    const emergingNarrative = emergingNarratives[0];
    
    insights.push({
      title: `${emergingNarrative.name} is an Emerging Trend`,
      description: `This narrative is gaining traction across platforms and may present future opportunities.`,
      narratives: [emergingNarrative.name],
      tokens: tokens.slice(0, 2).map(t => t.symbol),
      sentiment: 'neutral',
      timeframe: 'long',
      conviction: 'medium'
    });
  }
  
  // Insight 4: Potential caution/risk if any bearish signals
  const bearishSignals = [
    ...(narratives.filter(n => n.sentiment.overall === 'negative' || n.sentiment.overall === 'bearish')),
    ...(tokens.filter(t => t.sentiment.overall === 'negative' || t.sentiment.overall === 'bearish'))
  ];
  
  if (bearishSignals.length > 0) {
    insights.push({
      title: "Caution: Bearish Signals Detected",
      description: "Multiple data sources are showing bearish sentiment for certain narratives and tokens.",
      narratives: narratives.filter(n => n.sentiment.overall === 'negative' || n.sentiment.overall === 'bearish').slice(0, 2).map(n => n.name),
      tokens: tokens.filter(t => t.sentiment.overall === 'negative' || t.sentiment.overall === 'bearish').slice(0, 2).map(t => t.symbol),
      sentiment: 'bearish',
      timeframe: 'short',
      conviction: 'medium'
    });
  }
  
  // Insight 5: Use YouTube opportunities if available
  if (youtubeData && youtubeData.analyses && youtubeData.analyses.length > 0) {
    // Collect all opportunities from YouTube videos
    const allOpportunities = youtubeData.analyses
      .flatMap((analysis: any) => analysis.content.opportunities || [])
      .filter(Boolean);
    
    if (allOpportunities.length > 0) {
      // Group by type and find the most common one
      const opportunityTypes: Record<string, any[]> = {};
      allOpportunities.forEach((opp: any) => {
        if (!opportunityTypes[opp.type]) {
          opportunityTypes[opp.type] = [];
        }
        opportunityTypes[opp.type].push(opp);
      });
      
      const topOpportunityType = Object.entries(opportunityTypes)
        .sort((a, b) => b[1].length - a[1].length)[0];
      
      const relatedTokens = tokens.slice(0, 2).map(t => t.symbol);
      const relatedNarratives = narratives
        .filter(n => n.sentiment.overall === 'positive' || n.sentiment.overall === 'bullish')
        .slice(0, 2)
        .map(n => n.name);
      
      insights.push({
        title: `${topOpportunityType[0].charAt(0).toUpperCase() + topOpportunityType[0].slice(1)} Opportunity Identified`,
        description: topOpportunityType[1][0].description || `Multiple analysts are highlighting opportunities in ${topOpportunityType[0]}.`,
        narratives: relatedNarratives,
        tokens: relatedTokens,
        sentiment: 'bullish',
        timeframe: topOpportunityType[1][0].timeframe || 'medium',
        conviction: topOpportunityType[1][0].conviction || 'medium'
      });
    }
  }
  
  return insights;
}

// Calculate market sentiment based on all sources
function calculateMarketSentiment(
  twitterData: any,
  newsData: any,
  youtubeData: any
) {
  const sentiments: Record<string, number> = {
    bullish: 0,
    positive: 0,
    bearish: 0,
    negative: 0,
    neutral: 0,
    mixed: 0
  };
  
  // Twitter sentiment
  if (twitterData && twitterData.sentimento_geral) {
    sentiments[twitterData.sentimento_geral] += 3; // Weigh Twitter sentiment higher
  }
  
  // News sentiment
  if (newsData && newsData.news) {
    const newsSentiments: Record<string, number> = {};
    
    newsData.news.forEach((news: any) => {
      if (news.macroImpact && news.macroImpact.sentiment) {
        const sentiment = news.macroImpact.sentiment;
        newsSentiments[sentiment] = (newsSentiments[sentiment] || 0) + 1;
      }
    });
    
    // Map news sentiments to our standard format
    Object.entries(newsSentiments).forEach(([sentiment, count]) => {
      if (sentiment === 'positive' || sentiment === 'bullish') {
        sentiments.bullish += count;
      } else if (sentiment === 'negative' || sentiment === 'bearish') {
        sentiments.bearish += count;
      } else {
        sentiments[sentiment] += count;
      }
    });
  }
  
  // YouTube sentiment
  if (youtubeData && youtubeData.analyses) {
    youtubeData.analyses.forEach((analysis: any) => {
      if (analysis.content && analysis.content.sentiment && analysis.content.sentiment.overall) {
        sentiments[analysis.content.sentiment.overall] += 2; // Weigh YouTube sentiment moderately
      }
    });
  }
  
  // Combine similar sentiments
  sentiments.bullish += sentiments.positive;
  sentiments.bearish += sentiments.negative;
  delete sentiments.positive;
  delete sentiments.negative;
  
  // Find the dominant sentiment
  const dominantSentiment = Object.entries(sentiments)
    .sort((a, b) => b[1] - a[1])[0];
    
  return dominantSentiment[0];
}

async function generateMacroResponse(forceRefresh = false) {
  const now = Date.now();
  
  // Return cached response if available and not expired
  if (
    !forceRefresh && 
    cachedResponse && 
    now - lastFetchTime < CACHE_TIME_MS
  ) {
    return cachedResponse;
  }
  
  // Fetch data from all sources in parallel
  const [twitterData, newsData, youtubeData] = await Promise.all([
    fetchTwitterData(),
    fetchNewsData(),
    fetchYoutubeData()
  ]);
  
  // Create cross-platform narratives and tokens
  const narratives = normalizeNarratives(twitterData, newsData, youtubeData);
  const tokens = normalizeTokens(twitterData, newsData, youtubeData);
  
  // Generate insights based on the data
  const insights = generateInsights(narratives, tokens, twitterData, newsData, youtubeData);
  
  // Calculate overall market sentiment
  const marketSentiment = calculateMarketSentiment(twitterData, newsData, youtubeData);
  
  // Build the final response
  const response = {
    narratives,
    tokens,
    insights,
    marketSentiment,
    timestamp: new Date().toISOString(),
    sources: {
      twitter: {
        available: !!twitterData,
        timestamp: twitterData?.timestamp
      },
      news: {
        available: !!newsData,
        timestamp: newsData?.timestamp
      },
      youtube: {
        available: !!youtubeData,
        timestamp: youtubeData?.timestamp
      }
    }
  };
  
  // Cache the result
  cachedResponse = response;
  lastFetchTime = now;
  
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    const response = await generateMacroResponse(forceRefresh);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating macro response:', error);
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An error occurred processing the macro data' },
      { status: 500 }
    );
  }
} 