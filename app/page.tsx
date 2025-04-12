'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTopCryptos, getGlobalMetrics, CryptoData } from "@/lib/coinapi";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, DollarSign, TrendingUp, BarChart3, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import Link from "next/link";

type SortConfig = {
  key: 'price_usd' | 'percent_change_24h' | 'volume_1day_usd' | null;
  direction: 'asc' | 'desc';
};

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'desc' });
  const { theme, setTheme } = useTheme();

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key ? 
        (current.direction === 'desc' ? 'asc' : 'desc') : 
        'desc'
    }));
  };

  const getSortedData = () => {
    if (!sortConfig.key) return cryptoData.slice(0, 50);

    return [...cryptoData]
      .sort((a, b) => {
        const key = sortConfig.key;
        if (!key) return 0;
        
        const aValue = a[key] || 0;
        const bValue = b[key] || 0;
        
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      })
      .slice(0, 50);
  };

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

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return formatCurrency(value);
  };

  return (
    <main className="flex min-h-screen flex-col p-8 relative overflow-hidden">
      {/* Background Bitcoin Icons */}
      <div className="absolute inset-0 -z-10 opacity-20">
        {/* Primeira camada de ícones */}
        <div className="absolute top-10 left-10">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={100} height={100} />
        </div>
        <div className="absolute top-20 right-20">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={150} height={150} />
        </div>
        <div className="absolute bottom-10 left-20">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={80} height={80} />
        </div>
        <div className="absolute bottom-20 right-10">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={120} height={120} />
        </div>
        <div className="absolute top-1/2 left-1/4">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={200} height={200} />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={60} height={60} />
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={90} height={90} />
        </div>
        <div className="absolute top-1/4 right-1/3">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={70} height={70} />
        </div>

        {/* Segunda camada de ícones */}
        <div className="absolute top-40 left-1/3">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={130} height={130} />
        </div>
        <div className="absolute bottom-40 right-1/3">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={110} height={110} />
        </div>
        <div className="absolute top-1/4 left-1/5">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={85} height={85} />
        </div>
        <div className="absolute bottom-1/4 right-1/5">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={95} height={95} />
        </div>
        <div className="absolute top-3/4 left-2/5">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={75} height={75} />
        </div>
        <div className="absolute bottom-3/4 right-2/5">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={65} height={65} />
        </div>
        <div className="absolute top-2/5 left-3/4">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={140} height={140} />
        </div>
        <div className="absolute bottom-2/5 right-3/4">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={160} height={160} />
        </div>

        {/* Terceira camada de ícones */}
        <div className="absolute top-1/6 left-1/6">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={45} height={45} />
        </div>
        <div className="absolute bottom-1/6 right-1/6">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={55} height={55} />
        </div>
        <div className="absolute top-5/6 left-5/6">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={50} height={50} />
        </div>
        <div className="absolute bottom-5/6 right-5/6">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={40} height={40} />
        </div>
        <div className="absolute top-2/3 left-1/2">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={180} height={180} />
        </div>
        <div className="absolute bottom-2/3 right-1/2">
          <Image src="/bitcoin.svg" alt="Bitcoin" width={170} height={170} />
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Home</h1>
          <Link 
            href="/analyses" 
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Análises
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="card-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capitalização de Mercado Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.market_cap_usd ? formatLargeNumber(globalMetrics.market_cap_usd) : 'N/A'}
            </div>
            <p className={`text-xs ${globalMetrics?.market_cap_change_24h_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {globalMetrics?.market_cap_change_24h_percent ? 
                `${globalMetrics.market_cap_change_24h_percent.toFixed(2)}%` : 
                'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.volume_24h_usd ? formatLargeNumber(globalMetrics.volume_24h_usd) : 'N/A'}
            </div>
            <p className={`text-xs ${globalMetrics?.volume_24h_change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {globalMetrics?.volume_24h_change_percent ? 
                `${globalMetrics.volume_24h_change_percent.toFixed(2)}%` : 
                'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Image
                src="/bitcoin.svg"
                alt="Bitcoin"
              width={20}
              height={20}
            />
              BTC Dominance
            </CardTitle>
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
        <Card className="card-purple">
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

      <div className="flex gap-4">
        <Tabs defaultValue="all" className="space-y-4 flex-1">
          <TabsList className="bg-background/50">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="gainers">Ganhadores</TabsTrigger>
            <TabsTrigger value="losers">Perdedores</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>Principais Criptomoedas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-base w-[15%] px-4">Moeda</TableHead>
                      <TableHead 
                        className="text-base w-[20%] px-4 text-center cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('price_usd')}
                      >
                        <div className="flex items-center justify-center">
                          <DollarSign className={`h-4 w-4 ${sortConfig.key === 'price_usd' ? 'text-primary' : ''}`} />
        </div>
                      </TableHead>
                      <TableHead 
                        className="text-base w-[20%] px-4 text-center cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('percent_change_24h')}
                      >
                        <div className="flex items-center justify-center">
                          <TrendingUp className={`h-4 w-4 ${sortConfig.key === 'percent_change_24h' ? 'text-primary' : ''}`} />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-base w-[20%] px-4 text-center cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('volume_1day_usd')}
                      >
                        <div className="flex items-center justify-center">
                          <BarChart3 className={`h-4 w-4 ${sortConfig.key === 'volume_1day_usd' ? 'text-primary' : ''}`} />
                        </div>
                      </TableHead>
                      <TableHead className="text-base w-[25%] px-4 text-center">Últimas 24h</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedData().map((crypto, index) => (
                      <TableRow key={`all-${crypto.asset_id}-${index}`}>
                        <TableCell className="font-medium w-[15%] px-4">
                          <div className="flex items-center gap-2">
                            <span>{crypto.asset_id}</span>
                            <span className="text-muted-foreground">{crypto.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[20%] px-4 text-center">{formatCurrency(crypto.price_usd)}</TableCell>
                        <TableCell className={`w-[20%] px-4 text-center ${crypto.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {crypto.percent_change_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell className="w-[20%] px-4 text-center">{formatLargeNumber(crypto.volume_1day_usd)}</TableCell>
                        <TableCell className="w-[25%] px-4">
                          <div className="w-[100px] h-[40px] mx-auto">
                            <Sparklines data={crypto.sparkline_data} width={100} height={40}>
                              <SparklinesLine 
                                color={crypto.percent_change_24h >= 0 ? '#22c55e' : '#ef4444'} 
                                style={{ fill: "none" }}
                              />
                            </Sparklines>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gainers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maiores Altas em 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">Moeda</TableHead>
                      <TableHead className="text-base">Preço</TableHead>
                      <TableHead className="text-base">Variação 24h</TableHead>
                      <TableHead className="text-base">Volume 24h</TableHead>
                      <TableHead className="text-base">Últimas 24h</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cryptoData]
                      .filter(crypto => !isNaN(crypto.percent_change_24h))
                      .sort((a, b) => {
                        if (!a.percent_change_24h) return 1;
                        if (!b.percent_change_24h) return -1;
                        return b.percent_change_24h - a.percent_change_24h;
                      })
                      .slice(0, 5)
                      .map((crypto, index) => (
                        <TableRow key={`gainers-${crypto.asset_id}-${index}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span>{crypto.asset_id}</span>
                              <span className="text-muted-foreground">{crypto.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(crypto.price_usd)}</TableCell>
                          <TableCell className="text-green-500 font-semibold">
                            +{crypto.percent_change_24h.toFixed(2)}%
                          </TableCell>
                          <TableCell>{formatLargeNumber(crypto.volume_1day_usd)}</TableCell>
                          <TableCell>
                            <div className="w-[100px] h-[40px]">
                              <Sparklines data={crypto.sparkline_data} width={100} height={40}>
                                <SparklinesLine 
                                  color="#22c55e"
                                  style={{ fill: "none" }}
                                />
                              </Sparklines>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="defi" className="space-y-4 flex-1">
          <TabsList className="bg-background/50">
            <TabsTrigger value="defi">DeFi 🔥</TabsTrigger>
            <TabsTrigger value="gaming">Gaming 🔥</TabsTrigger>
            <TabsTrigger value="layer2">Layer 2 🔥</TabsTrigger>
            <TabsTrigger value="ai">AI 🔥</TabsTrigger>
          </TabsList>
          <TabsContent value="defi" className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>DeFi - Finanças Descentralizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-base">Moeda</TableHead>
                      <TableHead className="text-base">Preço</TableHead>
                      <TableHead className="text-base">Variação 24h</TableHead>
                      <TableHead className="text-base">Volume 24h</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cryptoData]
                      .filter(crypto => {
                        const defiTokens = ['UNI', 'AAVE', 'MKR', 'COMP', 'SNX', 'CAKE', 'CRV', 'SUSHI', '1INCH', 'YFI'];
                        return defiTokens.includes(crypto.asset_id);
                      })
                      .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
                      .slice(0, 5)
                      .map((crypto, index) => (
                        <TableRow key={`defi-${crypto.asset_id}-${index}`}>
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
                          <TableCell>{formatLargeNumber(crypto.volume_1day_usd)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gaming" className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>Gaming e Metaverso</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-base">Moeda</TableHead>
                      <TableHead className="text-base">Preço</TableHead>
                      <TableHead className="text-base">Variação 24h</TableHead>
                      <TableHead className="text-base">Volume 24h</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cryptoData]
                      .filter(crypto => {
                        const gamingTokens = ['AXS', 'SAND', 'MANA', 'ENJ', 'GALA', 'ILV', 'IMX', 'MAGIC', 'WEMIX', 'ULTRA'];
                        return gamingTokens.includes(crypto.asset_id);
                      })
                      .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
                      .slice(0, 5)
                      .map((crypto, index) => (
                        <TableRow key={`gaming-${crypto.asset_id}-${index}`}>
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
                          <TableCell>{formatLargeNumber(crypto.volume_1day_usd)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="layer2" className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>Layer 2 - Escalabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-base">Moeda</TableHead>
                      <TableHead className="text-base">Preço</TableHead>
                      <TableHead className="text-base">Variação 24h</TableHead>
                      <TableHead className="text-base">Volume 24h</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cryptoData]
                      .filter(crypto => {
                        const layer2Tokens = ['MATIC', 'ARB', 'OP', 'IMX', 'METIS', 'ZKS', 'DYDX', 'LRC', 'BOBA', 'RSK'];
                        return layer2Tokens.includes(crypto.asset_id);
                      })
                      .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
                      .slice(0, 5)
                      .map((crypto, index) => (
                        <TableRow key={`layer2-${crypto.asset_id}-${index}`}>
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
                          <TableCell>{formatLargeNumber(crypto.volume_1day_usd)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle>Inteligência Artificial</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="text-base">Moeda</TableHead>
                      <TableHead className="text-base">Preço</TableHead>
                      <TableHead className="text-base">Variação 24h</TableHead>
                      <TableHead className="text-base">Volume 24h</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cryptoData]
                      .filter(crypto => {
                        const aiTokens = ['FET', 'OCEAN', 'AGIX', 'NMR', 'RLC', 'GRT', 'RNDR', 'ALI', 'RAI', 'BOTTO'];
                        return aiTokens.includes(crypto.asset_id);
                      })
                      .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
                      .slice(0, 5)
                      .map((crypto, index) => (
                        <TableRow key={`ai-${crypto.asset_id}-${index}`}>
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
                          <TableCell>{formatLargeNumber(crypto.volume_1day_usd)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
    </main>
  );
}
