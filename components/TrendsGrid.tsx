'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

interface Narrative {
  name: string;
  socialVolume: number;
  financialVolume: number;
  influencers: number;
  tokens: string[];
  risks: {
    primary: string;
    details: string;
  };
}

export default function TrendsGrid() {
  const [narratives, setNarratives] = useState<Narrative[]>([
    {
      name: "DePIN",
      socialVolume: 85000,
      financialVolume: 2500000000,
      influencers: 12,
      tokens: ["HNT", "MOBILE", "RNDR", "FIL"],
      risks: {
        primary: "Adoção inicial limitada",
        details: "Infraestrutura física necessária pode atrasar crescimento"
      }
    },
    {
      name: "ZK",
      socialVolume: 120000,
      financialVolume: 4800000000,
      influencers: 25,
      tokens: ["MINA", "ZKS", "STARK", "IMX"],
      risks: {
        primary: "Complexidade técnica",
        details: "Dificuldade de auditoria e validação dos sistemas"
      }
    },
    {
      name: "RWA",
      socialVolume: 45000,
      financialVolume: 1200000000,
      influencers: 8,
      tokens: ["MKR", "RNDR", "UNI", "AAVE"],
      risks: {
        primary: "Regulamentação incerta",
        details: "Possíveis restrições governamentais em múltiplas jurisdições"
      }
    },
    {
      name: "BTCfi",
      socialVolume: 95000,
      financialVolume: 3600000000,
      influencers: 18,
      tokens: ["STX", "ORDI", "RATS", "SATS"],
      risks: {
        primary: "Alta volatilidade",
        details: "Dependência direta das flutuações do Bitcoin"
      }
    },
    {
      name: "AI + Crypto",
      socialVolume: 150000,
      financialVolume: 5200000000,
      influencers: 30,
      tokens: ["AGIX", "FET", "OCEAN", "GRT"],
      risks: {
        primary: "Hype excessivo",
        details: "Possível bolha especulativa no setor de IA"
      }
    }
  ]);

  const getSocialVolumeCategory = (volume: number): string => {
    if (volume >= 130000) return "Muito Alto";
    if (volume >= 90000) return "Alto";
    if (volume >= 70000) return "Médio";
    if (volume >= 50000) return "Baixo";
    return "Muito Baixo";
  };

  const refreshData = () => {
    // Simulando atualização de dados
    const updatedNarratives = narratives.map(narrative => ({
      ...narrative,
      socialVolume: Math.floor(Math.random() * 200000) + 30000,
      financialVolume: Math.floor(Math.random() * 8000000000) + 1000000000
    }));
    setNarratives(updatedNarratives);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    }
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Narrative Radar</h2>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Narrativa</TableHead>
              <TableHead>Volume Social</TableHead>
              <TableHead>Volume Financeiro</TableHead>
              <TableHead>Influencers</TableHead>
              <TableHead>Tokens Relevantes</TableHead>
              <TableHead>Riscos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {narratives.map((narrative) => (
              <TableRow key={narrative.name}>
                <TableCell className="font-medium">{narrative.name}</TableCell>
                <TableCell>{getSocialVolumeCategory(narrative.socialVolume)}</TableCell>
                <TableCell>{formatVolume(narrative.financialVolume)}</TableCell>
                <TableCell>{narrative.influencers} ativos</TableCell>
                <TableCell>{narrative.tokens.join(", ")}</TableCell>
                <TableCell>
                  <div className="text-red-500">
                    <div>{narrative.risks.primary}</div>
                    <div className="text-sm mt-1">{narrative.risks.details}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
