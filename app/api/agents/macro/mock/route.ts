import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Data de exemplo para demonstração do agente Macro
  const mockResponse = {
    narratives: [
      {
        name: "DeFi Summer 2.0",
        occurrences: 17,
        sources: {
          twitter: true,
          news: true,
          youtube: true,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "bullish",
          youtube: "bullish",
          onchain: "bullish",
          overall: "bullish"
        },
        strength: "growing",
        description: "A revitalização do setor DeFi, com novos protocolos inovadores e aumento de TVL em várias chains."
      },
      {
        name: "Bitcoin halving",
        occurrences: 14,
        sources: {
          twitter: true,
          news: true,
          youtube: true,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "neutral",
          youtube: "bullish",
          onchain: "bullish",
          overall: "bullish"
        },
        strength: "established",
        description: "O efeito do halving de abril de 2024 na oferta e demanda de Bitcoin, com implicações para todo o mercado."
      },
      {
        name: "Layer 2 Expansion",
        occurrences: 12,
        sources: {
          twitter: true,
          news: true,
          youtube: false,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "bullish",
          onchain: "bullish",
          overall: "bullish"
        },
        strength: "growing",
        description: "Crescimento acelerado de soluções Layer 2 com aumento de adoção por usuários e desenvolvedores."
      },
      {
        name: "NFT Revival",
        occurrences: 9,
        sources: {
          twitter: true,
          news: false,
          youtube: true,
          onchain: false
        },
        sentiment: {
          twitter: "mixed",
          youtube: "positive",
          overall: "neutral"
        },
        strength: "emerging",
        description: "Sinais de recuperação no mercado de NFTs, especialmente em coleções de alta qualidade e tokens com utilidade."
      },
      {
        name: "Institutional Adoption",
        occurrences: 7,
        sources: {
          twitter: false,
          news: true,
          youtube: true,
          onchain: false
        },
        sentiment: {
          news: "positive",
          youtube: "bullish",
          overall: "bullish"
        },
        strength: "established",
        description: "Crescente adoção de Bitcoin e Ethereum por instituições financeiras tradicionais e empresas."
      },
      {
        name: "Restaking",
        occurrences: 15,
        sources: {
          twitter: true,
          news: false,
          youtube: true,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          youtube: "bullish",
          onchain: "bullish",
          overall: "bullish"
        },
        strength: "growing",
        description: "Protocolos de restaking como EigenLayer estão vendo crescimento acelerado em TVL e adoção."
      }
    ],
    tokens: [
      {
        symbol: "BTC",
        occurrences: 28,
        sources: {
          twitter: true,
          news: true,
          youtube: true,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "bullish",
          youtube: "bullish",
          onchain: "bullish",
          overall: "bullish"
        }
      },
      {
        symbol: "ETH",
        occurrences: 22,
        sources: {
          twitter: true,
          news: true,
          youtube: true,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "positive",
          youtube: "mixed",
          onchain: "bullish",
          overall: "positive"
        }
      },
      {
        symbol: "SOL",
        occurrences: 15,
        sources: {
          twitter: true,
          news: true,
          youtube: true,
          onchain: true
        },
        sentiment: {
          twitter: "mixed",
          news: "positive",
          youtube: "positive",
          onchain: "bullish",
          overall: "positive"
        }
      },
      {
        symbol: "ARB",
        occurrences: 12,
        sources: {
          twitter: true,
          news: true,
          youtube: false,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "neutral",
          onchain: "bearish",
          overall: "neutral"
        }
      },
      {
        symbol: "DOGE",
        occurrences: 10,
        sources: {
          twitter: true,
          news: false,
          youtube: true,
          onchain: false
        },
        sentiment: {
          twitter: "mixed",
          youtube: "negative",
          overall: "neutral"
        }
      },
      {
        symbol: "UNI",
        occurrences: 8,
        sources: {
          twitter: true,
          news: true,
          youtube: false,
          onchain: true
        },
        sentiment: {
          twitter: "positive",
          news: "positive",
          onchain: "bullish",
          overall: "positive"
        }
      }
    ],
    insights: [
      {
        title: "DeFi Summer 2.0 is the Dominant Narrative",
        description: "Este narrativa aparece em todas as 4 fontes com 17 menções. A revitalização do setor DeFi, com novos protocolos inovadores e aumento de TVL em várias chains.",
        narratives: ["DeFi Summer 2.0"],
        tokens: ["UNI", "AAVE", "CRV"],
        sentiment: "bullish",
        timeframe: "medium",
        conviction: "medium"
      },
      {
        title: "BTC Shows Strong Positive Sentiment",
        description: "Bitcoin tem sentimento positivo em múltiplas fontes com 28 menções, impulsionado pelo ciclo de halving e adoção institucional.",
        narratives: ["Bitcoin halving", "Institutional Adoption"],
        tokens: ["BTC"],
        sentiment: "bullish",
        timeframe: "medium",
        conviction: "high"
      },
      {
        title: "Layer 2 is an Emerging Trend",
        description: "A narrativa de expansão Layer 2 está ganhando força em múltiplas plataformas e pode apresentar oportunidades futuras para investidores.",
        narratives: ["Layer 2 Expansion"],
        tokens: ["ARB", "OP"],
        sentiment: "neutral",
        timeframe: "long",
        conviction: "medium"
      },
      {
        title: "Strategy Opportunity Identified",
        description: "Múltiplos analistas estão destacando oportunidades em estratégias de acumulação de Bitcoin pré-halving combinada com posições em L2s.",
        narratives: ["Bitcoin halving", "Layer 2 Expansion"],
        tokens: ["BTC", "ARB"],
        sentiment: "bullish",
        timeframe: "medium",
        conviction: "medium"
      },
      {
        title: "Restaking Growth from On-Chain Data",
        description: "Os dados on-chain mostram um crescimento significativo de 25% no TVL do EigenLayer, sugerindo o fortalecimento da narrativa de restaking.",
        narratives: ["Restaking"],
        tokens: ["ETH"],
        sentiment: "bullish",
        timeframe: "medium",
        conviction: "high"
      }
    ],
    marketSentiment: "bullish",
    timestamp: new Date().toISOString(),
    sources: {
      twitter: {
        available: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      news: {
        available: true,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      youtube: {
        available: true,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      onchain: {
        available: true,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    }
  };

  return NextResponse.json(mockResponse);
} 