/**
 * Tipos TypeScript para a API de Oportunidades
 * Este arquivo centraliza todas as tipagens usadas na aplicação
 */

// Endpoints disponíveis
export const ENDPOINTS = {
  opportunities: '/opportunities',
  explorerBc: '/oportunidadesExplorerBc',
  dot: '/oportunidadesDot',
  orgaoPublico: '/oportunidadesOrgaoPublico',
} as const;

// Mapeamento de nomes de campos no objeto data
export const DATA_KEYS = {
  opportunities: 'opportunities',
  explorerBc: 'oportunidadesExplorerBc',
  dot: 'oportunidadesDot',
  orgaoPublico: 'oportunidadesOrgaoPublico',
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
export type EndpointPath = typeof ENDPOINTS[EndpointKey];

// Estrutura de amount/valor
export interface Amount {
  amountMicros: string | null;
  currencyCode: string;
}

// Dados da oportunidade (formato retornado pela nossa API)
export interface OpportunityData {
  id: string;
  funnel: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  stage: string;
  amount: Amount | null;
}

// Resposta da API original do CRM (formato que vem do endpoint externo)
export interface CrmOpportunity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  stage?: string; // Para opportunities
  fase?: string; // Para outros endpoints (explorerBc, dot, orgaoPublico)
  amount?: Amount;
  valor?: Amount; // Para outros endpoints (explorerBc, dot, orgaoPublico)
  [key: string]: any; // Permite outros campos adicionais
}

export interface CrmApiResponse {
  data?: {
    opportunities?: CrmOpportunity[];
    oportunidadesExplorerBc?: CrmOpportunity[];
    oportunidadesDot?: CrmOpportunity[];
    oportunidadesOrgaoPublico?: CrmOpportunity[];
    [key: string]: CrmOpportunity[] | undefined;
  };
  pageInfo?: {
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  totalCount?: number;
}

// Resposta da nossa API Next.js
export interface ApiSuccessResponse {
  success: true;
  data: OpportunityData[];
  total: number;
  errors?: Array<{ endpoint: string; error: string }>; // Erros parciais quando busca de múltiplos endpoints
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Query parameters para paginação e filtros
export interface PaginationParams {
  limit?: number;
  depth?: 0 | 1;
  order_by?: string;
  filter?: string;
  starting_after?: string;
  ending_before?: string;
}

// Query parameters aceitos pela API Next.js
export interface OpportunitiesQueryParams extends PaginationParams {
  endpoint?: EndpointKey;
  all?: 'true' | 'false';
  fetch_all_pages?: 'true' | 'false';
}