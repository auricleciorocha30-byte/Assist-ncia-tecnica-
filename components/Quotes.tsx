
import React, { useState } from 'react';
import { Quote, QuoteItem } from '../types';
import { Plus, Trash2, Printer, Search, X, FilePlus, User, Calendar, DollarSign, FileText, ShieldCheck } from 'lucide-react';

interface Props {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  technicianName: string;
}

const Quotes: React.FC<Props> = ({ quotes, setQuotes, technicianName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({
    clientName: '',
    clientPhone: '',
    items: [],
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [itemForm, setItemForm] = useState<Partial<QuoteItem>>({ description: '', quantity: 1, unitPrice: 0 });

  const addItem = () => {
    if (!itemForm.description || !itemForm.quantity || !itemForm.unitPrice) return;
    const item: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: itemForm.description as string,
      quantity: Number(itemForm.quantity),
      unitPrice: Number(itemForm.unitPrice)
    };
    setNewQuote(prev => ({ ...prev, items: [...(prev.items || []), item] }));
    setItemForm({ description: '', quantity: 1, unitPrice: 0 });
  };

  const removeItem = (id: string) => {
    setNewQuote(prev => ({ ...prev, items: prev.items?.filter(i => i.id !== id) }));
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.clientName || !newQuote.items?.length) return;

    const total = newQuote.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
    const quoteToAdd: Quote = {
      id: `ORC-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newQuote.clientName as string,
      clientPhone: newQuote.clientPhone as string,
      date: newQuote.date as string,
      validUntil: newQuote.validUntil as string,
      items: newQuote.items as QuoteItem[],
      total,
      status: 'Aberto',
      technician: technicianName
    };

    setQuotes(prev => [quoteToAdd, ...prev]);
    setIsModalOpen(false);
    setNewQuote({ clientName: '', clientPhone: '', items: [], date: new Date().toISOString().split('T')[0] });
  };

  const deleteQuote = (id: string) => {
    if (confirm('Deseja excluir este orçamento?')) {
      setQuotes(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Orçamentos</h2>
          <p className="text-sm text-slate-500">Propostas comerciais geradas por sua equipe.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20 transition-all"
        >
          <FilePlus size={20} />
          Novo Orçamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map(quote => (
          <div key={quote.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                quote.status === 'Aberto' ? 'bg-blue-100 text-blue-700' : 
                quote.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {quote.status}
              </span>
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"><Printer size={18} /></button>
                <button onClick={() => deleteQuote(quote.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">{quote.id}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <User size={14} />
                  {quote.clientName}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400">
                  <ShieldCheck size={12} className="text-blue-400" />
                  EMITIDO POR: {quote.technician}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 max-h-32 overflow-y-auto thin-scrollbar">
                {quote.items.map(item => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-slate-600">{item.quantity}x {item.description}</span>
                    <span className="font-bold text-slate-800">R$ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                <p className="text-xl font-black text-slate-900">R$ {quote.total.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Vencimento</p>
                <p className="text-xs font-bold text-slate-600">{new Date(quote.validUntil).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800">Criar Novo Orçamento</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Técnico: {technicianName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveQuote} className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nome do cliente" value={newQuote.clientName} onChange={e => setNewQuote({...newQuote, clientName: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="(00) 00000-0000" value={newQuote.clientPhone} onChange={e => setNewQuote({...newQuote, clientPhone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 uppercase border-b pb-2">Itens do Orçamento</h4>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <input type="text" placeholder="Descrição/Serviço" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Qtd" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: Number(e.target.value)})} />
                  </div>
                  <div className="col-span-3">
                    <input type="number" placeholder="R$ Un." className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" value={itemForm.unitPrice} onChange={e => setItemForm({...itemForm, unitPrice: Number(e.target.value)})} />
                  </div>
                  <div className="col-span-1">
                    <button type="button" onClick={addItem} className="w-full h-full flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {newQuote.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{item.description}</p>
                        <p className="text-[10px] text-slate-500">{item.quantity}x R$ {item.unitPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-900">R$ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                        <button type="button" onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center mt-auto">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Total Geral</span>
                <span className="text-2xl font-black">R$ {newQuote.items?.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0).toFixed(2)}</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Salvar Proposta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;
