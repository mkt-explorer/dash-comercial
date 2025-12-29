import { NextRequest, NextResponse } from 'next/server';
import {
  ENDPOINTS,
  DATA_KEYS,
  EndpointKey,
  OpportunityData,
  CrmApiResponse,
  PaginationParams,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@/types/opportunities';

const BASE_URL = 'https://crm.explorercallcenter.com/rest';

/**
 * Função auxiliar para buscar dados de um endpoint específico
 */
async function fetchFromEndpoint(
  endpoint: string,
  funnel: string,
  params?: PaginationParams
): Promise<OpportunityData[]> {
  try {
    const token = process.env.CRM_API_TOKEN;

    if (!token) {
      throw new Error('CRM_API_TOKEN não configurado nas variáveis de ambiente');
    }

    // Construir query string com os parâmetros
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.depth !== undefined) queryParams.append('depth', params.depth.toString());
    if (params?.order_by) queryParams.append('order_by', params.order_by);
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.starting_after) queryParams.append('starting_after', params.starting_after);
    if (params?.ending_before) queryParams.append('ending_before', params.ending_before);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar ${endpoint}: ${response.status} ${response.statusText}`);
    }

    const data: CrmApiResponse = await response.json();

    // Obter a chave correta do data baseado no endpoint
    const dataKey = DATA_KEYS[funnel as EndpointKey] || funnel;
    const opportunities = data?.data?.[dataKey];

    // Validar se a resposta tem a estrutura esperada
    if (!opportunities || !Array.isArray(opportunities)) {
      console.warn(`Endpoint ${endpoint} retornou estrutura inesperada. Data key: ${dataKey}`, data);
      return [];
    }

    // Mapear os dados para o formato desejado
    return opportunities.map((opp) => ({
      id: opp.id,
      funnel,
      name: opp.name,
      createdAt: opp.createdAt,
      updatedAt: opp.updatedAt,
      stage: opp.stage || opp.fase || '',
      amount: opp.amount || opp.valor || null,
    }));
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Função para buscar todas as páginas de um endpoint automaticamente
 */
async function fetchAllPagesFromEndpoint(
  endpoint: string,
  funnel: string,
  params?: PaginationParams
): Promise<OpportunityData[]> {
  let allData: OpportunityData[] = [];
  let hasNextPage = true;
  let cursor: string | undefined = undefined;
  const maxPages = 100; // Limite de segurança
  let pageCount = 0;

  while (hasNextPage && pageCount < maxPages) {
    try {
      const token = process.env.CRM_API_TOKEN;
      if (!token) {
        throw new Error('CRM_API_TOKEN não configurado');
      }

      const queryParams = new URLSearchParams();
      
      // Usar limit maior para reduzir número de requisições
      queryParams.append('limit', params?.limit?.toString() || '200');
      if (params?.depth !== undefined) queryParams.append('depth', params.depth.toString());
      if (params?.order_by) queryParams.append('order_by', params.order_by);
      if (params?.filter) queryParams.append('filter', params.filter);
      if (cursor) queryParams.append('starting_after', cursor);

      const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: CrmApiResponse = await response.json();

      // Obter a chave correta do data baseado no endpoint
      const dataKey = DATA_KEYS[funnel as EndpointKey] || funnel;
      const opportunities = data?.data?.[dataKey];

      if (!opportunities || !Array.isArray(opportunities)) {
        console.warn(`Endpoint ${endpoint} retornou estrutura inesperada na página ${pageCount + 1}. Data key: ${dataKey}`);
        break;
      }

      const mappedOpportunities = opportunities.map((opp) => ({
        id: opp.id,
        funnel,
        name: opp.name,
        createdAt: opp.createdAt,
        updatedAt: opp.updatedAt,
        stage: opp.stage || opp.fase || '',
        amount: opp.amount || opp.valor || null,
      }));

      allData.push(...mappedOpportunities);

      hasNextPage = data.pageInfo?.hasNextPage || false;
      cursor = data.pageInfo?.endCursor;
      pageCount++;

      console.log(`${funnel}: Página ${pageCount} - ${mappedOpportunities.length} registros (total: ${allData.length})`);

    } catch (error) {
      console.error(`Erro ao buscar página ${pageCount + 1} de ${endpoint}:`, error);
      break;
    }
  }

  return allData;
}

/**
 * GET /api/opportunities
 * 
 * Query params opcionais:
 * - endpoint: específico endpoint para buscar (opportunities, explorerBc, dot, orgaoPublico)
 * - all: true para buscar de todos os endpoints
 * - fetch_all_pages: true para buscar todas as páginas automaticamente (ignora starting_after/ending_before)
 * - limit: número de resultados por página (0-200, padrão: 60)
 * - depth: nível de objetos relacionados (0 ou 1, padrão: 1)
 * - order_by: ordenação (ex: "name,createdAt[DESC]")
 * - filter: filtros (ex: "stage[eq]:LEAD,name[contains]:Hospital")
 * - starting_after: cursor para paginação manual
 * - ending_before: cursor para paginação manual
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpointParam = searchParams.get('endpoint') as EndpointKey | null;
    const fetchAll = searchParams.get('all') === 'true';
    const fetchAllPages = searchParams.get('fetch_all_pages') === 'true';

    // Parâmetros de paginação e filtros
    const paginationParams: PaginationParams = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      depth: searchParams.get('depth') ? parseInt(searchParams.get('depth')!) as 0 | 1 : undefined,
      order_by: searchParams.get('order_by') || undefined,
      filter: searchParams.get('filter') || undefined,
      starting_after: searchParams.get('starting_after') || undefined,
      ending_before: searchParams.get('ending_before') || undefined,
    };

    let results: OpportunityData[] = [];
    let errors: Array<{ endpoint: string; error: string }> = [];

    if (fetchAll) {
      // Buscar de todos os endpoints
      const promises = Object.entries(ENDPOINTS).map(([key, path]) =>
        fetchAllPages 
          ? fetchAllPagesFromEndpoint(path, key, paginationParams)
          : fetchFromEndpoint(path, key, paginationParams)
      );

      const allResults = await Promise.allSettled(promises);

      // Processar resultados, incluindo apenas os bem-sucedidos
      allResults.forEach((result, index) => {
        const endpointKey = Object.keys(ENDPOINTS)[index];
        if (result.status === 'fulfilled') {
          results.push(...result.value);
        } else {
          const errorMessage = result.reason instanceof Error ? result.reason.message : 'Erro desconhecido';
          errors.push({ endpoint: endpointKey, error: errorMessage });
          console.error(`Falha ao buscar do endpoint ${endpointKey}:`, result.reason);
        }
      });
    } else if (endpointParam && endpointParam in ENDPOINTS) {
      // Buscar de um endpoint específico
      results = fetchAllPages
        ? await fetchAllPagesFromEndpoint(ENDPOINTS[endpointParam], endpointParam, paginationParams)
        : await fetchFromEndpoint(ENDPOINTS[endpointParam], endpointParam, paginationParams);
    } else {
      // Padrão: buscar apenas do endpoint 'opportunities'
      results = fetchAllPages
        ? await fetchAllPagesFromEndpoint(ENDPOINTS.opportunities, 'opportunities', paginationParams)
        : await fetchFromEndpoint(ENDPOINTS.opportunities, 'opportunities', paginationParams);
    }

    const response: ApiSuccessResponse = {
      success: true,
      data: results,
      total: results.length,
      ...(errors.length > 0 && { errors }),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Erro na rota de API:', error);
    
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: 'Erro ao buscar oportunidades',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}