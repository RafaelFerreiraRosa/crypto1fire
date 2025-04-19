import { NextResponse } from 'next/server';
import { getLatestAnalysis } from '@/lib/services/macroAnalysisDB';
import { getLatestNews, getHighImpactNews } from '@/lib/services/macroNewsDB';

interface AgentShareRequest {
  sourceAgent: string;
  targetAgent: string;
  requestType: string;
  parameters?: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const body: AgentShareRequest = await request.json();
    const { sourceAgent, targetAgent, requestType, parameters } = body;
    
    // Log da solicitação entre agentes
    console.log(`Agent communication: ${sourceAgent} -> ${targetAgent}, Request: ${requestType}`);
    
    // Validar os campos obrigatórios
    if (!sourceAgent || !targetAgent || !requestType) {
      return NextResponse.json(
        { error: 'Missing required fields: sourceAgent, targetAgent, or requestType' },
        { status: 400 }
      );
    }
    
    // Lógica para diferentes tipos de comunicação entre agentes
    if (targetAgent === 'MacroX') {
      // Solicitações para o agente MacroX
      switch (requestType) {
        case 'getLatestAnalysis':
          const analysis = await getLatestAnalysis();
          return NextResponse.json({
            success: true,
            sourceAgent: targetAgent, // agora MacroX é a fonte da resposta
            targetAgent: sourceAgent, // enviando para quem solicitou
            responseType: 'macroAnalysis',
            data: analysis
          });
          
        default:
          return NextResponse.json(
            { error: `Unknown request type for MacroX: ${requestType}` },
            { status: 400 }
          );
      }
    } 
    
    // Solicitações para o agente MacroN
    if (targetAgent === 'MacroN') {
      switch (requestType) {
        case 'getLatestNews':
          const limit = parameters?.limit || 10;
          const news = await getLatestNews(limit);
          return NextResponse.json({
            success: true,
            sourceAgent: targetAgent,
            targetAgent: sourceAgent,
            responseType: 'macroNews',
            data: news
          });
          
        case 'getHighImpactNews':
          const highImpactNews = await getHighImpactNews();
          return NextResponse.json({
            success: true,
            sourceAgent: targetAgent,
            targetAgent: sourceAgent,
            responseType: 'highImpactNews',
            data: highImpactNews
          });
          
        default:
          return NextResponse.json(
            { error: `Unknown request type for MacroN: ${requestType}` },
            { status: 400 }
          );
      }
    }
    
    // Pode adicionar outros agentes conforme necessário
    // else if (targetAgent === 'OutroAgente') { ... }
    
    // Agente não encontrado
    return NextResponse.json(
      { error: `Agent not found: ${targetAgent}` },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Error in agent communication:', error);
    return NextResponse.json(
      { error: 'Failed to process agent communication request' },
      { status: 500 }
    );
  }
}

// Esta API também pode fornecer informações sobre os agentes disponíveis
export async function GET() {
  try {
    // Lista de agentes disponíveis e suas capacidades
    const availableAgents = [
      {
        id: 'MacroX',
        description: 'Analisa tweets de influenciadores cripto para extrair sinais macroeconômicos',
        endpoints: [
          {
            requestType: 'getLatestAnalysis',
            description: 'Retorna a análise macroeconômica mais recente'
          }
        ]
      },
      {
        id: 'MacroN',
        description: 'Analisa notícias macro de fontes confiáveis de mídia cripto e financeira',
        endpoints: [
          {
            requestType: 'getLatestNews',
            description: 'Retorna as notícias mais recentes analisadas',
            parameters: {
              limit: 'Número de notícias para retornar (opcional, padrão: 10)'
            }
          },
          {
            requestType: 'getHighImpactNews',
            description: 'Retorna notícias com alto impacto macroeconômico'
          }
        ]
      }
      // Adicionar outros agentes conforme eles forem criados
    ];
    
    return NextResponse.json({
      availableAgents,
      totalAgents: availableAgents.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching available agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available agents' },
      { status: 500 }
    );
  }
} 