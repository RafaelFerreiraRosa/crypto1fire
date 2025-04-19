import { NextRequest, NextResponse } from 'next/server';
import { 
  saveTweet, 
  getLatestTweets, 
  MONITORED_ACCOUNTS, 
  OnChainTweet 
} from '@/lib/services/chainTweetsDB';

// Dados de exemplo para simular tweets com métricas on-chain
const sampleTweets: OnChainTweet[] = [
  {
    id: "tweet-1",
    protocolo: "EigenLayer",
    blockchain: "Ethereum",
    metrica_onchain: "TVL ultrapassou 15B de dólares, crescimento de 25% no último mês",
    narrativa: ["Restaking", "Liquid Staking"],
    sentimento: "bullish",
    autor: "@MessariCrypto",
    data: new Date().toISOString(),
    engajamento: {
      likes: 3208,
      retweets: 412,
      comentarios: 127
    },
    fonte: "https://twitter.com/MessariCrypto/status/1234567890",
    texto: "EigenLayer continues to dominate the restaking narrative with TVL now exceeding $15B. That's a 25% increase in the last month alone. Restaking is becoming a pivotal part of Ethereum's ecosystem growth. $ETH"
  },
  {
    id: "tweet-2",
    protocolo: "Uniswap",
    blockchain: "Ethereum",
    metrica_onchain: "Volume de negociação de 2.5B nas últimas 24h, maior pico desde março",
    narrativa: ["DEX", "DeFi"],
    sentimento: "bullish",
    autor: "@DefiLlama",
    data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 1859,
      retweets: 312,
      comentarios: 87
    },
    fonte: "https://twitter.com/DefiLlama/status/1234567891",
    texto: "Uniswap just recorded $2.5B in trading volume over the last 24h. This is the highest we've seen since March. DEX activity is heating up as market volatility increases. $UNI"
  },
  {
    id: "tweet-3",
    protocolo: "Solana",
    blockchain: "Solana",
    metrica_onchain: "Transações diárias ultrapassaram 100M pela primeira vez",
    narrativa: ["Layer 1", "Alta Performance"],
    sentimento: "bullish",
    autor: "@santimentfeed",
    data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 2417,
      retweets: 531,
      comentarios: 163
    },
    fonte: "https://twitter.com/santimentfeed/status/1234567892",
    texto: "Solana has just hit a major milestone with daily transactions exceeding 100M for the first time in its history. The network is showing impressive growth in activity and adoption metrics. $SOL"
  },
  {
    id: "tweet-4",
    protocolo: "Arbitrum",
    blockchain: "Arbitrum",
    metrica_onchain: "TVL caiu 18% nas últimas duas semanas, perdendo market share para concorrentes",
    narrativa: ["Layer 2", "Rollups"],
    sentimento: "bearish",
    autor: "@DeFiDailyData",
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 1123,
      retweets: 246,
      comentarios: 95
    },
    fonte: "https://twitter.com/DeFiDailyData/status/1234567893",
    texto: "Arbitrum TVL has declined by 18% in the past two weeks, representing a significant loss of market share among L2s. Competition from other rollups like Base and Optimism is intensifying. $ARB holders should monitor this trend."
  },
  {
    id: "tweet-5",
    protocolo: "Bitcoin",
    blockchain: "Bitcoin",
    metrica_onchain: "Endereços ativos diários acima de 1M por 30 dias consecutivos",
    narrativa: ["DeFi", "Layers"],
    sentimento: "bullish",
    autor: "@glassnode",
    data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 3561,
      retweets: 824,
      comentarios: 217
    },
    fonte: "https://twitter.com/glassnode/status/1234567894",
    texto: "Bitcoin daily active addresses have remained above 1M for 30 consecutive days. This level of consistent on-chain activity was last seen during the 2021 bull market. Strong indication of growing network usage. $BTC"
  },
  {
    id: "tweet-6",
    protocolo: "Lido",
    blockchain: "Ethereum",
    metrica_onchain: "Stake ratio atinge 40% do ETH staking total, dominância crescente",
    narrativa: ["Liquid Staking", "ETH 2.0"],
    sentimento: "bullish",
    autor: "@lookonchain",
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 1876,
      retweets: 342,
      comentarios: 109
    },
    fonte: "https://twitter.com/lookonchain/status/1234567895",
    texto: "Lido's dominance in ETH staking continues to grow, now representing 40% of all staked ETH. The protocol has added over 500k ETH in the past month. Liquid staking remains one of the strongest narratives in the ecosystem. $LDO $ETH"
  },
  {
    id: "tweet-7",
    protocolo: "MakerDAO",
    blockchain: "Ethereum",
    metrica_onchain: "Receita anualizada de 87M, retorno crescendo 15% MoM",
    narrativa: ["DeFi", "Stablecoins"],
    sentimento: "bullish",
    autor: "@TokenTerminal",
    data: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 1432,
      retweets: 213,
      comentarios: 64
    },
    fonte: "https://twitter.com/TokenTerminal/status/1234567896",
    texto: "MakerDAO's annualized revenue has hit $87M, with month-over-month growth of 15%. The protocol is showing strong profitability metrics and DAI demand is rising. One of the few profitable DeFi protocols with consistent growth. $MKR"
  },
  {
    id: "tweet-8",
    protocolo: "Aave",
    blockchain: "Ethereum",
    metrica_onchain: "Empréstimos totais caíram 30% após aumento das taxas de juros",
    narrativa: ["DeFi", "Lending"],
    sentimento: "bearish",
    autor: "@DeFiMoon",
    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 987,
      retweets: 176,
      comentarios: 89
    },
    fonte: "https://twitter.com/DeFiMoon/status/1234567897",
    texto: "Aave has seen a 30% drop in total borrows following the recent interest rate hikes. The lending market is cooling off significantly as users seek alternatives or exit leveraged positions. This could impact protocol revenues in the short term. $AAVE"
  },
  {
    id: "tweet-9",
    protocolo: "Base",
    blockchain: "Base",
    metrica_onchain: "Número de contratos implantados ultrapassou 50k, +120% desde junho",
    narrativa: ["Layer 2", "Coinbase Ecosystem"],
    sentimento: "bullish",
    autor: "@OnChainWizard",
    data: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 2241,
      retweets: 413,
      comentarios: 146
    },
    fonte: "https://twitter.com/OnChainWizard/status/1234567898",
    texto: "Base has now surpassed 50,000 deployed contracts, representing 120% growth since June. Developer activity on the Coinbase L2 is accelerating rapidly. This is an impressive growth trajectory for a relatively new L2."
  },
  {
    id: "tweet-10",
    protocolo: "Sui",
    blockchain: "Sui",
    metrica_onchain: "Endereços ativos diários em queda de 40% no último mês",
    narrativa: ["Layer 1", "Move Ecosystem"],
    sentimento: "bearish",
    autor: "@intotheblock",
    data: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    engajamento: {
      likes: 1354,
      retweets: 287,
      comentarios: 118
    },
    fonte: "https://twitter.com/intotheblock/status/1234567899",
    texto: "Sui daily active addresses have dropped by 40% over the past month. On-chain activity is showing a concerning downtrend after the initial hype has subsided. The network needs to attract more sustainable use cases. $SUI"
  }
];

