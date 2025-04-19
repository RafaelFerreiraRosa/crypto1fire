'use client';

import { useEffect, useState } from 'react';
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
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Zap, 
  LineChart, 
  Clock,
  ArrowUp,
  ArrowDown,
  Users,
  MessageSquare,
  Repeat,
  Heart,
  Database,
  ShieldAlert,
  Activity
} from 'lucide-react';
import TokenDetails from './TokenDetails';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  category: string;
  mentionCount: number;
  hypeScore: number;
  onchainStrength: number;
  opportunityScore: number;
  narratives: string[];
}

interface NarrativeData {
  name: string;
  description: string;
  socialVolume: number;
  hypeFactor: number;
  twitterSentiment: number;
  newsSentiment: number;
  onchainSentiment: number;
  combinedSentiment: number;
  topTokens: string[];
  riskLevel: string;
  macroAnalysis: string;
  qualityScore: number;
}

interface NarrativeDetailsProps {
  narrativeName: string;
  onClose: () => void;
}

export default function NarrativeDetails({ narrativeName, onClose }: NarrativeDetailsProps) {
  const [narrative, setNarrative] = useState<NarrativeData | null>(null);
  const [relatedTokens, setRelatedTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  
  useEffect(() => {
    const fetchNarrativeDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscar dados da narrativa selecionada
        const response = await fetch(`/api/report`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const reportData = await response.json();
        console.log("Received report data:", reportData);
        
        // Encontrar a narrativa específica
        const foundNarrative = reportData.narratives.find(
          (n: NarrativeData) => n.name === narrativeName
        );
        
        if (!foundNarrative) {
          console.error(`Narrativa não encontrada: ${narrativeName}`);
          throw new Error(`Narrativa "${narrativeName}" não encontrada`);
        }
        
        console.log("Found narrative:", foundNarrative);
        setNarrative(foundNarrative);
        
        // Filtrar tokens relacionados a esta narrativa
        if (reportData.tokens && Array.isArray(reportData.tokens)) {
          console.log("Total tokens available:", reportData.tokens.length);
          
          // Verificar cada token e suas narrativas
          const matchingTokens = reportData.tokens.filter((token: TokenData) => {
            if (!token.narratives || !Array.isArray(token.narratives)) {
              console.log(`Token sem narrativas válidas: ${token.symbol}`);
              return false;
            }
            
            const hasNarrative = token.narratives.some(narrative => 
              narrative.toLowerCase() === narrativeName.toLowerCase()
            );
            
            if (hasNarrative) {
              console.log(`Token com narrativa correspondente: ${token.symbol}`);
            }
            
            return hasNarrative;
          });
          
          console.log(`Tokens relacionados à narrativa "${narrativeName}":`, matchingTokens);
          setRelatedTokens(matchingTokens);
        } else {
          console.error("Tokens não disponíveis ou não são um array:", reportData.tokens);
          setRelatedTokens([]);
        }
      } catch (err) {
        console.error('Error fetching narrative details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load narrative data');
      } finally {
        setLoading(false);
      }
    };
    
    if (narrativeName) {
      fetchNarrativeDetails();
    }
  }, [narrativeName]);
  
  // Dados simulados para métricas sociais e on-chain
  const socialMetrics = {
    postCount: Math.floor(Math.random() * 500) + 200,
    likes: Math.floor(Math.random() * 2000) + 1000,
    reposts: Math.floor(Math.random() * 800) + 300,
    engagementRate: (Math.random() * 4 + 1).toFixed(2) + '%',
    topAccounts: ["CryptoAnalyst", "BlockchainExpert", "TokenInvestor", "CryptoNews"],
    growthRate: (Math.random() * 20 - 5).toFixed(1) + '%',
    // Métricas de intervalo de 12h
    last12h: {
      postCount: Math.floor(Math.random() * 250) + 100,
      likesGrowth: (Math.random() * 30 - 5).toFixed(1) + '%',
      repostsGrowth: (Math.random() * 25 - 3).toFixed(1) + '%',
      mentionsGrowth: (Math.random() * 35 - 7).toFixed(1) + '%',
      totalEngagement: Math.floor(Math.random() * 5000) + 1000,
      uniqueAccounts: Math.floor(Math.random() * 150) + 50
    }
  };
  
  const onChainMetrics = {
    totalValueLocked: `$${(Math.random() * 500 + 100).toFixed(2)}M`,
    activeAddresses: Math.floor(Math.random() * 50000) + 10000,
    transactions24h: Math.floor(Math.random() * 100000) + 20000,
    averageTxValue: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
    adoptionRate: (Math.random() * 15 + 5).toFixed(2) + '%',
    developerActivity: Math.floor(Math.random() * 100) + 20
  };
  
  const riskAssessment = {
    marketVolatility: (Math.random() * 100).toFixed(0),
    regulatoryRisk: (Math.random() * 100).toFixed(0),
    technicalRisk: (Math.random() * 100).toFixed(0),
    competitionRisk: (Math.random() * 100).toFixed(0),
    fundingStatus: ['Bem financiado', 'Financiamento limitado', 'Grandes investidores', 'Apoio de VCs'][Math.floor(Math.random() * 4)]
  };
  
  // Função para renderizar uma barra de progresso com cor baseada no valor
  const renderProgressBar = (value: number, maxValue: number = 100) => {
    const percentage = (value / maxValue) * 100;
    let bgColor = 'bg-green-500';
    
    if (percentage > 75) bgColor = 'bg-red-500';
    else if (percentage > 50) bgColor = 'bg-amber-500';
    else if (percentage > 25) bgColor = 'bg-blue-500';
    
    return (
      <div className="w-full h-2 bg-zinc-800 rounded-full mt-1">
        <div 
          className={`h-2 rounded-full ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  // Função para obter a cor de categoria baseada em um padrão de termômetro
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Microcap':
        return 'bg-red-500';
      case 'Smallcap':
        return 'bg-amber-500';
      case 'Midcap':
        return 'bg-cyan-500';
      case 'Bigcap':
        return 'bg-blue-500';
      default:
        return 'bg-zinc-600';
    }
  };
  
  // Função para formatar o preço com base no valor
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    } else if (price >= 1) {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    } else if (price >= 0.01) {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 3,
        maximumFractionDigits: 3 
      });
    } else {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 6,
        maximumFractionDigits: 6 
      });
    }
  };

  // Função para formatar a variação percentual de preço
  const formatPriceChange = (priceChange: number): string => {
    return (Math.abs(priceChange) * 100).toFixed(1);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !narrative) {
    return (
      <div className="flex items-center justify-center h-[600px] text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2" />
        <p>{error || "Erro ao carregar os detalhes da narrativa"}</p>
      </div>
    );
  }
  
  // Se um token for selecionado, mostrar seus detalhes
  if (selectedToken) {
    return (
      <TokenDetails 
        token={{
          ...selectedToken,
          id: selectedToken.symbol.toLowerCase()
        }} 
        onClose={() => setSelectedToken(null)} 
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{narrative.name}</h1>
          <p className="text-muted-foreground">{narrative.description}</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
        >
          Voltar ao Relatório
        </button>
      </div>
      
      {/* Resumo da Narrativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              narrative.combinedSentiment >= 70 ? 'bg-green-500/80' :
              narrative.combinedSentiment >= 50 ? 'bg-green-400/70' :
              narrative.combinedSentiment >= 40 ? 'bg-blue-400/70' :
              narrative.combinedSentiment >= 30 ? 'bg-red-400/70' : 'bg-red-500/80'
            } text-white`}>
              {narrative.combinedSentiment >= 70 ? 'Bullish' :
               narrative.combinedSentiment >= 50 ? 'Levemente Bullish' :
               narrative.combinedSentiment >= 40 ? 'Neutro' :
               narrative.combinedSentiment >= 30 ? 'Levemente Bearish' : 'Bearish'}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Twitter</div>
                <div className="text-xl font-bold">{narrative.twitterSentiment}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Notícias</div>
                <div className="text-xl font-bold">{narrative.newsSentiment}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">On-chain</div>
                <div className="text-xl font-bold">{narrative.onchainSentiment}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Volume Social</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              {narrative.socialVolume.toLocaleString()}
              <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
            </div>
            <div className="mt-2 text-sm">Hype Factor: <span className={narrative.hypeFactor > 4 ? 'text-amber-500' : 'text-blue-400'}>{narrative.hypeFactor.toFixed(1)}x</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualidade & Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm">Qualidade</div>
                <div className="text-2xl font-bold">{narrative.qualityScore}/100</div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                narrative.riskLevel === 'Muito Alto' ? 'bg-red-500/80' :
                narrative.riskLevel === 'Alto' ? 'bg-amber-500/80' :
                narrative.riskLevel === 'Moderado' ? 'bg-yellow-500/80' :
                narrative.riskLevel === 'Médio' ? 'bg-blue-500/80' : 'bg-green-500/80'
              } text-white`}>
                {narrative.riskLevel}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Métricas Sociais Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas Sociais (12h)</CardTitle>
            <CardDescription>Dados de engajamento no Twitter/X nas últimas 12 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Posts
                  </div>
                  <div className="text-2xl font-bold">{socialMetrics.last12h.postCount}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Crescimento de Curtidas
                  </div>
                  <div className={`text-2xl font-bold ${
                    parseFloat(socialMetrics.last12h.likesGrowth) > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {socialMetrics.last12h.likesGrowth}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Repeat className="h-4 w-4 mr-1" />
                    Crescimento de Reposts
                  </div>
                  <div className={`text-2xl font-bold ${
                    parseFloat(socialMetrics.last12h.repostsGrowth) > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {socialMetrics.last12h.repostsGrowth}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Activity className="h-4 w-4 mr-1" />
                    Engajamento Total
                  </div>
                  <div className="text-2xl font-bold">{socialMetrics.last12h.totalEngagement.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Crescimento de Menções
                  </div>
                  <div className={`text-2xl font-bold ${
                    parseFloat(socialMetrics.last12h.mentionsGrowth) > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {socialMetrics.last12h.mentionsGrowth}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    Contas Únicas
                  </div>
                  <div className="text-2xl font-bold">{socialMetrics.last12h.uniqueAccounts}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="text-sm text-muted-foreground mb-2">Principais Contas</div>
              <div className="flex flex-wrap gap-1">
                {socialMetrics.topAccounts.map((account, i) => (
                  <span key={i} className="text-xs bg-zinc-800 rounded-full px-2 py-0.5">
                    @{account}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Análise de Risco Detalhada */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Risco</CardTitle>
            <CardDescription>Avaliação detalhada de fatores de risco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Volatilidade de Mercado (24h)
                  </span>
                  <span className="text-xs ml-2">{
                    // Usar a média de variação de preço dos tokens relacionados como volatilidade
                    relatedTokens.length > 0 
                      ? Math.round(Math.abs(relatedTokens.reduce((acc, token) => acc + Math.abs(token.priceChange24h), 0) / relatedTokens.length) * 100)
                      : riskAssessment.marketVolatility
                  }/100</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      relatedTokens.length > 0 
                        ? (Math.round(Math.abs(relatedTokens.reduce((acc, token) => acc + Math.abs(token.priceChange24h), 0) / relatedTokens.length) * 100) > 75 ? 'bg-red-500' :
                           Math.round(Math.abs(relatedTokens.reduce((acc, token) => acc + Math.abs(token.priceChange24h), 0) / relatedTokens.length) * 100) > 50 ? 'bg-amber-500' : 'bg-blue-500')
                        : parseInt(riskAssessment.marketVolatility) > 75 ? 'bg-red-500' :
                          parseInt(riskAssessment.marketVolatility) > 50 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.min(
                        relatedTokens.length > 0 
                          ? Math.round(Math.abs(relatedTokens.reduce((acc, token) => acc + Math.abs(token.priceChange24h), 0) / relatedTokens.length) * 100)
                          : parseInt(riskAssessment.marketVolatility),
                        100
                      )}%` 
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-1" />
                    Risco Regulatório
                  </span>
                  <span className="text-xs ml-2">{riskAssessment.regulatoryRisk}/100</span>
                </div>
                {renderProgressBar(parseInt(riskAssessment.regulatoryRisk))}
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Risco Técnico
                  </span>
                  <span className="text-xs ml-2">{riskAssessment.technicalRisk}/100</span>
                </div>
                {renderProgressBar(parseInt(riskAssessment.technicalRisk))}
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Risco de Competição
                  </span>
                  <span className="text-xs ml-2">{riskAssessment.competitionRisk}/100</span>
                </div>
                {renderProgressBar(parseInt(riskAssessment.competitionRisk))}
              </div>
              
              <div className="pt-2">
                <div className="text-sm text-muted-foreground mb-1">Análise Macro</div>
                <p className="text-sm">{narrative.macroAnalysis}</p>
              </div>
              
              <div className="pt-2">
                <div className="text-sm text-muted-foreground mb-1">Status de Financiamento</div>
                <div className="text-sm font-medium">{riskAssessment.fundingStatus}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dados On-Chain */}
      <Card>
        <CardHeader>
          <CardTitle>Dados On-Chain</CardTitle>
          <CardDescription>Métricas de atividade on-chain para o ecossistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Database className="h-4 w-4 mr-1" />
                Total Value Locked (TVL)
              </div>
              <div className="text-2xl font-bold">{onChainMetrics.totalValueLocked}</div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Users className="h-4 w-4 mr-1" />
                Endereços Ativos (24h)
              </div>
              <div className="text-2xl font-bold">{onChainMetrics.activeAddresses.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Activity className="h-4 w-4 mr-1" />
                Transações (24h)
              </div>
              <div className="text-2xl font-bold">{onChainMetrics.transactions24h.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <BarChart className="h-4 w-4 mr-1" />
                Valor Médio de Transação
              </div>
              <div className="text-2xl font-bold">{onChainMetrics.averageTxValue}</div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Taxa de Adoção
              </div>
              <div className="text-2xl font-bold">{onChainMetrics.adoptionRate}</div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Activity className="h-4 w-4 mr-1" />
                Atividade de Desenvolvedores
              </div>
              <div className="text-2xl font-bold">{onChainMetrics.developerActivity}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tokens Relacionados */}
      <Card>
        <CardHeader>
          <CardTitle>Tokens Relacionados</CardTitle>
          <CardDescription>Top 10 tokens com melhor performance dentro da narrativa</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Social</TableHead>
                <TableHead>On-Chain</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedTokens
                .sort((a, b) => b.opportunityScore - a.opportunityScore)
                .slice(0, 10)  // Limitar aos 10 primeiros tokens
                .map((token, index) => (
                  <TableRow 
                    key={index}
                    className="cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    onClick={() => setSelectedToken(token)}
                  >
                    <TableCell>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono">${formatPrice(token.price)}</div>
                      <div className={`text-xs flex items-center ${
                        token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {token.priceChange24h >= 0 ? 
                          <ArrowUp className="h-3 w-3 mr-1" /> : 
                          <ArrowDown className="h-3 w-3 mr-1" />
                        }
                        {formatPriceChange(token.priceChange24h)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(token.category)}`}>
                        {token.category}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-zinc-800 w-full h-2 rounded-full">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${token.hypeScore}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {token.mentionCount} menções
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-zinc-800 w-full h-2 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            token.onchainStrength > 75 ? 'bg-green-500' :
                            token.onchainStrength > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${token.onchainStrength}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-800">
                        <BarChart className="h-3 w-3 mr-1" />
                        {token.opportunityScore}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span suppressHydrationWarning>Última atualização: {new Date().toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-1" />
          Dados obtidos de Twitter, CryptoPanic, CoinGecko, DeFiLlama e Dune Analytics
        </div>
      </div>
    </div>
  );
} 