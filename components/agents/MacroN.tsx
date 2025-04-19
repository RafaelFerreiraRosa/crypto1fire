'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Newspaper, Globe, LineChart, FileText, TrendingUp, TrendingDown, BarChart2, ArrowLeft, ExternalLink } from 'lucide-react';
import { MacroNewsItem } from '@/lib/services/macroNewsDB';

// Componente Badge simplificado
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

// Componente Skeleton simplificado
const Skeleton = ({
  className = ""
}: {
  className?: string
}) => {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
  );
};

interface NewsSourceData {
  name: string;
  url: string;
  category: string;
  priority: number;
}

interface MacroNResponse {
  news: MacroNewsItem[];
  sources: string[];
  timestamp: string;
  cached?: boolean;
}

// Determinar cor para fase do ciclo de mercado
function getMarketCycleColor(phase: string): string {
  switch (phase) {
    case 'accumulation':
      return 'bg-sky-600 text-white';
    case 'uptrend':
      return 'bg-emerald-600 text-white';
    case 'distribution':
      return 'bg-amber-500 text-white';
    case 'downtrend':
      return 'bg-rose-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

// Determinar cor para sinal de investimento
function getInvestmentSignalColor(action: string): string {
  switch (action) {
    case 'buy':
      return 'bg-emerald-600 text-white';
    case 'sell':
      return 'bg-rose-600 text-white';
    case 'hold':
      return 'bg-amber-500 text-white';
    case 'research':
      return 'bg-sky-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

// Criar barra de força para sinais de investimento
function renderStrengthBar(strength: string | number): JSX.Element {
  if (typeof strength === 'number') {
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            strength >= 7 ? 'bg-emerald-500' : 
            strength >= 4 ? 'bg-amber-500' : 
            'bg-rose-500'
          }`}
          style={{ width: `${strength * 10}%` }}
        />
      </div>
    );
  }
  
  const strengthMap: Record<string, number> = {
    'forte': 3,
    'moderado': 2,
    'fraco': 1
  };
  
  const level = strengthMap[strength] || 1;
  
  return (
    <div className="flex items-center gap-0.5">
      <div className={`h-1.5 w-3 rounded-l ${level >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
      <div className={`h-1.5 w-3 ${level >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
      <div className={`h-1.5 w-3 rounded-r ${level >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
    </div>
  );
}

const MacroN: React.FC = () => {
  const [newsData, setNewsData] = useState<MacroNResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<MacroNewsItem | null>(null);

  const fetchNewsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let apiUrl = '/api/agents/news';
      // Verificar se estamos no lado do cliente para usar window.location.origin
      if (typeof window !== 'undefined') {
        apiUrl = `${window.location.origin}${apiUrl}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      
      const data = await response.json();
      setNewsData(data);
    } catch (err) {
      setError('Failed to load news data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'very-high') => {
    switch (severity) {
      case 'very-high':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral' | 'mixed') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'mixed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketIcon = (market: string) => {
    switch (market) {
      case 'crypto':
        return <BarChart2 className="h-4 w-4 text-blue-500" />;
      case 'stocks':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bonds':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'commodities':
        return <LineChart className="h-4 w-4 text-orange-500" />;
      case 'forex':
        return <Globe className="h-4 w-4 text-purple-500" />;
      default:
        return <Newspaper className="h-4 w-4" />;
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
            News Analysis Error
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={fetchNewsData}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!newsData) {
    return null;
  }

  // Se um item de notícia está selecionado, mostra a visão detalhada
  if (selectedNews) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-blue-500" />
                {selectedNews.title}
              </CardTitle>
              <CardDescription>
                From <a href={selectedNews.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{selectedNews.source}</a> • {new Date(selectedNews.timestamp).toLocaleString()}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedNews(null)}
            >
              Back to News
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Macro Impact Summary</h3>
            <p className="text-sm">{selectedNews.summary}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-3">Macro Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Severity:</span>
                  <Badge className={getSeverityColor(selectedNews.macroImpact.severity)}>
                    {selectedNews.macroImpact.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sentiment:</span>
                  <Badge className={getSentimentColor(selectedNews.macroImpact.sentiment)}>
                    {selectedNews.macroImpact.sentiment.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Affected Markets:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedNews.macroImpact.markets.map((market, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        {getMarketIcon(market)}
                        <span>{market.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm mt-1">{selectedNews.macroImpact.description}</p>
                </div>
              </div>
            </div>
            
            {selectedNews.regulatoryImplications && (
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Regulatory Implications</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Severity:</span>
                    <Badge className={getSeverityColor(selectedNews.regulatoryImplications.severity)}>
                      {selectedNews.regulatoryImplications.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Regions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedNews.regulatoryImplications.regions.map((region, index) => (
                        <Badge key={index} variant="outline" className="border text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm mt-1">{selectedNews.regulatoryImplications.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedNews.marketCycle && (
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Análise de Ciclo de Mercado</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Fase:</span>
                      <Badge className={getMarketCycleColor(selectedNews.marketCycle.phase)}>
                        {selectedNews.marketCycle.phase.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs">
                      Confiança: {selectedNews.marketCycle.confidence}%
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Análise:</span>
                    <p className="text-sm mt-1">{selectedNews.marketCycle.analysis}</p>
                  </div>
                </div>
              </div>
            )}
            
            {selectedNews.investmentSignal && (
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3">Sinal de Investimento</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Ação:</span>
                      <Badge className={getInvestmentSignalColor(selectedNews.investmentSignal.action)}>
                        {selectedNews.investmentSignal.action.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Força:</span>
                      {renderStrengthBar(selectedNews.investmentSignal.strength)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Prazo:</span>
                    <span className="text-sm">{selectedNews.investmentSignal.timeframe}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Justificativa:</span>
                    <p className="text-sm mt-1">{selectedNews.investmentSignal.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Related Assets</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNews.relatedAssets.map((asset, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 bg-muted">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNews.categories.map((category, index) => (
                <Badge key={index} className="px-3 py-1 bg-blue-50 text-blue-700">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Full Content</h3>
            <p className="text-sm whitespace-pre-line">{selectedNews.content}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => window.open(selectedNews.url, '_blank')}
          >
            Read Original
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
            <Newspaper className="h-5 w-5 text-blue-500" />
            MacroN News Analysis
          </CardTitle>
        </div>
        <CardDescription>
          {newsData.timestamp && (
            <span>Last updated: {new Date(newsData.timestamp).toLocaleString()}</span>
          )}
          {newsData.cached && (
            <span className="ml-2 text-xs">(cached)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="high-impact">High Impact</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="market-cycle">Market Cycle</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {newsData.news.map((news, index) => (
              <div 
                key={news.id || index} 
                className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => setSelectedNews(news)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{news.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {news.source} • {new Date(news.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(news.macroImpact.severity)}>
                      {news.macroImpact.severity}
                    </Badge>
                    <Badge className={getSentimentColor(news.macroImpact.sentiment)}>
                      {news.macroImpact.sentiment}
                    </Badge>
                  </div>
                </div>
                <p className="mt-3 text-sm">{news.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {news.relatedAssets.slice(0, 3).map((asset, idx) => (
                    <Badge key={idx} variant="secondary" className="px-2 py-0.5 bg-muted">
                      {asset}
                    </Badge>
                  ))}
                  {news.relatedAssets.length > 3 && (
                    <Badge variant="secondary" className="px-2 py-0.5 bg-muted">
                      +{news.relatedAssets.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="high-impact" className="space-y-4 mt-4">
            {newsData.news.filter(news => 
              ['high', 'very-high'].includes(news.macroImpact.severity)
            ).map((news, index) => (
              <div 
                key={`high-${news.id || index}`} 
                className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => setSelectedNews(news)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{news.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {news.source} • {new Date(news.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getSeverityColor(news.macroImpact.severity)}>
                    {news.macroImpact.severity}
                  </Badge>
                </div>
                <p className="mt-3 text-sm">{news.macroImpact.description}</p>
              </div>
            ))}
            {newsData.news.filter(news => 
              ['high', 'very-high'].includes(news.macroImpact.severity)
            ).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No high impact news at the moment
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="regulatory" className="space-y-4 mt-4">
            {newsData.news.filter(news => news.regulatoryImplications).map((news, index) => (
              <div 
                key={`reg-${news.id || index}`} 
                className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => setSelectedNews(news)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{news.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {news.source} • {new Date(news.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {news.regulatoryImplications?.regions.map((region, idx) => (
                      <Badge key={idx} variant="outline" className="border text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm">
                  {news.regulatoryImplications?.description}
                </p>
              </div>
            ))}
            {newsData.news.filter(news => news.regulatoryImplications).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No regulatory news at the moment
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="market-cycle" className="space-y-4 mt-4">
            <div className="rounded-lg border p-4 bg-slate-50">
              <h3 className="font-medium mb-2">Análise de Ciclo de Mercado</h3>
              <p className="text-sm mb-4">Baseado nas notícias mais recentes, o MacroN identifica em qual fase do ciclo de mercado estamos e recomendações de investimento.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg border p-4 bg-white">
                  <h4 className="text-sm font-medium mb-3">Fase do Ciclo</h4>
                  {newsData.news.some(news => news.marketCycle) ? (
                    <>
                      {(() => {
                        // Encontra a fase do ciclo mais comum nas notícias recentes
                        const phaseCount: Record<string, number> = {};
                        newsData.news.forEach(news => {
                          if (news.marketCycle) {
                            phaseCount[news.marketCycle.phase] = (phaseCount[news.marketCycle.phase] || 0) + 1;
                          }
                        });
                        
                        const mostCommonPhase = Object.entries(phaseCount)
                          .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
                        
                        // Encontra a notícia com esta fase que tem maior confiança
                        const bestNews = newsData.news
                          .filter(n => n.marketCycle && n.marketCycle.phase === mostCommonPhase)
                          .sort((a, b) => (b.marketCycle?.confidence || 0) - (a.marketCycle?.confidence || 0))[0];
                        
                        return bestNews && bestNews.marketCycle ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={getMarketCycleColor(bestNews.marketCycle.phase)}>
                                {bestNews.marketCycle.phase.toUpperCase()}
                              </Badge>
                              <span className="text-xs">
                                Confiança: {bestNews.marketCycle.confidence}%
                              </span>
                            </div>
                            <p className="text-sm">{bestNews.marketCycle.analysis}</p>
                            <div className="text-xs text-gray-500 mt-2">
                              Baseado em notícias de {Object.entries(phaseCount).length} fontes
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Não há análise de ciclo disponível
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Não há análise de ciclo disponível
                    </div>
                  )}
                </div>
                
                <div className="rounded-lg border p-4 bg-white">
                  <h4 className="text-sm font-medium mb-3">Sinais de Investimento</h4>
                  {newsData.news.some(news => news.investmentSignal) ? (
                    <div className="space-y-4">
                      {(() => {
                        // Agrupa sinais por ação
                        const signals: Record<string, {count: number, items: MacroNewsItem[]}> = {};
                        newsData.news.forEach(news => {
                          if (news.investmentSignal) {
                            if (!signals[news.investmentSignal.action]) {
                              signals[news.investmentSignal.action] = {count: 0, items: []};
                            }
                            signals[news.investmentSignal.action].count += 1;
                            signals[news.investmentSignal.action].items.push(news);
                          }
                        });
                        
                        return Object.entries(signals)
                          .sort((a, b) => b[1].count - a[1].count)
                          .map(([action, data], index) => {
                            // Para cada tipo de ação, encontra o sinal mais forte
                            const strongestSignal = data.items
                              .sort((a, b) => {
                                const strengthMap: Record<string, number> = {
                                  'forte': 3,
                                  'moderado': 2,
                                  'fraco': 1
                                };
                                return (strengthMap[b.investmentSignal?.strength || ''] || 0) - 
                                       (strengthMap[a.investmentSignal?.strength || ''] || 0);
                              })[0];
                            
                            return strongestSignal && strongestSignal.investmentSignal ? (
                              <div key={index} className="rounded border p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <Badge className={getInvestmentSignalColor(action)}>
                                    {action.toUpperCase()}
                                  </Badge>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">Força:</span>
                                    {renderStrengthBar(strongestSignal.investmentSignal.strength)}
                                  </div>
                                </div>
                                <p className="text-xs mb-1">
                                  Prazo: <span className="font-medium">{strongestSignal.investmentSignal.timeframe}</span>
                                </p>
                                <p className="text-sm">{strongestSignal.investmentSignal.reasoning}</p>
                              </div>
                            ) : null;
                          });
                      })()}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Não há sinais de investimento disponíveis
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Notícias com Análise de Ciclo e Sinais</h4>
                <div className="space-y-3">
                  {newsData.news
                    .filter(news => news.marketCycle || news.investmentSignal)
                    .slice(0, 5)
                    .map((news, index) => (
                      <div 
                        key={`cycle-${news.id || index}`} 
                        className="rounded-lg border p-3 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedNews(news)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{news.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {news.source} • {new Date(news.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {news.marketCycle && (
                              <Badge className={getMarketCycleColor(news.marketCycle.phase)}>
                                {news.marketCycle.phase}
                              </Badge>
                            )}
                            {news.investmentSignal && (
                              <Badge className={getInvestmentSignalColor(news.investmentSignal.action)}>
                                {news.investmentSignal.action}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                  {newsData.news.filter(news => news.marketCycle || news.investmentSignal).length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      Não há notícias com análise de ciclo ou sinais de investimento
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="mt-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-3">Monitored Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsData.sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Newspaper className="h-4 w-4 text-blue-500" />
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={fetchNewsData}>
          Refresh News
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MacroN; 