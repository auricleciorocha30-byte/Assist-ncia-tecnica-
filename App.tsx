
import React, { useState, useMemo, useEffect } from 'react';
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
  ClipboardList,
  Menu,
  LogOut
} from 'lucide-react';
import { AppView, Device, ServiceOrder, Quote, UserAccount } from './types';
import Dashboard from './components/Dashboard';
import ServiceOrders from './components/ServiceOrders';
import Tools from './components/Tools';
import Logs from './components/Logs';
import POS from './components/POS';
import Quotes from './components/Quotes';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('techguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [devices] = useState<Device[]>([
    { id: '1', name: 'Câmera Portaria', type: 'Câmera', ipAddress: '192.168.1.50', status: 'online', lastSeen: 'Agora', location: 'Entrada Principal' },
    { id: '2', name: 'Servidor Local', type: 'Servidor', ipAddress: '192.168.1.10', status: 'maintenance', lastSeen: 'Há 2 horas', location: 'Data Center' },
    { id: '3', name: 'DVR HIK-01', type: 'DVR/NVR', ipAddress: '192.168.1.100', status: 'offline', lastSeen: 'Há 1 dia', location: 'Rack Sala 2' },
    { id: '4', name: 'PC Adm 01', type: 'PC', ipAddress: '192.168.1.15', status: 'online', lastSeen: 'Agora', location: 'Escritório' },
  ]);

  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([
    { id: 'OS-1001', clientName: 'Carlos Eduardo', clientPhone: '(11) 98888-7777', deviceModel: 'Dell Vostro 3500', issueDescription: 'Não liga, suspeita de curto na placa mãe.', entryDate: '2023-10-25', estimatedDeliveryDate: new Date().toISOString().split('T')[0], status: 'Em Análise', priority: 'Alta', technician: 'João Silva' },
    { id: 'OS-1002', clientName: 'Ana Maria', clientPhone: '(11) 97777-6666', deviceModel: 'MacBook Air M1', issueDescription: 'Tela trincada.', entryDate: '2023-10-26', estimatedDeliveryDate: '2023-11-30', status: 'Aguardando Peças', priority: 'Média', estimatedCost: 1200, technician: 'João Silva' },
    { id: 'OS-1003', clientName: 'Condomínio Solar', clientPhone: '(11) 3333-2222', deviceModel: 'DVR Intelbras 16 canais', issueDescription: 'HD não reconhecido.', entryDate: '2023-10-27', status: 'Pronto', priority: 'Alta', estimatedCost: 450, technician: 'Ricardo Martins' },
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('techguard_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('techguard_user');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const notificationCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return serviceOrders.filter(os => 
      os.status !== 'Entregue' && 
      os.status !== 'Cancelado' && 
      os.status !== 'Pronto' &&
      os.estimatedDeliveryDate && 
      os.estimatedDeliveryDate <= today
    ).length;
  }, [serviceOrders]);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.SERVICE_ORDERS, label: 'Assistência (OS)', icon: ClipboardList },
    { id: AppView.POS, label: 'Vendas (PDV)', icon: ShoppingCart },
    { id: AppView.QUOTES, label: 'Orçamentos', icon: FileText },
    { id: AppView.TOOLS, label: 'Ferramentas', icon: Wrench },
    { id: AppView.LOGS, label: 'Histórico', icon: History },
  ];

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard devices={devices} serviceOrders={serviceOrders} />;
      case AppView.POS: return <POS />;
      case AppView.QUOTES: return <Quotes quotes={quotes} setQuotes={setQuotes} technicianName={currentUser.name} />;
      case AppView.SERVICE_ORDERS: return <ServiceOrders orders={serviceOrders} setOrders={setServiceOrders} technicianName={currentUser.name} />;
      case AppView.TOOLS: return <Tools />;
      case AppView.LOGS: return <Logs />;
      default: return <Dashboard devices={devices} serviceOrders={serviceOrders} />;
    }
  };

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden lg:flex">
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

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-4 py-3 bg-slate-800/50 rounded-2xl flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-rose-400 hover:text-rose-300 transition-colors text-xs font-bold"
          >
            <LogOut size={16} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Menu Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm lg:hidden flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <h1 className="text-xl font-bold text-white">TechGuard<span className="text-blue-500">Pro</span></h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
              <Settings size={24} className="rotate-45" />
            </button>
          </div>
          <div className="flex-1 p-6 space-y-4">
            <div className="px-6 py-4 bg-white/5 rounded-3xl flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-black uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-black text-white">{currentUser.name}</p>
                <p className="text-sm text-slate-500 uppercase font-bold">{currentUser.role}</p>
              </div>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                    currentView === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  <Icon size={24} />
                  {item.label}
                </button>
              );
            })}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold text-rose-500 hover:bg-rose-500/10 mt-auto transition-all"
            >
              <LogOut size={24} />
              Sair
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="relative max-w-xs md:max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar cliente ou OS..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 text-xs md:text-sm outline-none font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex flex-col text-right mr-2">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Online agora</span>
              <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
            </div>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-white animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 touch-pan-y">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
