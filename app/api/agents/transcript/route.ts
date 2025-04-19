import { NextRequest, NextResponse } from 'next/server';
import { 
  saveTranscriptAnalysis, 
  getLatestTranscriptAnalyses, 
  VIDEO_SOURCES, 
  VideoTranscriptAnalysis 
} from '@/lib/services/macroVideoTranscriptDB';

// Sample transcript analysis for demonstration
const sampleAnalyses: VideoTranscriptAnalysis[] = [
  {
    videoId: "sample-video-1",
    videoTitle: "Bitcoin's Next Move: The Macro Picture Explained",
    channelName: "Benjamin Cowen",
    channelUrl: "https://www.youtube.com/c/IntoTheCryptoverse",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    analyzedAt: new Date().toISOString(),
    
    sentiment: {
      overall: "bullish",
      strength: "moderate",
      description: "The analyst maintains a cautiously optimistic outlook based on improving macro conditions and strong on-chain metrics, though acknowledges short-term uncertainty."
    },
    
    narratives: [
      {
        name: "Bitcoin as Digital Gold",
        description: "Bitcoin's role as a store of value is strengthening as inflation concerns persist and traditional markets show volatility.",
        strength: "established",
        timeframe: "long"
      },
      {
        name: "AI + Crypto",
        description: "The integration of AI with blockchain is creating new use cases and efficiency improvements across the crypto ecosystem.",
        strength: "growing",
        timeframe: "medium"
      },
      {
        name: "Real World Assets (RWA)",
        description: "Tokenization of real-world assets is gaining institutional interest and creating new market opportunities.",
        strength: "emerging",
        timeframe: "long"
      }
    ],
    
    mentionedTokens: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        sentiment: "positive",
        context: "Bitcoin remains in an accumulation phase with strong holder metrics and decreasing exchange reserves."
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        sentiment: "positive",
        context: "Ethereum's ecosystem continues to expand with growing developer activity and increasing staking rates."
      },
      {
        symbol: "SOL",
        name: "Solana",
        sentiment: "neutral",
        context: "Solana has recovered technically but needs to demonstrate more institutional adoption to confirm its long-term value proposition."
      }
    ],
    
    macroSignals: [
      {
        type: "monetary-policy",
        description: "The Federal Reserve is likely to begin cutting rates by Q3 2024, which historically benefits risk assets like cryptocurrencies.",
        impact: "high"
      },
      {
        type: "institutional",
        description: "ETF inflows have remained consistently positive, indicating sustained institutional interest despite market volatility.",
        impact: "medium"
      },
      {
        type: "adoption",
        description: "Corporate blockchain implementations are accelerating, particularly in supply chain and financial services sectors.",
        impact: "medium"
      }
    ],
    
    perceivedRisks: [
      {
        category: "regulatory",
        description: "Regulatory uncertainty in the US could create headwinds for crypto exchanges and DeFi protocols.",
        severity: "medium",
        timeframe: "medium"
      },
      {
        category: "market",
        description: "Correlation with traditional markets remains high, exposing crypto to broader economic downturns.",
        severity: "medium",
        timeframe: "short"
      }
    ],
    
    opportunities: [
      {
        type: "sector",
        description: "Layer 2 scaling solutions are positioned for growth as Ethereum transitions to a more modular architecture.",
        timeframe: "medium",
        conviction: "high"
      },
      {
        type: "token",
        description: "Bitcoin is showing strong accumulation patterns before the next halving event.",
        timeframe: "medium",
        conviction: "high"
      },
      {
        type: "narrative",
        description: "AI-powered DeFi protocols that enhance efficiency and risk management have significant growth potential.",
        timeframe: "long",
        conviction: "medium"
      }
    ],
    
    summary: "The analysis presents a moderately bullish outlook for crypto markets, primarily driven by improving monetary policy conditions, strong Bitcoin fundamentals ahead of the halving, and growing institutional adoption. Key narratives include Bitcoin as digital gold, AI integration in crypto, and real-world asset tokenization. While regulatory and market correlation risks persist, opportunities exist in Layer 2 solutions, Bitcoin accumulation, and AI-powered DeFi protocols. ETH and BTC receive positive sentiment, while SOL is viewed more neutrally pending further institutional adoption.",
    
    transcriptSnippets: [
      "What we're seeing in the on-chain data suggests a strong accumulation phase for Bitcoin, with long-term holders increasing their positions despite market volatility.",
      "The Federal Reserve has signaled a potential shift in monetary policy by Q3 2024, which historically has been a positive catalyst for risk assets, including cryptocurrencies.",
      "Layer 2 scaling solutions are addressing Ethereum's capacity limitations while maintaining security guarantees, positioning this sector for significant growth as adoption increases.",
      "Institutional interest remains strong, evidenced by consistent ETF inflows and increasing corporate blockchain implementations, particularly in supply chain and financial services."
    ]
  },
  {
    videoId: "sample-video-2",
    videoTitle: "Current Crypto Narratives: What's Working, What's Not",
    channelName: "Coin Bureau",
    channelUrl: "https://www.youtube.com/c/CoinBureau",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    analyzedAt: new Date().toISOString(),
    
    sentiment: {
      overall: "mixed",
      strength: "moderate",
      description: "The analysis shows significant sector-specific divergence, with some narratives flourishing while others struggle to maintain momentum."
    },
    
    narratives: [
      {
        name: "DePIN (Decentralized Physical Infrastructure)",
        description: "Networks building decentralized alternatives to traditional infrastructure are gaining traction with real-world utility.",
        strength: "growing",
        timeframe: "long"
      },
      {
        name: "Modular Blockchains",
        description: "The shift toward modular blockchain architecture is enabling greater specialization and scalability.",
        strength: "growing",
        timeframe: "medium"
      },
      {
        name: "Meme Coins",
        description: "Speculative interest in meme coins continues but with diminishing returns and increasing fragmentation.",
        strength: "fading",
        timeframe: "short"
      }
    ],
    
    mentionedTokens: [
      {
        symbol: "RNDR",
        name: "Render Network",
        sentiment: "positive",
        context: "Render Network is demonstrating genuine utility in decentralized GPU computing with growing usage metrics."
      },
      {
        symbol: "RON",
        name: "Ronin",
        sentiment: "positive",
        context: "Ronin's gaming ecosystem is showing strong user retention and transaction volume."
      },
      {
        symbol: "AVAX",
        name: "Avalanche",
        sentiment: "neutral",
        context: "Avalanche needs to differentiate its value proposition beyond technical specifications to attract more developers and users."
      },
      {
        symbol: "DOGE",
        name: "Dogecoin",
        sentiment: "negative",
        context: "Dogecoin and similar meme coins lack fundamental value drivers beyond social momentum, which appears to be waning."
      }
    ],
    
    macroSignals: [
      {
        type: "technology",
        description: "AI integration is accelerating development cycles and creating new possibilities for blockchain applications.",
        impact: "high"
      },
      {
        type: "adoption",
        description: "Gaming and social applications are proving to be the most effective onboarding vectors for mainstream users.",
        impact: "high"
      },
      {
        type: "geopolitical",
        description: "Emerging markets continue to lead in grassroots crypto adoption due to currency instability and remittance needs.",
        impact: "medium"
      }
    ],
    
    perceivedRisks: [
      {
        category: "competition",
        description: "Fragmentation across L1s and L2s is creating user confusion and diluting developer resources.",
        severity: "medium",
        timeframe: "medium"
      },
      {
        category: "technical",
        description: "Many projects are still struggling with the blockchain trilemma, sacrificing either security, decentralization, or scalability.",
        severity: "high",
        timeframe: "long"
      },
      {
        category: "fundamental",
        description: "Value accrual mechanisms for many tokens remain theoretical rather than demonstrated.",
        severity: "high",
        timeframe: "medium"
      }
    ],
    
    opportunities: [
      {
        type: "sector",
        description: "Decentralized physical infrastructure networks (DePIN) with clear token utility and revenue models.",
        timeframe: "long",
        conviction: "high"
      },
      {
        type: "strategy",
        description: "Focus on protocols with fee-sharing mechanisms that directly benefit token holders.",
        timeframe: "medium",
        conviction: "high"
      },
      {
        type: "token",
        description: "Gaming tokens with active ecosystems and proven player engagement metrics.",
        timeframe: "medium",
        conviction: "medium"
      }
    ],
    
    summary: "The analysis presents a mixed market outlook with strong narrative divergence. DePIN and modular blockchain architectures are gaining momentum, while speculative meme coins are losing traction. Tokens demonstrating real utility like RNDR and RON receive positive sentiment, while purely speculative assets like DOGE are viewed negatively. AI integration, gaming adoption, and emerging market usage are identified as significant macro trends. Key risks include ecosystem fragmentation, persistent blockchain trilemma challenges, and uncertain token value accrual. The most compelling opportunities are in DePIN projects, fee-sharing protocols, and gaming tokens with proven engagement metrics.",
    
    transcriptSnippets: [
      "What we're seeing now is a clear divergence between narratives and tokens with demonstrated utility versus those riding purely on speculation and hype.",
      "DePIN projects are particularly interesting because they're building real-world infrastructure with clear token utility models, unlike many of the previous crypto narratives.",
      "The blockchain trilemma remains a fundamental challenge. Most projects claiming to have solved it have simply made different trade-offs that become apparent at scale.",
      "Gaming and social applications continue to be the most effective onboarding vectors for mainstream users who care more about the experience than the underlying blockchain technology."
    ]
  }
];

