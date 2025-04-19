import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface VideoSource {
  name: string;
  channelUrl: string;
  category: 'technical' | 'fundamental' | 'macro' | 'defi' | 'institutional' | 'educational';
  quality: number; // 1-5, with 5 being the highest
}

export interface VideoTranscriptAnalysis {
  id?: string;
  videoId: string; // YouTube video ID or other unique identifier
  videoTitle: string;
  channelName: string;
  channelUrl: string;
  transcriptUrl?: string; // URL to the full transcript if stored separately
  publishedAt: string; // ISO date string
  analyzedAt: string; // ISO date string when the analysis was performed
  
  // Analysis results
  sentiment: {
    overall: 'bullish' | 'bearish' | 'neutral' | 'mixed';
    strength: 'weak' | 'moderate' | 'strong';
    description: string;
  };
  
  narratives: Array<{
    name: string;
    description: string;
    strength: 'emerging' | 'growing' | 'established' | 'fading';
    timeframe: 'short' | 'medium' | 'long';
  }>;
  
  mentionedTokens: Array<{
    symbol: string;
    name?: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    context: string; // Brief excerpt from transcript explaining the mention
  }>;
  
  macroSignals: Array<{
    type: 'monetary-policy' | 'regulation' | 'adoption' | 'institutional' | 'technology' | 'geopolitical' | 'other';
    description: string;
    impact: 'low' | 'medium' | 'high' | 'very-high';
  }>;
  
  perceivedRisks: Array<{
    category: 'market' | 'regulatory' | 'technical' | 'fundamental' | 'competition' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timeframe: 'immediate' | 'short' | 'medium' | 'long';
  }>;
  
  opportunities: Array<{
    type: 'token' | 'sector' | 'strategy' | 'narrative';
    description: string;
    timeframe: 'short' | 'medium' | 'long';
    conviction: 'low' | 'medium' | 'high';
  }>;
  
  summary: string; // A concise summary of the entire analysis
  
  // Original data
  transcriptSnippets: string[]; // Key excerpts from the transcript
}

// List of high-quality crypto YouTube channels to monitor
export const VIDEO_SOURCES: VideoSource[] = [
  { name: 'Benjamin Cowen', channelUrl: 'https://www.youtube.com/c/IntoTheCryptoverse', category: 'technical', quality: 5 },
  { name: 'Digital Asset News', channelUrl: 'https://www.youtube.com/c/DigitalAssetNews', category: 'institutional', quality: 4 },
  { name: 'Coin Bureau', channelUrl: 'https://www.youtube.com/c/CoinBureau', category: 'educational', quality: 5 },
  { name: 'Real Vision', channelUrl: 'https://www.youtube.com/c/RealVisionFinance', category: 'macro', quality: 5 },
  { name: 'DataDash', channelUrl: 'https://www.youtube.com/c/DataDash', category: 'technical', quality: 4 },
  { name: 'Uncommon Core', channelUrl: 'https://www.youtube.com/c/UncommonCore', category: 'fundamental', quality: 5 },
  { name: 'Anthony Pompliano', channelUrl: 'https://www.youtube.com/c/AnthonyPompliano', category: 'macro', quality: 4 },
  { name: 'Unchained Podcast', channelUrl: 'https://www.youtube.com/c/UnchainedPodcast', category: 'educational', quality: 5 },
  { name: 'Bankless', channelUrl: 'https://www.youtube.com/c/Bankless', category: 'defi', quality: 5 },
  { name: 'The Defiant', channelUrl: 'https://www.youtube.com/c/TheDefiant', category: 'defi', quality: 4 },
  { name: 'Blockworks', channelUrl: 'https://www.youtube.com/c/BlockworksGroup', category: 'institutional', quality: 5 },
  { name: 'Crypto Banter', channelUrl: 'https://www.youtube.com/c/CryptoBanter', category: 'technical', quality: 3 }
];

const DB_DIR = path.join(process.cwd(), 'data');
const TRANSCRIPT_DB_FILE = path.join(DB_DIR, 'video-transcript-analyses.json');

