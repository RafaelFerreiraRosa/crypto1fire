const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoData {
  asset_id: string;
  name: string;
  price_usd: number;
  volume_1day_usd: number;
  percent_change_24h: number;
  sparkline_data: number[];
}

// Função auxiliar para adicionar delay entre requisições
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função auxiliar para fazer requisições com retry
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      // Se a resposta não for ok, espera um pouco antes de tentar novamente
      await delay(1000 * (i + 1));
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * (i + 1));
    }
  }
  throw new Error('Failed to fetch after retries');
}

export async function getTopCryptos(): Promise<CryptoData[]> {
  try {
    console.log('Fetching top cryptos...');
    // Buscando as top 200 criptomoedas por market cap
    const response = await fetchWithRetry(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&sparkline=true&price_change_percentage=24h`
    );

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return [];
    }

    return data.map((crypto: any) => ({
      asset_id: crypto.symbol.toUpperCase(),
      name: crypto.name,
      price_usd: crypto.current_price || 0,
      volume_1day_usd: crypto.total_volume || 0,
      percent_change_24h: crypto.price_change_percentage_24h || 0,
      sparkline_data: crypto.sparkline_in_7d?.price || []
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
}

export async function getGlobalMetrics() {
  try {
    console.log('Fetching global metrics...');
    await delay(1000); // Espera 1 segundo após a primeira requisição
    
    const response = await fetchWithRetry(`${BASE_URL}/global`);
    const data = await response.json();

    if (!data || !data.data) {
      console.error('Invalid response format:', data);
      return null;
    }

    return {
      market_cap_usd: data.data.total_market_cap?.usd || 0,
      market_cap_change_24h_percent: data.data.market_cap_change_percentage_24h || 0,
      volume_24h_usd: data.data.total_volume?.usd || 0,
      volume_24h_change_percent: 0,
      btc_dominance: data.data.market_cap_percentage?.btc || 0,
      btc_dominance_change_24h: 0,
      eth_dominance: data.data.market_cap_percentage?.eth || 0,
      eth_dominance_change_24h: 0
    };
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return null;
  }
} 