// Adicionar interface para insights de mercado baseados em dados on-chain
export interface OnChainInsight {
  id: string;
  title: string;
  description: string;
  protocolos: string[];
  blockchains: string[];
  narrativas: string[];
  indicadores: {
    nome: string;
    valor: string;
    tendencia: 'up' | 'down' | 'neutral';
    timeframe: '24h' | '7d' | '30d' | '90d';
  }[];
  sentimento: 'bullish' | 'bearish' | 'neutro';
  confianca: 'alta' | 'media' | 'baixa';
  fonte: string[];
  timestamp: string;
}

// Insights de exemplo baseados em métricas on-chain
const sampleInsights: OnChainInsight[] = [
  {
    id: "insight-1",
    title: "EigenLayer TVL quebra 15B, sinalizando crescimento acelerado no setor de restaking",
    description: "O aumento de 25% no TVL do EigenLayer no último mês supera significativamente o crescimento médio do mercado de 8%. Essa métrica on-chain sinaliza uma mudança no comportamento dos investidores institucionais, que estão alocando mais ETH para protocolos de restaking em busca de rendimentos adicionais.",
    protocolos: ["EigenLayer", "Lido"],
    blockchains: ["Ethereum"],
    narrativas: ["Restaking", "Liquid Staking"],
    indicadores: [
      {
        nome: "Total Value Locked (TVL)",
        valor: "$15.2B",
        tendencia: "up",
        timeframe: "30d"
      },
      {
        nome: "Crescimento mensal",
        valor: "+25%",
        tendencia: "up",
        timeframe: "30d"
      },
      {
        nome: "Market Share no ecossistema ETH",
        valor: "8.4%",
        tendencia: "up",
        timeframe: "30d"
      }
    ],
    sentimento: "bullish",
    confianca: "alta",
    fonte: ["@MessariCrypto", "@DefiLlama"],
    timestamp: new Date().toISOString()
  },
  {
    id: "insight-2",
    title: "Base L2 ultrapassou Arbitrum em contratos implantados, sinalizando mudança no ecossistema L2",
    description: "O número de contratos implantados na Base cresceu 120% desde junho, agora superando Arbitrum nessa métrica, embora ainda esteja atrás em TVL. Isso sugere que desenvolvedores estão migrando para o ecossistema da Base, potencialmente devido à sua conexão com a Coinbase e menores custos de transação.",
    protocolos: ["Base", "Arbitrum"],
    blockchains: ["Base", "Arbitrum"],
    narrativas: ["Layer 2", "Coinbase Ecosystem"],
    indicadores: [
      {
        nome: "Contratos Implantados",
        valor: "50,000+",
        tendencia: "up",
        timeframe: "90d"
      },
      {
        nome: "Crescimento de Contratos",
        valor: "+120%",
        tendencia: "up",
        timeframe: "90d"
      },
      {
        nome: "TVL Comparativo",
        valor: "45% do Arbitrum",
        tendencia: "up",
        timeframe: "30d"
      }
    ],
    sentimento: "bullish",
    confianca: "media",
    fonte: ["@OnChainWizard", "@DeFiDailyData"],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "insight-3",
    title: "Endereços ativos do Bitcoin mantêm-se acima de 1M por 30 dias, replicando padrão do ciclo de 2021",
    description: "A atividade on-chain do Bitcoin mostra sinais de força sustentada, com endereços ativos diários permanecendo acima de 1 milhão por 30 dias consecutivos. Este padrão foi observado pela última vez durante o mercado de alta de 2021, sugerindo um crescimento orgânico e adoção contínua da rede.",
    protocolos: ["Bitcoin"],
    blockchains: ["Bitcoin"],
    narrativas: ["Bitcoin Adoption", "Halving Cycle"],
    indicadores: [
      {
        nome: "Endereços Ativos Diários",
        valor: "1.08M",
        tendencia: "up",
        timeframe: "30d"
      },
      {
        nome: "Volume de Transações",
        valor: "$12.4B (média diária)",
        tendencia: "up",
        timeframe: "30d"
      },
      {
        nome: "Tráfego de Exchange",
        valor: "-5% (saída líquida)",
        tendencia: "down",
        timeframe: "7d"
      }
    ],
    sentimento: "bullish",
    confianca: "alta",
    fonte: ["@glassnode", "@woonomic", "@ki_young_ju"],
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "insight-4",
    title: "Declínio de 18% no TVL do Arbitrum sinaliza potencial perda de momentum para L2s concorrentes",
    description: "Os dados on-chain revelam uma queda de 18% no TVL do Arbitrum nas últimas duas semanas, coincidindo com ganhos em outras L2s como Base e Optimism. Esta transferência de capital sugere uma possível redistribuição no ecossistema L2, com desenvolvedores e usuários buscando oportunidades em cadeias alternativas.",
    protocolos: ["Arbitrum", "Base", "Optimism"],
    blockchains: ["Arbitrum", "Ethereum"],
    narrativas: ["Layer 2", "Rollups"],
    indicadores: [
      {
        nome: "TVL",
        valor: "$5.8B (-18%)",
        tendencia: "down",
        timeframe: "7d"
      },
      {
        nome: "Market Share entre L2s",
        valor: "42% (-6% desde o mês passado)",
        tendencia: "down",
        timeframe: "30d"
      },
      {
        nome: "Transações Diárias",
        valor: "1.2M (-8%)",
        tendencia: "down",
        timeframe: "7d"
      }
    ],
    sentimento: "bearish",
    confianca: "media",
    fonte: ["@DeFiLlama", "@TokenTerminal"],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "insight-5",
    title: "100M de transações diárias em Solana demonstra escalabilidade superior entre blockchains L1",
    description: "Solana atingiu a marca histórica de 100 milhões de transações diárias, superando significativamente outras blockchains L1. Este crescimento exponencial em atividade on-chain, combinado com baixas taxas, sugere que Solana está ganhando tração como infraestrutura preferida para aplicações de alta frequência de transações, incluindo DeFi e gaming.",
    protocolos: ["Solana"],
    blockchains: ["Solana"],
    narrativas: ["Layer 1", "Alta Performance", "Scalability"],
    indicadores: [
      {
        nome: "Transações Diárias",
        valor: "100M+",
        tendencia: "up",
        timeframe: "30d"
      },
      {
        nome: "Tempo Médio de Bloco",
        valor: "400ms",
        tendencia: "neutral",
        timeframe: "30d"
      },
      {
        nome: "Custo Médio por Transação",
        valor: "$0.00025",
        tendencia: "neutral",
        timeframe: "30d"
      }
    ],
    sentimento: "bullish",
    confianca: "alta",
    fonte: ["@santimentfeed", "@DefiLlama"],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // Verifica se é uma solicitação para atualizar os dados
    const searchParams = request.nextUrl.searchParams;
    const refresh = searchParams.get('refresh') === 'true';
    
    // Get recent tweets from database
    const latestTweets = await getLatestTweets(20);
    
    // Se temos tweets recentes e não é uma solicitação de atualização, retorna eles
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    if (latestTweets.length > 0 && !refresh && new Date(latestTweets[0].data) > oneHourAgo) {
      return NextResponse.json({
        tweets: latestTweets,
        insights: sampleInsights,
        monitored_accounts: MONITORED_ACCOUNTS,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Em um ambiente real, faríamos chamadas à API do Twitter aqui
    // e processaríamos os tweets para extrair métricas on-chain
    // Para este exemplo, usamos dados de amostra
    const saveTweetPromises = sampleTweets.map(async (tweet) => {
      // Adiciona um timestamp atual aos dados de exemplo para simular dados novos
      const tweetWithCurrentTimestamp = {
        ...tweet,
        data: refresh 
          ? new Date().toISOString() 
          : tweet.data // mantém a data original se não for refresh
      };
      
      // Salva no banco de dados
      return await saveTweet(tweetWithCurrentTimestamp);
    });
    
    // Aguarda todas as operações de salvar concluírem
    const savedTweets = await Promise.all(saveTweetPromises);
    
    // Atualiza timestamps dos insights para simular novos dados
    const updatedInsights = refresh 
      ? sampleInsights.map(insight => ({
          ...insight,
          timestamp: new Date().toISOString()
        }))
      : sampleInsights;
    
    return NextResponse.json({
      tweets: savedTweets,
      insights: updatedInsights,
      monitored_accounts: MONITORED_ACCOUNTS,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing ChainX request:', error);
    return NextResponse.json(
      { error: 'Failed to process on-chain tweet data' },
      { status: 500 }
    );
  }
}

// Endpoint para futura implementação de análise de tweets específicos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verifica se o corpo contém um URL de tweet para análise
    if (!body.tweet_url) {
      return NextResponse.json(
        { error: 'No tweet URL provided' },
        { status: 400 }
      );
    }
    
    // Aqui, em um ambiente real, faríamos o scraping do tweet
    // e processaríamos para extrair métricas on-chain
    // Para este exemplo, retornamos uma análise fictícia
    
    const mockAnalysis: OnChainTweet = {
      id: `tweet-${Date.now()}`,
      protocolo: "EigenLayer",
      blockchain: "Ethereum",
      metrica_onchain: "TVL ultrapassou 15B de dólares, crescimento de 25% no último mês",
      narrativa: ["Restaking", "Liquid Staking"],
      sentimento: "bullish",
      autor: "@UserSubmitted",
      data: new Date().toISOString(),
      engajamento: {
        likes: 0,
        retweets: 0,
        comentarios: 0
      },
      fonte: body.tweet_url,
      texto: "This is a placeholder analysis of the submitted tweet URL."
    };
    
    // Salva no banco de dados
    const savedAnalysis = await saveTweet(mockAnalysis);
    
    return NextResponse.json({
      analysis: savedAnalysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing ChainX POST request:', error);
    return NextResponse.json(
      { error: 'Failed to analyze submitted tweet' },
      { status: 500 }
    );
  }
} 