'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CryptoReport from '@/components/CryptoReport';
import Link from 'next/link';
import { Home, BarChart2, PieChart, LineChart, Newspaper } from 'lucide-react';
import MacroX from '@/components/agents/MacroX';
import MacroN from '@/components/agents/MacroN';

export default function ReportPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Report</h1>
          <Link 
            href="/" 
            className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link 
            href="/analyses" 
            className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-1"
          >
            <BarChart2 className="h-4 w-4" /> Análises
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          Última atualização: <span suppressHydrationWarning>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="report">Dashboard Principal</TabsTrigger>
          <TabsTrigger value="narratives">Narrativas</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="macro">Análise Social</TabsTrigger>
          <TabsTrigger value="news">Análise de Notícias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="report" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <CryptoReport />
          )}
        </TabsContent>
        
        <TabsContent value="narratives" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Narrativas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo de análise de narrativas será implementado aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokens" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo de análise de tokens será implementado aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="macro" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <MacroX />
          </div>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <MacroN />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 