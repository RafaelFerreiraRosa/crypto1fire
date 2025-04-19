'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Users,
  MessageSquare,
  Link as LinkIcon,
  Globe,
  Calendar,
  Shield,
  Database,
  Activity,
  CircleDollarSign,
  BarChart3,
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Wallet,
  Twitter,
  Github,
  Eye,
  Repeat,
  Heart,
  Zap,
  User,
  Layers,
  DollarSign,
  Clock,
  AlertCircle,
  LayoutGrid,
  UserCheck,
  Lock,
  ArrowLeftRight,
  Flame,
  Share2
} from 'lucide-react';

// Componente Badge simplificado
const Badge = ({ children, variant }: { children: React.ReactNode, variant?: string }) => {
  const bgColor = variant === 'outline' ? 'bg-transparent border border-gray-200' : 'bg-blue-100 text-blue-800';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {children}
    </span>
  );
};

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h?: number;
  category: string;
  narratives: string[];
  onChainMetrics?: {
    activeAddresses: number;
    transactionVolume: number;
    tvl: number;
    weeklyActiveUsers: number;
    developerActivity: number;
    gasUsed?: number;
    contractInteractions?: number;
    dailyTransactions?: number;
    uniqueHolders?: number;
    averageHoldingTime?: number;
  };
  socialMetrics?: {
    twitterFollowers: number;
    twitterEngagement: string;
    telegramMembers: number;
    discordMembers: number;
    redditSubscribers: number;
    githubStars: number;
    githubCommits: number;
    averageDailyMentions: number;
    twitterViews?: number;
    twitterLikes?: number;
    twitterReposts?: number;
    socialVolume?: number;
    sentimentScore?: number;
  };
  marketData?: {
    marketCap: number;
    fullyDilutedValuation: number;
    volume24h: number;
    volumeToMarketCap: number;
    allTimeHigh: number;
    allTimeHighDate: string;
    allTimeLow: number;
    allTimeLowDate: string;
    circulatingSupply: number;
    maxSupply: number;
  };
  projectInfo?: {
    description: string;
    website: string;
    twitter: string;
    github: string;
    foundingYear: number;
    teamMembers: number;
    investors: string[];
    lastUpdated: string;
    tokenomics?: {
      distribution: Array<{category: string, percentage: number}>;
      initialSupply: number;
      inflation: number;
      vestingSchedule?: string;
      unlockDetails?: string;
    };
    team?: Array<{name: string, role: string}>;
  };
  riskAnalysis?: {
    volatilityScore: number;
    regulatoryRisk: number;
    competitionRisk: number;
    technicalRisk: number;
    auditStatus: string;
    returnPotential?: number;
    riskReturnRatio?: number;
  };
  walletMovements?: Array<{
    walletAddress: string;
    amount: number;
    direction: string;
    timestamp: string;
    walletTag?: string;
    txHash?: string;
  }>;
}

interface TokenDetailsProps {
  token: TokenData;
  onClose: () => void;
}

