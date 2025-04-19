import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface OnChainTweet {
  id: string;
  protocolo: string;
  blockchain: string;
  metrica_onchain: string;
  narrativa: string[];
  sentimento: 'bullish' | 'bearish' | 'neutro';
  autor: string;
  data: string;
  engajamento: {
    likes: number;
    retweets: number;
    comentarios: number;
  };
  fonte: string;
  texto?: string; // O texto completo do tweet (opcional)
}

// Lista de contas para monitorar
export const MONITORED_ACCOUNTS: string[] = [
  // Analistas de dados on-chain solicitados pelo usuário
  '@woonomic',         // Willy Woo
  '@DylanLeClair_',    // Dylan LeClair
  '@ki_young_ju',      // Ki Young Ju
  '@QwQiao',           // Qiao Wang
  '@spencernoon',      // Spencer Noon
  '@VentureCoinist',   // Luke Martin
  
  // Portais de dados on-chain
  '@glassnode',
  '@CryptoQuant_com',
  '@santimentfeed',
  '@nansen_ai',
  '@lookintobtc',      // Look into Bitcoin
  '@coinmetrics',
  '@TokenTerminal',
  '@DefiLlama',
  '@Artemis__xyz',     // Artemis
  
  // Outras fontes relevantes
  '@MessariCrypto',
  '@intotheblock',
  '@DuneAnalytics',
  '@0xngmi',
  '@adamscochran',
  '@DeFiDailyData',
  '@DarenMatsuoka',
  '@DeFiMoon',
  '@OnChainWizard',
  '@checkmatey',       // _Checkmatey_
  '@PositiveCrypto',   // PositiveCrypto
  '@WClementeIII',     // Will Clemente
  '@cryptohayes',      // Arthur Hayes
  '@ArcaneResearch',   // Arcane Research
  '@CryptoDiffer',     // Crypto Differ
  '@RyanWatkins_',     // Ryan Watkins
  '@nic__carter'       // Nic Carter
];

const DB_DIR = path.join(process.cwd(), 'data');
const CHAIN_TWEETS_DB_FILE = path.join(DB_DIR, 'chain-tweets.json');

