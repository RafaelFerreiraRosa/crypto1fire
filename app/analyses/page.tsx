import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Home, ExternalLink } from "lucide-react";
import Link from "next/link";
import NewsGrid from "@/components/NewsGrid";
import TrendsGrid from "@/components/TrendsGrid";

// Mapeamento de URLs conhecidas do CryptoPanic para as URLs originais dos artigos
const KNOWN_URLS_MAP: Record<string, string> = {
  "https://cryptopanic.com/news/20999106/Breaking-Bitcoin-Soars-5-on-Tariff-Reversal": "https://u.today/breaking-bitcoin-soars-5-on-tariff-reversal",
  "https://cryptopanic.com/news/20999007/Trump-Puts-New-Tarrifs-on-China-125": "https://coinpaprika.com/news/trump-puts-new-tarrifs-on-china-125-/",
  "https://cryptopanic.com/news/20998629/China-and-Russia-are-using-Bitcoin-to-settle-energy-trades": "https://www.cryptopolitan.com/china-and-russia-are-using-bitcoin-to-settle-energy-trades/",
  "https://cryptopanic.com/news/21001801/SEC-Approves-Options-Trading-on-Spot-ETH-ETFs": "https://thedefiant.io/news/regulation/sec-approves-options-trading-on-spot-eth-etfs-da544350",
  "https://cryptopanic.com/news/21001821/Bitcoin-100K-target-back-on-table-after-Trump-tariff-pause-supercharges-market-sentiment": "https://cointelegraph.com/news/bitcoin-100-k-target-back-on-table-after-trump-tariff-pause-supercharges-market-sentiment",
  "https://cryptopanic.com/news/20988705/Trump-linked-WLFI-dumps-Ethereum-at-55-loss-amid-crypto-market-turmoil": "https://cointrackdaily.com/trump-linked-wlfi-dumps-ethereum-at-55-loss-amid-crypto-market-turmoil/",
  "https://cryptopanic.com/news/20988010/Ethereum-ETH-Whales-Capitulate-Is-It-Over": "https://u.today/ethereum-eth-whales-capitulate-is-it-over",
  "https://cryptopanic.com/news/20988043/Ethereum-in-great-difficulty-ETH-has-outperformed-Bitcoin-only-15-of-the-time": "https://en.cryptonomist.ch/ethereum-in-great-difficulty-eth-has-outperformed-bitcoin-only-15-of-the-time/",
  "https://cryptopanic.com/news/20971660/Bitcoin-drops-below-77K-as-US-confirms-104-tariffs-on-China": "https://cryptobriefing.com/news/bitcoin-drops-below-77k-as-us-confirms-104-tariffs-on-china/",
  "https://cryptopanic.com/news/20964396/XRP-Will-Overtake-Ethereum-By-2028-Standard-Chartered": "https://feeds2.benzinga.com/xrp-will-overtake-ethereum-by-2028-standard-chartered/",
  "https://cryptopanic.com/news/20957348/MegaETH-Supercharging-Ethereum-for-the-Real-Time-Internet-Era": "https://coinpaprika.com/news/megaeth-supercharging-ethereum-for-the-real-time-internet-era/",
  "https://cryptopanic.com/news/20956948/Trump-escalates-trade-war-BTC-at-80k": "https://coinpaprika.com/news/trump-escalates-trade-war-btc-at-80k/",
  "https://cryptopanic.com/news/20954761/ETH-Drops-to-2-Year-Lows-Amid-Crypto-Selloff": "https://bankless.com/blog/eth-drops-to-2-year-lows-amid-crypto-selloff/",
  "https://cryptopanic.com/news/20952800/Ethereum-Whales-Scoop-Up-60M-as-ETH-Price-Tumbles-to-2023-Lows": "https://cryptopotato.com/ethereum-whales-scoop-up-60m-as-eth-price-tumbles-to-2023-lows/",
  "https://cryptopanic.com/news/20943186/Markets-are-crashing-Bitcoin-at-75k": "https://coinpaprika.com/news/markets-are-crashing-bitcoin-at-75k/",
  "https://cryptopanic.com/news/20940044/Breaking-Crypto-Market-Getting-Annihilated-as-Ethereum-Collapses-by-10": "https://u.today/breaking-crypto-market-getting-annihilated-as-ethereum-collapses-by-10",
  "https://cryptopanic.com/news/20938494/PayPal-Adds-Solana-and-Chainlink-to-its-Crypto-Services": "https://spaziocrypto.com/paypal-adds-solana-and-chainlink-to-its-crypto-services/",
  "https://cryptopanic.com/news/20937139/Era-of-US-Treasuries-and-Stocks-As-Global-Reserve-Assets-Now-Over-As-Gold-and-Bitcoin-Take-Over-Arthur-Hayes": "https://dailyhodl.com/2025/04/06/era-of-us-treasuries-and-stocks-as-global-reserve-assets-now-over-as-gold-and-bitcoin-take-over-arthur-hayes/"
};

