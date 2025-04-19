'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Clock,
  RefreshCw,
  TrendingUp,
  Twitter,
  Newspaper,
  Youtube,
  Lightbulb,
  Zap,
  DollarSign,
  GitBranch,
  Star,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interfaces for Twitter data (MacroX)
interface TwitterNarrative {
  nome: string;
  menções: number;
  sentimento: number;
  tendência: 'up' | 'down' | 'neutral';
}

interface TwitterToken {
  symbol: string;
  menções: number;
  sentimento: 'positivo' | 'negativo' | 'neutro';
}

interface MacroXResponse {
  narrativas: TwitterNarrative[];
  tokens: TwitterToken[];
  sentimento_geral: 'bullish' | 'bearish' | 'neutro' | 'misto';
  análise_macro: string;
  timestamp: string;
}

// Interfaces for News data (MacroN)
interface MacroNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  timestamp: string;
  categories: string[];
  macroImpact: {
    severity: string;
    sentiment: string;
    description: string;
  };
  relatedAssets: Array<{
    symbol: string;
    name: string;
    type: string;
  }>;
}

interface MacroNResponse {
  news: MacroNewsItem[];
  timestamp: string;
}

// Interfaces for YouTube data (MacroY)
interface VideoTranscriptAnalysis {
  videoId: string;
  videoTitle: string;
  channelName: string;
  publishedAt: string;
  sentiment: {
    overall: "bullish" | "bearish" | "neutral" | "mixed";
    strength: "strong" | "moderate" | "weak";
    description: string;
  };
  narratives: Array<{
    name: string;
    description: string;
    strength: "established" | "growing" | "emerging" | "fading";
    timeframe: "short" | "medium" | "long";
  }>;
  mentionedTokens: Array<{
    symbol: string;
    name: string;
    sentiment: "positive" | "negative" | "neutral";
    context: string;
  }>;
  opportunities: Array<{
    type: string;
    description: string;
    timeframe: "short" | "medium" | "long";
    conviction: "high" | "medium" | "low";
  }>;
}

interface MacroYResponse {
  analyses: VideoTranscriptAnalysis[];
  timestamp: string;
}

// Interfaces para dados on-chain (ChainX)
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
}

interface ChainXResponse {
  tweets: OnChainTweetData[];
  timestamp: string;
  cached?: boolean;
  monitored_accounts?: string[];
}

// Macro Response (combined data)
interface CrossPlatformNarrative {
  name: string;
  occurrences: number;
  sources: {
    twitter: boolean;
    news: boolean;
    youtube: boolean;
  };
  sentiment: {
    twitter?: string;
    news?: string;
    youtube?: string;
    overall: string;
  };
  strength: string;
  description: string;
}

interface CrossPlatformToken {
  symbol: string;
  occurrences: number;
  sources: {
    twitter: boolean;
    news: boolean;
    youtube: boolean;
  };
  sentiment: {
    twitter?: string;
    news?: string;
    youtube?: string;
    overall: string;
  };
}

interface MacroInsight {
  title: string;
  description: string;
  narratives: string[];
  tokens: string[];
  sentiment: string;
  timeframe: 'short' | 'medium' | 'long';
  conviction: 'high' | 'medium' | 'low';
}

interface MacroResponse {
  narratives: CrossPlatformNarrative[];
  tokens: CrossPlatformToken[];
  insights: MacroInsight[];
  marketSentiment: string;
  timestamp: string;
  sources: {
    twitter: {
      available: boolean;
      timestamp?: string;
    };
    news: {
      available: boolean;
      timestamp?: string;
    };
    youtube: {
      available: boolean;
      timestamp?: string;
    };
    onchain: {
      available: boolean;
      timestamp?: string;
    };
  };
}