export async function GET(request?: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData = {
      timestamp: new Date().toISOString(),
      sources: [
        {
          id: "v1",
          title: "Ethereum's Future After Dencun Upgrade",
          channelName: "Bankless",
          url: "https://youtube.com/watch?v=example1",
          publishedAt: "2024-03-15T14:30:00Z",
          thumbnailUrl: "https://i.ytimg.com/vi/example1/maxresdefault.jpg",
          views: 87500,
          likes: 4320,
          subscribers: 650000
        },
        {
          id: "v2",
          title: "Bitcoin ETF Impact on Market Cycles",
          channelName: "Coin Bureau",
          url: "https://youtube.com/watch?v=example2",
          publishedAt: "2024-03-12T10:15:00Z",
          thumbnailUrl: "https://i.ytimg.com/vi/example2/maxresdefault.jpg",
          views: 126000,
          likes: 8750,
          subscribers: 2100000
        }
      ],
      analyses: [
        {
          sourceId: "v1",
          summary: "This video discusses the impact of Ethereum's Dencun upgrade on the network's scalability, focusing on how blob transactions reduce L2 costs. The hosts analyze the upgrade's success, noting a 90% reduction in L2 fees and increasing activity on rollups. They predict this will accelerate Ethereum's adoption and position it as the dominant execution layer for Web3 applications.",
          sentiment: {
            overall: "positive",
            confidence: 0.92
          },
          narratives: [
            {
              name: "Layer 2 Scaling",
              sentiment: "positive",
              confidence: 0.95,
              analysis: "The video strongly emphasizes L2 scaling solutions as fundamental to Ethereum's future. The discussion highlights that since Dencun's implementation, L2 transaction costs have fallen by 90%, making Ethereum's scaling solution competitive with alternative L1s."
            },
            {
              name: "DeFi Growth",
              sentiment: "positive",
              confidence: 0.87,
              analysis: "The hosts predict that reduced costs will revitalize DeFi activity on Ethereum, reversing the trend of users migrating to alternative chains. They cite early data showing increased TVL on Ethereum L2s since the upgrade."
            },
            {
              name: "ETH as Ultra Sound Money",
              sentiment: "neutral",
              confidence: 0.78,
              analysis: "The video touches on Ethereum's monetary policy, noting that the deflationary mechanism is working but suggesting its impact on price may be overestimated in the short term."
            }
          ],
          mentionedTokens: [
            {
              symbol: "ETH",
              name: "Ethereum",
              sentiment: "positive",
              confidence: 0.94,
              analysis: "Presented as the foundation of Web3, with strong fundamentals strengthened by the upgrade. The hosts suggest long-term holding."
            },
            {
              symbol: "OP",
              name: "Optimism",
              sentiment: "positive",
              confidence: 0.89,
              analysis: "Described as a leading L2 solution that's benefiting significantly from blob transactions, with predictions of increased adoption and value capture."
            },
            {
              symbol: "ARB",
              name: "Arbitrum",
              sentiment: "positive",
              confidence: 0.87,
              analysis: "Mentioned as a major L2 seeing reduced fees and increased activity post-Dencun, though with some concerns about competition from other scaling solutions."
            },
            {
              symbol: "SOL",
              name: "Solana",
              sentiment: "neutral",
              confidence: 0.75,
              analysis: "Referenced as a competitor to Ethereum that may lose some of its fee advantage as L2s become more efficient, though still respected for its technical capabilities."
            }
          ],
          macroSignals: [
            {
              type: "technical",
              strength: "moderate",
              timeframe: "medium",
              analysis: "The upgrade implementation has created a positive technical narrative for Ethereum, potentially resolving one of its main criticisms. The hosts suggest this could lead to a repricing event in the medium term as the market recognizes the improved scalability."
            },
            {
              type: "adoption",
              strength: "strong",
              timeframe: "long",
              analysis: "Lower fees on L2s could trigger a significant increase in user adoption of Ethereum-based applications, creating a positive feedback loop for the ecosystem. Early data shows increased new wallet creation on major L2s."
            }
          ],
          perceivedRisks: [
            {
              type: "competitive",
              severity: "medium",
              description: "The hosts acknowledge that alternative L1s have built substantial ecosystems during Ethereum's scaling challenges, and these ecosystems may retain users despite Ethereum's improvements."
            },
            {
              type: "technical",
              severity: "low",
              description: "While the upgrade has been successful, the video notes that Ethereum still has a complex roadmap ahead with potential for delays or technical challenges."
            }
          ],
          opportunities: [
            {
              description: "Growing usage of L2 solutions",
              potentialImpact: "high",
              timeframe: "short",
              relatedTokens: ["OP", "ARB", "MATIC"],
              analysis: "The immediate fee reduction on L2s creates a compelling opportunity for users to migrate from alternative chains, driving potential growth for L2 tokens in the near term."
            },
            {
              description: "DeFi protocol revival on Ethereum",
              potentialImpact: "high",
              timeframe: "medium",
              relatedTokens: ["AAVE", "UNI", "CRV"],
              analysis: "Lower transaction costs could revitalize DeFi activity on Ethereum L2s, benefiting established protocols that have maintained their security and reliability through the bear market."
            }
          ]
        },
        {
          sourceId: "v2",
          summary: "This video explores how Bitcoin ETF approval has fundamentally changed BTC's market dynamics. The host argues that institutional capital has created a more stable price floor but may also extend cycle lengths. The analysis suggests we're entering a prolonged accumulation phase rather than a typical bull market, with institutional strategies focusing on dollar-cost averaging and reduced volatility being the new normal.",
          sentiment: {
            overall: "neutral",
            confidence: 0.85
          },
          narratives: [
            {
              name: "Bitcoin Institutionalization",
              sentiment: "positive",
              confidence: 0.91,
              analysis: "The video presents the ETF approval as a watershed moment for Bitcoin's legitimacy, highlighting the sustained inflows and reduced selling pressure. The host emphasizes that this represents a fundamental shift in Bitcoin's holder base and price dynamics."
            },
            {
              name: "Market Cycle Changes",
              sentiment: "neutral",
              confidence: 0.88,
              analysis: "The host proposes that traditional crypto market cycles may be lengthening or fundamentally changing due to institutional participation. The analysis suggests reduced volatility but potentially slower, steadier growth compared to previous cycles."
            },
            {
              name: "BTC as Digital Gold",
              sentiment: "positive",
              confidence: 0.86,
              analysis: "The narrative of Bitcoin as a store of value and inflation hedge is presented as strengthening, with institutional adoption validating this use case. The host suggests this narrative will continue to dominate over medium of exchange or other use cases."
            }
          ],
          mentionedTokens: [
            {
              symbol: "BTC",
              name: "Bitcoin",
              sentiment: "positive",
              confidence: 0.89,
              analysis: "Portrayed as entering a new phase of maturity, with institutional adoption creating a more stable investment thesis. The host suggests long-term accumulation rather than trading."
            },
            {
              symbol: "ETH",
              name: "Ethereum",
              sentiment: "neutral",
              confidence: 0.76,
              analysis: "Mentioned briefly as potentially benefitting from the legitimization of crypto as an asset class, though with the caveat that ETH lacks the clear investment narrative that BTC has established."
            },
            {
              symbol: "SOL",
              name: "Solana",
              sentiment: "neutral",
              confidence: 0.72,
              analysis: "Referenced as an example of altcoins that may see less dramatic peaks in this cycle due to more mature market dynamics, though still considered a strong technical contender."
            }
          ],
          macroSignals: [
            {
              type: "institutional",
              strength: "strong",
              timeframe: "long",
              analysis: "The ETF approval represents a fundamental shift in Bitcoin's institutional accessibility. The video cites data showing that even conservative allocations from pension funds and endowments could drive significant price appreciation over years rather than months."
            },
            {
              type: "regulatory",
              strength: "moderate",
              timeframe: "medium",
              analysis: "The host suggests that ETF approval has reduced regulatory uncertainty for Bitcoin specifically, but cautions that this clarity may not extend to the broader crypto market."
            }
          ],
          perceivedRisks: [
            {
              type: "market",
              severity: "medium",
              description: "The host warns that institutional capital could lead to Bitcoin's price movement becoming more correlated with traditional markets, potentially reducing its appeal as a diversification asset during broader market stress."
            },
            {
              type: "expectation",
              severity: "high",
              description: "The video expresses concern that retail investors expecting a repeat of previous bull market patterns might become disillusioned with a more gradual appreciation, leading to reduced participation."
            }
          ],
          opportunities: [
            {
              description: "Bitcoin mining equities",
              potentialImpact: "moderate",
              timeframe: "medium",
              relatedTokens: [],
              analysis: "The host suggests that publicly-traded mining companies may offer leveraged exposure to Bitcoin's growth with the additional benefit of dividends and traditional market integration."
            },
            {
              description: "BTC-focused DeFi protocols",
              potentialImpact: "moderate",
              timeframe: "long",
              relatedTokens: ["WBTC", "SATS", "STACKS"],
              analysis: "Protocols that enable Bitcoin utilization in DeFi ecosystems are highlighted as potential beneficiaries of increased Bitcoin popularity and institutional holding."
            }
          ]
        }
      ]
    };
    
    return NextResponse.json(mockData, { status: 200 });
  } catch (error) {
    console.error('Error in transcript analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript analysis' },
      { status: 500 }
    );
  }
}