// Inicializa o banco de dados local
async function initializeDB() {
  try {
    await mkdir(DB_DIR, { recursive: true });
    
    try {
      await readFile(CHAIN_TWEETS_DB_FILE, 'utf-8');
      // Se conseguir ler, o arquivo existe
    } catch (error) {
      // Se o arquivo não existir, cria ele com um array vazio
      await writeFile(CHAIN_TWEETS_DB_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing ChainX database:', error);
  }
}

// Busca todos os tweets armazenados
export async function getAllTweets(): Promise<OnChainTweet[]> {
  try {
    await initializeDB();
    const data = await readFile(CHAIN_TWEETS_DB_FILE, 'utf-8');
    return JSON.parse(data) as OnChainTweet[];
  } catch (error) {
    console.error('Error reading ChainX tweets:', error);
    return [];
  }
}

// Busca os tweets mais recentes (limita a quantidade)
export async function getLatestTweets(limit: number = 20): Promise<OnChainTweet[]> {
  try {
    const tweets = await getAllTweets();
    
    // Ordena por data (mais recente primeiro)
    return tweets
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting latest ChainX tweets:', error);
    return [];
  }
}

// Salva um novo tweet no banco de dados
export async function saveTweet(tweet: OnChainTweet): Promise<OnChainTweet> {
  try {
    await initializeDB();
    const tweets = await getAllTweets();
    
    // Gera um ID único baseado no timestamp se não existir
    const newTweet = {
      ...tweet,
      id: tweet.id || `tweet-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    };
    
    // Verifica se o tweet já existe (pelo id ou URL)
    const existingTweetIndex = tweets.findIndex(t => 
      t.id === newTweet.id || t.fonte === newTweet.fonte
    );
    
    if (existingTweetIndex >= 0) {
      // Atualiza o tweet existente
      tweets[existingTweetIndex] = newTweet;
    } else {
      // Adiciona um novo tweet
      tweets.push(newTweet);
    }
    
    // Limita o histórico para os últimos 500 itens para não crescer demais
    const limitedTweets = tweets
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 500);
    
    await writeFile(CHAIN_TWEETS_DB_FILE, JSON.stringify(limitedTweets, null, 2));
    return newTweet;
  } catch (error) {
    console.error('Error saving ChainX tweet:', error);
    throw new Error('Failed to save ChainX tweet');
  }
}

// Busca tweets por protocolo
export async function getTweetsByProtocol(protocol: string): Promise<OnChainTweet[]> {
  try {
    const tweets = await getAllTweets();
    return tweets.filter(tweet => 
      tweet.protocolo.toLowerCase() === protocol.toLowerCase()
    );
  } catch (error) {
    console.error(`Error getting ChainX tweets for protocol ${protocol}:`, error);
    return [];
  }
}

// Busca tweets por blockchain
export async function getTweetsByBlockchain(blockchain: string): Promise<OnChainTweet[]> {
  try {
    const tweets = await getAllTweets();
    return tweets.filter(tweet => 
      tweet.blockchain.toLowerCase() === blockchain.toLowerCase()
    );
  } catch (error) {
    console.error(`Error getting ChainX tweets for blockchain ${blockchain}:`, error);
    return [];
  }
}

// Busca tweets por narrativa
export async function getTweetsByNarrative(narrative: string): Promise<OnChainTweet[]> {
  try {
    const tweets = await getAllTweets();
    return tweets.filter(tweet => 
      tweet.narrativa.some(n => n.toLowerCase() === narrative.toLowerCase())
    );
  } catch (error) {
    console.error(`Error getting ChainX tweets for narrative ${narrative}:`, error);
    return [];
  }
}

// Busca tweets por sentimento
export async function getTweetsBySentiment(sentiment: 'bullish' | 'bearish' | 'neutro'): Promise<OnChainTweet[]> {
  try {
    const tweets = await getAllTweets();
    return tweets.filter(tweet => tweet.sentimento === sentiment);
  } catch (error) {
    console.error(`Error getting ChainX tweets for sentiment ${sentiment}:`, error);
    return [];
  }
}

// Busca tweets de um autor específico
export async function getTweetsByAuthor(author: string): Promise<OnChainTweet[]> {
  try {
    const tweets = await getAllTweets();
    // Remove @ se presente para facilitar comparação
    const normalizedAuthor = author.startsWith('@') ? author.substring(1) : author;
    
    return tweets.filter(tweet => {
      const tweetAuthor = tweet.autor.startsWith('@') ? tweet.autor.substring(1) : tweet.autor;
      return tweetAuthor.toLowerCase() === normalizedAuthor.toLowerCase();
    });
  } catch (error) {
    console.error(`Error getting ChainX tweets for author ${author}:`, error);
    return [];
  }
}

// Retorna estatísticas sobre os tweets
export async function getTweetStats() {
  try {
    const tweets = await getAllTweets();
    const lastWeekCutoff = new Date();
    lastWeekCutoff.setDate(lastWeekCutoff.getDate() - 7);
    
    const recentTweets = tweets.filter(item => new Date(item.data) >= lastWeekCutoff);
    
    // Protocolos mais mencionados
    const protocolCounts: Record<string, number> = {};
    const blockchainCounts: Record<string, number> = {};
    const narrativeCounts: Record<string, number> = {};
    const sentimentCounts = {
      bullish: 0,
      bearish: 0,
      neutro: 0
    };
    
    recentTweets.forEach(tweet => {
      // Contar protocolos
      protocolCounts[tweet.protocolo] = (protocolCounts[tweet.protocolo] || 0) + 1;
      
      // Contar blockchains
      blockchainCounts[tweet.blockchain] = (blockchainCounts[tweet.blockchain] || 0) + 1;
      
      // Contar narrativas
      tweet.narrativa.forEach(narrative => {
        narrativeCounts[narrative] = (narrativeCounts[narrative] || 0) + 1;
      });
      
      // Contar sentimentos
      sentimentCounts[tweet.sentimento]++;
    });
    
    // Ordenar por contagem (mais mencionados primeiro)
    const sortByCount = (obj: Record<string, number>) => {
      return Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);
    };
    
    return {
      total: tweets.length,
      lastWeek: recentTweets.length,
      topProtocols: sortByCount(protocolCounts),
      topBlockchains: sortByCount(blockchainCounts),
      topNarratives: sortByCount(narrativeCounts),
      sentimentBreakdown: sentimentCounts
    };
  } catch (error) {
    console.error('Error generating ChainX tweet stats:', error);
    return null;
  }
} 