// Helper functions
const getSentimentColor = (sentiment: string): string => {
  switch (sentiment.toLowerCase()) {
    case 'bullish':
    case 'positivo':
    case 'positive':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'bearish':
    case 'negativo':
    case 'negative':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'neutral':
    case 'neutro':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'mixed':
    case 'misto':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

const getStrengthColor = (strength: string): string => {
  switch (strength.toLowerCase()) {
    case 'high':
    case 'strong':
    case 'established':
      return 'bg-green-500 text-white';
    case 'medium':
    case 'moderate':
    case 'growing':
      return 'bg-blue-500 text-white';
    case 'low':
    case 'weak':
    case 'emerging':
      return 'bg-yellow-500 text-black';
    case 'fading':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getSourceIcon = (source: string, size: number = 16) => {
  switch (source) {
    case 'twitter':
      return <Twitter size={size} className="text-blue-500" />;
    case 'news':
      return <Newspaper size={size} className="text-amber-500" />;
    case 'youtube':
      return <Youtube size={size} className="text-red-500" />;
    case 'onchain':
      return <BarChart3 size={size} className="text-purple-500" />;
    default:
      return <AlertCircle size={size} />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Loading skeleton
const MacroSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
    <Skeleton className="h-60 w-full" />
  </div>
);

// Main Macro component
const Macro: React.FC = () => {
  const [twitterData, setTwitterData] = useState<MacroXResponse | null>(null);
  const [newsData, setNewsData] = useState<MacroNResponse | null>(null);
  const [youtubeData, setYoutubeData] = useState<MacroYResponse | null>(null);
  const [chainxData, setChainxData] = useState<ChainXResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [macroData, setMacroData] = useState<MacroResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("insights");

  const fetchData = async (forceRefresh = false) => {
    setRefreshing(true);
    setError(null);
    
    try {
      const queryParam = forceRefresh ? '?refresh=true' : '';
      let baseUrl = '';
      
      // Verificar se estamos no lado do cliente
      if (typeof window !== 'undefined') {
        baseUrl = window.location.origin;
      }
      
      const macroResponse = await fetch(`${baseUrl}/api/agents/macro${queryParam}`);
      
      if (!macroResponse.ok) {
        throw new Error('Failed to fetch macro data');
      }
      
      const macroResult = await macroResponse.json();
      setMacroData(macroResult);
      
      // Tentar buscar dados do Twitter
      try {
        const twitterResponse = await fetch(`${baseUrl}/api/agents/twitter`);
        if (twitterResponse.ok) {
          const twitterResult = await twitterResponse.json();
          setTwitterData(twitterResult);
        }
      } catch (twitterError) {
        console.error('Error fetching Twitter data:', twitterError);
      }
      
      // Tentar buscar dados das notícias
      try {
        const newsResponse = await fetch(`${baseUrl}/api/agents/news`);
        if (newsResponse.ok) {
          const newsResult = await newsResponse.json();
          setNewsData(newsResult);
        }
      } catch (newsError) {
        console.error('Error fetching news data:', newsError);
      }
      
      // Tentar buscar dados do YouTube
      try {
        const youtubeResponse = await fetch(`${baseUrl}/api/agents/transcript`);
        if (youtubeResponse.ok) {
          const youtubeResult = await youtubeResponse.json();
          setYoutubeData(youtubeResult);
        }
      } catch (youtubeError) {
        console.error('Error fetching YouTube data:', youtubeError);
      }
      
      // Tentar buscar dados on-chain
      try {
        const chainxResponse = await fetch(`${baseUrl}/api/agents/chainx`);
        if (chainxResponse.ok) {
          const chainxResult = await chainxResponse.json();
          setChainxData(chainxResult);
        }
      } catch (chainxError) {
        console.error('Error fetching on-chain data:', chainxError);
      }
      
    } catch (error) {
      console.error('Error in Macro fetch:', error);
      setError('Failed to fetch macro analysis data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  // Rendering functions for the different sections
  const renderSourcesStatus = () => {
    if (!macroData) return null;
    
    const sources = [
      { 
        name: 'Twitter', 
        key: 'twitter', 
        available: macroData.sources.twitter.available,
        timestamp: macroData.sources.twitter.timestamp,
        icon: <Twitter className="h-5 w-5 text-blue-500" />
      },
      { 
        name: 'News', 
        key: 'news', 
        available: macroData.sources.news.available,
        timestamp: macroData.sources.news.timestamp,
        icon: <Newspaper className="h-5 w-5 text-amber-500" />
      },
      { 
        name: 'YouTube', 
        key: 'youtube', 
        available: macroData.sources.youtube.available,
        timestamp: macroData.sources.youtube.timestamp,
        icon: <Youtube className="h-5 w-5 text-red-500" />
      },
      { 
        name: 'On-Chain', 
        key: 'onchain', 
        available: macroData.sources.onchain?.available || false,
        timestamp: macroData.sources.onchain?.timestamp,
        icon: <BarChart3 className="h-5 w-5 text-purple-500" />
      }
    ];
    
    return (
      <div className="flex flex-wrap gap-3 mb-4">
        {sources.map((source, index) => (
          <Badge 
            key={index}
            variant={source.available ? "default" : "outline"}
            className="flex items-center gap-1"
          >
            {source.icon}
            {source.available 
              ? `${source.name} (${formatDate(source.timestamp || '')})` 
              : `${source.name} (unavailable)`}
          </Badge>
        ))}
      </div>
    );
  };

  const renderCrossPlatformNarratives = () => {
    if (!macroData?.narratives.length) {
      return (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="p-4 border rounded border-yellow-300 bg-yellow-50 text-yellow-800">
              No cross-platform narratives identified yet.
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Cross-Platform Narratives
          </CardTitle>
          <CardDescription>Narratives that appear across multiple data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {macroData.narratives.map((narrative, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{narrative.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {narrative.sources.twitter && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Twitter size={14} />
                        X
                      </Badge>
                    )}
                    {narrative.sources.news && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Newspaper size={14} />
                        News
                      </Badge>
                    )}
                    {narrative.sources.youtube && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Youtube size={14} />
                        YouTube
                      </Badge>
                    )}
                    <Badge className={getStrengthColor(narrative.strength)}>
                      {narrative.strength}
                    </Badge>
                    <Badge className={getSentimentColor(narrative.sentiment.overall)}>
                      {narrative.sentiment.overall}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground">{narrative.description}</p>
                <div className="mt-2 text-sm text-muted-foreground">
                  Mentioned {narrative.occurrences} times across {Object.entries(narrative.sources).filter(([_, v]) => v).length} sources
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCrossPlatformTokens = () => {
    if (!macroData?.tokens.length) {
      return (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="p-4 border rounded border-yellow-300 bg-yellow-50 text-yellow-800">
              No cross-platform tokens identified yet.
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cross-Platform Tokens
          </CardTitle>
          <CardDescription>Tokens mentioned across multiple data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {macroData.tokens.map((token, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">${token.symbol}</h3>
                  <Badge className={getSentimentColor(token.sentiment.overall)}>
                    {token.sentiment.overall}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {token.sources.twitter && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Twitter size={12} />
                      X
                    </Badge>
                  )}
                  {token.sources.news && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Newspaper size={12} />
                      News
                    </Badge>
                  )}
                  {token.sources.youtube && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Youtube size={12} />
                      YouTube
                    </Badge>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Mentioned {token.occurrences} times
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMacroInsights = () => {
    if (!macroData?.insights.length) {
      return (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="p-4 border rounded border-yellow-300 bg-yellow-50 text-yellow-800">
              No insights available yet.
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-4">
        {macroData.insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {insight.title}
                </CardTitle>
                <div className="flex gap-1">
                  <Badge className={getStrengthColor(insight.conviction)}>
                    {insight.conviction}
                  </Badge>
                  <Badge variant="outline">
                    {insight.timeframe} term
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{insight.description}</p>
              
              {insight.narratives.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    Related Narratives
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {insight.narratives.map((narrative, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 bg-muted">
                        {narrative}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {insight.tokens.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Related Tokens
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {insight.tokens.map((token, idx) => (
                      <Badge key={idx} className="px-3 py-1 bg-blue-50 text-blue-700">
                        ${token}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Macro Analysis</CardTitle>
          <CardDescription>Cross-platform analysis from social media, news, and video content</CardDescription>
        </CardHeader>
        <CardContent>
          <MacroSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Macro Analysis</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded border-red-300 bg-red-50 text-red-800">
            <AlertCircle className="inline-block mr-2" size={20} />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!macroData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Macro Analysis</CardTitle>
          <CardDescription>No analysis data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded border-yellow-300 bg-yellow-50 text-yellow-800">
            No macro analyses are currently available. Please check back later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Macro Analysis</CardTitle>
            <CardDescription>Last updated: {formatDate(macroData.timestamp)}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`flex items-center gap-1 ${getSentimentColor(macroData.marketSentiment)}`}>
              <Activity size={14} />
              {macroData.marketSentiment} Sentiment
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderSourcesStatus()}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="narratives">Narratives</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-4">
            {renderMacroInsights()}
          </TabsContent>
          
          <TabsContent value="narratives">
            {renderCrossPlatformNarratives()}
          </TabsContent>
          
          <TabsContent value="tokens">
            {renderCrossPlatformTokens()}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <div>
            Data sources: Twitter, News outlets, YouTube videos
          </div>
          <div>
            Last updated: {formatDate(macroData.timestamp)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Macro; 