
import React from 'react';
import { MaintenanceLog } from '../types';
import { History, Calendar, User, FileText } from 'lucide-react';

const Logs: React.FC = () => {
  const mockLogs: MaintenanceLog[] = [
    { id: '1', deviceId: '1', date: '2023-10-24', description: 'Limpeza de lentes e ajuste de foco.', technician: 'João Silva', cost: 150 },
    { id: '2', deviceId: '2', date: '2023-10-20', description: 'Troca de pasta térmica e limpeza interna do servidor.', technician: 'João Silva', cost: 200 },
    { id: '3', deviceId: '3', date: '2023-10-15', description: 'Formatação de HD e reconfiguração de acesso remoto.', technician: 'Ricardo M.', cost: 350 },
    { id: '4', deviceId: '1', date: '2023-09-01', description: 'Instalação inicial e crimpagem de conectores.', technician: 'João Silva' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Manutenções</h2>
        <p className="text-slate-500">Acompanhe todas as intervenções realizadas nos equipamentos.</p>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {mockLogs.map((log, i) => (
          <div key={log.id} className="relative pl-10">
            {/* Timeline Dot */}
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"></div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <Calendar size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{new Date(log.date).toLocaleDateString('pt-BR')}</span>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <User size={14} />
                    <span>{log.technician}</span>
                  </div>
                </div>
                {log.cost && (
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                    R$ {log.cost.toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <div className="mt-1 text-blue-600">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Manutenção em Dispositivo #{log.deviceId}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
