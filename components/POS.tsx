import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Tag, 
  Package, 
  CreditCard, 
  Banknote, 
  Receipt, 
  PlusCircle, 
  DollarSign, 
  Type,
  Wrench,
  Camera,
  Cpu,
  Globe,
  HardDrive,
  MousePointer2
} from 'lucide-react';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Câmera IP Full HD 1080p', price: 289.90, category: 'CFTV', stock: 15 },
  { id: 'p2', name: 'DVR Intelbras 4 Canais Multi HD', price: 450.00, category: 'CFTV', stock: 8 },
  { id: 'p3', name: 'Cabo Coaxial 4mm + Bipolar (100m)', price: 125.00, category: 'Infra', stock: 20 },
  { id: 'p4', name: 'Conector BNC Mola com Parafuso', price: 3.50, category: 'Acessórios', stock: 200 },
  { id: 'p5', name: 'Fonte 12V 5A Chaveada Colmeia', price: 45.90, category: 'Energia', stock: 35 },
  { id: 'p6', name: 'SSD Kingston 480GB A400', price: 189.00, category: 'Informática', stock: 12 },
  { id: 'p7', name: 'HD Seagate SkyHawk 2TB (CFTV)', price: 399.00, category: 'CFTV', stock: 6 },
  { id: 'p8', name: 'Mouse USB Óptico Simples', price: 25.00, category: 'Informática', stock: 45 },
];

const QUICK_SERVICES = [
  { name: 'Mão de Obra: Instalação Câmera', price: 120.00, icon: Camera },
  { name: 'Mão de Obra: Configuração Acesso Remoto', price: 80.00, icon: Globe },
  { name: 'Mão de Obra: Limpeza Técnica PC/DVR', price: 150.00, icon: Wrench },
  { name: 'Mão de Obra: Formatação + Backup', price: 180.00, icon: Cpu },
  { name: 'Mão de Obra: Recuperação de HD', price: 250.00, icon: HardDrive },
  { name: 'Visita Técnica / Orçamento', price: 50.00, icon: MousePointer2 },
];

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todos');
  
  // Manual item states
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  const addToCart = (product: Product | Omit<Product, 'stock'>) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, stock: (product as Product).stock || 0 }];
    });
  };

  const addManualItem = (e?: React.FormEvent, customName?: string, customPrice?: number) => {
    if (e) e.preventDefault();
    const name = customName || manualName;
    const price = customPrice || parseFloat(manualPrice);

    if (!name || isNaN(price)) return;

    const newItem: Omit<Product, 'stock'> = {
      id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name,
      price: price,
      category: 'Serviço/Personalizado'
    };

    addToCart(newItem);
    if (!customName) {
      setManualName('');
      setManualPrice('');
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'Todos' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 p-6 gap-6 overflow-hidden">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">PDV Inteligente</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Produtos e Serviços Rápidos</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar ou digitar novo item..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Services Panel */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Serviços e Mão de Obra Frequentes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {QUICK_SERVICES.map((svc, idx) => {
                const SvcIcon = svc.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => addManualItem(undefined, svc.name, svc.price)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 transition-all group"
                  >
                    <SvcIcon size={20} className="mb-2 text-blue-600 group-hover:text-white" />
                    <span className="text-[9px] font-black uppercase text-center leading-tight line-clamp-2 h-6">{svc.name}</span>
                    <span className="text-xs font-bold mt-1">R$ {svc.price.toFixed(0)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Manual Item Form - Mini version */}
          <div className="flex flex-wrap items-end gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                <Type size={12} /> Item Avulso / Serviço Ad-hoc
              </label>
              <input 
                type="text" 
                placeholder="O que você está cobrando?" 
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={manualName}
                onChange={e => setManualName(e.target.value)}
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                <DollarSign size={12} /> Preço (R$)
              </label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0,00" 
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={manualPrice}
                onChange={e => setManualPrice(e.target.value)}
              />
            </div>
            <button 
              onClick={() => addManualItem()}
              disabled={!manualName || !manualPrice}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-600/10"
            >
              <PlusCircle size={18} />
              ADICIONAR
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap border ${
                  category === cat 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar">
          {searchTerm && filteredProducts.length === 0 && (
            <div className="col-span-full py-8 text-center flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <Package size={40} className="text-slate-300 mb-2" />
               <p className="text-sm font-bold text-slate-500">Produto não encontrado no catálogo.</p>
               <button 
                 onClick={() => { setManualName(searchTerm); setSearchTerm(''); }}
                 className="mt-3 text-xs font-black text-blue-600 hover:underline"
               >
                 + ADICIONAR "{searchTerm}" COMO ITEM AVULSO
               </button>
            </div>
          )}
          
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="flex flex-col p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded tracking-tighter">{product.category}</span>
                <span className="text-[10px] font-bold text-slate-400">Est: {product.stock}</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-4 line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">{product.name}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-base font-black text-slate-900">R$ {product.price.toFixed(2)}</span>
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plus size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full md:w-[400px] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <ShoppingCart size={20} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Resumo da Venda</h3>
          </div>
          <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-1 rounded-lg">ITENS: {cart.reduce((a, b) => a + b.quantity, 0)}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.map(item => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.id.toString().startsWith('manual') ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.category}</span>
                  <span className="text-[10px] font-black text-blue-600">R$ {item.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"><Minus size={14} /></button>
                <span className="text-xs font-black text-slate-800 w-5 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"><Plus size={14} /></button>
              </div>
              {/* FIX: Using item.id instead of non-existent id */}
              <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Package size={32} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-800">Carrinho Vazio</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Selecione produtos ou serviços ao lado para iniciar a venda.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900 text-white space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-blue-400 tracking-widest">Total Geral</span>
              <span className="text-3xl font-black text-white">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10">
              <CreditCard size={18} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase">Cartão</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl transition-all border border-emerald-500 shadow-lg shadow-emerald-900/40">
              <Banknote size={18} />
              <span className="text-[10px] font-black uppercase">PIX / Dinheiro</span>
            </button>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-sm font-black shadow-xl shadow-blue-900/60 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Receipt size={20} />
            CONCLUIR E EMITIR RECIBO
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;