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
  ArrowDown
} from 'lucide-react';
import NarrativeDetails from './NarrativeDetails';
import TokenDetails from './TokenDetails';

// Tipos de dados para o relatório
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

interface ReportData {
  narratives: NarrativeData[];
  tokens: TokenData[];
  lastUpdated: string;
  topNarratives: {
    name: string;
    socialVolume: number;
  }[];
  emergingOpportunities: {
    symbol: string;
    narratives: string[];
    score: number;
  }[];
  macroSentiment: {
    crypto: number;
    equities: number;
    global: number;
  };
}

export default function CryptoReport() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNarrative, setSelectedNarrative] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  
  useEffect(() => {
    // Função para buscar dados do relatório da API
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/report', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[600px] text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2" />
        <p>{error || "Erro ao carregar os dados do relatório"}</p>
      </div>
    );
  }

  // Se um token estiver selecionado, mostrar seus detalhes
  if (selectedToken) {
    return (
      <TokenDetails 
        token={selectedToken} 
        onClose={() => setSelectedToken(null)}
      />
    );
  }
  
  // Se uma narrativa estiver selecionada, mostrar seus detalhes
  if (selectedNarrative) {
    return (
      <NarrativeDetails 
        narrativeName={selectedNarrative} 
        onClose={() => setSelectedNarrative(null)} 
      />
    );
  }
  
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

  const formatPriceChange = (priceChange: number): string => {
    return (Math.abs(priceChange) * 100).toFixed(1);
  };

  // Dados já carregados, renderizar o dashboard
  return (
    <div className="space-y-6">
      {/* Header Cards - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Narrativas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{data.narratives.length}</div>
              <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.topNarratives[0].name} é a mais discutida
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentimento Macro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{data.macroSentiment.crypto}/100</div>
              {data.macroSentiment.crypto >= 50 ? (
                <ArrowUp className="h-4 w-4 ml-2 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 ml-2 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.macroSentiment.crypto >= 70 ? "Bullish" : 
               data.macroSentiment.crypto >= 50 ? "Moderadamente Bullish" : 
               data.macroSentiment.crypto >= 40 ? "Neutro" : "Bearish"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Emergentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{data.emergingOpportunities.length}</div>
              <Zap className="h-4 w-4 ml-2 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.emergingOpportunities[0].symbol} com maior pontuação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Narrativa de Maior Qualidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {data.narratives.reduce((prev, current) => 
                  (prev.qualityScore > current.qualityScore) ? prev : current
                ).name}
              </div>
              <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Score: {data.narratives.reduce((prev, current) => 
                (prev.qualityScore > current.qualityScore) ? prev : current
              ).qualityScore}/100
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Narratives */}
        <Card className="md:col-span-1 h-[460px] flex flex-col">
          <CardHeader>
            <CardTitle>Narrativas em Alta</CardTitle>
            <CardDescription>
              Ordenadas por volume social
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <div className="space-y-4">
              {data.topNarratives.map((narrative, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between cursor-pointer hover:bg-zinc-800 p-2 rounded-md transition-colors"
                  onClick={() => setSelectedNarrative(narrative.name)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      index < 2 ? 'bg-green-500' : 
                      index < 4 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span>{narrative.name}</span>
                  </div>
                  <div className="font-mono text-sm">{narrative.socialVolume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Top Tokens with Opportunities */}
        <Card className="md:col-span-2 h-[460px] flex flex-col">
          <CardHeader>
            <CardTitle>Principais Oportunidades</CardTitle>
            <CardDescription>
              Tokens com maior pontuação de oportunidade
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Narrativas</TableHead>
                  <TableHead>Social</TableHead>
                  <TableHead>On-Chain</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.tokens
                  .sort((a, b) => b.opportunityScore - a.opportunityScore)
                  .slice(0, 5)
                  .map((token, index) => (
                    <TableRow 
                      key={index}
                      className="cursor-pointer hover:bg-zinc-800/50 transition-colors"
                      onClick={() => setSelectedToken(token)}
                    >
                      <TableCell>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-muted-foreground">{token.category}</div>
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
                        <div className="flex flex-wrap gap-1">
                          {token.narratives.map((narrative, i) => (
                            <span key={i} className="text-xs bg-zinc-800 rounded-full px-2 py-0.5">
                              {narrative}
                            </span>
                          ))}
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
      </div>
      
      {/* Footer Notes */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Última atualização: <span suppressHydrationWarning>{new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-1" />
          Dados coletados de Twitter, CryptoPanic, CoinGecko, DeFiLlama e Dune Analytics
        </div>
      </div>
    </div>
  );
}