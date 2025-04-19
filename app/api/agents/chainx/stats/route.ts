import { NextResponse } from 'next/server';
import { getTweetStats } from '@/lib/services/chainTweetsDB';

export async function GET() {
  try {
    const stats = await getTweetStats();
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to generate on-chain tweet stats' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching ChainX stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch on-chain tweet statistics' },
      { status: 500 }
    );
  }
} 