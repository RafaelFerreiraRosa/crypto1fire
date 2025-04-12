const API_KEY = '67751941-ba33-4258-9b45-9575706108eb';
const BASE_URL = 'https://rest.coinapi.io/v1';

export interface CryptoData {
  asset_id: string;
  name: string;
  price_usd: number;
  volume_1day_usd: number;
  percent_change_24h: number;
}

export async function getTopCryptos(): Promise<CryptoData[]> {
  try {
    const response = await fetch(`${BASE_URL}/assets?filter_asset_id=BTC,ETH,BNB,SOL,ADA`, {
      headers: {
        'X-CoinAPI-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
}

export async function getGlobalMetrics() {
  try {
    const response = await fetch(`${BASE_URL}/globalmetrics`, {
      headers: {
        'X-CoinAPI-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch global metrics');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return null;
  }
} 