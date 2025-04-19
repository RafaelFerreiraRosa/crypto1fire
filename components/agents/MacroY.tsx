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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Clock,
  ExternalLink,
  Lightbulb,
  TrendingUp,
  Youtube,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Zap,
} from "lucide-react";

// Define interfaces
interface VideoSource {
  name: string;
  url: string;
}

interface Sentiment {
  overall: "bullish" | "bearish" | "neutral" | "mixed";
  strength: "strong" | "moderate" | "weak";
  description: string;
}

interface Narrative {
  name: string;
  description: string;
  strength: "established" | "growing" | "emerging" | "fading";
  timeframe: "short" | "medium" | "long";
}

interface MentionedToken {
  symbol: string;
  name: string;
  sentiment: "positive" | "negative" | "neutral";
  context: string;
}

interface MacroSignal {
  type: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface PerceivedRisk {
  category: string;
  description: string;
  severity: "high" | "medium" | "low";
  timeframe: "short" | "medium" | "long";
}

interface Opportunity {
  type: string;
  description: string;
  timeframe: "short" | "medium" | "long";
  conviction: "high" | "medium" | "low";
}

interface VideoTranscriptAnalysis {
  videoId: string;
  videoTitle: string;
  channelName: string;
  channelUrl: string;
  publishedAt: string;
  analyzedAt: string;
  sentiment: Sentiment;
  narratives: Narrative[];
  mentionedTokens: MentionedToken[];
  macroSignals: MacroSignal[];
  perceivedRisks: PerceivedRisk[];
  opportunities: Opportunity[];
  summary: string;
  transcriptSnippets: string[];
}

interface MacroYResponse {
  analyses: VideoTranscriptAnalysis[];
  sources?: string[];
  timestamp: string;
  cached?: boolean;
}

// Loading skeleton component
const VideoAnalysisSkeleton = () => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
    <Skeleton className="h-60 w-full" />
  </div>
);

// Determine color for sentiment
const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'bullish':
      return 'bg-green-500 hover:bg-green-600';
    case 'bearish':
      return 'bg-red-500 hover:bg-red-600';
    case 'neutral':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'mixed':
      return 'bg-yellow-500 hover:bg-yellow-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

