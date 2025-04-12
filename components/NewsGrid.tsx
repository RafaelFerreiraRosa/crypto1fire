'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface NewsGridProps {
  news: any[];
}

function getMarketSentimentEmoji(news: any) {
  if (news.votes && news.votes.important > 0) {
    return '🐂'; // Touro (Bullish)
  } else if (news.votes && news.votes.negative > 0) {
    return '🐻'; // Urso (Bearish)
  }
  return '➡️'; // Neutro
}

function formatTimeSince(dateString: string): string {
  const publishedDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - publishedDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffMins / 1440);
    return `${days}d ago`;
  }
}

export default function NewsGrid({ news }: NewsGridProps) {
  const [showAllNews, setShowAllNews] = useState(false);
  
  // Mostrar apenas 6 notícias inicialmente, ou todas 12 se showAllNews for true
  const displayedNews = showAllNews ? news.slice(0, 12) : news.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedNews.length > 0 ? (
          displayedNews.map((item: any) => (
            <div key={item.id} className="flex flex-col h-full bg-zinc-800/80 hover:bg-zinc-700/90 rounded-lg transition-colors border border-border/20 p-4">
              <a 
                href={item.original_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary transition-colors flex items-start gap-2 mb-2"
              >
                <div className="flex-1 flex items-start">
                  <span className="mr-1">{item.title}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0 mt-1 ml-1" />
                </div>
                <span className="text-base flex-shrink-0">
                  {getMarketSentimentEmoji(item)}
                </span>
              </a>
              <div className="flex items-center gap-2 mt-auto">
                <p className="text-xs text-muted-foreground">
                  {formatTimeSince(item.published_at)}
                </p>
                <a 
                  href={`https://${item.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-500 hover:text-purple-600 transition-colors"
                >
                  {item.domain}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground col-span-3">Carregando notícias...</div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        {!showAllNews && news.length > 6 ? (
          <button 
            onClick={() => setShowAllNews(true)}
            className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/90 rounded-md text-white text-sm font-medium transition-colors border border-border/20"
          >
            More
          </button>
        ) : (
          <a 
            href="https://cryptopanic.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/90 rounded-md text-white text-sm font-medium transition-colors border border-border/20"
          >
            Ver Todas
          </a>
        )}
      </div>
    </>
  );
} 