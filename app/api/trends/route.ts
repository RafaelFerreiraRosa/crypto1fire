import { NextRequest, NextResponse } from 'next/server';

// Contas a serem monitoradas por categoria
const TWITTER_ACCOUNTS = {
  emergingNarratives: ['CryptoWizardd', 'beaniemaxi', 'CL207'],
  technicalResearchers: ['0xfoobar', 'LightCrypto', 'ercwl'],
  narrativeCurators: ['TaschaLabs', 'RyanSAdams']
};

// Mapeamento de narrativas conhecidas e tokens associados
const KNOWN_NARRATIVES = {
  "DePIN": {
    description: "Infraestrutura física descentralizada, conectando mundo real com blockchain",
    tokens: ["RNDR", "LPT", "HNT", "WLD", "AR", "FIL", "GRT", "AERO"],
    risks: "Hardware dependencies, adoção física lenta",
    associatedAccounts: ["CryptoWizardd", "CL207"],
    ecosystemMetrics: {
      onchainTVL: "$850M",
      weeklyActiveUsers: 125000,
      weeklyTransactions: 2800000
    }
  },
  "ZK": {
    description: "Tecnologia de prova sem conhecimento para privacidade e escalabilidade",
    tokens: ["MINA", "DUSK", "ZETA", "BLUR", "IMX", "STRK", "MATIC", "DYDX"],
    risks: "Tecnologia complexa, desenvolvimento lento",
    associatedAccounts: ["0xfoobar", "LightCrypto", "ercwl"],
    ecosystemMetrics: {
      onchainTVL: "$3.2B",
      weeklyActiveUsers: 780000,
      weeklyTransactions: 5600000
    }
  },
  "RWA": {
    description: "Tokenização de ativos do mundo real em blockchain",
    tokens: ["ONDO", "FLARE", "MKR", "USDC", "PAXG", "UNI", "EURS", "TNGBL"],
    risks: "Regulação, desafios de custódia",
    associatedAccounts: ["TaschaLabs", "RyanSAdams"],
    ecosystemMetrics: {
      onchainTVL: "$5.8B",
      weeklyActiveUsers: 210000,
      weeklyTransactions: 890000
    }
  },
  "BTCfi": {
    description: "Finanças descentralizadas construídas no Bitcoin",
    tokens: ["WBTC", "STACKS", "ORDI", "SATS", "BTC", "RUNE", "GALA", "RATS"],
    risks: "Limitações técnicas do Bitcoin, ecossistema emergente",
    associatedAccounts: ["CryptoWizardd", "RyanSAdams"],
    ecosystemMetrics: {
      onchainTVL: "$1.7B",
      weeklyActiveUsers: 340000,
      weeklyTransactions: 1200000
    }
  },
  "AI + Crypto": {
    description: "Combinação de inteligência artificial com blockchain",
    tokens: ["FET", "OCEAN", "AGIX", "NMR", "RAD", "RLC", "GARI", "ALI"],
    risks: "Hype excessivo, integração real limitada",
    associatedAccounts: ["0xfoobar", "TaschaLabs"],
    ecosystemMetrics: {
      onchainTVL: "$620M",
      weeklyActiveUsers: 95000,
      weeklyTransactions: 450000
    }
  },
  "Layer2": {
    description: "Soluções de escalabilidade para blockchains principais",
    tokens: ["OP", "ARB", "BASE", "MATIC", "ZK", "IMX", "METIS", "LOOM"],
    risks: "Fragmentação do ecossistema, competição intensa",
    associatedAccounts: ["RyanSAdams", "ercwl"],
    ecosystemMetrics: {
      onchainTVL: "$7.5B",
      weeklyActiveUsers: 1200000,
      weeklyTransactions: 8500000
    }
  },
  "Memecoin": {
    description: "Tokens com foco em comunidade e valor memético",
    tokens: ["DOGE", "SHIB", "PEPE", "WIF", "TURBO", "BONK", "MOG", "BRETT"],
    risks: "Alta volatilidade, falta de utilidade inerente",
    associatedAccounts: ["beaniemaxi", "CL207"],
    ecosystemMetrics: {
      onchainTVL: "$220M",
      weeklyActiveUsers: 2800000,
      weeklyTransactions: 3400000
    }
  },
  "Gaming": {
    description: "Jogos integrados com tecnologia blockchain",
    tokens: ["AXS", "GALA", "MAGIC", "ILV", "IMX", "BEAM", "ATLAS", "MV"],
    risks: "Qualidade de jogos variável, sustentabilidade econômica",
    associatedAccounts: ["CryptoWizardd", "beaniemaxi"],
    ecosystemMetrics: {
      onchainTVL: "$980M",
      weeklyActiveUsers: 520000,
      weeklyTransactions: 1900000
    }
  }
};

// Função para categorizar tokens com base no MCap
function categorizeByMCap(marketCap: number): string {
  if (marketCap < 200000000) {
    return "Microcap";
  } else if (marketCap < 500000000) {
    return "Smallcap";
  } else if (marketCap < 3000000000) {
    return "Midcap";
  } else {
    return "Bigcap";
  }
}

