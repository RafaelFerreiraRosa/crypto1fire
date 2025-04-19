import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllTranscriptAnalyses, 
  getLatestTranscriptAnalyses, 
  getAnalysesByChannel,
  getAnalysesByToken,
  getAnalysesByNarrative,
  getAnalysesBySentiment,
  VideoTranscriptAnalysis
} from '@/lib/services/macroVideoTranscriptDB';

// Format data for export to other agents
function formatDataForExport(analyses: VideoTranscriptAnalysis[]) {
  return analyses.map(analysis => ({
    source: {
      type: 'video',
      videoId: analysis.videoId,
      videoTitle: analysis.videoTitle,
      channelName: analysis.channelName,
      channelUrl: analysis.channelUrl,
      publishedAt: analysis.publishedAt,
      analyzedAt: analysis.analyzedAt
    },
    content: {
      sentiment: analysis.sentiment,
      narratives: analysis.narratives,
      tokens: analysis.mentionedTokens,
      macroSignals: analysis.macroSignals,
      risks: analysis.perceivedRisks,
      opportunities: analysis.opportunities,
      summary: analysis.summary
    },
    metadata: {
      confidence: 0.85, // Placeholder - would be calculated based on analysis confidence
      relevance: 0.9, // Placeholder - would be calculated based on query relevance
      timestamp: new Date().toISOString()
    }
  }));
}

// Generate insights from aggregated analyses
function generateInsights(analyses: VideoTranscriptAnalysis[]) {
  if (analyses.length === 0) {
    return [];
  }
  
  // Count sentiments
  const sentiments = {
    bullish: 0,
    bearish: 0,
    neutral: 0,
    mixed: 0
  };
  
  analyses.forEach(analysis => {
    sentiments[analysis.sentiment.overall]++;
  });
  
  // Find dominant sentiment
  const totalAnalyses = analyses.length;
  const dominantSentiment = Object.entries(sentiments)
    .sort((a, b) => b[1] - a[1])[0];
  
  const dominantPercentage = (dominantSentiment[1] / totalAnalyses) * 100;
  
  // Collect frequently mentioned tokens
  const tokenMentions: Record<string, {count: number, positive: number, negative: number, neutral: number}> = {};
  
  analyses.forEach(analysis => {
    analysis.mentionedTokens.forEach(token => {
      if (!tokenMentions[token.symbol]) {
        tokenMentions[token.symbol] = {
          count: 0,
          positive: 0,
          negative: 0,
          neutral: 0
        };
      }
      
      tokenMentions[token.symbol].count++;
      if (token.sentiment === 'positive') tokenMentions[token.symbol].positive++;
      if (token.sentiment === 'negative') tokenMentions[token.symbol].negative++;
      if (token.sentiment === 'neutral') tokenMentions[token.symbol].neutral++;
    });
  });
  
  // Get top tokens by mention count
  const topTokens = Object.entries(tokenMentions)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([symbol, data]) => ({
      symbol,
      mentions: data.count,
      sentiment: data.positive > data.negative 
        ? 'positive' 
        : data.negative > data.positive 
          ? 'negative' 
          : 'neutral',
      positivePercentage: (data.positive / data.count) * 100
    }));
  
  // Collect narratives
  const narrativeMentions: Record<string, {count: number, emerging: number, growing: number, established: number, fading: number}> = {};
  
  analyses.forEach(analysis => {
    analysis.narratives.forEach(narrative => {
      const name = narrative.name.toLowerCase();
      if (!narrativeMentions[name]) {
        narrativeMentions[name] = {
          count: 0,
          emerging: 0,
          growing: 0,
          established: 0,
          fading: 0
        };
      }
      
      narrativeMentions[name].count++;
      narrativeMentions[name][narrative.strength]++;
    });
  });
  
  // Get top narratives
  const topNarratives = Object.entries(narrativeMentions)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      mentions: data.count,
      strength: data.established > data.growing 
        ? 'established' 
        : data.growing > data.emerging 
          ? 'growing' 
          : data.emerging > data.fading 
            ? 'emerging' 
            : 'fading'
    }));
  
  // Generate insights array
  return [
    {
      type: 'sentiment',
      content: `${dominantSentiment[0].charAt(0).toUpperCase() + dominantSentiment[0].slice(1)} sentiment dominates with ${dominantPercentage.toFixed(0)}% of analyzed videos.`
    },
    {
      type: 'tokens',
      content: `Most discussed tokens: ${topTokens.map(t => t.symbol).join(', ')}. ${topTokens[0].symbol} has ${topTokens[0].positivePercentage.toFixed(0)}% positive sentiment.`
    },
    {
      type: 'narratives',
      content: `Top narratives: ${topNarratives.map(n => n.name).join(', ')}. ${topNarratives[0].name} appears to be ${topNarratives[0].strength}.`
    }
  ];
}

// Handle GET request - export MacroY data to other agents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const limit = parseInt(searchParams.get('limit') || '10');
    const channel = searchParams.get('channel');
    const token = searchParams.get('token');
    const narrative = searchParams.get('narrative');
    const sentiment = searchParams.get('sentiment') as 'bullish' | 'bearish' | 'neutral' | 'mixed' | null;
    
    // Get analyses based on filters
    let analyses: VideoTranscriptAnalysis[] = [];
    
    if (channel) {
      analyses = await getAnalysesByChannel(channel);
    } else if (token) {
      analyses = await getAnalysesByToken(token);
    } else if (narrative) {
      analyses = await getAnalysesByNarrative(narrative);
    } else if (sentiment) {
      analyses = await getAnalysesBySentiment(sentiment);
    } else {
      analyses = await getLatestTranscriptAnalyses(limit);
    }
    
    // Format data for export
    const exportData = formatDataForExport(analyses);
    
    // Generate insights from the analyses
    const insights = generateInsights(analyses);
    
    return NextResponse.json({
      source: 'MacroY',
      timestamp: new Date().toISOString(),
      analyses: exportData,
      insights,
      meta: {
        count: analyses.length,
        filtered: !!(channel || token || narrative || sentiment),
        filterType: channel ? 'channel' : token ? 'token' : narrative ? 'narrative' : sentiment ? 'sentiment' : null
      }
    });
  } catch (error) {
    console.error('Error exporting MacroY data:', error);
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An error occurred exporting MacroY data' },
      { status: 500 }
    );
  }
} 