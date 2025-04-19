'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AlertTriangle, Info, ArrowUp, ArrowDown, TrendingUp, TrendingDown, ChevronDown, Filter, X, Zap, BarChart2, Users, MessageCircle, RepeatIcon, Eye } from 'lucide-react';

interface OnChainActivity {
  activeUsers: number;
  dailyTransactions: number;
  tvl: number;
  userGrowth: number;
  txGrowth: number;
  activityScore: number;
}

interface TwitterEngagement {
  totalLikes: number;
  totalReposts: number;
  totalViews: number;
  tweetCount: number;
  avgLikesPerTweet: number;
  avgRepostsPerTweet: number;
  avgViewsPerTweet: number;
  engagementScore: number;
  totalEngagement: number;
}

interface Token {
  symbol: string;
  name: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  category: string;
  tradingVolume?: number;
  volumeToMcapRatio?: number;
  volumeQuality?: string;
  onchainActivity?: OnChainActivity;
  dataVerified?: boolean;
  lastUpdated?: string;
}

interface EcosystemMetrics {
  onchainTVL: string;
  weeklyActiveUsers: number;
  weeklyTransactions: number;
}

interface Narrative {
  name: string;
  description: string;
  tokens: Token[];
  risks: string;
  hypeLevel: string;
  sourceType: string;
  socialVolume: number;
  credibilityScore?: number;
  hypeFactor?: number;
  qualityScore?: number;
  ecosystemMetrics?: EcosystemMetrics;
  twitterEngagement?: TwitterEngagement;
  sentimentData?: {
    twitter: number;
    news: number;
    onchain: number;
    combined: number;
  };
}