// Função para obter a URL original de um artigo
function getOriginalUrl(item: any): string {
  // Primeiro verificar se temos um mapeamento direto para essa URL
  const baseUrl = item.url.split('?')[0]; // Remover parâmetros de consulta
  if (KNOWN_URLS_MAP[baseUrl]) {
    return KNOWN_URLS_MAP[baseUrl];
  }
  
  // Se tivemos a URL da fonte, usar diretamente
  if (item.source_url) {
    return item.source_url;
  }
  
  // Para casos especiais como o artigo da SEC
  if (item.id === 21001801 || 
      (item.title && item.title.includes("SEC Approves Options Trading"))) {
    return "https://thedefiant.io/news/regulation/sec-approves-options-trading-on-spot-eth-etfs-da544350";
  }
  
  // Caso especial para o artigo do Bitcoin 100K
  if (item.id === 21001821 || 
      (item.title && item.title.includes("Bitcoin 100K target"))) {
    return "https://cointelegraph.com/news/bitcoin-100-k-target-back-on-table-after-trump-tariff-pause-supercharges-market-sentiment";
  }
  
  // Construir URL com base no domínio e slug
  if (item.domain && item.slug) {
    const domain = item.domain;
    const slug = item.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    switch (domain) {
      case 'u.today':
        return `https://u.today/${slug}`;
      case 'coinpaprika.com':
        return `https://coinpaprika.com/news/${slug}/`;
      case 'thedefiant.io':
        return `https://thedefiant.io/news/regulation/${slug}`;
      case 'cryptopolitan.com':
        return `https://www.cryptopolitan.com/${slug}/`;
      case 'cointelegraph.com':
        return `https://cointelegraph.com/news/${slug}`;
      case 'cointrackdaily.com':
        return `https://cointrackdaily.com/${slug}/`;
      case 'en.cryptonomist.ch':
        return `https://en.cryptonomist.ch/${slug}/`;
      case 'cryptobriefing.com':
        return `https://cryptobriefing.com/news/${slug}/`;
      case 'feeds2.benzinga.com':
        return `https://feeds2.benzinga.com/${slug}/`;
      case 'spaziocrypto.com':
        return `https://spaziocrypto.com/${slug}/`;
      case 'cryptopotato.com':
        return `https://cryptopotato.com/${slug}/`;
      case 'bankless.com':
        return `https://bankless.com/blog/${slug}/`;
      case 'dailyhodl.com':
        // Adicionar data para dailyhodl se disponível
        if (item.published_at) {
          const date = new Date(item.published_at);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `https://dailyhodl.com/${year}/${month}/${day}/${slug}/`;
        }
        return `https://dailyhodl.com/${slug}/`;
      default:
        return `https://${domain}/${slug}/`;
    }
  }
  
  // Se nada funcionar, retornar a URL original do CryptoPanic
  return item.url;
}

async function getNews() {
  try {
    console.log('Buscando notícias...');
    const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=e35640c0f7f57d29739e119fa54ea6dc01305915&public=true&filter=rising&limit=20', {
      next: { revalidate: 300 },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Resposta da API de notícias não está ok:', response.status);
      throw new Error('Falha ao buscar notícias');
    }
    
    const data = await response.json();
    console.log('Notícias obtidas com sucesso:', data.results?.length + ' itens');
    
    // Processar as notícias para adicionar a URL original
    const processedNews = (data.results || []).map((item: any) => {
      return {
        ...item,
        original_url: getOriginalUrl(item)
      };
    });
    
    return processedNews;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

async function getTopCryptos() {
  try {
    console.log('Buscando dados das criptomoedas...');
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot,matic-network,chainlink&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h', {
      next: { revalidate: 60 },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Resposta da API de criptomoedas não está ok:', response.status);
      throw new Error('Falha ao buscar dados das criptomoedas');
    }
    
    const data = await response.json();
    console.log('Dados de criptomoedas obtidos com sucesso:', data.length + ' itens');
    
    return data.map((coin: any) => ({
      asset_id: coin.symbol.toUpperCase(),
      price_usd: coin.current_price,
      percent_change_24h: coin.price_change_percentage_24h / 100
    }));
  } catch (error) {
    console.error('Erro ao buscar dados das criptomoedas:', error);
    return [];
  }
}

