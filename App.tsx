
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Cpu, 
  Wrench, 
  History, 
  Bell, 
  Settings,
  Search,
  ClipboardList
} from 'lucide-react';
import { AppView, Device, ServiceOrder, Quote } from './types';
import Dashboard from './components/Dashboard';
import ServiceOrders from './components/ServiceOrders';
import Tools from './components/Tools';
import Logs from './components/Logs';
import POS from './components/POS';
import Quotes from './components/Quotes';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // Mock devices for dashboard (maintained even without inventory view)
  const [devices] = useState<Device[]>([
    { id: '1', name: 'Câmera Portaria', type: 'Câmera', ipAddress: '192.168.1.50', status: 'online', lastSeen: 'Agora', location: 'Entrada Principal' },
    { id: '2', name: 'Servidor Local', type: 'Servidor', ipAddress: '192.168.1.10', status: 'maintenance', lastSeen: 'Há 2 horas', location: 'Data Center' },
    { id: '3', name: 'DVR HIK-01', type: 'DVR/NVR', ipAddress: '192.168.1.100', status: 'offline', lastSeen: 'Há 1 dia', location: 'Rack Sala 2' },
    { id: '4', name: 'PC Adm 01', type: 'PC', ipAddress: '192.168.1.15', status: 'online', lastSeen: 'Agora', location: 'Escritório' },
  ]);

  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([
    { id: 'OS-1001', clientName: 'Carlos Eduardo', clientPhone: '(11) 98888-7777', deviceModel: 'Dell Vostro 3500', issueDescription: 'Não liga, suspeita de curto na placa mãe.', entryDate: '2023-10-25', status: 'Em Análise', priority: 'Alta' },
    { id: 'OS-1002', clientName: 'Ana Maria', clientPhone: '(11) 97777-6666', deviceModel: 'MacBook Air M1', issueDescription: 'Tela trincada.', entryDate: '2023-10-26', status: 'Aguardando Peças', priority: 'Média', estimatedCost: 1200 },
    { id: 'OS-1003', clientName: 'Condomínio Solar', clientPhone: '(11) 3333-2222', deviceModel: 'DVR Intelbras 16 canais', issueDescription: 'HD não reconhecido.', entryDate: '2023-10-27', status: 'Pronto', priority: 'Alta', estimatedCost: 450 },
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([]);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.SERVICE_ORDERS, label: 'Assistência (OS)', icon: ClipboardList },
    { id: AppView.POS, label: 'Vendas (PDV)', icon: ShoppingCart },
    { id: AppView.QUOTES, label: 'Orçamentos', icon: FileText },
    { id: AppView.TOOLS, label: 'Ferramentas', icon: Wrench },
    { id: AppView.LOGS, label: 'Histórico', icon: History },
  ];

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard devices={devices} serviceOrders={serviceOrders} />;
      case AppView.POS: return <POS />;
      case AppView.QUOTES: return <Quotes quotes={quotes} setQuotes={setQuotes} />;
      case AppView.SERVICE_ORDERS: return <ServiceOrders orders={serviceOrders} setOrders={setServiceOrders} />;
      case AppView.TOOLS: return <Tools />;
      case AppView.LOGS: return <Logs />;
      default: return <Dashboard devices={devices} serviceOrders={serviceOrders} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TechGuard<span className="text-blue-500">Pro</span></h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-white transition-colors text-sm">
            <Settings size={18} />
            <span>Configurações</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar cliente, OS ou equipamento..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
              JD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
