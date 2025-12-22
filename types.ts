
export enum AppView {
  DASHBOARD = 'dashboard',
  POS = 'pos',
  QUOTES = 'quotes',
  SERVICE_ORDERS = 'service_orders',
  TOOLS = 'tools',
  LOGS = 'logs'
}

export type DeviceType = 'Câmera' | 'PC' | 'Servidor' | 'Roteador' | 'DVR/NVR' | 'Notebook' | 'Smartphone' | 'Outro';

export type OSStatus = 'Pendente' | 'Em Análise' | 'Aguardando Peças' | 'Pronto' | 'Entregue' | 'Cancelado';

export interface ServiceOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAddress?: string;
  deviceModel: string;
  issueDescription: string;
  entryDate: string;
  status: OSStatus;
  priority: 'Baixa' | 'Média' | 'Alta';
  estimatedCost?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  total: number;
  status: 'Aberto' | 'Aprovado' | 'Recusado';
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ipAddress?: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  location: string;
}

export interface MaintenanceLog {
  id: string;
  deviceId: string;
  date: string;
  description: string;
  technician: string;
  cost?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
