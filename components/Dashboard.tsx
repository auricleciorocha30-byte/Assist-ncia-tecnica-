
import React from 'react';
import { Device, ServiceOrder } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  WifiOff,
  Clock,
  ClipboardList,
  Wrench
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  devices: Device[];
  serviceOrders: ServiceOrder[];
}

const Dashboard: React.FC<DashboardProps> = ({ devices, serviceOrders }) => {
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  
  const pendingOS = serviceOrders.filter(os => os.status === 'Pendente' || os.status === 'Em Análise').length;
  const readyOS = serviceOrders.filter(os => os.status === 'Pronto').length;

  const data = [
    { name: 'Rede Online', value: onlineCount, color: '#10b981' },
    { name: 'Rede Offline', value: offlineCount, color: '#ef4444' },
    { name: 'OS Pendentes', value: pendingOS, color: '#3b82f6' },
    { name: 'OS Prontas', value: readyOS, color: '#8b5cf6' },
  ];

  const stats = [
    { label: 'Total OS Ativas', value: serviceOrders.filter(o => o.status !== 'Entregue').length, icon: ClipboardList, color: 'blue' },
    { label: 'Em Reparo', value: serviceOrders.filter(o => o.status === 'Em Análise').length, icon: Wrench, color: 'amber' },
    { label: 'Rede Crítica', value: offlineCount, icon: AlertTriangle, color: 'red' },
    { label: 'Faturamento Est.', value: `R$ ${serviceOrders.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0)}`, icon: Activity, color: 'green' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Painel Operacional</h2>
        <p className="text-slate-500">Visão geral da assistência técnica e infraestrutura.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-emerald-50 text-emerald-600',
            red: 'bg-rose-50 text-rose-600',
            amber: 'bg-amber-50 text-amber-600'
          };
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colors[stat.color as keyof typeof colors]}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Desempenho Geral</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Ordens Prontas</h3>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <div className="space-y-4">
            {serviceOrders.filter(o => o.status === 'Pronto').map(order => (
              <div key={order.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-slate-800 text-sm">{order.clientName}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase font-black">{order.id}</span>
                </div>
                <p className="text-xs text-slate-500">{order.deviceModel}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Pronto para retirada</span>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">NOTIFICAR</button>
                </div>
              </div>
            ))}
            {serviceOrders.filter(o => o.status === 'Pronto').length === 0 && (
              <p className="text-center text-slate-400 text-sm py-10">Nenhuma OS pronta no momento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