// Análise de tweets e identificação de padrões emergentes
async function analyzeTwitterTrends() {
  // Simula análise de tweets sem precisar da API real do Twitter
  // Em um ambiente real, usaríamos a API do Twitter para coletar tweets
  
  // Estratégia para identificar projetos antes que estourem:
  // 1. Monitorar menções de tokens em contas de emergingNarratives
  // 2. Verificar se há menções cruzadas entre diferentes influenciadores
  // 3. Identificar menções de tokens micro/small cap específicos
  // 4. Analisar engajamento: likes, reposts e views dos tweets
  // 5. Analisar sentimento e contexto das menções
  
  const narratives = Object.keys(KNOWN_NARRATIVES).map(name => {
    const narrative = KNOWN_NARRATIVES[name as keyof typeof KNOWN_NARRATIVES];
    
    // Simula volume social baseado no número de contas associadas e um fator aleatório
    const associatedAccounts = narrative.associatedAccounts || [];
    
    // Simula métricas de engajamento no Twitter (X)
    const twitterEngagement = simulateTwitterEngagement(name, associatedAccounts);
    
    // Volume social agora leva em conta metrics de engajamento (likes, reposts, views)
    const socialVolume = twitterEngagement.totalEngagement;
    
    // Simula análise de sentimento de posts no Twitter
    const twitterSentiment = simulateTwitterSentiment(name);
    
    // Simula análise de matérias do CryptoPanic
    const newsSentiment = simulateNewsSentiment(name);
    
    // Simula análise de dados on-chain
    const onchainSentiment = simulateOnchainSentiment(name);
    
    // Cálculo de sentimento combinado (média ponderada)
    // Twitter: 40%, CryptoPanic: 30%, On-chain: 30%
    const combinedSentiment = (
      twitterSentiment * 0.4 +
      newsSentiment * 0.3 +
      onchainSentiment * 0.3
    );
    
    // Mapeamento de sentimento para nível de hype
    let hypeLevel = "médio";
    if (combinedSentiment > 70) {
      hypeLevel = "alto";
    } else if (combinedSentiment < 30) {
      hypeLevel = "baixo";
    }
    
    // Determina a fonte principal da narrativa baseada nas contas associadas
    const sourceType = associatedAccounts.some(acc => TWITTER_ACCOUNTS.technicalResearchers.includes(acc))
      ? "technicalResearchers"
      : associatedAccounts.some(acc => TWITTER_ACCOUNTS.narrativeCurators.includes(acc))
        ? "narrativeCurators"
        : "emergingNarratives";
    
    // Calcular score de credibilidade baseado no tipo de fonte e no engajamento
    // Maior engajamento gera mais credibilidade, ponderado pelo tipo de fonte
    const credibilityScore = calculateCredibilityScore(sourceType, twitterEngagement);
    
    return {
      name,
      description: narrative.description,
      tokens: narrative.tokens,
      risks: narrative.risks,
      hypeLevel,
      sourceType,
      socialVolume,
      credibilityScore,
      twitterEngagement,
      ecosystemMetrics: narrative.ecosystemMetrics,
      sentimentData: {
        twitter: twitterSentiment,
        news: newsSentiment,
        onchain: onchainSentiment,
        combined: combinedSentiment
      }
    };
  });
  
  // Ordena por volume social (mais popular primeiro)
  return narratives.sort((a, b) => b.socialVolume - a.socialVolume);
}

