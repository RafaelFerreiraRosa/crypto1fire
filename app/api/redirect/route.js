import { NextRequest, NextResponse } from 'next/server';

// Mapeamento para URLs específicos que sabemos que funcionam
const KNOWN_URLS_MAP = {
  // CryptoPanic URLs para URLs reais (sem parâmetros de query)
  "https://cryptopanic.com/news/20999106/Breaking-Bitcoin-Soars-5-on-Tariff-Reversal": "https://u.today/breaking-bitcoin-soars-5-on-tariff-reversal",
  "https://cryptopanic.com/news/20999007/Trump-Puts-New-Tarrifs-on-China-125": "https://coinpaprika.com/news/trump-puts-new-tarrifs-on-china-125-/",
  "https://cryptopanic.com/news/20998629/China-and-Russia-are-using-Bitcoin-to-settle-energy-trades": "https://www.cryptopolitan.com/china-and-russia-are-using-bitcoin-to-settle-energy-trades/",
  "https://cryptopanic.com/news/21001801/SEC-Approves-Options-Trading-on-Spot-ETH-ETFs": "https://thedefiant.io/news/regulation/sec-approves-options-trading-on-spot-eth-etfs-da544350",
  "https://cryptopanic.com/news/21001821/Bitcoin-100K-target-back-on-table-after-Trump-tariff-pause-supercharges-market-sentiment": "https://cointelegraph.com/news/bitcoin-100k-target-back-on-table-after-trump-tariff-pause-supercharges-market-sentiment",
  // Mais URLs baseadas nos logs
  "https://cryptopanic.com/news/20988705/Trump-linked-WLFI-dumps-Ethereum-at-55-loss-amid-crypto-market-turmoil": "https://cointrackdaily.com/trump-linked-wlfi-dumps-ethereum-at-55-loss-amid-crypto-market-turmoil/",
  "https://cryptopanic.com/news/20988010/Ethereum-ETH-Whales-Capitulate-Is-It-Over": "https://u.today/ethereum-eth-whales-capitulate-is-it-over",
  "https://cryptopanic.com/news/20988043/Ethereum-in-great-difficulty-ETH-has-outperformed-Bitcoin-only-15-of-the-time": "https://en.cryptonomist.ch/ethereum-in-great-difficulty-eth-has-outperformed-bitcoin-only-15-of-the-time/"
};

// Mapeamento de domínios para seus respectivos formatos de URL
const DOMAIN_URL_FORMATS = {
  'u.today': 'https://u.today/{slug}',
  'coinpaprika.com': 'https://coinpaprika.com/news/{slug}/',
  'thedefiant.io': 'https://thedefiant.io/news/regulation/{slug}',
  'cryptopolitan.com': 'https://www.cryptopolitan.com/{slug}/',
  'dailyhodl.com': 'https://dailyhodl.com/{date}/{slug}/',
  'cryptopotato.com': 'https://cryptopotato.com/{slug}/',
  'bankless.com': 'https://bankless.com/blog/{slug}/',
  'cointelegraph.com': 'https://cointelegraph.com/news/{slug}'
};

export async function GET(request) {
  // Obtém a URL para onde redirecionar a partir dos parâmetros da consulta
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
  }
  
  console.log(`Tentando redirecionar: ${url}`);
  
  // Limpar URL e comparar com o mapeamento
  const cleanUrl = url.split('?')[0]; // Remove parâmetros query
  console.log(`URL limpa para verificação: ${cleanUrl}`);
  
  // Verifica se é uma URL conhecida que já temos o mapeamento
  if (KNOWN_URLS_MAP[cleanUrl]) {
    console.log(`URL conhecida encontrada, redirecionando para: ${KNOWN_URLS_MAP[cleanUrl]}`);
    return NextResponse.redirect(KNOWN_URLS_MAP[cleanUrl]);
  }
  
  try {
    // Extrair o ID da notícia da URL
    const newsIdMatch = cleanUrl.match(/\/news\/(\d+)/);
    if (!newsIdMatch || !newsIdMatch[1]) {
      throw new Error("Não foi possível extrair o ID da notícia da URL");
    }
    
    const newsId = newsIdMatch[1];
    console.log(`ID da notícia extraído: ${newsId}`);
    
    // Obter os detalhes da notícia pela API
    console.log(`Buscando detalhes da notícia com ID ${newsId} na API...`);
    const apiUrl = `https://cryptopanic.com/api/v1/posts/${newsId}/?auth_token=e35640c0f7f57d29739e119fa54ea6dc01305915`;
    
    const apiResponse = await fetch(apiUrl, {
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    
    if (!apiResponse.ok) {
      throw new Error(`Erro ao buscar dados da API: ${apiResponse.status}`);
    }
    
    const newsData = await apiResponse.json();
    console.log(`Dados da notícia obtidos: title=${newsData.title}, domain=${newsData.domain}`);
    
    // Estratégia simplificada: Construir URL com base no domínio e slug
    if (newsData.domain && newsData.slug) {
      // Construir URL com base no domínio
      let constructedUrl = "";
      const domain = newsData.domain;
      const slug = newsData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      switch (domain) {
        case 'u.today':
          constructedUrl = `https://u.today/${slug}`;
          break;
        case 'coinpaprika.com':
          constructedUrl = `https://coinpaprika.com/news/${slug}/`;
          break;
        case 'thedefiant.io':
          constructedUrl = `https://thedefiant.io/news/regulation/${slug}`;
          break;
        case 'cryptopolitan.com':
          constructedUrl = `https://www.cryptopolitan.com/${slug}/`;
          break;
        case 'dailyhodl.com':
          // Adicionar data para dailyhodl
          if (newsData.published_at) {
            const date = new Date(newsData.published_at);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            constructedUrl = `https://dailyhodl.com/${year}/${month}/${day}/${slug}/`;
          } else {
            constructedUrl = `https://dailyhodl.com/${slug}/`;
          }
          break;
        case 'cryptopotato.com':
          constructedUrl = `https://cryptopotato.com/${slug}/`;
          break;
        case 'bankless.com':
          constructedUrl = `https://bankless.com/blog/${slug}/`;
          break;
        case 'cointelegraph.com':
          constructedUrl = `https://cointelegraph.com/news/${slug}`;
          break;
        case 'cointrackdaily.com':
          constructedUrl = `https://cointrackdaily.com/${slug}/`;
          break;
        case 'en.cryptonomist.ch':
          constructedUrl = `https://en.cryptonomist.ch/${slug}/`;
          break;
        case 'cryptobriefing.com':
          constructedUrl = `https://cryptobriefing.com/news/${slug}/`;
          break;
        case 'feeds2.benzinga.com':
          constructedUrl = `https://feeds2.benzinga.com/${slug}/`;
          break;
        case 'spaziocrypto.com':
          constructedUrl = `https://spaziocrypto.com/${slug}/`;
          break;
        default:
          constructedUrl = `https://${domain}/${slug}/`;
      }
      
      console.log(`URL construída com base no domínio: ${constructedUrl}`);
      return NextResponse.redirect(constructedUrl);
    }
    
    // Último recurso: Redirecionar para a página original do CryptoPanic
    console.log(`Nenhuma URL encontrada, redirecionando para a página original: ${cleanUrl}`);
    return NextResponse.redirect(cleanUrl);
    
  } catch (error) {
    console.error('Erro ao processar redirecionamento:', error);
    return NextResponse.json({ error: 'Falha ao processar redirecionamento' }, { status: 500 });
  }
} 