export default function NarrativeRadar() {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [filteredNarratives, setFilteredNarratives] = useState<Narrative[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedNarrative, setSelectedNarrative] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTokenDetails, setShowTokenDetails] = useState<string | null>(null);
  const [showTwitterDetails, setShowTwitterDetails] = useState<string | null>(null);
  const [showOnChainDetails, setShowOnChainDetails] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const MARKET_CAP_CATEGORIES = ["Microcap", "Smallcap", "Midcap", "Bigcap"];

  const fetchNarratives = async (forceFresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check for cached data if not forcing a fresh fetch
      if (!forceFresh) {
        const cachedData = localStorage.getItem('narrativeData');
        const cachedTime = localStorage.getItem('narrativeDataTime');
        
        if (cachedData && cachedTime) {
          const parsedTime = parseInt(cachedTime, 10);
          const now = Date.now();
          
          // Use cached data if it's still valid
          if (now - parsedTime < CACHE_DURATION) {
            const parsedData = JSON.parse(cachedData);
            setNarratives(parsedData);
            setFilteredNarratives(parsedData);
            setLoading(false);
            setLastFetchTime(parsedTime);
            return;
          }
        }
      }
      
      // Fetch fresh data
      const response = await fetch('/api/trends', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the new data
      const now = Date.now();
      localStorage.setItem('narrativeData', JSON.stringify(data.narratives));
      localStorage.setItem('narrativeDataTime', now.toString());
      
      setNarratives(data.narratives);
      setFilteredNarratives(data.narratives);
      setTrendingCoins(data.trendingCoins || []);
      setLastFetchTime(now);
    } catch (err) {
      console.error('Error fetching narratives:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNarratives();
    
    // Handle clicking outside of narrative dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
      
      if (categoryFilterRef.current && !categoryFilterRef.current.contains(event.target as Node)) {
        setShowCategoryFilter(false);
      }
      
      // Close token details when clicking outside
      if (showTokenDetails && !(event.target as Element).closest('.token-detail-popup')) {
        setShowTokenDetails(null);
      }
      
      // Close on-chain details when clicking outside
      if (showOnChainDetails && !(event.target as Element).closest('.onchain-detail-popup')) {
        setShowOnChainDetails(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (narratives) {
      let filtered = [...narratives];
      
      // Filter by narrative if selected
      if (selectedNarrative) {
        filtered = filtered.filter(n => n.name === selectedNarrative);
      }
      
      // Apply category filter to the tokens within each narrative
      if (selectedCategory) {
        filtered = filtered.map(narrative => {
          // Keep the original narrative structure but filter tokens by category
          return {
            ...narrative,
            tokens: narrative.tokens.filter(token => token.category === selectedCategory)
          };
        }).filter(narrative => narrative.tokens.length > 0); // Remove narratives with no matching tokens
      }
      
      // Always limit tokens to a reasonable number to display (e.g., 5)
      const limitedTokensNarratives = filtered.map(narrative => ({
        ...narrative,
        tokens: narrative.tokens.slice(0, 5)
      }));
      
      // Sort narratives by sentiment or another important metric
      const sortedNarratives = limitedTokensNarratives.sort((a, b) => {
        const sentimentA = a.sentimentData?.combined || 50;
        const sentimentB = b.sentimentData?.combined || 50;
        return sentimentB - sentimentA;
      });
      
      setFilteredNarratives(sortedNarratives);
    }
  }, [narratives, selectedNarrative, selectedCategory]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setShowCategoryFilter(false);
  };

  const toggleCategoryFilter = () => {
    setShowCategoryFilter(!showCategoryFilter);
    setShowFilter(false);
  };

  const selectNarrative = (name: string) => {
    setSelectedNarrative(name === selectedNarrative ? null : name);
    setShowFilter(false);
  };

  const selectCategory = (category: string) => {
    // Toggle the category selection - if clicking the same one, clear it
    if (category === selectedCategory) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  const clearFilters = () => {
    setSelectedNarrative('');
    setSelectedCategory('');
  };

  const toggleTokenDetails = (symbol: string) => {
    setShowTokenDetails(showTokenDetails === symbol ? null : symbol);
  };

  const getHypeLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'alto':
        return <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/80 text-white">
          {level} <TrendingUp className="h-3 w-3 ml-1" />
        </div>;
      case 'médio':
        return <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/80 text-white">
          {level}
        </div>;
      case 'baixo':
        return <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/80 text-white">
          {level} <TrendingDown className="h-3 w-3 ml-1" />
        </div>;
      default:
        return <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/80 text-white">
          {level}
        </div>;
    }
  };

  const getCategoryBadge = (category: string, isClickable = false) => {
    // Define background colors for each category
    let bgColorClass = "";
    
    switch (category) {
      case "Microcap":
        bgColorClass = "bg-red-500/20 text-red-300";
        break;
      case "Smallcap":
        bgColorClass = "bg-orange-500/20 text-orange-300";
        break;
      case "Midcap":
        bgColorClass = "bg-blue-500/20 text-blue-300";
        break;
      case "Bigcap":
        bgColorClass = "bg-green-500/20 text-green-300";
        break;
      default:
        bgColorClass = "bg-zinc-500/20 text-zinc-300";
    }
    
    // Base class for badge
    const baseClass = `px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${bgColorClass}`;
    
    // For clickable badges, add cursor and active state visuals
    if (isClickable) {
      // Add visual indication when the category is selected
      const isSelected = category === selectedCategory;
      const selectedClass = isSelected ? 'ring-2 ring-offset-1 ring-offset-black' : '';
      
      return (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            selectCategory(category);
          }}
          className={`${baseClass} ${selectedClass} cursor-pointer hover:opacity-80 transition-all`}
        >
          {category}
        </div>
      );
    }
    
    return <div className={baseClass}>{category}</div>;
  };

  const getVolumeQualityBadge = (quality?: string) => {
    if (!quality) return null;
    
    switch (quality) {
      case 'Alto':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/80 text-white">
          Vol: {quality}
        </div>;
      case 'Médio':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/80 text-white">
          Vol: {quality}
        </div>;
      case 'Baixo':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/80 text-white">
          Vol: {quality}
        </div>;
      default:
        return null;
    }
  };

  const getQualityScoreBadge = (score?: number) => {
    if (!score) return null;
    
    let color = 'bg-gray-500/80';
    if (score >= 80) color = 'bg-green-500/80';
    else if (score >= 60) color = 'bg-blue-500/80';
    else if (score >= 40) color = 'bg-yellow-500/80';
    else color = 'bg-red-500/80';
    
    return (
      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color} text-white`}>
        <BarChart2 className="h-3 w-3 mr-1" />
        {score.toFixed(0)}
      </div>
    );
  };

  const getSentimentBadge = (sentiment?: number) => {
    if (!sentiment) return null;
    
    let color = '';
    let icon = null;
    let label = '';
    
    if (sentiment >= 70) {
      color = 'bg-green-500/80';
      icon = <ArrowUp className="h-3 w-3 mr-1" />;
      label = 'Bullish';
    } else if (sentiment >= 50) {
      color = 'bg-green-400/70';
      icon = <ArrowUp className="h-3 w-3 mr-1" />;
      label = 'Levemente Bullish';
    } else if (sentiment >= 40) {
      color = 'bg-blue-400/70';
      label = 'Neutro';
    } else if (sentiment >= 30) {
      color = 'bg-red-400/70';
      icon = <ArrowDown className="h-3 w-3 mr-1" />;
      label = 'Levemente Bearish';
    } else {
      color = 'bg-red-500/80';
      icon = <ArrowDown className="h-3 w-3 mr-1" />;
      label = 'Bearish';
    }
    
    return (
      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color} text-white`}>
        {icon}
        {label} ({sentiment.toFixed(0)})
      </div>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  const handleRefresh = () => {
    // Clear cache and fetch fresh data
    localStorage.removeItem('narrativeData');
    localStorage.removeItem('narrativeDataTime');
    fetchNarratives(true);
  };

  // Get unique narrative names for the dropdown
  const uniqueNarratives = Array.from(new Set(narratives.map(n => n.name)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-muted-foreground">Carregando dados do Radar de Narrativas...</p>
        <p className="text-xs text-muted-foreground mt-2">Isso pode levar alguns segundos na primeira carga</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <Card className="bg-background/50">
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Narrative Radar</h2>
            <p className="text-sm text-muted-foreground">
              Principais narrativas cripto e seus tokens associados
              {selectedCategory && (
                <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground">
                  Filtrando por: {selectedCategory}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {(selectedNarrative || selectedCategory) && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-400">Filtros ativos:</span>
                {selectedNarrative && (
                  <span className="px-2 py-1 rounded-md bg-blue-600/30 text-blue-200 text-xs flex items-center">
                    Narrativa: {selectedNarrative}
                    <button 
                      onClick={() => setSelectedNarrative('')} 
                      className="ml-1 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-2 py-1 rounded-md bg-purple-600/30 text-purple-200 text-xs flex items-center">
                    Categoria: {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory('')} 
                      className="ml-1 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="px-2 py-1 rounded-md bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
            
            <button 
              onClick={handleRefresh} 
              className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              <RepeatIcon size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Info size={14} className="mr-1" />
          {lastFetchTime > 0 ? (
            <span className="italic">Data last updated {new Date(lastFetchTime).toLocaleTimeString()}</span>
          ) : (
            <span className="italic">Showing latest data</span>
          )}
          {selectedCategory && (
            <span className="ml-2 italic">
              Mostrando os melhores tokens {selectedCategory} de cada narrativa
            </span>
          )}
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] relative">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={toggleFilter}
                >
                  Narrativa
                  <Filter className="h-4 w-4 ml-1 text-muted-foreground" />
                </div>
                {showFilter && (
                  <div 
                    ref={filterRef}
                    className="absolute top-full left-0 z-10 mt-1 w-48 rounded-md bg-background shadow-lg border border-border"
                  >
                    <div className="py-1">
                      {uniqueNarratives.map((narrative) => (
                        <div 
                          key={narrative}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 flex items-center justify-between ${selectedNarrative === narrative ? 'bg-primary/5 font-medium' : ''}`}
                          onClick={() => selectNarrative(narrative)}
                        >
                          {narrative}
                          {selectedNarrative === narrative && (
                            <ArrowUp className="h-3 w-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TableHead>
              <TableHead className="w-[120px]">Social & Métricas</TableHead>
              <TableHead className="w-[120px]">Vol. Financeiro</TableHead>
              <TableHead className="w-[300px] relative">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={toggleCategoryFilter}
                >
                  Tokens Relevantes
                  <Filter className="h-4 w-4 ml-1 text-muted-foreground" />
                </div>
                {showCategoryFilter && (
                  <div 
                    ref={categoryFilterRef}
                    className="absolute top-full left-0 z-10 mt-1 w-48 rounded-md bg-background shadow-lg border border-border"
                  >
                    <div className="py-1">
                      <div className="mt-2 flex gap-1.5">
                        {MARKET_CAP_CATEGORIES.map((category) => (
                          <div 
                            key={category}
                            onClick={() => selectCategory(category)}
                            className={`px-2 py-1 rounded text-xs font-medium cursor-pointer 
                              ${category === selectedCategory 
                                ? 'bg-primary/20 ring-2 ring-primary/40 text-primary' 
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TableHead>
              <TableHead className="w-[200px]">Riscos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNarratives.map((narrative, index) => {
              // Calcular o volume financeiro total dos tokens
              const totalVolume = narrative.tokens.reduce((acc, token) => acc + (token.marketCap || 0), 0);
              
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{narrative.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{narrative.description}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {narrative.sentimentData && getSentimentBadge(narrative.sentimentData.combined)}
                      </div>
                      
                      {narrative.ecosystemMetrics && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BarChart2 className="h-3 w-3" />
                            <span>TVL: {narrative.ecosystemMetrics.onchainTVL}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{narrative.ecosystemMetrics.weeklyActiveUsers.toLocaleString()} usuários / semana</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1">Social:</span>
                        <span className="font-mono">{narrative.socialVolume.toLocaleString()}</span>
                      </div>
                      
                      {narrative.hypeFactor !== undefined && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground mr-1">Hype:</span>
                          <span className={`font-mono ${narrative.hypeFactor > 3 ? 'text-amber-500' : 'text-green-500'}`}>
                            {narrative.hypeFactor.toFixed(1)}x
                          </span>
                        </div>
                      )}
                      
                      {narrative.sentimentData && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground mr-1">Sentimento:</span>
                          <div className="flex gap-1">
                            <span className={`font-mono text-xs ${
                              narrative.sentimentData.twitter >= 60 ? 'text-green-500' : 
                              narrative.sentimentData.twitter <= 40 ? 'text-red-500' : 'text-blue-500'
                            }`}>
                              X:{narrative.sentimentData.twitter}
                            </span>
                            <span className={`font-mono text-xs ${
                              narrative.sentimentData.news >= 60 ? 'text-green-500' : 
                              narrative.sentimentData.news <= 40 ? 'text-red-500' : 'text-blue-500'
                            }`}>
                              News:{narrative.sentimentData.news}
                            </span>
                            <span className={`font-mono text-xs ${
                              narrative.sentimentData.onchain >= 60 ? 'text-green-500' : 
                              narrative.sentimentData.onchain <= 40 ? 'text-red-500' : 'text-blue-500'
                            }`}>
                              On-chain:{narrative.sentimentData.onchain}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {narrative.credibilityScore && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground mr-1">Credibilidade:</span>
                          <span className="font-mono">{narrative.credibilityScore}</span>
                        </div>
                      )}

                      {narrative.twitterEngagement && (
                        <div onClick={() => setShowTwitterDetails(narrative.name === showTwitterDetails ? null : narrative.name)} 
                             className="mt-2 text-xs cursor-pointer hover:bg-primary/10 rounded px-1 py-0.5 relative">
                          <div className="flex items-center gap-1 text-primary">
                            <MessageCircle className="h-3 w-3" />
                            <span>Ver métricas do Twitter</span>
                          </div>
                          
                          {showTwitterDetails === narrative.name && (
                            <div className="absolute z-20 left-0 mt-1 bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 w-64 shadow-xl">
                              <div className="text-sm font-medium mb-2">Engajamento no Twitter (12h)</div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <div className="text-zinc-400 flex items-center">
                                    <MessageCircle className="h-3 w-3 mr-1" />
                                    Tweets
                                  </div>
                                  <div>{narrative.twitterEngagement.tweetCount}</div>
                                </div>
                                
                                <div>
                                  <div className="text-zinc-400">Score</div>
                                  <div>{narrative.twitterEngagement.engagementScore.toLocaleString()}</div>
                                </div>
                                
                                <div>
                                  <div className="text-zinc-400 flex items-center">
                                    <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                                    </svg>
                                    Likes
                                  </div>
                                  <div>{narrative.twitterEngagement.totalLikes.toLocaleString()}</div>
                                </div>
                                
                                <div>
                                  <div className="text-zinc-400 flex items-center">
                                    <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
                                    </svg>
                                    Reposts
                                  </div>
                                  <div>{narrative.twitterEngagement.totalReposts.toLocaleString()}</div>
                                </div>
                                
                                <div className="col-span-2">
                                  <div className="text-zinc-400 flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Visualizações
                                  </div>
                                  <div>{narrative.twitterEngagement.totalViews.toLocaleString()}</div>
                                </div>
                                
                                <div className="col-span-2 mt-1">
                                  <div className="text-zinc-400">Métricas por tweet</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                      <svg className="h-3 w-3 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                                      </svg>
                                      <span className="ml-1">{narrative.twitterEngagement.avgLikesPerTweet}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <svg className="h-3 w-3 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
                                      </svg>
                                      <span className="ml-1">{narrative.twitterEngagement.avgRepostsPerTweet}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-1 text-xs text-muted-foreground hidden">
                        Fonte: {narrative.sourceType === "technicalResearchers" ? "Pesq. Técnicos" : 
                        narrative.sourceType === "narrativeCurators" ? "Curadores" : "Emergentes"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono">{formatNumber(totalVolume)}</span>
                      
                      {narrative.ecosystemMetrics && (
                        <div 
                          onClick={() => setShowOnChainDetails(narrative.name === showOnChainDetails ? null : narrative.name)}
                          className="mt-1 text-xs text-muted-foreground cursor-pointer hover:text-primary"
                        >
                          <div className="flex items-center gap-1">
                            <span>Txs: {narrative.ecosystemMetrics.weeklyTransactions.toLocaleString()}/semana</span>
                            <BarChart2 className="h-3 w-3" />
                          </div>
                          
                          {/* On Chain Details Popup */}
                          {showOnChainDetails === narrative.name && (
                            <div className="absolute z-20 bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 w-72 shadow-xl onchain-detail-popup">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-bold text-sm">Métricas On-Chain: {narrative.name}</div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOnChainDetails(null);
                                  }}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <div className="text-zinc-400">TVL Total</div>
                                  <div className="font-medium">{narrative.ecosystemMetrics.onchainTVL}</div>
                                </div>
                                <div>
                                  <div className="text-zinc-400">Usuários Ativos</div>
                                  <div className="font-medium">{narrative.ecosystemMetrics.weeklyActiveUsers.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-zinc-400">Transações</div>
                                  <div className="font-medium">{narrative.ecosystemMetrics.weeklyTransactions.toLocaleString()}/semana</div>
                                </div>
                                
                                <div className="col-span-2 mt-1">
                                  <div className="text-zinc-400 mb-1">Tokens com maior atividade</div>
                                  <div className="flex flex-wrap gap-1">
                                    {narrative.tokens
                                      .filter(token => token.onchainActivity)
                                      .sort((a, b) => 
                                        (b.onchainActivity?.activityScore || 0) - 
                                        (a.onchainActivity?.activityScore || 0)
                                      )
                                      .slice(0, 5)
                                      .map((token, i) => (
                                        <div key={i} className="px-2 py-1 bg-zinc-800 rounded-md flex items-center">
                                          <span className="font-medium mr-1">{token.symbol}</span>
                                          <div className="h-1.5 w-12 bg-zinc-700 rounded-full">
                                            <div 
                                              className={`h-1.5 rounded-full ${
                                                (token.onchainActivity?.activityScore || 0) > 75 ? 'bg-green-500' :
                                                (token.onchainActivity?.activityScore || 0) > 50 ? 'bg-blue-500' :
                                                (token.onchainActivity?.activityScore || 0) > 25 ? 'bg-yellow-500' : 'bg-red-500'
                                              }`}
                                              style={{ width: `${token.onchainActivity?.activityScore || 0}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                                
                                {narrative.sentimentData && (
                                  <div className="col-span-2 mt-1">
                                    <div className="text-zinc-400 mb-1">Sentimento On-Chain</div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          narrative.sentimentData.onchain >= 75 ? 'bg-green-500' :
                                          narrative.sentimentData.onchain >= 50 ? 'bg-blue-500' :
                                          narrative.sentimentData.onchain >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${narrative.sentimentData.onchain}%` }}
                                      ></div>
                                    </div>
                                    <div className="flex justify-between text-xs mt-0.5">
                                      <span>Bearish</span>
                                      <span>Bullish</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{narrative.risks}</span>
                    </div>
                    {narrative.hypeFactor !== undefined && narrative.hypeFactor > 4 && (
                      <div className="flex items-center mt-2">
                        <Zap className="h-4 w-4 text-amber-500 mr-1 flex-shrink-0" />
                        <span className="text-xs text-amber-500">Hype elevado em relação a fundamentos</span>
                      </div>
                    )}
                    <div className="flex items-center mt-2">
                      <Info className="h-4 w-4 text-blue-400 mr-1 flex-shrink-0" />
                      <span className="text-xs text-blue-400">Volatilidade: {narrative.name === "Memecoin" ? "Extrema" : narrative.name === "AI + Crypto" || narrative.name === "Gaming" ? "Alta" : "Moderada"}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1 flex-shrink-0" />
                      <span className="text-xs text-green-400">Adoção: {
                        narrative.name === "Layer2" || narrative.name === "DePIN" ? "Crescente" :
                        narrative.name === "ZK" || narrative.name === "RWA" ? "Inicial" : 
                        narrative.name === "BTCfi" ? "Acelerada" : "Variável"
                      }</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 