export default function TokenDetails({ token, onClose }: TokenDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [extendedData, setExtendedData] = useState<any>(null);
  
  useEffect(() => {
    // Função para buscar dados estendidos do token
    const fetchExtendedTokenData = async () => {
      setLoading(true);
      
      try {
        // Buscar dados estendidos
        const data = await generateExtendedTokenData(token);
        setExtendedData(data);
      } catch (err) {
        console.error('Error fetching token details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExtendedTokenData();
  }, [token]);
  
  const generateExtendedTokenData = async (token: TokenData): Promise<TokenData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const extendedData: TokenData = {
          ...token,
          narratives: token.narratives || ['DeFi', 'Layer 2', 'Gaming'],
          marketData: {
            marketCap: token.marketCap,
            fullyDilutedValuation: token.marketCap * 1.5,
            volume24h: token.marketCap * 0.2,
            volumeToMarketCap: 0.2,
            allTimeHigh: token.price * 2,
            allTimeHighDate: new Date(Date.now() - 30000000000).toISOString().split('T')[0],
            allTimeLow: token.price * 0.2,
            allTimeLowDate: new Date(Date.now() - 60000000000).toISOString().split('T')[0],
            circulatingSupply: Math.floor(token.marketCap / token.price),
            maxSupply: Math.floor((token.marketCap / token.price) * 1.5),
          },
          socialMetrics: {
            twitterFollowers: Math.floor(Math.random() * 500000) + 1000,
            twitterEngagement: (Math.random() * 5 + 0.5).toFixed(2) + '%',
            telegramMembers: Math.floor(Math.random() * 100000) + 500,
            discordMembers: Math.floor(Math.random() * 80000) + 1000,
            redditSubscribers: Math.floor(Math.random() * 100000) + 500,
            githubStars: Math.floor(Math.random() * 5000) + 10,
            githubCommits: Math.floor(Math.random() * 10000) + 100,
            averageDailyMentions: Math.floor(Math.random() * 1000) + 10,
            twitterViews: Math.floor(Math.random() * 5000000) + 100000,
            twitterLikes: Math.floor(Math.random() * 100000) + 5000,
            twitterReposts: Math.floor(Math.random() * 50000) + 1000,
            socialVolume: Math.floor(Math.random() * 10000) + 500,
            sentimentScore: Math.floor(Math.random() * 100)
          },
          onChainMetrics: {
            activeAddresses: Math.floor(Math.random() * 100000) + 1000,
            transactionVolume: Math.floor(Math.random() * 50000) + 500,
            tvl: token.marketCap * 0.2,
            weeklyActiveUsers: Math.floor(Math.random() * 50000) + 1000,
            developerActivity: Math.floor(Math.random() * 100) + 10,
            gasUsed: Math.floor(Math.random() * 1000000) + 50000,
            contractInteractions: Math.floor(Math.random() * 50000) + 1000,
            dailyTransactions: Math.floor(Math.random() * 100000) + 5000,
            uniqueHolders: Math.floor(Math.random() * 500000) + 10000,
            averageHoldingTime: Math.floor(Math.random() * 365) + 30
          },
          projectInfo: {
            description: `${token.name} (${token.symbol}) é uma criptomoeda ${token.category.toLowerCase()} focada em casos de uso de ${token.narratives.join(', ')}. O projeto visa revolucionar o espaço blockchain fornecendo soluções inovadoras para problemas de escalabilidade e interoperabilidade. Com uma equipe experiente e uma forte comunidade, ${token.symbol} está posicionado para crescimento contínuo no ecossistema cripto.`,
            website: `https://${token.symbol.toLowerCase()}.io`,
            twitter: `https://twitter.com/${token.symbol.toLowerCase()}`,
            github: `https://github.com/${token.symbol.toLowerCase()}`,
            foundingYear: 2018 + Math.floor(Math.random() * 6),
            teamMembers: Math.floor(Math.random() * 30) + 5,
            investors: ['Crypto Capital', 'Blockchain Ventures', 'Digital Assets Fund', 'Coinbase Ventures', 'Binance Labs', 'a16z', 'Paradigm'],
            lastUpdated: new Date().toISOString().split('T')[0],
            tokenomics: {
              distribution: [
                {category: 'Team', percentage: 15},
                {category: 'Investors', percentage: 25},
                {category: 'Ecosystem', percentage: 30},
                {category: 'Community', percentage: 20},
                {category: 'Treasury', percentage: 10}
              ],
              initialSupply: Math.floor(token.marketCap / token.price) * 0.7,
              inflation: Math.random() * 10,
              vestingSchedule: '3 anos com liberação linear trimestral',
              unlockDetails: 'Próximo evento de desbloqueio: 15% em 3 meses'
            },
            team: [
              {name: 'Alex Smith', role: 'CEO & Founder'},
              {name: 'Maria Garcia', role: 'CTO'},
              {name: 'John Patel', role: 'Head of Research'},
              {name: 'Sarah Kim', role: 'Lead Developer'}
            ]
          },
          riskAnalysis: {
            volatilityScore: Math.floor(Math.random() * 100),
            regulatoryRisk: Math.floor(Math.random() * 100),
            competitionRisk: Math.floor(Math.random() * 100),
            technicalRisk: Math.floor(Math.random() * 100),
            auditStatus: Math.random() > 0.3 ? 'Sim, por CertiK e Trail of Bits' : 'Auditorias limitadas',
            returnPotential: Math.floor(Math.random() * 10) + 1,
            riskReturnRatio: Number((Math.random() * 5 + 0.5).toFixed(1))
          },
          walletMovements: [
            {
              walletAddress: '0x' + Math.random().toString(16).substring(2, 12) + '...',
              amount: Math.floor(Math.random() * 1000000),
              direction: 'in',
              timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
              walletTag: 'Whale 1',
              txHash: '0x' + Math.random().toString(16).substring(2, 66)
            },
            {
              walletAddress: '0x' + Math.random().toString(16).substring(2, 12) + '...',
              amount: Math.floor(Math.random() * 500000),
              direction: 'out',
              timestamp: new Date(Date.now() - Math.random() * 86400000 * 1.5).toISOString(),
              walletTag: 'Exchange',
              txHash: '0x' + Math.random().toString(16).substring(2, 66)
            },
            {
              walletAddress: '0x' + Math.random().toString(16).substring(2, 12) + '...',
              amount: Math.floor(Math.random() * 2000000),
              direction: 'in',
              timestamp: new Date(Date.now() - Math.random() * 86400000 * 1).toISOString(),
              walletTag: 'Whale 2',
              txHash: '0x' + Math.random().toString(16).substring(2, 66)
            },
            {
              walletAddress: '0x' + Math.random().toString(16).substring(2, 12) + '...',
              amount: Math.floor(Math.random() * 300000),
              direction: 'out',
              timestamp: new Date(Date.now() - Math.random() * 86400000 * 0.5).toISOString(),
              walletTag: 'Whale 3',
              txHash: '0x' + Math.random().toString(16).substring(2, 66)
            },
            {
              walletAddress: '0x' + Math.random().toString(16).substring(2, 12) + '...',
              amount: Math.floor(Math.random() * 800000),
              direction: 'in',
              timestamp: new Date(Date.now() - Math.random() * 3600000 * 2).toISOString(),
              walletTag: 'Investor',
              txHash: '0x' + Math.random().toString(16).substring(2, 66)
            }
          ]
        };
        resolve(extendedData);
      }, 1000);
    });
  };
  
  // Função para formatar valores em bilhões, milhões, etc.
  const formatCurrency = (value: number | undefined | string): string => {
    if (!value) return '$0';
    
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? Number(value) : value;
    
    if (numValue >= 1_000_000_000) {
      return `$${(numValue / 1_000_000_000).toFixed(2)}B`;
    } else if (numValue >= 1_000_000) {
      return `$${(numValue / 1_000_000).toFixed(2)}M`;
    } else if (numValue >= 1_000) {
      return `$${(numValue / 1_000).toFixed(2)}K`;
    } else {
      return `$${numValue.toFixed(2)}`;
    }
  };
  
  // Função para formatar valores de tokens
  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2)}M`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(2)}K`;
    } else {
      return amount.toFixed(2);
    }
  };
  
  // Função para renderizar barras de progresso
  const renderProgressBar = (percentage: number) => {
    const getColorClass = (pct: number) => {
      if (pct < 25) return 'from-red-500 to-red-400';
      if (pct < 50) return 'from-yellow-500 to-yellow-400';
      if (pct < 75) return 'from-blue-500 to-blue-400';
      return 'from-green-500 to-green-400';
    };
    
    return (
      <div className="w-full h-2 bg-zinc-800 rounded-full mt-2">
        <div 
          className={`h-full bg-gradient-to-r ${getColorClass(percentage)} rounded-full`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };
  
  // Função para renderizar gráfico de distribuição de tokenomics
  const renderTokenDistribution = (distribution: Array<{category: string, percentage: number}>) => {
    return (
      <div className="w-full h-4 rounded-full overflow-hidden flex">
        {distribution.map((segment, i) => (
          <div 
            key={i}
            className={`h-full ${getDistributionColor(segment.category)}`}
            style={{ width: `${segment.percentage}%` }}
            title={`${segment.category}: ${segment.percentage}%`}
          />
        ))}
      </div>
    );
  };
  
  // Função para determinar cores para os segmentos do gráfico de tokenomics
  const getDistributionColor = (category: string): string => {
    const colors: {[key: string]: string} = {
      'Team': 'bg-blue-500',
      'Investors': 'bg-purple-500',
      'Foundation': 'bg-green-500',
      'Ecosystem': 'bg-yellow-500',
      'Community': 'bg-red-500',
      'Treasury': 'bg-indigo-500',
      'Advisors': 'bg-pink-500',
      'Public Sale': 'bg-cyan-500',
      'Private Sale': 'bg-amber-500',
      'Liquidity': 'bg-emerald-500',
      'Staking Rewards': 'bg-teal-500',
      'Airdrop': 'bg-orange-500'
    };
    
    return colors[category] || 'bg-gray-500';
  };
  
  // Funções de formatação
  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 0.01) return price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    return price.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  };
  
  const formatPriceChange = (priceChange: number): string => {
    return Math.abs(priceChange).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} segundos atrás`;
    }
    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    }
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  };
  
  // Função para gerar e baixar um PDF com análise do token
  const generateAndDownloadPDF = (token: TokenData) => {
    // Em um cenário real, isso poderia chamar uma API para gerar um PDF
    // Por enquanto, vamos simular criando um arquivo de texto
    
    const analysisText = `
    RELATÓRIO DE ANÁLISE: ${token.name} (${token.symbol})
    =============================================
    
    Resumo das notícias recentes:
    -----------------------------
    1. ${token.name} anunciou parceria com grande empresa de pagamentos
       Impacto: Alto - A integração permitirá transações mais rápidas e taxas reduzidas
    
    2. Atualização de protocolo em desenvolvimento
       Impacto: Médio - Melhorias de escalabilidade e redução de custos de transação
    
    3. Aumento de 40% na atividade de desenvolvimento
       Impacto: Médio-Longo prazo - Mostra comprometimento da equipe com o projeto
    
    Indicadores chave:
    -----------------
    - Preço atual: $${token.price}
    - Variação 24h: ${token.priceChange24h}%
    - Market Cap: ${formatCurrency(token.marketCap)}
    - Sentimento social: ${extendedData?.socialMetrics?.sentimentScore || 0}/100
    
    Análise de risco/retorno:
    -----------------------
    - Volatilidade: ${extendedData?.riskAnalysis?.volatilityScore || 0}/100
    - Risco regulatório: ${extendedData?.riskAnalysis?.regulatoryRisk || 0}/100
    - Risco de competição: ${extendedData?.riskAnalysis?.competitionRisk || 0}/100
    - Potencial de retorno: ${extendedData?.riskAnalysis?.returnPotential || 0}/10
    
    Conclusão:
    ---------
    ${getProjectSpecificAnalysis(token)}
    
    Relatório gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}
    `;
    
    // Criar um blob e download
    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.symbol}_analysis_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Função para fornecer análises específicas por projeto
  const getProjectSpecificAnalysis = (token: TokenData): string => {
    const analysisMap: Record<string, string> = {
      'BTC': `Bitcoin (BTC) está mostrando força contínua após o halving recente, com adoção institucional crescente via ETFs aprovados. Análise on-chain mostra acumulação por grandes players. Potencial de valorização significativo nos próximos meses, especialmente se a macroeconomia global continuar favorável.`,
      'ETH': `Ethereum (ETH) está em momento crucial com a transição completa para Proof-of-Stake e implementação do EIP-4844. As melhorias de escalabilidade e a redução nas taxas são fatores positivos, enquanto o atraso do ETF spot gera alguma incerteza. Considera-se um investimento sólido de médio-longo prazo.`,
      'SOL': `Solana (SOL) demonstra recuperação técnica impressionante após os eventos FTX, com crescimento rápido no ecossistema DeFi e NFT. O token tem mostrado resiliência, mas enfrenta competição intensa de outras L1s e L2s. Risco moderado com potencial de alto retorno.`,
      'BNB': `Binance Coin (BNB) apresenta estabilidade significativa apesar das pressões regulatórias sobre a Binance. O ecossistema BNB Chain continua expandindo com novos projetos e parcerias. O token tem um caso de uso claro e fluxo constante de queima, o que o torna uma opção de risco moderado.`,
      'XRP': `Ripple (XRP) vem recuperando posições após a vitória parcial contra a SEC, com novas parcerias institucionais para pagamentos transfronteiriços. A adoção internacional continua crescendo, especialmente na Ásia. A resolução completa do caso judicial ainda é um catalisador potencial importante.`,
      'DOT': `Polkadot (DOT) está intensificando o desenvolvimento de parachains e cross-chain interoperability. O ecossistema está amadurecendo com mais aplicações live. A governança on-chain e o staking apresentam vantagens competitivas, mas o crescimento tem sido mais lento que o esperado.`,
      'DOGE': `Dogecoin (DOGE) mantém uma comunidade forte e tem impulsos periódicos baseados em menções de Elon Musk e integração com X. Como um meme coin com histórico, apresenta volatilidade extrema. Investir apenas com capital de risco e com cautela devido à falta de utilidade significativa.`,
      'LINK': `Chainlink (LINK) continua liderando o setor de oráculos com novas integrações e soluções como CCIP e Chainlink Functions. Fundamental para o crescimento de DeFi e contratos inteligentes. O modelo econômico revisado e o staking atualizado prometem melhorar a tokenomics. Recomendado para exposição à infraestrutura blockchain.`,
      'ADA': `Cardano (ADA) avança com atualizações consistentes e metodologia acadêmica rigorosa. O lançamento do DeFi e contratos inteligentes tem sido mais lento que concorrentes, mas com maior ênfase em segurança. Desenvolvimento constante com roadmap claro, mas precisa acelerar adoção real.`,
      'MATIC': `Polygon (MATIC) expandiu significativamente além de ser apenas uma solução de escala para Ethereum com o lançamento de zkEVM e múltiplas soluções de L2. Parcerias empresariais e grande adoção são pontos fortes, enquanto a competição com outras L2s continua intensa. Bom potencial de valorização com risco controlado.`
    };
    
    return analysisMap[token.symbol] || 
      `${token.symbol} apresenta ${extendedData?.riskAnalysis?.returnPotential && extendedData?.riskAnalysis?.returnPotential > 7 ? 'alto' : extendedData?.riskAnalysis?.returnPotential && extendedData?.riskAnalysis?.returnPotential > 4 ? 'médio' : 'baixo'} potencial de retorno com ${extendedData?.riskAnalysis?.volatilityScore && extendedData?.riskAnalysis?.volatilityScore > 70 ? 'alta' : extendedData?.riskAnalysis?.volatilityScore && extendedData?.riskAnalysis?.volatilityScore > 40 ? 'média' : 'baixa'} volatilidade. Os principais riscos incluem ${extendedData?.riskAnalysis?.regulatoryRisk && extendedData?.riskAnalysis?.regulatoryRisk > 70 ? 'regulação, ' : ''}${extendedData?.riskAnalysis?.competitionRisk && extendedData?.riskAnalysis?.competitionRisk > 70 ? 'competição forte, ' : ''}${extendedData?.riskAnalysis?.technicalRisk && extendedData?.riskAnalysis?.technicalRisk > 70 ? 'complexidade técnica' : ''}. Recomendado para investidores com ${extendedData?.riskAnalysis?.volatilityScore && extendedData?.riskAnalysis?.volatilityScore > 60 ? 'alta' : 'média'} tolerância a risco.`;
  };
  
  // Função para obter links corretos com base no símbolo do token
  const getCorrectLink = (symbol: string, linkType: 'website' | 'twitter' | 'github'): string => {
    const links: Record<string, Record<'website' | 'twitter' | 'github', string>> = {
      'BTC': {
        website: 'https://bitcoin.org',
        twitter: 'https://twitter.com/Bitcoin',
        github: 'https://github.com/bitcoin/bitcoin'
      },
      'ETH': {
        website: 'https://ethereum.org',
        twitter: 'https://twitter.com/ethereum',
        github: 'https://github.com/ethereum'
      },
      'SOL': {
        website: 'https://solana.com',
        twitter: 'https://twitter.com/solana',
        github: 'https://github.com/solana-labs'
      },
      'BNB': {
        website: 'https://www.bnbchain.org',
        twitter: 'https://twitter.com/bnbchain',
        github: 'https://github.com/bnb-chain'
      },
      'XRP': {
        website: 'https://ripple.com',
        twitter: 'https://twitter.com/Ripple',
        github: 'https://github.com/ripple'
      },
      'DOGE': {
        website: 'https://dogecoin.com',
        twitter: 'https://twitter.com/dogecoin',
        github: 'https://github.com/dogecoin/dogecoin'
      },
      'ADA': {
        website: 'https://cardano.org',
        twitter: 'https://twitter.com/cardano',
        github: 'https://github.com/input-output-hk/cardano-node'
      },
      'LINK': {
        website: 'https://chain.link',
        twitter: 'https://twitter.com/chainlink',
        github: 'https://github.com/smartcontractkit/chainlink'
      },
      'DOT': {
        website: 'https://polkadot.network',
        twitter: 'https://twitter.com/Polkadot',
        github: 'https://github.com/paritytech/polkadot'
      },
      'MATIC': {
        website: 'https://polygon.technology',
        twitter: 'https://twitter.com/0xPolygon',
        github: 'https://github.com/maticnetwork'
      }
    };
    
    if (links[symbol] && links[symbol][linkType]) {
      return links[symbol][linkType];
    }
    
    // Links padrão se o token não estiver no mapeamento
    const defaults = {
      website: `https://${symbol.toLowerCase()}.io`,
      twitter: `https://twitter.com/${symbol.toLowerCase()}`,
      github: `https://github.com/${symbol.toLowerCase()}`
    };
    
    return defaults[linkType];
  };
  
  // Função para obter o status de auditoria de cada token
  const getAuditStatus = (symbol: string): string[] => {
    const auditMap: Record<string, string[]> = {
      'BTC': [], // Bitcoin não precisa de auditoria tradicional devido ao seu design
      'ETH': ['ConsenSys Diligence', 'Trail of Bits', 'Runtime Verification'],
      'SOL': ['Kudelski Security', 'OtterSec'],
      'BNB': ['CertiK', 'PeckShield', 'SlowMist'],
      'XRP': ['Bishop Fox'],
      'DOT': ['NCC Group', 'Quarkslab'],
      'DOGE': [], // Sem auditorias formais
      'ADA': ['Root9B', 'FP Complete'],
      'LINK': ['Sigma Prime', 'Trail of Bits'],
      'MATIC': ['Certik', 'Consensys', 'Quantstamp'],
      'UNI': ['ABDK Consulting', 'Trail of Bits'],
      'AVAX': ['Certik', 'Halborn'],
      'AAVE': ['OpenZeppelin', 'Trail of Bits', 'SigmaPrime'],
      'ATOM': ['Informal Systems', 'CertiK'],
      'NEAR': ['ABDK Consulting', 'NCC Group']
    };

    return auditMap[symbol] || (extendedData?.riskAnalysis?.auditStatus?.includes('CertiK') ? ['CertiK'] : 
           extendedData?.riskAnalysis?.auditStatus?.includes('Trail of Bits') ? ['Trail of Bits'] : []);
  };

  // Função para obter classes de cores para diferentes auditores
  const getAuditorColorClass = (auditor: string): string => {
    const colorMap: Record<string, string> = {
      'CertiK': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Trail of Bits': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'OpenZeppelin': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'PeckShield': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Kudelski Security': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'ConsenSys Diligence': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Quantstamp': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Runtime Verification': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'NCC Group': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Sigma Prime': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'ABDK Consulting': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'SlowMist': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
      'OtterSec': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'Bishop Fox': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      'Quarkslab': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Root9B': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      'FP Complete': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
      'Halborn': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Informal Systems': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
    };

    return colorMap[auditor] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  // Função para obter dados da equipe para cada token
  const getProjectTeam = (symbol: string): Array<{name: string, role: string}> => {
    const teamMap: Record<string, Array<{name: string, role: string}>> = {
      'BTC': [
        {name: 'Satoshi Nakamoto', role: 'Founder (pseudonym)'},
        {name: 'Wladimir van der Laan', role: 'Lead Maintainer (Bitcoin Core)'},
        {name: 'Jonas Schnelli', role: 'Core Developer'},
        {name: 'Pieter Wuille', role: 'Core Developer'}
      ],
      'ETH': [
        {name: 'Vitalik Buterin', role: 'Co-Founder'},
        {name: 'Joseph Lubin', role: 'Co-Founder'},
        {name: 'Tim Beiko', role: 'Protocol Lead'},
        {name: 'Danny Ryan', role: 'Ethereum 2.0 Researcher'}
      ],
      'SOL': [
        {name: 'Anatoly Yakovenko', role: 'Co-Founder & CEO'},
        {name: 'Raj Gokal', role: 'Co-Founder & COO'},
        {name: 'Greg Fitzgerald', role: 'CTO'},
        {name: 'Eric Williams', role: 'Chief Scientist'}
      ],
      'BNB': [
        {name: 'Changpeng Zhao (CZ)', role: 'Founder & Former CEO'},
        {name: 'Yi He', role: 'Co-Founder'},
        {name: 'Richard Teng', role: 'CEO'},
        {name: 'Teck Chia', role: 'Head of BNB Chain'}
      ],
      'XRP': [
        {name: 'Brad Garlinghouse', role: 'CEO'},
        {name: 'David Schwartz', role: 'CTO'},
        {name: 'Chris Larsen', role: 'Executive Chairman & Co-founder'},
        {name: 'Monica Long', role: 'President'}
      ],
      'DOT': [
        {name: 'Dr. Gavin Wood', role: 'Founder'},
        {name: 'Robert Habermeier', role: 'Co-Founder'},
        {name: 'Peter Czaban', role: 'Co-Founder'},
        {name: 'Björn Wagner', role: 'CEO of Parity Technologies'}
      ],
      'DOGE': [
        {name: 'Billy Markus', role: 'Co-Founder (no longer active)'},
        {name: 'Jackson Palmer', role: 'Co-Founder (no longer active)'},
        {name: 'Ross Nicoll', role: 'Core Developer'},
        {name: 'Michi Lumin', role: 'Core Developer'}
      ],
      'ADA': [
        {name: 'Charles Hoskinson', role: 'Founder & CEO of IOHK'},
        {name: 'Jeremy Wood', role: 'Co-Founder of IOHK'},
        {name: 'Aggelos Kiayias', role: 'Chief Scientist'},
        {name: 'Philip Wadler', role: 'Lead Developer, Plutus'}
      ],
      'LINK': [
        {name: 'Sergey Nazarov', role: 'Co-Founder & CEO'},
        {name: 'Steve Ellis', role: 'Co-Founder & CTO'},
        {name: 'Dr. Ari Juels', role: 'Chief Scientist'},
        {name: 'Keenan Olsen', role: 'Head of Community & Partnerships'}
      ],
      'MATIC': [
        {name: 'Sandeep Nailwal', role: 'Co-Founder'},
        {name: 'Jaynti Kanani', role: 'Co-Founder & CEO'},
        {name: 'Anurag Arjun', role: 'Co-Founder'},
        {name: 'Mihailo Bjelic', role: 'Co-Founder'}
      ]
    };

    return teamMap[symbol] || extendedData?.projectInfo?.team || [];
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with token info and back button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{token.name} ({token.symbol})</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xl font-mono">${formatPrice(token.price)}</p>
            <div className={`flex items-center text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {token.priceChange24h >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {formatPriceChange(token.priceChange24h)}% (24h)
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </button>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(token.marketCap)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              FDV: {formatCurrency(Number(extendedData?.marketData?.fullyDilutedValuation || token.marketCap * 1.5))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Volume 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(extendedData?.marketData?.volume24h || token.marketCap * 0.15))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Vol/MCap: {((Number(extendedData?.marketData?.volumeToMarketCap || 0.15)) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categoria & Narrativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-800 text-white">
              {token.category}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {token.narratives.map((narrative, i) => (
                <span key={i} className="text-xs bg-blue-500/20 text-blue-400 rounded-full px-2 py-0.5">
                  {narrative}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* ATH & ATL */}
        {token.marketData && (
          <>
            <Card className="p-4">
              <h4 className="font-bold mb-2">All-Time High</h4>
              <div className="flex items-center">
                <p className="text-xl font-semibold">
                  ${token.marketData.allTimeHigh.toLocaleString()}
                </p>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(token.marketData.allTimeHighDate).toLocaleDateString()}
                </span>
              </div>
              {renderProgressBar(
                Math.round((token.price / token.marketData.allTimeHigh) * 100)
              )}
            </Card>

            <Card className="p-4">
              <h4 className="font-bold mb-2">All-Time Low</h4>
              <div className="flex items-center">
                <p className="text-xl font-semibold">
                  ${token.marketData.allTimeLow.toLocaleString()}
                </p>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(token.marketData.allTimeLowDate).toLocaleDateString()}
                </span>
              </div>
              {renderProgressBar(
                Math.round((token.price / token.marketData.allTimeLow) * 100 > 100 ? 100 : (token.price / token.marketData.allTimeLow) * 100)
              )}
            </Card>
          </>
        )}
      </div>

      {/* Supply Information */}
      {token.marketData && (
        <div className="mt-4">
          <h4 className="font-bold text-sm">Supply</h4>
          <div className="flex items-center mt-1 space-x-2">
            <div className="flex-grow">
              {renderProgressBar(
                Math.round((token.marketData.circulatingSupply / token.marketData.maxSupply) * 100)
              )}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatCurrency(token.marketData.circulatingSupply)} / {formatCurrency(token.marketData.maxSupply)}
            </span>
          </div>
        </div>
      )}
      
      {/* On-Chain Data Section (Updated) */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="text-xl font-bold">Dados On-Chain</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 px-6 py-4">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-500" /> 
                <h4 className="font-bold text-lg">Métricas de Atividade</h4>
              </div>
            </div>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4 mr-1 text-green-500" /> Endereços Ativos
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.onChainMetrics?.activeAddresses || 0)}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      style={{ width: `${Math.min((extendedData?.onChainMetrics?.activeAddresses || 0) / 10000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4 mr-1 text-green-500" /> Tempo Médio Holding
                  </div>
                  <div className="text-xl font-bold">
                    {extendedData?.onChainMetrics?.averageHoldingTime || 0} dias
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      style={{ width: `${Math.min((extendedData?.onChainMetrics?.averageHoldingTime || 0) / 180 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <LayoutGrid className="h-4 w-4 mr-1 text-green-500" /> Tx Diárias
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.onChainMetrics?.dailyTransactions || 0)}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      style={{ width: `${Math.min((extendedData?.onChainMetrics?.dailyTransactions || 0) / 50000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <UserCheck className="h-4 w-4 mr-1 text-green-500" /> Holders Únicos
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.onChainMetrics?.uniqueHolders || 0)}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      style={{ width: `${Math.min((extendedData?.onChainMetrics?.uniqueHolders || 0) / 250000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/10 px-6 py-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" /> 
                <h4 className="font-bold text-lg">Métricas Financeiras</h4>
              </div>
            </div>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Lock className="h-4 w-4 mr-1 text-blue-500" /> TVL
                  </div>
                  <div className="text-xl font-bold">
                    {formatCurrency(Number(extendedData?.onChainMetrics?.tvl || 0))}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" 
                      style={{ width: `${Math.min((Number(extendedData?.onChainMetrics?.tvl || 0)) / (Number(token.marketCap) / 2) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <ArrowLeftRight className="h-4 w-4 mr-1 text-blue-500" /> Volume On-Chain
                  </div>
                  <div className="text-xl font-bold">
                    {formatCurrency(Number(extendedData?.onChainMetrics?.transactionVolume || 0))}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" 
                      style={{ width: `${Math.min((Number(extendedData?.onChainMetrics?.transactionVolume || 0)) / 25000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Flame className="h-4 w-4 mr-1 text-blue-500" /> Gas Utilizado
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.onChainMetrics?.gasUsed || 0)}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" 
                      style={{ width: `${Math.min((extendedData?.onChainMetrics?.gasUsed || 0) / 500000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Share2 className="h-4 w-4 mr-1 text-blue-500" /> Usuários Ativos
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.onChainMetrics?.weeklyActiveUsers || 0)}
                  </div>
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2">
                    <div 
                      className="h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" 
                      style={{ width: `${Math.min((extendedData?.onChainMetrics?.weeklyActiveUsers || 0) / 25000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Social Metrics Section (New) */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
          <h3 className="text-xl font-bold">Volume Social</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Twitter className="h-4 w-4 mr-2 text-blue-400" /> 
                Dados de Engajamento Social
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Eye className="h-4 w-4 mr-1" /> Visualizações
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.socialMetrics?.twitterViews || 0)}
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Heart className="h-4 w-4 mr-1" /> Curtidas
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.socialMetrics?.twitterLikes || 0)}
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Repeat className="h-4 w-4 mr-1" /> Compartilhamentos
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.socialMetrics?.twitterReposts || 0)}
                  </div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4 mr-1" /> Seguidores
                  </div>
                  <div className="text-xl font-bold">
                    {formatTokenAmount(extendedData?.socialMetrics?.twitterFollowers || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-green-500" /> 
                Tendências e Sentimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume Social Diário</span>
                  <span className="font-medium">{formatTokenAmount(extendedData?.socialMetrics?.socialVolume || 0)}</span>
                </div>
                {renderProgressBar(Math.min((extendedData?.socialMetrics?.socialVolume || 0) / 5000 * 100, 100))}
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Menções Diárias</span>
                  <span className="font-medium">{formatTokenAmount(extendedData?.socialMetrics?.averageDailyMentions || 0)}</span>
                </div>
                {renderProgressBar(Math.min((extendedData?.socialMetrics?.averageDailyMentions || 0) / 500 * 100, 100))}
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sentimento (0-100)</span>
                  <span className="font-medium">{extendedData?.socialMetrics?.sentimentScore || 0}</span>
                </div>
                {renderProgressBar(extendedData?.socialMetrics?.sentimentScore || 0)}
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Engajamento</span>
                  <span className="font-medium">{extendedData?.socialMetrics?.twitterEngagement || '0%'}</span>
                </div>
                {renderProgressBar(parseFloat((extendedData?.socialMetrics?.twitterEngagement || '0%').replace('%', '')))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atualizações recentes importantes */}
        <Card className="mt-4 relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" /> 
              Atualizações Importantes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Twitter className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">{token.name} anunciou parceria com grande empresa de pagamentos</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    A integração permitirá transações mais rápidas e com taxas reduzidas, expandindo significativamente o caso de uso do token.
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">2 dias atrás • Impacto potencial: Alto</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">CoinTelegraph: {token.symbol} implementará atualização de protocolo</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    A atualização visa melhorar a escalabilidade e reduzir custos de transação em aproximadamente 30%, segundo análise técnica.
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">5 dias atrás • Impacto potencial: Médio</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Github className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium">Atividade de desenvolvimento aumentou em 40%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Análise do repositório GitHub mostra aumento significativo nos commits e contribuições de desenvolvedores nas últimas 2 semanas.
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">1 semana atrás • Impacto potencial: Médio-Longo prazo</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => generateAndDownloadPDF(token)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Baixar Resumo
            </button>
          </CardContent>
        </Card>
      </div>
      
      {/* Whale Wallet Movements Section (New) */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <Wallet className="h-5 w-5 mr-2 text-amber-500" />
          <h3 className="text-xl font-bold">Movimentações de Baleias (CoinStats)</h3>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Carteira</TableHead>
                  <TableHead>Etiqueta</TableHead>
                  <TableHead>Direção</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extendedData?.walletMovements?.map((movement: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">
                      {movement.walletAddress}
                    </TableCell>
                    <TableCell>{movement.walletTag}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${movement.direction === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                        {movement.direction === 'in' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        {movement.direction === 'in' ? 'Entrada' : 'Saída'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTokenAmount(movement.amount)} {token.symbol}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatTimeAgo(movement.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Project Overview & Analysis (New) */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="text-xl font-bold">Relatório do Projeto</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{extendedData?.projectInfo?.description}</p>
                
                {extendedData?.projectInfo?.tokenomics && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Tokenomics</h4>
                    <div className="mb-2">
                      {renderTokenDistribution(extendedData.projectInfo.tokenomics.distribution)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {extendedData.projectInfo.tokenomics.distribution.map((segment: {category: string, percentage: number}, i: number) => (
                        <div key={i} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${getDistributionColor(segment.category)} mr-1`}></div>
                          <span>{segment.category}: {segment.percentage}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Fornecimento Inicial:</span>
                        <span className="ml-2 font-medium">{formatTokenAmount(extendedData.projectInfo.tokenomics.initialSupply)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Inflação Anual:</span>
                        <span className="ml-2 font-medium">{extendedData.projectInfo.tokenomics.inflation.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cronograma de Vesting:</span>
                        <span className="ml-2 font-medium">{extendedData.projectInfo.tokenomics.vestingSchedule}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Próximo Desbloqueio:</span>
                        <span className="ml-2 font-medium">{extendedData.projectInfo.tokenomics.unlockDetails}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {extendedData?.projectInfo?.team && getProjectTeam(token.symbol).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Equipe</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getProjectTeam(token.symbol).map((member, i) => (
                        <div key={i} className="text-sm">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Informações Adicionais</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ano de Fundação:</span>
                      <span className="ml-2 font-medium">{extendedData?.projectInfo?.foundingYear}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Membros na Equipe:</span>
                      <span className="ml-2 font-medium">{extendedData?.projectInfo?.teamMembers}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Investidores:</span>
                      <span className="ml-2 font-medium">{extendedData?.projectInfo?.investors?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última Atualização:</span>
                      <span className="ml-2 font-medium">{extendedData?.projectInfo?.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="flex mt-4 space-x-3">
                    <a href={getCorrectLink(token.symbol, 'website')} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center text-xs text-blue-500 hover:text-blue-700">
                      <Globe className="h-4 w-4 mr-1" /> Website
                    </a>
                    <a href={getCorrectLink(token.symbol, 'twitter')} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center text-xs text-blue-500 hover:text-blue-700">
                      <Twitter className="h-4 w-4 mr-1" /> Twitter
                    </a>
                    <a href={getCorrectLink(token.symbol, 'github')} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center text-xs text-blue-500 hover:text-blue-700">
                      <Github className="h-4 w-4 mr-1" /> GitHub
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Análise de Risco/Retorno</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Volatilidade</span>
                    <span className="text-sm font-medium">{extendedData?.riskAnalysis?.volatilityScore}/100</span>
                  </div>
                  {renderProgressBar(extendedData?.riskAnalysis?.volatilityScore || 0)}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Risco Regulatório</span>
                    <span className="text-sm font-medium">{extendedData?.riskAnalysis?.regulatoryRisk}/100</span>
                  </div>
                  {renderProgressBar(extendedData?.riskAnalysis?.regulatoryRisk || 0)}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Risco de Competição</span>
                    <span className="text-sm font-medium">{extendedData?.riskAnalysis?.competitionRisk}/100</span>
                  </div>
                  {renderProgressBar(extendedData?.riskAnalysis?.competitionRisk || 0)}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Risco Técnico</span>
                    <span className="text-sm font-medium">{extendedData?.riskAnalysis?.technicalRisk}/100</span>
                  </div>
                  {renderProgressBar(extendedData?.riskAnalysis?.technicalRisk || 0)}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Potencial de Retorno</span>
                    <div className="flex items-center">
                      {Array.from({length: 5}).map((_, i) => (
                        <Zap key={i} className={`h-4 w-4 ${i < (extendedData?.riskAnalysis?.returnPotential || 0) / 2 ? 'text-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Auditoria</span>
                    <div className="flex space-x-1">
                      {getAuditStatus(token.symbol).map((auditor, index) => (
                        <span key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAuditorColorClass(auditor)}`}>
                          {auditor}
                        </span>
                      ))}
                      {getAuditStatus(token.symbol).length === 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Sem Auditoria
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Proporção Risco/Retorno</span>
                    <span className="text-sm font-medium">{extendedData?.riskAnalysis?.riskReturnRatio}/5</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-amber-500" /> 
                    Resumo da Análise
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {getProjectSpecificAnalysis(token)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 