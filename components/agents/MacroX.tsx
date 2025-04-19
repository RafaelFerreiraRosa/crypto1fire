'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, TrendingUp, TrendingDown, BarChart2, Twitter, Users } from 'lucide-react';

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

interface MacroAnalysisResult {
  sentimento_geral: 'bullish' | 'bearish' | 'neutro';
  sinais_macro: string;
  narrativas_emergentes: string[];
  tokens_mencionados: string[];
  fase_ciclo_mercado: 'acumulação' | 'alta' | 'distribuição' | 'baixa';
  justificativa: string;
  timestamp?: string;
  id?: string;
  cached?: boolean;
  influenciadores_chave?: string[];
  influencers_monitored?: string[];
}

const MacroX: React.FC = () => {
  const [analysis, setAnalysis] = useState<MacroAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMacroAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/agents/macro');
      
      if (!response.ok) {
        throw new Error('Failed to fetch macro analysis');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to load macro analysis. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMacroAnalysis();
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

  const getMarketPhaseIcon = (phase: 'acumulação' | 'alta' | 'distribuição' | 'baixa') => {
    switch (phase) {
      case 'acumulação':
        return <BarChart2 className="h-5 w-5 text-blue-500" />;
      case 'alta':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'distribuição':
        return <BarChart2 className="h-5 w-5 text-orange-500" />;
      case 'baixa':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
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
            Analysis Error
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={fetchMacroAnalysis}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-blue-500" />
            MacroX Analysis
          </CardTitle>
          <Badge className={getSentimentColor(analysis.sentimento_geral)}>
            {analysis.sentimento_geral ? analysis.sentimento_geral.toUpperCase() : 'UNKNOWN'}
          </Badge>
        </div>
        <CardDescription>
          {analysis.timestamp && (
            <span>Last updated: {new Date(analysis.timestamp).toLocaleString()}</span>
          )}
          {analysis.cached && (
            <span className="ml-2 text-xs">(cached)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="narratives">Narratives</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="justification">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium">Market Phase</h3>
              <div className="mt-2 flex items-center">
                {getMarketPhaseIcon(analysis.fase_ciclo_mercado)}
                <span className="ml-2 font-semibold capitalize">{analysis.fase_ciclo_mercado}</span>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium">Macro Signals</h3>
              <p className="mt-2 text-sm">{analysis.sinais_macro}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="narratives">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-3">Emerging Narratives</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.narrativas_emergentes && analysis.narrativas_emergentes.map((narrative, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1 border">
                    {narrative}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tokens">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-3">Mentioned Tokens</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.tokens_mencionados && analysis.tokens_mencionados.map((token, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 bg-muted">
                    {token}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="influencers">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Monitored Accounts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.influencers_monitored || []).map((influencer, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 border bg-blue-50">
                      {influencer}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {analysis.influenciadores_chave && analysis.influenciadores_chave.length > 0 && (
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Key Voices in Current Analysis
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.influenciadores_chave.map((influencer, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800">
                        {influencer}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="justification">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Detailed Analysis</h3>
              <p className="text-sm whitespace-pre-line">{analysis.justificativa}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={fetchMacroAnalysis}>
          Refresh Analysis
        </Button>
        <div className="text-xs text-gray-500">
          Powered by AI tweet analysis
          {analysis.id && <span> • ID: {analysis.id}</span>}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MacroX; 