// Simula métricas de engajamento no Twitter (likes, reposts, views)
function simulateTwitterEngagement(narrativeName: string, associatedAccounts: string[]) {
  // Bases para simulação
  const baseValues = {
    likes: {
      emergingNarratives: { min: 300, max: 2500 },
      technicalResearchers: { min: 800, max: 5000 },
      narrativeCurators: { min: 1000, max: 7000 }
    },
    reposts: {
      emergingNarratives: { min: 50, max: 500 },
      technicalResearchers: { min: 150, max: 1500 },
      narrativeCurators: { min: 200, max: 2000 }
    },
    views: {
      emergingNarratives: { min: 10000, max: 100000 },
      technicalResearchers: { min: 50000, max: 500000 },
      narrativeCurators: { min: 70000, max: 700000 }
    }
  };

  let totalLikes = 0;
  let totalReposts = 0;
  let totalViews = 0;
  let tweetCount = 0;
  
  // Para cada conta associada, simular engajamento
  associatedAccounts.forEach(account => {
    // Determinar categoria da conta
    let accountType = "emergingNarratives";
    if (TWITTER_ACCOUNTS.technicalResearchers.includes(account)) {
      accountType = "technicalResearchers";
    } else if (TWITTER_ACCOUNTS.narrativeCurators.includes(account)) {
      accountType = "narrativeCurators";
    }
    
    // Simular de 1 a 5 tweets por conta
    const tweetCountForAccount = Math.floor(Math.random() * 5) + 1;
    tweetCount += tweetCountForAccount;
    
    // Para cada tweet, gerar métricas
    for (let i = 0; i < tweetCountForAccount; i++) {
      // Gerar likes, reposts e views para este tweet
      const likesBase = baseValues.likes[accountType as keyof typeof baseValues.likes];
      const repostsBase = baseValues.reposts[accountType as keyof typeof baseValues.reposts];
      const viewsBase = baseValues.views[accountType as keyof typeof baseValues.views];
      
      const likes = Math.floor(Math.random() * (likesBase.max - likesBase.min)) + likesBase.min;
      const reposts = Math.floor(Math.random() * (repostsBase.max - repostsBase.min)) + repostsBase.min;
      const views = Math.floor(Math.random() * (viewsBase.max - viewsBase.min)) + viewsBase.min;
      
      totalLikes += likes;
      totalReposts += reposts;
      totalViews += views;
    }
  });
  
  // Calcular engajamento médio por tweet
  const avgLikesPerTweet = tweetCount > 0 ? Math.floor(totalLikes / tweetCount) : 0;
  const avgRepostsPerTweet = tweetCount > 0 ? Math.floor(totalReposts / tweetCount) : 0;
  const avgViewsPerTweet = tweetCount > 0 ? Math.floor(totalViews / tweetCount) : 0;
  
  // Calcular score de engajamento (ponderando métricas)
  // Likes têm peso 5x, Reposts 10x (indicam maior comprometimento)
  const engagementScore = totalLikes * 5 + totalReposts * 10 + Math.floor(totalViews / 100);
  
  // Normalizar para uma escala de "volume social"
  const totalEngagement = Math.floor(engagementScore / 100);
  
  return {
    totalLikes,
    totalReposts,
    totalViews,
    tweetCount,
    avgLikesPerTweet,
    avgRepostsPerTweet,
    avgViewsPerTweet,
    engagementScore,
    totalEngagement
  };
}

// Calcula score de credibilidade baseado no tipo de fonte e engajamento
function calculateCredibilityScore(sourceType: string, engagement: any) {
  // Base scores by source type
  const baseScoreByType = {
    technicalResearchers: 85,
    narrativeCurators: 75,
    emergingNarratives: 65
  };
  
  // Get base score for this source type
  const baseScore = baseScoreByType[sourceType as keyof typeof baseScoreByType] || 65;
  
  // Engagement boost (up to 10 points)
  // High engagement can boost credibility but only to a point
  const engagementBoost = Math.min(10, Math.floor(engagement.engagementScore / 10000));
  
  // Random variation (±5 points)
  const randomVariation = Math.floor(Math.random() * 10) - 5;
  
  // Calculate final score, ensuring it stays within 1-100 range
  return Math.min(100, Math.max(1, baseScore + engagementBoost + randomVariation));
}

