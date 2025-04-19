'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BarChart2, ChevronDown, ChevronUp, ExternalLink, LineChart, RefreshCw, Search, TrendingDown, TrendingUp, Twitter } from 'lucide-react';

// Componente Badge simplificado para evitar erros
const Badge = ({ 
  children, 
  className = "", 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: string;
}) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};

// Componente Skeleton simplificado para evitar erros
const Skeleton = ({
  className = ""
}: {
  className?: string
}) => {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
  );
};

interface OnChainTweetData {
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

interface OnChainIndicador {
  nome: string;
  valor: string;
  tendencia: 'up' | 'down' | 'neutral';
  timeframe: '24h' | '7d' | '30d' | '90d';
}

interface OnChainInsight {
  id: string;
  title: string;
  description: string;
  protocolos: string[];
  blockchains: string[];
  narrativas: string[];
  indicadores: OnChainIndicador[];
  sentimento: 'bullish' | 'bearish' | 'neutro';
  confianca: 'alta' | 'media' | 'baixa';
  fonte: string[];
  timestamp: string;
}

interface ChainXResponse {
  tweets: OnChainTweetData[];
  insights: OnChainInsight[];
  timestamp: string;
  cached?: boolean;
  monitored_accounts?: string[];
}

const ChainX: React.FC = () => {
  const [data, setData] = useState<ChainXResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (forceRefresh: boolean = false) => {
    const isInitialLoad = !data && !refreshing;
    
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    setError(null);
    
    try {
      const queryParams = forceRefresh ? '?refresh=true' : '';
      const response = await fetch(`/api/agents/chainx${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch on-chain tweet data');
      }
      
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      console.error('Error fetching ChainX data:', err);
      setError('Failed to load on-chain tweet analysis data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSentimentColor = (sentiment: 'bullish' | 'bearish' | 'neutro') => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-green-100 text-green-800';
      case 'bearish':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: 'bullish' | 'bearish' | 'neutro') => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: 'alta' | 'media' | 'baixa') => {
    switch (confidence) {
      case 'alta':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-blue-100 text-blue-800';
      case 'baixa':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            ChainX Analysis Error
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => fetchData()}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!data || !data.tweets || data.tweets.length === 0) {
    return (
      <Card className="w-full border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            No On-Chain Data Available
          </CardTitle>
          <CardDescription>
            No tweets with on-chain metrics were found. Check back later or try refreshing.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => fetchData(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-500" />
            On-Chain Metrics
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchData(true)} 
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription>
          On-chain metrics mentioned in crypto influencer tweets
          {data.timestamp && (
            <span> • Last updated: {new Date(data.timestamp).toLocaleString()}</span>
          )}
          {data.cached && (
            <span className="ml-2 text-xs">(cached)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Metrics</TabsTrigger>
            <TabsTrigger value="bullish">Bullish</TabsTrigger>
            <TabsTrigger value="bearish">Bearish</TabsTrigger>
            <TabsTrigger value="protocols">By Protocol</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 pt-4">
            {data.tweets.map((tweet) => (
              <Card key={tweet.id} className="border overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center mb-2">
                      <Twitter className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-medium">{tweet.autor}</span>
                      <span className="text-muted-foreground text-xs ml-2">• {formatDate(tweet.data)}</span>
                    </div>
                    <Badge className={getSentimentColor(tweet.sentimento)}>
                      <span className="flex items-center gap-1">
                        {getSentimentIcon(tweet.sentimento)}
                        {tweet.sentimento.toUpperCase()}
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-bold">{tweet.protocolo} <span className="text-muted-foreground">({tweet.blockchain})</span></div>
                    <div className="text-sm">{tweet.metrica_onchain}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tweet.narrativa.map((narrativa, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200">
                        {narrativa}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex gap-4">
                    <span>❤️ {tweet.engajamento.likes}</span>
                    <span>🔄 {tweet.engajamento.retweets}</span>
                    <span>💬 {tweet.engajamento.comentarios}</span>
                  </div>
                  
                  <div className="mt-2 text-xs">
                    <a href={tweet.fonte} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View original tweet
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="bullish" className="space-y-4 pt-4">
            {data.tweets
              .filter(tweet => tweet.sentimento === 'bullish')
              .map((tweet) => (
                <Card key={tweet.id} className="border overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-2">
                        <Twitter className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">{tweet.autor}</span>
                        <span className="text-muted-foreground text-xs ml-2">• {formatDate(tweet.data)}</span>
                      </div>
                      <Badge className={getSentimentColor(tweet.sentimento)}>
                        <span className="flex items-center gap-1">
                          {getSentimentIcon(tweet.sentimento)}
                          {tweet.sentimento.toUpperCase()}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="font-bold">{tweet.protocolo} <span className="text-muted-foreground">({tweet.blockchain})</span></div>
                      <div className="text-sm">{tweet.metrica_onchain}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tweet.narrativa.map((narrativa, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200">
                          {narrativa}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>❤️ {tweet.engajamento.likes}</span>
                      <span>🔄 {tweet.engajamento.retweets}</span>
                      <span>💬 {tweet.engajamento.comentarios}</span>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      <a href={tweet.fonte} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View original tweet
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="bearish" className="space-y-4 pt-4">
            {data.tweets
              .filter(tweet => tweet.sentimento === 'bearish')
              .map((tweet) => (
                <Card key={tweet.id} className="border overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-2">
                        <Twitter className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">{tweet.autor}</span>
                        <span className="text-muted-foreground text-xs ml-2">• {formatDate(tweet.data)}</span>
                      </div>
                      <Badge className={getSentimentColor(tweet.sentimento)}>
                        <span className="flex items-center gap-1">
                          {getSentimentIcon(tweet.sentimento)}
                          {tweet.sentimento.toUpperCase()}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="font-bold">{tweet.protocolo} <span className="text-muted-foreground">({tweet.blockchain})</span></div>
                      <div className="text-sm">{tweet.metrica_onchain}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tweet.narrativa.map((narrativa, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200">
                          {narrativa}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>❤️ {tweet.engajamento.likes}</span>
                      <span>🔄 {tweet.engajamento.retweets}</span>
                      <span>💬 {tweet.engajamento.comentarios}</span>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      <a href={tweet.fonte} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View original tweet
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="protocols" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(new Set(data.tweets.map(t => t.protocolo))).map(protocolo => (
                <Card key={protocolo} className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{protocolo}</CardTitle>
                    <CardDescription>
                      {data.tweets.filter(t => t.protocolo === protocolo).length} mentions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.tweets
                      .filter(t => t.protocolo === protocolo)
                      .map(tweet => (
                        <div key={tweet.id} className="p-2 border rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{tweet.autor}</span>
                            <Badge className={getSentimentColor(tweet.sentimento)}>
                              {tweet.sentimento}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{tweet.metrica_onchain}</p>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4 pt-4">
            {data.insights && data.insights.length > 0 ? (
              data.insights.map((insight) => (
                <Card key={insight.id} className="border overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getSentimentColor(insight.sentimento)}>
                          <span className="flex items-center gap-1">
                            {getSentimentIcon(insight.sentimento)}
                            {insight.sentimento.toUpperCase()}
                          </span>
                        </Badge>
                        <Badge className={getConfidenceColor(insight.confianca)}>
                          Confiança: {insight.confianca}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {formatDate(insight.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{insight.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Blockchains</h4>
                          <div className="flex flex-wrap gap-1">
                            {insight.blockchains.map((blockchain, idx) => (
                              <Badge key={idx} variant="outline" className="bg-indigo-50 border-indigo-200">
                                {blockchain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Protocolos</h4>
                          <div className="flex flex-wrap gap-1">
                            {insight.protocolos.map((protocolo, idx) => (
                              <Badge key={idx} variant="outline" className="bg-cyan-50 border-cyan-200">
                                {protocolo}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Narrativas</h4>
                        <div className="flex flex-wrap gap-1">
                          {insight.narrativas.map((narrativa, idx) => (
                            <Badge key={idx} className="bg-purple-100 text-purple-800">
                              {narrativa}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Indicadores On-Chain</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {insight.indicadores.map((indicador, idx) => (
                            <div key={idx} className="flex items-center justify-between border rounded p-2">
                              <div>
                                <div className="font-medium text-sm">{indicador.nome}</div>
                                <div className="text-xs text-muted-foreground">Timeframe: {indicador.timeframe}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{indicador.valor}</span>
                                {getTrendIcon(indicador.tendencia)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Fontes</h4>
                        <div className="flex flex-wrap gap-1">
                          {insight.fonte.map((fonte, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50">
                              <Twitter className="h-3 w-3 mr-1 text-blue-500" />
                              {fonte}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="w-full border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                    No On-Chain Insights Available
                  </CardTitle>
                  <CardDescription>
                    No insights based on on-chain metrics were found. Check back later or try refreshing.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {data.monitored_accounts && data.monitored_accounts.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Twitter className="h-4 w-4 mr-2 text-blue-500" />
              Monitored Accounts
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.monitored_accounts.map((account, idx) => (
                <Badge key={idx} variant="outline" className="bg-blue-50">
                  {account}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChainX; 