// Determine color for strength
const getStrengthColor = (strength: string): string => {
  switch (strength) {
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

// Determine color for token sentiment
const getTokenSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-500 text-white';
    case 'negative':
      return 'bg-red-500 text-white';
    case 'neutral':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Format date
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

// Main MacroY component
const MacroY: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState<MacroYResponse | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoTranscriptAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>("summary");

  // YouTube URL validation
  const isValidYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return youtubeRegex.test(url);
  };

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Handle URL submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidYoutubeUrl(youtubeUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setError("Could not extract video ID from URL");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/agents/transcript/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: youtubeUrl, videoId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze video");
      }
      
      setSuccessMessage("Video submitted for analysis. It will appear in the list once processed.");
      setYoutubeUrl("");
      
      // Refresh the data to show the new analysis (or you might delay this if processing takes time)
      setTimeout(() => {
        fetchData();
      }, 5000); // Give some time for processing
      
    } catch (err) {
      console.error('Failed to submit video for analysis:', err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/transcript');
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      setAgentResponse(data);
      
      // Set the first analysis as selected by default
      if (data.analyses && data.analyses.length > 0) {
        setSelectedAnalysis(data.analyses[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch MacroY data:', err);
      setError('Failed to load video analysis data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectAnalysis = (analysis: VideoTranscriptAnalysis) => {
    setSelectedAnalysis(analysis);
    setActiveTab("summary"); // Reset to summary tab when selecting a new analysis
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Video Transcript Analysis</CardTitle>
          <CardDescription>Loading video analysis data...</CardDescription>
        </CardHeader>
        <CardContent>
          <VideoAnalysisSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Video Transcript Analysis</CardTitle>
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

  if (!agentResponse || !selectedAnalysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Video Transcript Analysis</CardTitle>
          <CardDescription>No analysis data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded border-yellow-300 bg-yellow-50 text-yellow-800">
            No video analyses are currently available. Please check back later.
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
            <CardTitle>Video Transcript Analysis</CardTitle>
            <CardDescription>Insights extracted from crypto analyst videos</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock size={14} />
            {agentResponse ? `Updated ${formatDate(agentResponse.timestamp)}` : 'Loading...'}
          </Badge>
        </div>
      </CardHeader>
      
      {/* Add URL input form */}
      <CardContent className="border-b pb-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Analyze a YouTube Video</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!youtubeUrl.trim() || submitting}
                className="flex items-center gap-1"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Analyze</>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mt-2 text-sm text-green-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {successMessage}
              </div>
            )}
          </div>
        </form>
      </CardContent>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sidebar with video selection */}
          <div className="md:col-span-1 border rounded-lg p-2 h-[600px] overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Recent Videos</h3>
            <div className="space-y-2">
              {agentResponse.analyses.map((analysis) => (
                <div 
                  key={analysis.videoId}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedAnalysis.videoId === analysis.videoId 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSelectAnalysis(analysis)}
                >
                  <h4 className="text-sm font-medium truncate">{analysis.videoTitle}</h4>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span>{analysis.channelName}</span>
                    <Badge 
                      className={`${getSentimentColor(analysis.sentiment.overall)} text-white text-xs`}
                    >
                      {analysis.sentiment.overall}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(analysis.publishedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-bold">{selectedAnalysis.videoTitle}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Youtube size={14} />
                  {selectedAnalysis.channelName}
                </Badge>
                <Badge variant="outline">
                  {formatDate(selectedAnalysis.publishedAt)}
                </Badge>
                <a 
                  href={`https://youtube.com/watch?v=${selectedAnalysis.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  Watch Video
                </a>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="narratives">Narratives</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="macro">Macro Signals</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Overall Sentiment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getSentimentColor(selectedAnalysis.sentiment.overall)} text-white`}>
                        {selectedAnalysis.sentiment.overall.toUpperCase()}
                      </Badge>
                      <Badge className={`${getStrengthColor(selectedAnalysis.sentiment.strength)}`}>
                        {selectedAnalysis.sentiment.strength}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{selectedAnalysis.sentiment.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedAnalysis.summary}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Key Transcript Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedAnalysis.transcriptSnippets.map((snippet, index) => (
                        <div key={index} className="p-3 border rounded-md bg-muted/30">
                          <p className="text-sm italic">"{snippet}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Narratives Tab */}
              <TabsContent value="narratives">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Discussed Narratives
                    </CardTitle>
                    <CardDescription>Key crypto narratives mentioned in the video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedAnalysis.narratives.map((narrative, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{narrative.name}</h3>
                            <div className="flex gap-1">
                              <Badge className={getStrengthColor(narrative.strength)}>
                                {narrative.strength}
                              </Badge>
                              <Badge variant="outline">
                                {narrative.timeframe} term
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{narrative.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tokens Tab */}
              <TabsContent value="tokens">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Mentioned Tokens
                    </CardTitle>
                    <CardDescription>Cryptocurrencies discussed in the video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedAnalysis.mentionedTokens.map((token, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{token.name} <span className="text-sm font-medium text-muted-foreground">${token.symbol}</span></h3>
                            <Badge className={getTokenSentimentColor(token.sentiment)}>
                              {token.sentiment}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{token.context}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Macro Signals Tab */}
              <TabsContent value="macro">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Macro Signals
                      </CardTitle>
                      <CardDescription>Key market and economic signals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedAnalysis.macroSignals.map((signal, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{signal.type}</h3>
                              <Badge className={getStrengthColor(signal.impact)}>
                                {signal.impact} impact
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{signal.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Perceived Risks
                      </CardTitle>
                      <CardDescription>Key risk factors identified</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedAnalysis.perceivedRisks.map((risk, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{risk.category}</h3>
                              <div className="flex gap-1">
                                <Badge className={risk.severity === 'high' ? 'bg-red-500 text-white' : (risk.severity === 'medium' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white')}>
                                  {risk.severity}
                                </Badge>
                                <Badge variant="outline">{risk.timeframe}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Opportunities Tab */}
              <TabsContent value="opportunities">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Investment Opportunities
                    </CardTitle>
                    <CardDescription>Potential opportunities identified in the analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedAnalysis.opportunities.map((opportunity, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold">{opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}</h3>
                            <div className="flex gap-1">
                              <Badge className={getStrengthColor(opportunity.conviction)}>
                                {opportunity.conviction} conviction
                              </Badge>
                              <Badge variant="outline">
                                {opportunity.timeframe} term
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{opportunity.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <div>
            Data sources: {agentResponse.sources?.join(', ') || 'YouTube crypto analyst videos'}
          </div>
          <div>
            {agentResponse.cached ? 'Cached data · ' : ''}Last updated: {formatDate(agentResponse.timestamp)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MacroY; 