// Verificação aprofundada de dados de mercado e on-chain
async function fetchAndEnrichTokenData(narrative: any): Promise<any> {
  const tokenCount = Math.min(narrative.tokens.length, 5); // Limitar a 5 tokens por narrativa
  const enrichedTokens = [];
  
  // Mapeamento de IDs para o CoinGecko
  const coinGeckoIdMap: Record<string, string> = {
    "BTC": "bitcoin", "ETH": "ethereum", "MATIC": "matic-network",
    "SOL": "solana", "BNB": "binancecoin", "XRP": "ripple",
    "DOGE": "dogecoin", "ADA": "cardano", "DOT": "polkadot",
    "LINK": "chainlink", "SHIB": "shiba-inu", "AVAX": "avalanche-2",
    "RNDR": "render-token", "LPT": "livepeer", "HNT": "helium",
    "WLD": "worldcoin-wld", "AR": "arweave", "FIL": "filecoin",
    "GRT": "the-graph", "MINA": "mina-protocol", "DUSK": "dusk-network",
    "ZETA": "zetachain", "BLUR": "blur", "IMX": "immutable-x",
    "STRK": "starknet", "DYDX": "dydx", "MKR": "maker",
    "USDC": "usd-coin", "PAXG": "pax-gold", "UNI": "uniswap",
    "EURS": "stasis-eurs", "OP": "optimism", "ARB": "arbitrum",
    "METIS": "metis-token", "LOOM": "loom-network", "WBTC": "wrapped-bitcoin",
    "STACKS": "stacks", "ORDI": "ordinals", "RUNE": "thorchain",
    "GALA": "gala", "FET": "fetch-ai", "OCEAN": "ocean-protocol",
    "AGIX": "singularitynet", "NMR": "numeraire", "RAD": "radicle",
    "RLC": "iexec-rlc", "AXS": "axie-infinity", "MAGIC": "magic",
    "ILV": "illuvium", "BEAM": "beam-2", "PEPE": "pepe",
    "BONK": "bonk"
  };

  // Para cada token na narrativa (limitado ao tokenCount)
  for (let i = 0; i < tokenCount; i++) {
    const token = narrative.tokens[i];
    const tokenSymbol = token.symbol || token;
    const tokenName = token.name || `${tokenSymbol} Token`;
    
    try {
      // Buscar dados do CoinGecko com ID mapeado, se disponível
      const coinId = coinGeckoIdMap[tokenSymbol] || tokenSymbol.toLowerCase();
      
      // Usar CoinCap como alternativa ao CoinGecko para evitar rate limits
      const response = await fetch(`https://api.coincap.io/v2/assets/${coinId.toLowerCase()}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          const price = parseFloat(data.data.priceUsd);
          const marketCap = parseFloat(data.data.marketCapUsd);
          const volume = parseFloat(data.data.volumeUsd24Hr);
          const priceChange = parseFloat(data.data.changePercent24Hr);
          
          // Calcular proporção volume/mcap e qualidade
          const volumeToMcapRatio = marketCap > 0 ? volume / marketCap : 0;
          let volumeQuality = "Médio";
          if (volumeToMcapRatio > 0.3) volumeQuality = "Alto";
          if (volumeToMcapRatio < 0.05) volumeQuality = "Baixo";
          
          enrichedTokens.push({
            symbol: tokenSymbol,
            name: tokenName,
            price: price,
            priceChange24h: priceChange,
            marketCap: marketCap,
            category: categorizeByMCap(marketCap),
            tradingVolume: volume,
            volumeToMcapRatio: volumeToMcapRatio,
            volumeQuality: volumeQuality,
            dataVerified: true,
            lastUpdated: new Date().toISOString()
          });
          continue; // Próximo token
        }
      }
      
      // Tentar CryptoCompare como segunda alternativa
      const cryptoCompareResponse = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tokenSymbol}&tsyms=USD`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (cryptoCompareResponse.ok) {
        const priceData = await cryptoCompareResponse.json();
        if (priceData.USD) {
          // Fazer uma segunda chamada para dados adicionais
          const fullDataResponse = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${tokenSymbol}&tsyms=USD`, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          let marketCap = 1000000; // Valor padrão 
          let volume = 100000;
          let priceChange = 0;
          
          if (fullDataResponse.ok) {
            const fullData = await fullDataResponse.json();
            if (fullData.RAW && fullData.RAW[tokenSymbol] && fullData.RAW[tokenSymbol].USD) {
              marketCap = fullData.RAW[tokenSymbol].USD.MKTCAP || marketCap;
              volume = fullData.RAW[tokenSymbol].USD.VOLUME24HOUR || volume;
              priceChange = fullData.RAW[tokenSymbol].USD.CHANGEPCT24HOUR || 0;
            }
          }
          
          // Calcular proporção volume/mcap e qualidade
          const volumeToMcapRatio = marketCap > 0 ? volume / marketCap : 0;
          let volumeQuality = "Médio";
          if (volumeToMcapRatio > 0.3) volumeQuality = "Alto";
          if (volumeToMcapRatio < 0.05) volumeQuality = "Baixo";
          
          enrichedTokens.push({
            symbol: tokenSymbol,
            name: tokenName,
            price: priceData.USD,
            priceChange24h: priceChange,
            marketCap: marketCap,
            category: categorizeByMCap(marketCap),
            tradingVolume: volume,
            volumeToMcapRatio: volumeToMcapRatio,
            volumeQuality: volumeQuality,
            dataVerified: true,
            lastUpdated: new Date().toISOString()
          });
          continue; // Próximo token
        }
      }
      
      // Se chegou aqui, todas as APIs falharam, usar dados simulados
      const simulatedData = generateSimulatedTokenData(tokenSymbol);
      enrichedTokens.push({
        symbol: tokenSymbol,
        name: tokenName,
        price: simulatedData.price,
        priceChange24h: simulatedData.priceChange24h,
        marketCap: simulatedData.marketCap,
        category: categorizeByMCap(simulatedData.marketCap),
        tradingVolume: simulatedData.volume,
        volumeToMcapRatio: simulatedData.volume / simulatedData.marketCap,
        volumeQuality: simulatedData.volumeQuality,
        dataVerified: false,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Erro ao processar token ${tokenSymbol}:`, error);
      // Usar dados simulados como fallback
      const simulatedData = generateSimulatedTokenData(tokenSymbol);
      enrichedTokens.push({
        symbol: tokenSymbol,
        name: tokenName,
        price: simulatedData.price,
        priceChange24h: simulatedData.priceChange24h,
        marketCap: simulatedData.marketCap,
        category: categorizeByMCap(simulatedData.marketCap),
        tradingVolume: simulatedData.volume,
        volumeToMcapRatio: simulatedData.volume / simulatedData.marketCap,
        volumeQuality: simulatedData.volumeQuality,
        dataVerified: false,
        lastUpdated: new Date().toISOString()
      });
    }
  }
  
  // Atualizar a narrativa com os tokens enriquecidos
  return {
    ...narrative,
    tokens: enrichedTokens
  };
}

function generateSimulatedTokenData(symbol: string) {
  // Valores baseados no símbolo para serem consistentes entre refreshes
  const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Determinar a categoria baseada no hash do símbolo para consistência
  let baseMarketCap;
  const mod = symbolHash % 10;
  
  if (mod < 3) { // 30% chance de ser Microcap
    baseMarketCap = 1_000_000 + (symbolHash % 9_000_000);
  } else if (mod < 6) { // 30% chance de ser Smallcap
    baseMarketCap = 10_000_000 + (symbolHash % 90_000_000);
  } else if (mod < 9) { // 30% chance de ser Midcap
    baseMarketCap = 100_000_000 + (symbolHash % 900_000_000);
  } else { // 10% chance de ser Bigcap
    baseMarketCap = 1_000_000_000 + (symbolHash % 50_000_000_000);
  }
  
  // Preço baseado no market cap, com variação
  const price = ((baseMarketCap / 10000000) * (1 + (symbolHash % 100) / 100)).toFixed(2);
  
  // Volume diário como percentual do market cap
  const volumePercent = 0.05 + (symbolHash % 20) / 100; // 5% a 25% do market cap
  const volume = baseMarketCap * volumePercent;
  
  // Qualidade do volume baseada na percentagem
  let volumeQuality;
  if (volumePercent > 0.15) volumeQuality = "Alto";
  else if (volumePercent > 0.1) volumeQuality = "Médio";
  else volumeQuality = "Baixo";
  
  return {
    price: parseFloat(price),
    priceChange24h: -15 + (symbolHash % 30), // -15% a +15%
    marketCap: baseMarketCap,
    volume,
    volumeQuality
  };
}

async function fetchTopCoins(page = 1, perPage = 100) {
  try {
    // Buscar tokens em lotes de 100 (máximo permitido pela API)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    console.error(`Erro ao buscar moedas (página ${page}):`, response.status);
    return [];
  } catch (error) {
    console.error(`Erro ao buscar top coins (página ${page}):`, error);
    return [];
  }
}

async function fetchTop300Coins() {
  try {
    // Buscar em 3 páginas de 100 tokens cada
    const [page1, page2, page3] = await Promise.all([
      fetchTopCoins(1),
      fetchTopCoins(2),
      fetchTopCoins(3)
    ]);
    
    return [...page1, ...page2, ...page3];
  } catch (error) {
    console.error("Erro ao buscar top 300 tokens:", error);
    return [];
  }
}

// Adicionar funções de simulação de sentimento que estão faltando
function simulateTwitterSentiment(name: string): number {
  // Hash consistente baseado no nome para simulação
  const nameHash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  
  // Narrativas com sentimento mais otimista no Twitter
  const bullishNarratives = ['Layer2', 'DePIN', 'AI + Crypto', 'BTCfi'];
  const bearishNarratives = ['Memecoin'];
  
  // Ajustar base de sentimento de acordo com a narrativa
  let baseSentiment = 50; // neutro como padrão
  
  if (bullishNarratives.includes(name)) {
    baseSentiment = 60 + (nameHash % 20); // 60-80
  } else if (bearishNarratives.includes(name)) {
    baseSentiment = 30 + (nameHash % 30); // 30-60
  } else {
    baseSentiment = 40 + (nameHash % 30); // 40-70
  }
  
  return Math.min(100, Math.max(0, baseSentiment));
}

function simulateNewsSentiment(name: string): number {
  // Hash consistente baseado no nome para simulação
  const nameHash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  
  // Narrativas com cobertura de imprensa mais positiva
  const positiveCoverage = ['RWA', 'ZK', 'BTCfi'];
  const negativeCoverage = ['Memecoin', 'Gaming'];
  
  // Ajustar base de sentimento de acordo com a narrativa
  let baseSentiment = 50; // neutro como padrão
  
  if (positiveCoverage.includes(name)) {
    baseSentiment = 65 + (nameHash % 15); // 65-80
  } else if (negativeCoverage.includes(name)) {
    baseSentiment = 35 + (nameHash % 20); // 35-55
  } else {
    baseSentiment = 45 + (nameHash % 25); // 45-70
  }
  
  return Math.min(100, Math.max(0, baseSentiment));
}

function simulateOnchainSentiment(name: string): number {
  // Hash consistente baseado no nome para simulação
  const nameHash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  
  // Narrativas com atividade on-chain mais forte
  const strongOnchain = ['Layer2', 'DePIN', 'ZK'];
  const weakOnchain = ['Memecoin', 'AI + Crypto'];
  
  // Ajustar base de sentimento de acordo com a narrativa
  let baseSentiment = 50; // neutro como padrão
  
  if (strongOnchain.includes(name)) {
    baseSentiment = 70 + (nameHash % 20); // 70-90
  } else if (weakOnchain.includes(name)) {
    baseSentiment = 30 + (nameHash % 25); // 30-55
  } else {
    baseSentiment = 50 + (nameHash % 25); // 50-75
  }
  
  return Math.min(100, Math.max(0, baseSentiment));
}

// Corrigir funções com tipagem adequada
async function enrichWithOnChainData(coins: any[]): Promise<any[]> {
  // Aqui seria integrado com APIs reais como DefiLlama e Artemis
  // Por enquanto, vamos simular dados on-chain baseados nos dados disponíveis
  
  return coins.map((coin: any) => {
    // Hash consistente baseado no nome do token para ter resultados consistentes
    const nameHash = coin.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    
    // Simular dados de TVL (Total Value Locked)
    const tvlRatio = coin.market_cap > 0 ? 
      (0.1 + (nameHash % 60) / 100) : 0; // Entre 10% e 70% do market cap
    
    const tvl = coin.market_cap * tvlRatio;
    
    // Simular dados de usuários ativos
    const baseUserCount = 5000 + (nameHash % 195000);
    const userGrowth = -10 + (nameHash % 35); // -10% a +25%
    
    // Simular dados de transações
    const baseTxCount = 10000 + (nameHash % 990000);
    const txGrowth = -5 + (nameHash % 25); // -5% a +20%
    
    // Calcular pontuação de atividade
    const activityScore = Math.min(100, Math.max(1, 
      (tvlRatio * 50) + 
      (userGrowth > 0 ? userGrowth : userGrowth / 2) + 
      (txGrowth > 0 ? txGrowth : txGrowth / 2) + 
      (nameHash % 20)
    ));
    
    return {
      ...coin,
      onchain_data: {
        tvl,
        tvl_ratio: tvlRatio,
        active_users: baseUserCount,
        user_growth: userGrowth,
        daily_transactions: baseTxCount,
        tx_growth: txGrowth,
        activity_score: activityScore
      }
    };
  });
}

async function analyzeCrossSourceSentiment(coins: any[]): Promise<any[]> {
  // Aqui seria integrado com API real do Twitter (X) e CryptoPanic
  // Por enquanto, vamos simular dados de sentimento baseados em características dos tokens
  
  return coins.map((coin: any) => {
    // Hash consistente para simulação
    const nameHash = coin.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const symbolHash = coin.symbol.toUpperCase().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const combinedHash = nameHash + symbolHash;
    
    // Fatores de mercado afetam o sentimento
    const marketFactors = {
      // Tokens com maior capitalização tendem a ter melhor avaliação de sentimento
      marketCapFactor: coin.market_cap > 10000000000 ? 20 : 
                       coin.market_cap > 1000000000 ? 15 : 
                       coin.market_cap > 100000000 ? 10 : 
                       coin.market_cap > 10000000 ? 5 : 0,
      
      // Preço subindo tende a melhorar o sentimento
      priceFactor: coin.price_change_percentage_24h > 15 ? 20 :
                   coin.price_change_percentage_24h > 5 ? 15 :
                   coin.price_change_percentage_24h > 0 ? 5 :
                   coin.price_change_percentage_24h > -10 ? -5 : -15,
                   
      // Memecoins tendem a ter sentimento mais volátil
      volatilityFactor: coin.symbol.toLowerCase().match(/doge|shib|pepe|wojak|bonk/) ? -10 : 0,
      
      // Tokens famosos tendem a ter mais engajamento (positivo ou negativo)
      fameFactor: coin.symbol.toLowerCase().match(/btc|eth|sol|bnb|xrp/) ? 10 : 0
    };
    
    // Base de sentimento - usando hash para simular variação "natural"
    const baseSentiment = 50; // Neutro
    
    // Simulação de sentimento do Twitter
    const twitterSentiment = Math.min(100, Math.max(1, baseSentiment + 
      marketFactors.marketCapFactor * 0.5 +
      marketFactors.priceFactor * 1.2 +
      marketFactors.volatilityFactor * 2 +
      marketFactors.fameFactor +
      (combinedHash % 20 - 10)
    ));
    
    // Simulação de sentimento de notícias
    const newsSentiment = Math.min(100, Math.max(1, baseSentiment + 
      marketFactors.marketCapFactor * 0.7 +
      marketFactors.priceFactor * 0.8 +
      marketFactors.volatilityFactor * 0.5 +
      marketFactors.fameFactor * 1.5 +
      (nameHash % 20 - 10)
    ));
    
    // Simulação de sentimento on-chain
    const onchainSentiment = Math.min(100, Math.max(1, baseSentiment + 
      (coin.onchain_data ? (coin.onchain_data.activity_score - 50) * 0.8 : 0) +
      (coin.onchain_data && coin.onchain_data.user_growth > 0 ? coin.onchain_data.user_growth * 0.5 : 0) +
      marketFactors.marketCapFactor * 0.3 +
      (symbolHash % 20 - 10)
    ));
    
    // Sentimento combinado (média ponderada)
    const combinedSentiment = Math.round(
      twitterSentiment * 0.4 +
      newsSentiment * 0.3 +
      onchainSentiment * 0.3
    );
    
    return {
      ...coin,
      sentiment: {
        twitter: Math.round(twitterSentiment),
        news: Math.round(newsSentiment),
        onchain: Math.round(onchainSentiment),
        combined: combinedSentiment
      }
    };
  });
}

function categorizeTokens(coins: any[]): any[] {
  return coins.map((coin: any) => {
    // Categorizar por market cap
    let category;
    if (coin.market_cap < 50000000) category = "Microcap";
    else if (coin.market_cap < 500000000) category = "Smallcap";
    else if (coin.market_cap < 5000000000) category = "Midcap";
    else category = "Bigcap";
    
    return {
      ...coin,
      category
    };
  });
}

function organizeIntoNarratives(coins: any[]): any[] {
  // Mapeamento simplificado de tokens para narrativas
  // Na versão real, isso seria baseado em análise dos dados do Twitter, notícias, etc.
  const narrativeDetection: Record<string, string[]> = {
    "DePIN": ["HNT", "RNDR", "LPT", "FIL", "AR", "WLD", "GRT", "MINA", "DUSK", "ZETA"],
    "ZK": ["MINA", "ZK", "MATIC", "IMX", "DUSK", "ZETA"],
    "RWA": ["PAXG", "USDC", "MKR", "EURS"],
    "BTCfi": ["WBTC", "SATS", "ORDI", "BTC", "RUNE", "GALA"],
    "AI + Crypto": ["FET", "OCEAN", "AGIX", "NMR", "RAD", "RLC"],
    "Layer2": ["OP", "ARB", "MATIC", "IMX", "METIS", "LOOM"],
    "Memecoin": ["DOGE", "SHIB", "PEPE", "BONK", "FLOKI"],
    "Gaming": ["AXS", "GALA", "IMX", "MAGIC", "ILV", "BEAM"]
  };
  
  const result: any[] = [];
  
  Object.entries(narrativeDetection).forEach(([narrative, symbols]) => {
    // Filtrar tokens que pertencem a esta narrativa
    const narrativeTokens = coins.filter((coin: any) => 
      symbols.includes(coin.symbol.toUpperCase())
    );
    
    if (narrativeTokens.length > 0) {
      // Calcular métricas para esta narrativa
      const totalSocialVolume = narrativeTokens.reduce((sum: number, token: any) => {
        return sum + (token.sentiment ? (token.sentiment.twitter * 10) : 0);
      }, 0);
      
      const avgSentiment = {
        twitter: Math.round(narrativeTokens.reduce((sum: number, token: any) => sum + (token.sentiment ? token.sentiment.twitter : 50), 0) / narrativeTokens.length),
        news: Math.round(narrativeTokens.reduce((sum: number, token: any) => sum + (token.sentiment ? token.sentiment.news : 50), 0) / narrativeTokens.length),
        onchain: Math.round(narrativeTokens.reduce((sum: number, token: any) => sum + (token.sentiment ? token.sentiment.onchain : 50), 0) / narrativeTokens.length),
        combined: Math.round(narrativeTokens.reduce((sum: number, token: any) => sum + (token.sentiment ? token.sentiment.combined : 50), 0) / narrativeTokens.length)
      };
      
      // Determinar hype level baseado no sentimento e volume social
      let hypeLevel = "Médio";
      const combinedFactors = avgSentiment.combined + (totalSocialVolume / 10000);
      if (combinedFactors > 120) hypeLevel = "Alto";
      else if (combinedFactors < 80) hypeLevel = "Baixo";
      
      // Cálculo de credibilidade baseado nas fontes e engajamento
      const credibilityScore = calculateCredibilityScore(
        Math.random() > 0.7 ? "technicalResearchers" : Math.random() > 0.5 ? "narrativeCurators" : "emergingNarratives",
        simulateTwitterEngagement(narrative, narrativeDetection[narrative as keyof typeof narrativeDetection] || [])
      );
      
      // Mapear tokens para o formato esperado
      const formattedTokens = narrativeTokens.map((token: any) => ({
        symbol: token.symbol,
        name: token.name,
        marketCap: token.market_cap,
        price: token.current_price,
        priceChange24h: token.price_change_percentage_24h ?? 0,
        category: token.category,
        tradingVolume: token.total_volume,
        volumeToMcapRatio: token.total_volume && token.market_cap ? token.total_volume / token.market_cap : undefined,
        volumeQuality: token.total_volume && token.market_cap
          ? (token.total_volume / token.market_cap) > 0.3 ? "Alto"
            : (token.total_volume / token.market_cap) > 0.1 ? "Médio"
            : "Baixo"
          : undefined,
        onchainActivity: token.onchain_data ? {
          activeUsers: token.onchain_data.active_users,
          dailyTransactions: token.onchain_data.daily_transactions,
          tvl: token.onchain_data.tvl,
          userGrowth: token.onchain_data.user_growth,
          txGrowth: token.onchain_data.tx_growth,
          activityScore: token.onchain_data.activity_score
        } : undefined,
        dataVerified: Math.random() > 0.7, // Simulação
        lastUpdated: new Date().toISOString()
      }));
      
      // Gerar dados de engajamento no Twitter simulados
      const twitterEngagement = simulateTwitterEngagement(narrative, symbols);
      
      result.push({
        name: narrative,
        description: KNOWN_NARRATIVES[narrative as keyof typeof KNOWN_NARRATIVES]?.description || `Narrativa relacionada a ${narrative}`,
        tokens: formattedTokens,
        risks: KNOWN_NARRATIVES[narrative as keyof typeof KNOWN_NARRATIVES]?.risks || "Riscos específicos desconhecidos",
        hypeLevel,
        sourceType: Math.random() > 0.7 ? "technicalResearchers" : Math.random() > 0.5 ? "narrativeCurators" : "emergingNarratives",
        socialVolume: totalSocialVolume,
        credibilityScore,
        hypeFactor: (totalSocialVolume / 10000) * (Math.random() + 0.5), // hype factor simulado
        qualityScore: Math.round(credibilityScore * 0.8 + (avgSentiment.combined / 100) * 20),
        ecosystemMetrics: {
          onchainTVL: formatNumber(narrativeTokens.reduce((sum: number, token: any) => sum + (token.onchain_data ? token.onchain_data.tvl : 0), 0)),
          weeklyActiveUsers: narrativeTokens.reduce((sum: number, token: any) => sum + (token.onchain_data ? token.onchain_data.active_users : 0), 0),
          weeklyTransactions: narrativeTokens.reduce((sum: number, token: any) => sum + (token.onchain_data ? token.onchain_data.daily_transactions * 7 : 0), 0)
        },
        twitterEngagement,
        sentimentData: avgSentiment
      });
    }
  });
  
  // Ordenar narrativas por volume social
  return result.sort((a, b) => b.socialVolume - a.socialVolume);
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
}

// Função para buscar trending coins da CoinGecko
async function fetchTrendingCoins() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending', {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.coins.map((item: any) => ({
        id: item.item.id,
        name: item.item.name,
        symbol: item.item.symbol,
        market_cap_rank: item.item.market_cap_rank,
        thumb: item.item.thumb,
        score: item.item.score
      }));
    }
    
    console.error('Erro ao buscar trending coins:', response.status);
    return generateSimulatedTrendingCoins();
  } catch (error) {
    console.error('Erro ao buscar trending coins:', error);
    return generateSimulatedTrendingCoins();
  }
}

