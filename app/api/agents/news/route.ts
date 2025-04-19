import { NextResponse } from 'next/server';
import { 
  saveNewsItem, 
  getLatestNews, 
  NEWS_SOURCES, 
  MacroNewsItem 
} from '@/lib/services/macroNewsDB';

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

export async function GET() {
  try {
    // Get recent news
    const latestNews = await getLatestNews(10);
    
    // If we have recent news (less than 1 hour old), return it
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    if (latestNews.length > 0 && new Date(latestNews[0].timestamp) > oneHourAgo) {
      return NextResponse.json({
        news: latestNews,
        sources: NEWS_SOURCES.map(s => s.name),
        cached: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // In a real environment, we would do web scraping or API calls here
    // For this example, we use sample data
    const newsPromises = sampleNews.map(async (newsItem) => {
      // Save to database
      return await saveNewsItem(newsItem);
    });
    
    // Wait for all news items to be processed and saved
    const savedNews = await Promise.all(newsPromises);
    
    return NextResponse.json({
      news: savedNews,
      sources: NEWS_SOURCES.map(s => s.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing MacroN news:', error);
    return NextResponse.json(
      { error: 'Failed to process news data' },
      { status: 500 }
    );
  }
} 