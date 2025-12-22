
import React, { useState } from 'react';
import { ServiceOrder, OSStatus } from '../types';
import { Plus, Phone, Calendar, User, Laptop, AlertCircle, X, DollarSign, Trash2, Printer, MapPin, ChevronDown } from 'lucide-react';

interface Props {
  orders: ServiceOrder[];
  setOrders: React.Dispatch<React.SetStateAction<ServiceOrder[]>>;
}

type PrintFormat = 'A4' | '58mm' | '80mm';

const ServiceOrders: React.FC<Props> = ({ orders, setOrders }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<ServiceOrder | null>(null);

  const [newOS, setNewOS] = useState<Partial<ServiceOrder>>({
    priority: 'Média',
    status: 'Pendente',
    entryDate: new Date().toISOString().split('T')[0]
  });

  const statuses: OSStatus[] = ['Pendente', 'Em Análise', 'Aguardando Peças', 'Pronto', 'Entregue', 'Cancelado'];

  const getStatusColor = (status: OSStatus) => {
    switch (status) {
      case 'Pendente': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Em Análise': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Aguardando Peças': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pronto': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Entregue': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Cancelado': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityColor = (priority: ServiceOrder['priority']) => {
    switch (priority) {
      case 'Alta': return 'text-rose-500';
      case 'Média': return 'text-amber-500';
      case 'Baixa': return 'text-slate-400';
    }
  };

  const handleAddOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOS.clientName || !newOS.deviceModel) return;

    const osToAdd: ServiceOrder = {
      id: `OS-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newOS.clientName as string,
      clientPhone: newOS.clientPhone as string,
      clientAddress: newOS.clientAddress as string,
      deviceModel: newOS.deviceModel as string,
      issueDescription: newOS.issueDescription as string,
      entryDate: newOS.entryDate as string,
      status: (newOS.status as OSStatus) || 'Pendente',
      priority: (newOS.priority as any) || 'Média',
      estimatedCost: newOS.estimatedCost ? Number(newOS.estimatedCost) : undefined
    };

    setOrders(prev => [osToAdd, ...prev]);
    setIsModalOpen(false);
    setNewOS({ priority: 'Média', status: 'Pendente', entryDate: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteOS = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) {
      setOrders(prev => prev.filter(order => order.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: OSStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const generatePrintTemplate = (order: ServiceOrder, format: PrintFormat) => {
    const isThermal = format === '58mm' || format === '80mm';
    const widthClass = format === '58mm' ? 'width: 58mm;' : format === '80mm' ? 'width: 80mm;' : 'width: 210mm;';
    
    return `
      <html>
        <head>
          <title>Impressão ${order.id}</title>
          <style>
            @page { margin: 0; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              ${widthClass}
              margin: 0 auto;
              padding: ${isThermal ? '5mm' : '20mm'};
              font-size: ${isThermal ? '12px' : '14px'};
              color: #000;
            }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .title { font-size: ${isThermal ? '16px' : '24px'}; font-weight: bold; margin-bottom: 5px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 5px; display: block; }
            .field { margin-bottom: 3px; }
            .footer { border-top: 1px dashed #000; padding-top: 10px; margin-top: 20px; font-size: 10px; text-align: center; }
            .signature { margin-top: 40px; border-top: 1px solid #000; width: 80%; margin-left: auto; margin-right: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">TECHGUARD PRO</div>
            <div>Assistência Técnica e CFTV</div>
            <div>Data: ${new Date(order.entryDate).toLocaleDateString('pt-BR')}</div>
          </div>
          <div class="section"><div class="title" style="text-align:center;">${order.id}</div></div>
          <div class="section">
            <span class="section-title">CLIENTE</span>
            <div class="field">Nome: ${order.clientName}</div>
            <div class="field">Tel: ${order.clientPhone}</div>
            <div class="field">End: ${order.clientAddress || 'Não informado'}</div>
          </div>
          <div class="section">
            <span class="section-title">EQUIPAMENTO</span>
            <div class="field">Modelo: ${order.deviceModel}</div>
            <div class="field">Status: ${order.status}</div>
          </div>
          <div class="section">
            <span class="section-title">PROBLEMA RELATADO</span>
            <div>${order.issueDescription}</div>
          </div>
          <div class="section">
            <span class="section-title">ORÇAMENTO</span>
            <div class="field" style="font-size: 1.2em; font-weight:bold;">
              Valor Est.: R$ ${order.estimatedCost ? order.estimatedCost.toFixed(2) : 'A DEFINIR'}
            </div>
          </div>
          <div class="footer">
            <div>Termos: Garantia de 90 dias para mão de obra. Equipamentos não retirados em 90 dias serão descartados.</div>
            <div class="signature">Assinatura do Cliente</div>
          </div>
          <script>window.onload = () => { window.print(); setTimeout(() => { window.close(); }, 500); }</script>
        </body>
      </html>
    `;
  };

  const handlePrint = (format: PrintFormat) => {
    if (!selectedOrderForPrint) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintTemplate(selectedOrderForPrint, format));
      printWindow.document.close();
      setPrintModalOpen(false);
    }
  };

  const openPrintOptions = (order: ServiceOrder) => {
    setSelectedOrderForPrint(order);
    setPrintModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ordens de Serviço</h2>
          <p className="text-slate-500">Gestão de reparos e assistência técnica.</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus size={20} />
          Nova OS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${getStatusColor(order.status).split(' ')[0]}`}></div>
            
            <div className="flex justify-between items-start mb-5">
              <div className="flex flex-col gap-1.5 flex-1">
                {/* Seletor de Status Interativo no Topo */}
                <div className="relative inline-block w-fit group">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OSStatus)}
                    className={`appearance-none cursor-pointer w-fit text-[10px] font-black px-3 py-1 pr-6 rounded uppercase border ${getStatusColor(order.status)} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s} className="bg-white text-slate-800 uppercase font-bold">{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                </div>

                <div className="flex items-center gap-1">
                  <AlertCircle size={12} className={getPriorityColor(order.priority)} />
                  <span className={`text-[10px] font-bold ${getPriorityColor(order.priority)}`}>{order.priority}</span>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button 
                  type="button"
                  onClick={() => openPrintOptions(order)}
                  className="text-slate-400 hover:text-blue-500 p-2 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Imprimir OS"
                >
                  <Printer size={20} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleDeleteOS(order.id)}
                  className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Excluir OS"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-black text-slate-800 mb-0.5">{order.id}</h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Laptop size={14} />
                  {order.deviceModel}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Defeito</p>
                  <p className="text-sm text-slate-600 line-clamp-2 italic">"{order.issueDescription}"</p>
                </div>
                {order.clientAddress && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{order.clientAddress}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User size={14} className="text-slate-400" />
                    <span className="font-semibold">{order.clientName}</span>
                  </div>
                  <a href={`tel:${order.clientPhone}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <Phone size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={14} />
                  <span>Entrada: {new Date(order.entryDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Orçamento</span>
                <span className="text-lg font-black text-slate-800">
                  {order.estimatedCost ? `R$ ${order.estimatedCost.toFixed(2)}` : 'Pendente'}
                </span>
              </div>
              
              {/* Seletor de Status secundário no rodapé para clareza */}
              <select 
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OSStatus)}
                className={`text-[10px] font-bold px-3 py-2 rounded-lg border outline-none cursor-pointer hover:bg-slate-50 transition-colors ${getStatusColor(order.status)}`}
              >
                {statuses.map(s => (
                  <option key={s} value={s} className="bg-white text-slate-800">{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhuma ordem de serviço registrada.</p>
          </div>
        )}
      </div>

      {/* Modal Impressão */}
      {printModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Opções de Impressão</h3>
              <button type="button" onClick={() => setPrintModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-slate-500 mb-4">Selecione o formato para {selectedOrderForPrint?.id}:</p>
              <button 
                onClick={() => handlePrint('A4')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Printer size={18} />
                  </div>
                  <span className="font-bold text-slate-700">Folha A4</span>
                </div>
              </button>
              <button 
                onClick={() => handlePrint('80mm')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Printer size={18} />
                  </div>
                  <span className="font-bold text-slate-700">Térmica 80mm</span>
                </div>
              </button>
              <button 
                onClick={() => handlePrint('58mm')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Printer size={18} />
                  </div>
                  <span className="font-bold text-slate-700">Térmica 58mm</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova OS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Abrir Nova OS</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddOS} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome completo" value={newOS.clientName || ''} onChange={e => setNewOS({...newOS, clientName: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="(00) 00000-0000" value={newOS.clientPhone || ''} onChange={e => setNewOS({...newOS, clientPhone: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Endereço</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rua, Número, Bairro" value={newOS.clientAddress || ''} onChange={e => setNewOS({...newOS, clientAddress: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equipamento</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Câmera IP Intelbras" value={newOS.deviceModel || ''} onChange={e => setNewOS({...newOS, deviceModel: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Defeito</label>
                  <textarea required rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500" placeholder="Descrição do problema..." value={newOS.issueDescription || ''} onChange={e => setNewOS({...newOS, issueDescription: e.target.value})} />
                </div>
                
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Inicial</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newOS.status} onChange={e => setNewOS({...newOS, status: e.target.value as OSStatus})}>
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prioridade</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newOS.priority} onChange={e => setNewOS({...newOS, priority: e.target.value as any})}>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Estimado (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="number" className="w-full p-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" value={newOS.estimatedCost || ''} onChange={e => setNewOS({...newOS, estimatedCost: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Salvar OS</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceOrders;