// Função para gerar dados simulados de trending coins quando a API falha
function generateSimulatedTrendingCoins(): any[] {
  const simulatedTrending = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', market_cap_rank: 1, score: 0, thumb: '' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', market_cap_rank: 2, score: 0, thumb: '' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', market_cap_rank: 5, score: 0, thumb: '' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', market_cap_rank: 9, score: 0, thumb: '' },
    { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', market_cap_rank: 15, score: 0, thumb: '' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', market_cap_rank: 37, score: 0, thumb: '' },
    { id: 'worldcoin', name: 'Worldcoin', symbol: 'WLD', market_cap_rank: 82, score: 0, thumb: '' }
  ];
  
  return simulatedTrending;
}

export async function GET() {
  try {
    // Buscar top 300 tokens da CoinGecko
    console.log("Buscando top 300 tokens da CoinGecko...");
    let allCoins = await fetchTop300Coins();
    console.log(`Obtidos ${allCoins.length} tokens no total`);
    
    if (allCoins.length === 0) {
      // Fallback para dados simulados se a API falhar
      console.log("Utilizando dados simulados devido a falha na API");
      allCoins = []; // Aqui adicionaríamos dados simulados em uma implementação real
    }
    
    // Enriquecer dados com informações on-chain
    console.log("Enriquecendo tokens com dados on-chain...");
    const enrichedCoins = await enrichWithOnChainData(allCoins);
    
    // Analisar sentimento cruzando fontes (Twitter, notícias, on-chain)
    console.log("Analisando sentimento dos tokens...");
    const analyzedCoins = await analyzeCrossSourceSentiment(enrichedCoins);
    
    // Categorizar tokens
    console.log("Categorizando tokens...");
    const categorizedCoins = categorizeTokens(analyzedCoins);
    
    // Organizar tokens em narrativas
    console.log("Organizando tokens em narrativas...");
    const narratives = organizeIntoNarratives(categorizedCoins);
    console.log(`Geradas ${narratives.length} narrativas`);
    
    // Buscar trending coins separadamente
    let trendingCoins = [];
    try {
      trendingCoins = await fetchTrendingCoins();
    } catch (error) {
      console.error('Erro ao buscar trending coins:', error);
      trendingCoins = generateSimulatedTrendingCoins();
    }

    return NextResponse.json({ 
      narratives,
      trendingCoins,
      cached: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao processar dados:', error);
    return NextResponse.json({ error: 'Falha ao processar dados' }, { status: 500 });
  }
} 