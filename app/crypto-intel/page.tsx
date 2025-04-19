'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MacroN from '@/components/agents/MacroN';
import MacroY from '@/components/agents/MacroY';
import CryptoReport from '@/components/CryptoReport';

export default function CryptoIntelligence() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-2">Crypto Intelligence</h1>
      <p className="text-muted-foreground mb-6">Real-time market intelligence and analysis</p>
      
      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="report">Market Report</TabsTrigger>
          <TabsTrigger value="news">Macro News</TabsTrigger>
          <TabsTrigger value="videos">Video Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="report">
          <CryptoReport />
        </TabsContent>
        <TabsContent value="news">
          <MacroN />
        </TabsContent>
        <TabsContent value="videos">
          <MacroY />
        </TabsContent>
      </Tabs>
    </div>
  );
} 