// Initialize local database
async function initializeDB() {
  try {
    await mkdir(DB_DIR, { recursive: true });
    
    try {
      await readFile(TRANSCRIPT_DB_FILE, 'utf-8');
      // File exists
    } catch (error) {
      // If file doesn't exist, create it with an empty array
      await writeFile(TRANSCRIPT_DB_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing MacroY database:', error);
  }
}

// Get all stored transcript analyses
export async function getAllTranscriptAnalyses(): Promise<VideoTranscriptAnalysis[]> {
  try {
    await initializeDB();
    const data = await readFile(TRANSCRIPT_DB_FILE, 'utf-8');
    return JSON.parse(data) as VideoTranscriptAnalysis[];
  } catch (error) {
    console.error('Error reading transcript analyses:', error);
    return [];
  }
}

// Get the most recent transcript analyses (limited by count)
export async function getLatestTranscriptAnalyses(limit: number = 10): Promise<VideoTranscriptAnalysis[]> {
  try {
    const analyses = await getAllTranscriptAnalyses();
    
    // Sort by analyzedAt date (most recent first)
    return analyses
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting latest transcript analyses:', error);
    return [];
  }
}

// Save a new transcript analysis to the database
export async function saveTranscriptAnalysis(analysis: VideoTranscriptAnalysis): Promise<VideoTranscriptAnalysis> {
  try {
    await initializeDB();
    const analyses = await getAllTranscriptAnalyses();
    
    // Generate a unique ID based on timestamp and video title
    const newAnalysis = {
      ...analysis,
      id: `transcript-${Date.now()}-${analysis.videoId}`
    };
    
    analyses.push(newAnalysis);
    
    // Limit history to the last 500 items to prevent excessive growth
    const limitedAnalyses = analyses
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
      .slice(0, 500);
    
    await writeFile(TRANSCRIPT_DB_FILE, JSON.stringify(limitedAnalyses, null, 2));
    return newAnalysis;
  } catch (error) {
    console.error('Error saving transcript analysis:', error);
    throw new Error('Failed to save transcript analysis');
  }
}

// Get transcript analyses by channel name
export async function getAnalysesByChannel(channelName: string): Promise<VideoTranscriptAnalysis[]> {
  try {
    const analyses = await getAllTranscriptAnalyses();
    return analyses.filter(item => 
      item.channelName.toLowerCase().includes(channelName.toLowerCase())
    );
  } catch (error) {
    console.error(`Error getting analyses for channel ${channelName}:`, error);
    return [];
  }
}

// Get transcript analyses by mentioned token
export async function getAnalysesByToken(token: string): Promise<VideoTranscriptAnalysis[]> {
  try {
    const analyses = await getAllTranscriptAnalyses();
    return analyses.filter(item => 
      item.mentionedTokens.some(t => 
        t.symbol.toLowerCase() === token.toLowerCase() ||
        (t.name && t.name.toLowerCase().includes(token.toLowerCase()))
      )
    );
  } catch (error) {
    console.error(`Error getting analyses for token ${token}:`, error);
    return [];
  }
}

// Get transcript analyses by narrative
export async function getAnalysesByNarrative(narrative: string): Promise<VideoTranscriptAnalysis[]> {
  try {
    const analyses = await getAllTranscriptAnalyses();
    return analyses.filter(item => 
      item.narratives.some(n => 
        n.name.toLowerCase().includes(narrative.toLowerCase()) ||
        n.description.toLowerCase().includes(narrative.toLowerCase())
      )
    );
  } catch (error) {
    console.error(`Error getting analyses for narrative ${narrative}:`, error);
    return [];
  }
}

// Get transcript analyses by sentiment
export async function getAnalysesBySentiment(sentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed'): Promise<VideoTranscriptAnalysis[]> {
  try {
    const analyses = await getAllTranscriptAnalyses();
    return analyses.filter(item => item.sentiment.overall === sentiment);
  } catch (error) {
    console.error(`Error getting analyses with sentiment ${sentiment}:`, error);
    return [];
  }
}

// Get transcript analysis by video ID
export async function getAnalysisByVideoId(videoId: string): Promise<VideoTranscriptAnalysis | null> {
  try {
    const analyses = await getAllTranscriptAnalyses();
    return analyses.find(item => item.videoId === videoId) || null;
  } catch (error) {
    console.error(`Error getting analysis for video ID ${videoId}:`, error);
    return null;
  }
}

// Get aggregated statistics about the analyses
export async function getTranscriptAnalysisStats() {
  try {
    const analyses = await getAllTranscriptAnalyses();
    const lastMonthCutoff = new Date();
    lastMonthCutoff.setMonth(lastMonthCutoff.getMonth() - 1);
    
    const recentAnalyses = analyses.filter(item => new Date(item.analyzedAt) >= lastMonthCutoff);
    
    // Sentiment counts
    const sentimentCounts = {
      bullish: recentAnalyses.filter(item => item.sentiment.overall === 'bullish').length,
      bearish: recentAnalyses.filter(item => item.sentiment.overall === 'bearish').length,
      neutral: recentAnalyses.filter(item => item.sentiment.overall === 'neutral').length,
      mixed: recentAnalyses.filter(item => item.sentiment.overall === 'mixed').length
    };
    
    // Most mentioned tokens
    const tokenMentions: Record<string, number> = {};
    recentAnalyses.forEach(item => {
      item.mentionedTokens.forEach(token => {
        tokenMentions[token.symbol] = (tokenMentions[token.symbol] || 0) + 1;
      });
    });
    
    const topTokens = Object.entries(tokenMentions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([symbol, count]) => ({ symbol, count }));
    
    // Most common narratives
    const narrativeCounts: Record<string, number> = {};
    recentAnalyses.forEach(item => {
      item.narratives.forEach(narrative => {
        narrativeCounts[narrative.name] = (narrativeCounts[narrative.name] || 0) + 1;
      });
    });
    
    const topNarratives = Object.entries(narrativeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    // Most common risks
    const riskCounts: Record<string, number> = {};
    recentAnalyses.forEach(item => {
      item.perceivedRisks.forEach(risk => {
        riskCounts[risk.category] = (riskCounts[risk.category] || 0) + 1;
      });
    });
    
    const topRisks = Object.entries(riskCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }));
    
    return {
      totalAnalyses: analyses.length,
      recentAnalyses: recentAnalyses.length,
      sentimentCounts,
      topTokens,
      topNarratives,
      topRisks,
      lastUpdated: analyses.length > 0 ? 
        analyses.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())[0].analyzedAt : 
        null
    };
  } catch (error) {
    console.error('Error getting transcript analysis stats:', error);
    return null;
  }
} 