// This endpoint would also handle POST requests to analyze new transcripts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real implementation, this would:
    // 1. Extract the transcript text from the request
    // 2. Process it using LLM or other NLP techniques
    // 3. Generate the structured analysis
    // 4. Save the analysis to the database
    
    // For demonstration, we'll just save a modified sample
    const { videoId, videoTitle, channelName, channelUrl, transcript } = body;
    
    if (!videoId || !videoTitle || !channelName || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a placeholder analysis based on the first sample
    const newAnalysis: VideoTranscriptAnalysis = {
      ...sampleAnalyses[0],
      videoId,
      videoTitle,
      channelName,
      channelUrl: channelUrl || sampleAnalyses[0].channelUrl,
      publishedAt: new Date().toISOString(),
      analyzedAt: new Date().toISOString(),
      summary: `Analysis for ${videoTitle} by ${channelName}. In a real implementation, this would be generated from the transcript content.`,
      transcriptSnippets: [transcript.substring(0, 200) + "..."] // Just use the first 200 chars as a snippet
    };
    
    // Save the analysis
    const savedAnalysis = await saveTranscriptAnalysis(newAnalysis);
    
    return NextResponse.json({
      success: true,
      analysis: savedAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing transcript analysis request:', error);
    return NextResponse.json(
      { error: 'Failed to process transcript analysis' },
      { status: 500 }
    );
  }
} 