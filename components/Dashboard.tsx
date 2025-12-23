
import React from 'react';
import { Device, ServiceOrder } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ClipboardList,
  Wrench
} from 'lucide-react';

interface DashboardProps {
  devices: Device[];
  serviceOrders: ServiceOrder[];
}

const Dashboard: React.FC<DashboardProps> = ({ devices, serviceOrders }) => {
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  const today = new Date().toISOString().split('T')[0];
  
  const alertOSCount = serviceOrders.filter(os => 
    os.status !== 'Entregue' && 
    os.status !== 'Cancelado' && 
    os.status !== 'Pronto' &&
    os.estimatedDeliveryDate && 
    os.estimatedDeliveryDate <= today
  ).length;

  const stats = [
    { label: 'OS Ativas', value: serviceOrders.filter(o => o.status !== 'Entregue' && o.status !== 'Cancelado').length, icon: ClipboardList, color: 'blue' },
    { label: 'Em Reparo', value: serviceOrders.filter(o => o.status === 'Em Análise').length, icon: Wrench, color: 'amber' },
    { label: 'Prazos Críticos', value: alertOSCount, icon: Clock, color: 'red' },
    { label: 'Faturamento Est.', value: `R$ ${serviceOrders.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0)}`, icon: Activity, color: 'green' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Painel Operacional</h2>
        <p className="text-sm text-slate-500">Resumo da sua assistência e infraestrutura.</p>
      </div>

      {/* Grid de Estatísticas Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-emerald-50 text-emerald-600',
            red: 'bg-rose-50 text-rose-600',
            amber: 'bg-amber-50 text-amber-600'
          };
          return (
            <div key={i} className={`bg-white p-5 md:p-6 rounded-2xl border shadow-sm transition-all ${stat.color === 'red' && stat.value > 0 ? 'border-rose-200 ring-2 ring-rose-50' : 'border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colors[stat.color as keyof typeof colors]}`}>
                  <Icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-black text-slate-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Lista de OS Prontas - Foco em Mobile */}
        <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-800">Ordens Prontas para Entrega</h3>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceOrders.filter(o => o.status === 'Pronto').map(order => (
              <div key={order.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-800 text-sm truncate pr-2">{order.clientName}</p>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase font-black whitespace-nowrap">{order.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{order.deviceModel}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-200/50">
                  <span className="text-[10px] font-medium text-slate-400 italic">Aguardando cliente</span>
                  <button className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">NOTIFICAR</button>
                </div>
              </div>
            ))}
            {serviceOrders.filter(o => o.status === 'Pronto').length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-400 text-sm italic">
                Nenhuma ordem marcada como pronta no momento.
              </div>
            )}
          </div>
        </div>

        {/* Status de Rede Simplificado */}
        <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-6">Status dos Dispositivos Monitorados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {devices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">{device.name}</span>
                  <span className="text-[10px] text-slate-400">{device.ipAddress}</span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  device.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                  device.status === 'offline' ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
