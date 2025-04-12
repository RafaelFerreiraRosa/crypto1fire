'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTopCryptos, getGlobalMetrics, CryptoData } from "@/lib/coinapi";

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cryptos, metrics] = await Promise.all([
          getTopCryptos(),
          getGlobalMetrics()
        ]);
        setCryptoData(cryptos);
        setGlobalMetrics(metrics);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-xl">Carregando dados...</div>
      </main>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Criptomoedas</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capitalização de Mercado Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.market_cap_usd ? formatCurrency(globalMetrics.market_cap_usd) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {globalMetrics?.market_cap_change_24h_percent ? 
                `${globalMetrics.market_cap_change_24h_percent.toFixed(2)}% em relação ao dia anterior` : 
                'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.volume_24h_usd ? formatCurrency(globalMetrics.volume_24h_usd) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {globalMetrics?.volume_24h_change_percent ? 
                `${globalMetrics.volume_24h_change_percent.toFixed(2)}% em relação ao dia anterior` : 
                'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.btc_dominance ? `${globalMetrics.btc_dominance.toFixed(2)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {globalMetrics?.btc_dominance_change_24h ? 
                `${globalMetrics.btc_dominance_change_24h.toFixed(2)}% em relação ao dia anterior` : 
                'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Dominance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.eth_dominance ? `${globalMetrics.eth_dominance.toFixed(2)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {globalMetrics?.eth_dominance_change_24h ? 
                `${globalMetrics.eth_dominance_change_24h.toFixed(2)}% em relação ao dia anterior` : 
                'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="gainers">Ganhadores</TabsTrigger>
          <TabsTrigger value="losers">Perdedores</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Principais Criptomoedas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Moeda</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Variação 24h</TableHead>
                    <TableHead>Volume 24h</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cryptoData.map((crypto) => (
                    <TableRow key={crypto.asset_id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{crypto.asset_id}</span>
                          <span className="text-muted-foreground">{crypto.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(crypto.price_usd)}</TableCell>
                      <TableCell className={crypto.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {crypto.percent_change_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell>{formatVolume(crypto.volume_1day_usd)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
} 