function calculateMarketSentiment(news: any[]) {
  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;
  
  news.forEach(item => {
    if (item.votes && item.votes.important > 0) {
      bullishCount++;
    } else if (item.votes && item.votes.negative > 0) {
      bearishCount++;
    } else {
      neutralCount++;
    }
  });
  
  const total = bullishCount + bearishCount + neutralCount;
  
  if (total === 0) return { bullishPercentage: 0, bearishPercentage: 0 };
  
  const bullishPercentage = Math.round((bullishCount / total) * 100);
  const bearishPercentage = Math.round((bearishCount / total) * 100);
  
  return {
    bullishPercentage,
    bearishPercentage
  };
}

function getMarketSentimentEmoji(news: any) {
  if (news.votes && news.votes.important > 0) {
    return '🐂'; // Touro (Bullish)
  } else if (news.votes && news.votes.negative > 0) {
    return '🐻'; // Urso (Bearish)
  }
  return '➡️'; // Neutro
}

export default async function AnalysesPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log('Renderizando AnalysesPage...');
  
  let allNews = [];
  let cryptos = [];

  try {
    [allNews, cryptos] = await Promise.all([
      getNews(),
      getTopCryptos()
    ]);
    console.log('Dados carregados com sucesso:', { newsCount: allNews.length, cryptos });
  } catch (error) {
    console.error('Erro em AnalysesPage:', error);
  }
  
  const marketSentiment = calculateMarketSentiment(allNews);

  return (
    <main className="flex min-h-screen flex-col p-8 relative">
      <Link href="/" className="absolute top-4 left-4 z-10">
        <div className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
          <Home className="h-5 w-5 text-primary" />
        </div>
      </Link>

      <div className="mb-4 overflow-hidden">
        <div className="relative whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {cryptos.length > 0 ? (
              cryptos.map((crypto: any) => (
                <div key={crypto.asset_id} className="inline-flex items-center gap-2 mx-4">
                  <span className="font-medium">{crypto.asset_id}</span>
                  <span className="text-sm text-muted-foreground">
                    ${parseFloat(crypto.price_usd).toFixed(2)}
                  </span>
                  <span className={`text-sm flex items-center ${
                    crypto.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {crypto.percent_change_24h >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(crypto.percent_change_24h * 100).toFixed(2)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">Carregando cotações...</div>
            )}
          </div>
          <div className="animate-marquee inline-block">
            {cryptos.length > 0 ? (
              cryptos.map((crypto: any) => (
                <div key={`duplicate-${crypto.asset_id}`} className="inline-flex items-center gap-2 mx-4">
                  <span className="font-medium">{crypto.asset_id}</span>
                  <span className="text-sm text-muted-foreground">
                    ${parseFloat(crypto.price_usd).toFixed(2)}
                  </span>
                  <span className={`text-sm flex items-center ${
                    crypto.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {crypto.percent_change_24h >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(crypto.percent_change_24h * 100).toFixed(2)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">Carregando cotações...</div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-border/50 my-4"></div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Análises</h1>
      </div>

      <div className="flex gap-4">
        <Tabs defaultValue="news" className="space-y-4 flex-1">
          <TabsList className="bg-background/50">
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Últimas Notícias</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-base ${marketSentiment.bullishPercentage >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketSentiment.bullishPercentage >= 50 ? '🐂' : '🐻'}
                  </span>
                  <span className={`text-sm font-medium ${marketSentiment.bullishPercentage >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketSentiment.bullishPercentage >= 50 
                      ? `+${marketSentiment.bullishPercentage}%` 
                      : `-${marketSentiment.bearishPercentage}%`
                    }
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <NewsGrid news={allNews} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-background/50">
              <CardContent className="pt-6">
                <TrendsGrid />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 